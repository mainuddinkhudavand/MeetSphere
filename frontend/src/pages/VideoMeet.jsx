import React, { useEffect, useRef, useState, useContext } from 'react';
import io from "socket.io-client";
import styles from "../styles/videoComponent.module.css";
import server from '../environment';
import { AuthContext } from '../contexts/AuthContext';

const server_url = server;
var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
};

const ICEBREAKERS = [
    "If you could have any superpower for 24 hours, what would it be and why?",
    "What is the most interesting thing you have in your pockets right now?",
    "If you could only eat one food for the rest of your life, what would it be?",
    "What is the best piece of advice you've ever received?",
    "Would you rather travel 100 years into the past or 100 years into the future?",
    "What's your ultimate go-to movie or TV show to rewatch?",
    "If you could immediately master any language or skill, what would it be?",
    "What is your favorite workspace setup hack or habit?",
    "What was your first email address or screen name?",
    "If you had to change your name, what name would you choose?"
];

export default function VideoMeetComponent() {
    const { userData, getUserProfile } = useContext(AuthContext);
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();
    const audioRef = useRef(null);

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    let [videos, setVideos] = useState([]);
    let [offlineMode, setOfflineMode] = useState(false);

    // Zen Workspace States
    // sidebarTab controls toggling between standard call Chat and Zen Focus Tools
    let [sidebarTab, setSidebarTab] = useState("chat"); // "chat" or "zen"
    
    // zenSubTab handles tab switching between Notes, Pomodoro, Soundscapes, Icebreakers, and Polls
    let [zenSubTab, setZenSubTab] = useState("notes"); // "notes", "pomodoro", "soundscape", "icebreaker", "polls"
    
    // notes stores the local collaborative markdown notes text
    let [notes, setNotes] = useState("");
    
    // pomodoroTime counts down the focus timer session in seconds (default 25 minutes)
    let [pomodoroTime, setPomodoroTime] = useState(1500); 
    
    // pomodoroActive handles starting/pausing the active countdown
    let [pomodoroActive, setPomodoroActive] = useState(false);
    
    // soundscapeSelected plays local atmospheric sound layers (none, lofi, rain, cafe, forest)
    let [soundscapeSelected, setSoundscapeSelected] = useState("none");
    
    // soundscapeVolume binds to the local audio gain slider
    let [soundscapeVolume, setSoundscapeVolume] = useState(0.3);
    
    // icebreakerQuestion stores the active icebreaker team-building prompt
    let [icebreakerQuestion, setIcebreakerQuestion] = useState("Click the button to generate a fun team icebreaker question!");
    
    // Poll States
    // pollQuestion, pollOptions, and activePoll sync and model interactive meeting votes
    let [pollQuestion, setPollQuestion] = useState("");
    let [pollOptions, setPollOptions] = useState(["", ""]);
    let [activePoll, setActivePoll] = useState(null);
    let [hasVoted, setHasVoted] = useState(false);

    const videoRef = useRef([]);

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const profile = await getUserProfile(token);
                    if (profile) {
                        setUsername(profile.name || profile.username);
                    }
                } catch (e) {
                    console.log("Could not load user profile inside lobby:", e);
                }
            }
        };
        loadProfile();
        getPermissions();
    }, []);

    // Pomodoro timer logic
    useEffect(() => {
        let interval = null;
        if (pomodoroActive && pomodoroTime > 0) {
            interval = setInterval(() => {
                setPomodoroTime(prev => {
                    if (prev <= 1) {
                        setPomodoroActive(false);
                        try {
                            const alarm = new Audio("https://actions.google.com/sounds/v1/clocks/alarm_clock.ogg");
                            alarm.volume = 0.3;
                            alarm.play();
                        } catch (e) {}
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [pomodoroActive, pomodoroTime]);

    // Soundscapes audio controller
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            let src = "";
            if (soundscapeSelected === "lofi") src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
            else if (soundscapeSelected === "rain") src = "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg";
            else if (soundscapeSelected === "cafe") src = "https://actions.google.com/sounds/v1/ambiences/coffee_shop_ambience.ogg";
            else if (soundscapeSelected === "forest") src = "https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg";
            
            if (src) {
                audioRef.current.src = src;
                audioRef.current.loop = true;
                audioRef.current.volume = soundscapeVolume;
                audioRef.current.play().catch(err => console.log("Audio playback failed:", err));
            }
        }
    }, [soundscapeSelected]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = soundscapeVolume;
        }
    }, [soundscapeVolume]);

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e); }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }
    };

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e));
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { }
        }
    };

    let connect = () => {
        if (!username.trim()) {
            alert("Please enter a username to enter the lobby.");
            return;
        }
        setAskForUsername(false);
        getMedia();
    };

    let connectOffline = () => {
        if (!username.trim()) {
            alert("Please enter a username to enter the sandbox.");
            return;
        }
        setOfflineMode(true);
        setAskForUsername(false);
        getPermissions();
        setVideos([
            { socketId: 'mock-alex', isMock: true, name: 'Alex (PM)' },
            { socketId: 'mock-sarah', isMock: true, name: 'Sarah (Dev)' }
        ]);
        setMessages([
            { sender: 'Sarah', data: 'Hey! Glad you could join the sandbox call preview.' },
            { sender: 'Alex', data: 'Awesome design. Microphone and video toggles are active.' }
        ]);
    };

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            // Generic action broadcast receiver
            socketRef.current.on('action-broadcast', (type, data) => {
                if (type === "notes") {
                    setNotes(data);
                } else if (type === "pomodoro") {
                    if (data.action === "start") setPomodoroActive(true);
                    if (data.action === "pause") setPomodoroActive(false);
                    if (data.action === "reset") {
                        setPomodoroActive(false);
                        setPomodoroTime(data.time);
                    }
                } else if (type === "poll-launch") {
                    setActivePoll(data);
                    setHasVoted(false);
                } else if (type === "poll-vote") {
                    setActivePoll(prev => {
                        if (!prev) return prev;
                        const newVotes = [...prev.votes];
                        newVotes[data.optionIndex] = (newVotes[data.optionIndex] || 0) + 1;
                        return { ...prev, votes: newVotes };
                    });
                } else if (type === "icebreaker") {
                    setIcebreakerQuestion(data);
                }
            });

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };

                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);
                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    }
                });
            });
        });
    };

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);
        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    };

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current && !showModal) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        if (offlineMode) {
            addMessage(message, username || "You", socketIdRef.current);
            const userText = message;
            setMessage("");

            setTimeout(() => {
                let botReply = "MeetSphere client-side preview is working smoothly.";
                if (userText.toLowerCase().includes("hello") || userText.toLowerCase().includes("hi")) {
                    botReply = "Hi! Welcome to the simulated meeting sandbox.";
                } else if (userText.toLowerCase().includes("video") || userText.toLowerCase().includes("cam")) {
                    botReply = "You can toggle your local video frame in the bottom control bar.";
                }
                addMessage(botReply, "Alex", "mock-alex");
            }, 1000);
            return;
        }

        if (socketRef.current) {
            socketRef.current.emit('chat-message', message, username);
        }
        setMessage("");
    };

    // Synced Notes Handler
    const handleNotesChange = (e) => {
        const val = e.target.value;
        setNotes(val);
        if (offlineMode) return;
        if (socketRef.current) {
            socketRef.current.emit("action-broadcast", "notes", val);
        }
    };

    // Synced Pomodoro Actions
    const triggerPomodoroAction = (action, newTime = 1500) => {
        if (action === "start") {
            setPomodoroActive(true);
        } else if (action === "pause") {
            setPomodoroActive(false);
        } else if (action === "reset") {
            setPomodoroActive(false);
            setPomodoroTime(newTime);
        }
        if (!offlineMode && socketRef.current) {
            socketRef.current.emit("action-broadcast", "pomodoro", { action, time: newTime });
        }
    };

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Synced Poll Actions
    const handlePollOptionChange = (idx, val) => {
        const updated = [...pollOptions];
        updated[idx] = val;
        setPollOptions(updated);
    };

    const addPollOption = () => {
        setPollOptions([...pollOptions, ""]);
    };

    const launchPoll = () => {
        const clean = pollOptions.filter(o => o.trim() !== "");
        if (!pollQuestion.trim() || clean.length < 2) {
            alert("Please enter a question and at least 2 options.");
            return;
        }
        const poll = {
            question: pollQuestion,
            options: clean,
            votes: clean.map(() => 0)
        };
        setActivePoll(poll);
        setHasVoted(false);
        if (!offlineMode && socketRef.current) {
            socketRef.current.emit("action-broadcast", "poll-launch", poll);
        }
    };

    const submitVote = (optionIndex) => {
        setHasVoted(true);
        setActivePoll(prev => {
            if (!prev) return prev;
            const updatedVotes = [...prev.votes];
            updatedVotes[optionIndex] = (updatedVotes[optionIndex] || 0) + 1;
            const updatedPoll = { ...prev, votes: updatedVotes };
            if (!offlineMode && socketRef.current) {
                socketRef.current.emit("action-broadcast", "poll-vote", { optionIndex });
            }
            return updatedPoll;
        });
    };

    const icebreakers = [
        "If you could have dinner with any historical figure, who would it be and why?",
        "What is the most interesting thing you have in your workspace right now?",
        "If you had to live in a video game for a week, which one would it be?",
        "What is your absolute favorite coding snack or beverage?",
        "If you could immediately master any programming language, what would it be?",
        "What is the most unique app on your phone that you actually use?",
        "Would you rather work in an office with a slide, or work from a beach house?",
        "What is your favorite lo-fi track or music genre to listen to while working?",
        "If you could travel to any country in the world tomorrow, where would you go?"
    ];

    const generateIcebreaker = () => {
        const idx = Math.floor(Math.random() * icebreakers.length);
        const question = icebreakers[idx];
        setIcebreakerQuestion(question);
        if (!offlineMode && socketRef.current) {
            socketRef.current.emit("action-broadcast", "icebreaker", question);
        }
    };

    let handleVideo = () => {
        setVideo(!video);
    };

    let handleAudio = () => {
        setAudio(!audio);
    };

    let handleScreen = () => {
        setScreen(!screen);
    };

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        } catch (e) { }
        window.location.href = "/home";
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#080710' }}>
            <audio ref={audioRef} />

            {askForUsername === true ? (
                <div className="authPageContainer">
                    <div className="authLeftGlow"></div>
                    <div className="authRightGlow"></div>
                    
                    <div className="authCard glass-panel glassy-3d animate-float" style={{ width: '450px' }}>
                        <div className="authLogo" onClick={() => window.location.href = "/"}>
                            MeetSphere Lobby
                        </div>
                        
                        <h3 className="authTitle">Lobby Setup</h3>
                        <p className="authSubtitle">Check your camera preview and pick your connection mode</p>

                        <div className="authForm">
                            <div className="inputGroup">
                                <label>Display Name</label>
                                <input 
                                    type="text"
                                    placeholder="Enter your name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button 
                                    className="authSubmitBtn" 
                                    onClick={connect}
                                    style={{ flex: 1, margin: 0 }}
                                >
                                    🌐 Connect (Server)
                                </button>
                                <button 
                                    className="authSubmitBtn" 
                                    onClick={connectOffline}
                                    style={{ flex: 1, margin: 0, background: 'var(--secondary-gradient)', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.25)' }}
                                >
                                    🧪 Sandbox (Mock)
                                </button>
                            </div>

                            <div style={{ marginTop: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)', aspectRatio: '16/9' }}>
                                <video ref={localVideoref} autoPlay muted style={{ width: '100%', height: '100%', display: 'block', transform: 'scaleX(-1)', objectFit: 'cover' }}></video>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.meetVideoContainer}>
                    <div className={styles.videoMainArea}>
                        {/* Header Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', zIndex: 10 }}>
                            <div className="meetingBadge">
                                <span className="liveDot"></span>
                                {offlineMode ? "Offline Sandbox Mode" : "Live Video Call"}
                            </div>
                            <div className="meetingCodeDisplay">
                                {offlineMode ? "Sandbox Preview" : "Connected"}
                            </div>
                        </div>

                        {/* Video Conference view */}
                        <div className={styles.conferenceView}>
                            {videos.map((vid) => (
                                <div key={vid.socketId} style={{ position: 'relative' }}>
                                    {vid.isMock ? (
                                        <div 
                                            style={{ 
                                                width: '320px', 
                                                height: '180px', 
                                                borderRadius: '16px', 
                                                background: '#0a0a20', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                position: 'relative'
                                            }}
                                            className="glassy-3d"
                                        >
                                            <div className={styles.avatarFallback}>
                                                {vid.name.charAt(0)}
                                            </div>
                                            <span className={styles.feedName}>{vid.name}</span>
                                        </div>
                                    ) : (
                                        <video
                                            data-socket={vid.socketId}
                                            ref={ref => {
                                                if (ref && vid.stream) {
                                                    ref.srcObject = vid.stream;
                                                }
                                            }}
                                            autoPlay
                                            playsInline
                                            className="glassy-3d"
                                        >
                                        </video>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Controls Toolbar */}
                        <div className={styles.buttonContainers}>
                            <button onClick={handleVideo} title={video ? "Turn Video Off" : "Turn Video On"}>
                                {video ? '📹' : '🚫'}
                            </button>
                            <button onClick={handleAudio} title={audio ? "Mute Mic" : "Unmute Mic"}>
                                {audio ? '🎙️' : '🚫'}
                            </button>
                            <button onClick={handleScreen} title={screen ? "Stop Screen Sharing" : "Start Screen Share"}>
                                {screen ? '⏹️' : '🖥️'}
                            </button>
                            <button onClick={() => setModal(!showModal)} title="Toggle Sidebar" style={{ position: 'relative' }}>
                                💬
                                {newMessages > 0 && (
                                    <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--primary)', color: '#080710', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {newMessages}
                                    </span>
                                )}
                            </button>
                            <button onClick={handleEndCall} className={styles.hangupBtn} title="End Call">
                                📞
                            </button>
                        </div>

                        {/* Local Video Picture-in-Picture */}
                        {video && (
                            <video className={`${styles.meetUserVideo} glassy-3d`} ref={localVideoref} autoPlay muted></video>
                        )}
                    </div>

                    {/* Shared Workspace Sidebar */}
                    {showModal && (
                        <div className={`${styles.chatRoom} glass-panel glassy-3d`}>
                            <div className={styles.chatContainer}>
                                {/* Sidebar Tabs Header */}
                                <div className={styles.workspaceTabs}>
                                    <button 
                                        className={`${styles.workspaceTabBtn} ${sidebarTab === 'chat' ? styles.active : ''}`}
                                        onClick={() => setSidebarTab("chat")}
                                    >
                                        💬 Chat
                                    </button>
                                    <button 
                                        className={`${styles.workspaceTabBtn} ${sidebarTab === 'zen' ? styles.active : ''}`}
                                        onClick={() => setSidebarTab("zen")}
                                    >
                                        🧘 Zen Room
                                    </button>
                                </div>

                                {sidebarTab === "chat" ? (
                                    <div className={styles.chattingArea}>
                                        <div className={styles.messagesList}>
                                            {messages.length !== 0 ? messages.map((item, index) => (
                                                <div key={index} className={`${styles.messageBox} ${item.sender === username ? styles.self : ''}`}>
                                                    <span className={styles.messageSender}>{item.sender}</span>
                                                    <span className={styles.messageContent}>{item.data}</span>
                                                </div>
                                            )) : (
                                                <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
                                                    No messages yet.
                                                </div>
                                            )}
                                        </div>
                                        <form onSubmit={sendMessage} className={styles.inputControls}>
                                            <input 
                                                type="text" 
                                                className={styles.chatInput} 
                                                placeholder="Send a message..." 
                                                value={message} 
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                            <button type="submit" className={styles['btn-send']}>
                                                ➔
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className={styles.zenWorkspaceArea}>
                                        {/* Zen sub-tabs */}
                                        <div className={styles.zenSubTabs}>
                                            {["notes", "timer", "sounds", "icebreaker", "polls"].map(sub => (
                                                <button 
                                                    key={sub}
                                                    className={`${styles.zenSubTabBtn} ${zenSubTab === sub ? styles.active : ''}`}
                                                    onClick={() => setZenSubTab(sub)}
                                                >
                                                    {sub === 'notes' && '📝'}
                                                    {sub === 'timer' && '⏱️'}
                                                    {sub === 'sounds' && '🎵'}
                                                    {sub === 'icebreaker' && '🧊'}
                                                    {sub === 'polls' && '📊'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Zen Workspace Panels */}
                                        <div className={styles.zenPanelContent}>
                                            {zenSubTab === "notes" && (
                                                <div className={styles.notesPanel}>
                                                    <h4>Collaborative Meeting Notes</h4>
                                                    <p className={styles.subtext}>Notes sync in real-time with all participants.</p>
                                                    <textarea 
                                                        value={notes}
                                                        onChange={handleNotesChange}
                                                        placeholder="Start typing meeting notes here..."
                                                        className={styles.notesTextarea}
                                                    />
                                                </div>
                                            )}

                                            {zenSubTab === "timer" && (
                                                <div className={styles.timerPanel}>
                                                    <h4>Pomodoro Study Timer</h4>
                                                    <p className={styles.subtext}>Focus collaboratively during long workshops.</p>
                                                    <div className={styles.timerClock}>
                                                        {formatTimer(pomodoroTime)}
                                                    </div>
                                                    <div className={styles.timerControls}>
                                                        {pomodoroActive ? (
                                                            <button className="btn-dashboard-sec" onClick={() => triggerPomodoroAction("pause")}>Pause</button>
                                                        ) : (
                                                            <button className="btn-dashboard-action" onClick={() => triggerPomodoroAction("start")}>Start</button>
                                                        )}
                                                        <button className="btn-dashboard-sec" onClick={() => triggerPomodoroAction("reset", 1500)}>25m</button>
                                                        <button className="btn-dashboard-sec" onClick={() => triggerPomodoroAction("reset", 300)}>5m</button>
                                                    </div>
                                                </div>
                                            )}

                                            {zenSubTab === "sounds" && (
                                                <div className={styles.soundsPanel}>
                                                    <h4>Ambient Focus Mixer</h4>
                                                    <p className={styles.subtext}>Play calming sounds locally to enhance focus.</p>
                                                    <div className={styles.soundOptions}>
                                                        {[
                                                            { id: 'none', label: '🔇 Off' },
                                                            { id: 'lofi', label: '☕ Lo-Fi Beats' },
                                                            { id: 'rain', label: '🌧️ Heavy Rain' },
                                                            { id: 'cafe', label: '🗣️ Cafe Ambience' },
                                                            { id: 'forest', label: '🌲 Forest Stream' }
                                                        ].map(sound => (
                                                            <button 
                                                                key={sound.id}
                                                                className={`btn-dashboard-sec ${soundscapeSelected === sound.id ? 'active' : ''}`}
                                                                onClick={() => setSoundscapeSelected(sound.id)}
                                                                style={{ width: '100%', textAlign: 'left', background: soundscapeSelected === sound.id ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)', color: soundscapeSelected === sound.id ? '#080710' : 'white' }}
                                                            >
                                                                {sound.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className={styles.volumeControl} style={{ marginTop: '1rem' }}>
                                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Volume Control</label>
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="1" 
                                                            step="0.05"
                                                            value={soundscapeVolume}
                                                            onChange={(e) => setSoundscapeVolume(parseFloat(e.target.value))}
                                                            style={{ width: '100%', accentColor: 'var(--primary)' }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {zenSubTab === "icebreaker" && (
                                                <div className={styles.icebreakerPanel}>
                                                    <h4>Icebreaker Generator</h4>
                                                    <p className={styles.subtext}>Start meeting with team-building interactions.</p>
                                                    <div className={styles.icebreakerCard} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', margin: '1rem 0', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                                        {icebreakerQuestion}
                                                    </div>
                                                    <button className="btn-dashboard-action" style={{ width: '100%' }} onClick={generateIcebreaker}>
                                                        Pick Random Icebreaker
                                                    </button>
                                                </div>
                                            )}

                                            {zenSubTab === "polls" && (
                                                <div className={styles.pollsPanel}>
                                                    <h4>Interactive Room Polls</h4>
                                                    {!activePoll ? (
                                                        <div className={styles.createPollArea}>
                                                            <div className="inputGroup" style={{ marginBottom: '1rem' }}>
                                                                <label style={{ fontSize: '0.8rem' }}>Poll Question</label>
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="e.g. What stack should we use?"
                                                                    value={pollQuestion}
                                                                    onChange={(e) => setPollQuestion(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="inputGroup">
                                                                <label style={{ fontSize: '0.8rem' }}>Options</label>
                                                                {pollOptions.map((opt, idx) => (
                                                                    <input 
                                                                        key={idx}
                                                                        type="text" 
                                                                        placeholder={`Option ${idx + 1}`}
                                                                        value={opt}
                                                                        onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                                                                        style={{ marginBottom: '0.5rem' }}
                                                                    />
                                                                ))}
                                                                <button className="btn-dashboard-sec" onClick={addPollOption} style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}>
                                                                    + Add option
                                                                </button>
                                                            </div>
                                                            <button className="btn-dashboard-action" onClick={launchPoll} style={{ width: '100%', marginTop: '1rem' }}>
                                                                Launch Shared Poll
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.viewPollArea}>
                                                            <h5 style={{ fontSize: '1rem', marginBottom: '0.8rem' }}>{activePoll.question}</h5>
                                                            {!hasVoted ? (
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                                                    {activePoll.options.map((opt, idx) => (
                                                                        <button 
                                                                            key={idx} 
                                                                            className="btn-dashboard-sec" 
                                                                            onClick={() => submitVote(idx)}
                                                                            style={{ textAlign: 'left', width: '100%' }}
                                                                        >
                                                                            {opt}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                                    {activePoll.options.map((opt, idx) => {
                                                                        const totalVotes = activePoll.votes.reduce((a, b) => a + b, 0) || 1;
                                                                        const count = activePoll.votes[idx] || 0;
                                                                        const percent = Math.round((count / totalVotes) * 100);
                                                                        return (
                                                                            <div key={idx} style={{ position: 'relative', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.6rem 1rem', overflow: 'hidden' }}>
                                                                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${percent}%`, background: 'rgba(255, 152, 57, 0.1)', transition: 'width 0.5s ease' }}></div>
                                                                                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                                                                    <span>{opt}</span>
                                                                                    <strong>{count} votes ({percent}%)</strong>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    <button className="btn-dashboard-sec" onClick={() => setActivePoll(null)} style={{ width: '100%', marginTop: '1rem', fontSize: '0.8rem' }}>
                                                                        Create New Poll
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
