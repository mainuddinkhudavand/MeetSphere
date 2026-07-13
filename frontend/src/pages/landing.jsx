import React, { useState } from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const router = useNavigate();
    
    // Interactive Demo States
    const [demoMic, setDemoMic] = useState(true);
    const [demoCam, setDemoCam] = useState(true);
    const [demoShare, setDemoShare] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { name: 'Sarah', text: 'Hey there! How is the video quality?', self: false },
        { name: 'Alex', text: 'It looks incredibly smooth 🚀', self: false }
    ]);
    const [chatInput, setChatInput] = useState('');

    const handleSendDemoChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newUserMsg = { name: 'You', text: chatInput, self: true };
        setChatMessages(prev => [...prev, newUserMsg]);
        const userMsgText = chatInput;
        setChatInput('');

        // Simulate teammate response
        setTimeout(() => {
            let replyText = "Awesome! MeetSphere looks super fast.";
            if (userMsgText.toLowerCase().includes("hello") || userMsgText.toLowerCase().includes("hi")) {
                replyText = "Hey! Welcome to the MeetSphere interactive demo. Try toggling your mic or camera!";
            } else if (userMsgText.toLowerCase().includes("work") || userMsgText.toLowerCase().includes("test")) {
                replyText = "Everything is working flawlessly. The design feels super clean!";
            } else if (userMsgText.toLowerCase().includes("video") || userMsgText.toLowerCase().includes("cam")) {
                replyText = "The HD video frame rates are incredibly high!";
            }
            setChatMessages(prev => [...prev, { name: 'Alex', text: replyText, self: false }]);
        }, 1000);
    };

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader' onClick={() => router("/")}>
                    <h2>MeetSphere</h2>
                </div>
                <div className='navlist'>
                    <div className='navLinks'>
                        <a href='#features'>Features</a>
                        <a href='#how-it-works'>How It Works</a>
                        <a href='#pricing'>Pricing</a>
                        <a href='#faqs'>FAQs</a>
                    </div>
                    <div className='navActions'>
                        <button className='btn-guest' onClick={() => router("/guest-meeting-room-preview")}>
                            Join as Guest
                        </button>
                        <button className='btn-login' onClick={() => router("/auth")}>
                            Login / Register
                        </button>
                    </div>
                </div>
            </nav>


            <header className="heroSection">
                <div className="heroLeft">
                    <div className="heroBadge">
                        <span className="pulseDot"></span>
                        MeetSphere 2.0 is now live
                    </div>
                    <h1>
                        <span className="text-gradient">Connect</span> with your Teams and Loved Ones instantly
                    </h1>
                    <p>
                        High-quality video conferencing, screen sharing, and real-time collaboration. MeetSphere bridges the gap with zero hassle.
                    </p>
                    <div className="heroButtons">
                        <Link to="/auth" className="btn-hero-primary">
                            Get Started
                        </Link>
                        <a href="#demo" className="btn-hero-secondary">
                            Live Demo Preview
                        </a>
                    </div>
                    <div className="heroStats">
                        <div className="statItem">
                            <span className="statValue">100%</span>
                            <span className="statLabel">Free Tier</span>
                        </div>
                        <div className="statItem">
                            <span className="statValue">HD</span>
                            <span className="statLabel">Quality Call</span>
                        </div>
                        <div className="statItem">
                            <span className="statValue">256-bit</span>
                            <span className="statLabel">Secure SSL</span>
                        </div>
                    </div>
                </div>
                <div className="heroRight">
                    <div className="heroImageWrapper animate-float">
                        <img src="/mobile.png" alt="MeetSphere Mobile App preview" />
                        <div className="heroFloatingCard">
                            <div className="avatarRing">MS</div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'white' }}>Meeting Room Active</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Join with 5 friends</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Interactive Demo Section */}
            <section id="demo" className="demoSection">
                <div className="sectionHeader">
                    <h2>Experience the <span className="text-gradient">Real-Time</span> Magic</h2>
                    <p>Try out the mock room controls below. Toggle camera, mute audio, and interact with the chat panel.</p>
                </div>

                <div className="demoContainer">
                    <div className="demoVideoArea">
                        <div className="demoHeader">
                            <div className="meetingBadge">
                                <span className="liveDot"></span>
                                Live Demo Room
                            </div>
                            <div className="meetingCodeDisplay">Room Code: MS-DEMO-2026</div>
                        </div>

                        <div className="demoGrid">
                            <div className={`videoFeed ${demoCam ? 'active' : ''}`}>
                                {demoCam ? (
                                    demoShare ? (
                                        <div className="videoWaveform">
                                            <span style={{ fontSize: '3rem' }}>🖥️</span>
                                            <p style={{ position: 'absolute', bottom: '35%', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sharing your screen...</p>
                                        </div>
                                    ) : (
                                        <div className="videoWaveform" style={{ background: '#08081a' }}>
                                            <div className="avatarFallback primary">You</div>
                                        </div>
                                    )
                                ) : (
                                    <div className="videoWaveform" style={{ background: '#020205' }}>
                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Camera is Off</span>
                                    </div>
                                )}
                                <span className="feedName">You (Presenter)</span>
                                <div className={`micIndicator ${demoMic ? '' : 'muted'}`}>
                                    {demoMic ? '🎙️' : '🚫'}
                                </div>
                            </div>

                            <div className="videoFeed">
                                <div className="videoWaveform" style={{ background: '#0a0a24' }}>
                                    <div className="avatarFallback">A</div>
                                </div>
                                <span className="feedName">Alex (Teammate)</span>
                                <div className="micIndicator">🎙️</div>
                            </div>
                        </div>

                        <div className="demoControls">
                            <button 
                                className={`controlBtn ${demoMic ? 'active' : ''}`} 
                                onClick={() => setDemoMic(!demoMic)}
                                title={demoMic ? "Mute Mic" : "Unmute Mic"}
                            >
                                {demoMic ? '🎙️' : '🚫'}
                            </button>
                            <button 
                                className={`controlBtn ${demoCam ? 'active' : ''}`} 
                                onClick={() => setDemoCam(!demoCam)}
                                title={demoCam ? "Turn Off Video" : "Turn On Video"}
                            >
                                {demoCam ? '📹' : '🚫'}
                            </button>
                            <button 
                                className={`controlBtn ${demoShare ? 'active' : ''}`} 
                                onClick={() => setDemoShare(!demoShare)}
                                title={demoShare ? "Stop Screen Share" : "Share Screen"}
                            >
                                {demoShare ? '⏹️' : '🖥️'}
                            </button>
                            <button className="controlBtn hangup" onClick={() => alert("To join or host real meetings, please register or sign in!")}>
                                📞
                            </button>
                        </div>
                    </div>

                    <div className="demoChatPanel">
                        <div className="chatPanelHeader">
                            <h4>Meeting Chat</h4>
                        </div>
                        <div className="chatMessages">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`chatMsg ${msg.self ? 'self' : ''}`}>
                                    <span className="msgName">{msg.name}</span>
                                    <span className="msgText">{msg.text}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendDemoChat} className="chatInputArea">
                            <input 
                                type="text" 
                                className="chatInput" 
                                placeholder="Type a message..." 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button type="submit" className="chatSendBtn">
                                ➔
                            </button>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    )
}

