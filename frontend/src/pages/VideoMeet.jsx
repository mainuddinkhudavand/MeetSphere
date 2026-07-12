import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import styles from "../styles/videoComponent.module.css";
import server from '../environment';

const server_url = server;
var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
};

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

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

    const videoRef = useRef([]);

    useEffect(() => {
        getPermissions();
    }, []);

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
            {askForUsername === true ? (
                <div className="authPageContainer">
                    <div className="authLeftGlow"></div>
                    <div className="authRightGlow"></div>
                    
                    <div className="authCard glass-panel" style={{ width: '450px' }}>
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
                                {offlineMode ? "Sandbox preview" : "Connected"}
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
                            <button onClick={() => setModal(!showModal)} title="Toggle Chat" style={{ position: 'relative' }}>
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
                            <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>
                        )}
                    </div>

                    {/* Chat Sidebar */}
                    {showModal && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <div className={styles.chatHeader}>
                                    <h3>Meeting Chat</h3>
                                </div>
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
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
