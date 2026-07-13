import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [copied, setCopied] = useState(false);
    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    };

    return (
        <div className="dashboardContainer">
            {/* Sidebar */}
            <aside className="dashboardSidebar">
                <div>
                    <div className="sidebarBrand" onClick={() => navigate("/")}>
                        <h2>MeetSphere</h2>
                    </div>
                    <nav className="sidebarMenu">
                        <button className="menuItem active" onClick={() => navigate("/home")}>
                            <span>🏠</span> Dashboard
                        </button>
                        <button className="menuItem" onClick={() => navigate("/history")}>
                            <span>🕒</span> History Logs
                        </button>
                        <button className="menuItem" onClick={() => alert("Settings panel is a developer feature. Real-time microphone and speaker calibration tests are accessible in call!")}>
                            <span>⚙️</span> Calibration Check
                        </button>
                    </nav>
                </div>
                <div className="sidebarFooter">
                    <button 
                        className="menuItem" 
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                        style={{ color: '#ef4444' }}
                    >
                        <span>🚪</span> Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboardMain">
                <header className="dashboardHeader">
                    <div>
                        <h1>Dashboard Workspace</h1>
                        <p>Welcome back! Start hosting instantly or enter a code to join a room.</p>
                    </div>
                    <div className="meetingBadge">
                        <span className="liveDot"></span> Server Connected
                    </div>
                </header>

                {/* Stats Row */}
                <section className="statsRow">
                    <div className="statCard">
                        <div className="statCardIcon">🎥</div>
                        <div className="statCardInfo">
                            <h4>Unlimited</h4>
                            <p>Call Time</p>
                        </div>
                    </div>
                    <div className="statCard">
                        <div className="statCardIcon">👥</div>
                        <div className="statCardInfo">
                            <h4>100%</h4>
                            <p>Free Account</p>
                        </div>
                    </div>
                    <div className="statCard">
                        <div className="statCardIcon">🔒</div>
                        <div className="statCardInfo">
                            <h4>AES-256</h4>
                            <p>Call Security</p>
                        </div>
                    </div>
                </section>

                {/* Action Cards */}
                <section className="actionGrid">
                    <div className="actionCard">
                        <h3>Host Instant Meeting</h3>
                        <p>Generate a unique meeting room identifier code instantly and invite your team to join.</p>
                        <div className="cardDivider"></div>
                        {generatedCode ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Room Code:</span>
                                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>{generatedCode}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        className="btn-dashboard-action"
                                        onClick={async () => {
                                            setMeetingCode(generatedCode);
                                            await addToUserHistory(generatedCode);
                                            navigate(`/${generatedCode}`);
                                        }}
                                        style={{ flex: 1 }}
                                    >
                                        Start Call
                                    </button>
                                    <button 
                                        className="btn-dashboard-sec"
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedCode);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                    >
                                        {copied ? "Copied! ✓" : "Copy Code"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                className="btn-dashboard-action" 
                                onClick={() => {
                                    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
                                    setGeneratedCode(code);
                                }}
                            >
                                Generate Meeting Code
                            </button>
                        )}
                    </div>

                    <div className="actionCard">
                        <h3>Join a Meeting</h3>
                        <p>Enter an active 6-character room code below to connect with your team.</p>
                        <div className="cardDivider"></div>
                        <div className="inputAndBtn">
                            <input 
                                type="text" 
                                className="dashboardInput" 
                                placeholder="Enter Room Code (e.g. A3B8DF)"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
                            />
                            <button className="btn-dashboard-action" onClick={handleJoinVideoCall}>
                                Join
                            </button>
                        </div>
                    </div>
                </section>

                {/* Bottom Row */}
                <section className="dashboardBottomGrid">
                    <div className="dashboardSectionCard">
                        <h3>Upcoming Schedule (Mock)</h3>
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)', color: 'var(--text-dim)' }}>
                            📅 No meetings scheduled for today. Start a quick meeting instead!
                        </div>
                    </div>

                    <div className="dashboardSectionCard">
                        <h3>Device Health Status</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', color: '#00ff88' }}>
                                <span>🎙️ Microphone</span> <span>● Active</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', color: '#00ff88' }}>
                                <span>📹 Video Camera</span> <span>● Connected</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', color: '#00ff88' }}>
                                <span>🔊 Sound Quality</span> <span>● Standard</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default withAuth(HomeComponent)