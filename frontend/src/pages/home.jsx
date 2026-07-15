import React, { useContext, useState, useEffect } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [copied, setCopied] = useState(false);
    const { addToUserHistory, userData, updateUserProfile } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "profile"

    // Profile field states
    const [profileName, setProfileName] = useState("");
    const [profileBio, setProfileBio] = useState("");
    const [profileAvatar, setProfileAvatar] = useState("👤");
    const [profileStatus, setProfileStatus] = useState("Active");
    const [profileAccent, setProfileAccent] = useState("#ff9839");

    // Sync profile fields from AuthContext userData
    useEffect(() => {
        if (userData) {
            setProfileName(userData.name || "");
            setProfileBio(userData.bio || "");
            setProfileAvatar(userData.avatar || "👤");
            setProfileStatus(userData.status || "Active");
            setProfileAccent(userData.accentColor || "#ff9839");
        }
    }, [userData]);

    // Accent color dynamic engine
    useEffect(() => {
        const accent = userData?.accentColor || "#ff9839";
        document.documentElement.style.setProperty('--primary', accent);
        
        let r = 255, g = 152, b = 57;
        if (accent === "#a855f7") { r = 168; g = 85; b = 247; }
        else if (accent === "#3b82f6") { r = 59; g = 130; b = 246; }
        else if (accent === "#10b981") { r = 16; g = 185; b = 129; }
        
        document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
        document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${accent} 0%, rgba(${r}, ${g}, ${b}, 0.6) 100%)`);
        document.documentElement.style.setProperty('--border-glow-focus', `rgba(${r}, ${g}, ${b}, 0.5)`);
    }, [userData?.accentColor]);

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    };

    let handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile({
                name: profileName,
                bio: profileBio,
                avatar: profileAvatar,
                status: profileStatus,
                accentColor: profileAccent
            });
            alert("Profile updated successfully!");
            setActiveTab("dashboard");
        } catch (err) {
            alert(`Error saving profile: ${err.message || err}`);
        }
    };

    return (
        <div className="dashboardContainer">
            {/* Mobile Header */}
            <header className="mobileHeader glass-panel">
                <div className="mobileHeaderBrand" onClick={() => navigate("/")}>
                    <h2>MeetSphere</h2>
                </div>
                <div className="mobileUserBadge" onClick={() => setActiveTab("profile")}>
                    <span className="mobileAvatar">{userData?.avatar || "👤"}</span>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="dashboardSidebar">
                <div>
                    <div className="sidebarBrand" onClick={() => navigate("/")}>
                        <h2>MeetSphere</h2>
                    </div>
                    <nav className="sidebarMenu">
                        <button 
                            className={`menuItem ${activeTab === 'dashboard' ? 'active' : ''}`} 
                            onClick={() => setActiveTab("dashboard")}
                        >
                            <span>🏠</span> Dashboard
                        </button>
                        <button 
                            className={`menuItem ${activeTab === 'profile' ? 'active' : ''}`} 
                            onClick={() => setActiveTab("profile")}
                        >
                            <span>👤</span> My Profile
                        </button>
                        <button className="menuItem" onClick={() => navigate("/history")}>
                            <span>🕒</span> History Logs
                        </button>
                        <button className="menuItem" onClick={() => alert("Calibration Panel: Real-time tests are active inside meeting rooms!")}>
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
                {activeTab === "profile" ? (
                    <div className="profileSettingsContainer">
                        <header className="dashboardHeader">
                            <div>
                                <h1>Profile Configuration</h1>
                                <p>Personalize your screen identity, custom bio status, and application accent theme color.</p>
                            </div>
                        </header>

                        <div className="profileCard glass-panel glassy-3d animate-float">
                            <div className="profileHeaderArea">
                                <div className="profileAvatarLarge">
                                    {profileAvatar}
                                </div>
                                <div className="profileHeaderInfo">
                                    <h2>{profileName || userData?.name}</h2>
                                    <p className="profileUsernameText">@{userData?.username || "username"}</p>
                                    <span className="profileStatusBadge">{profileStatus}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSaveProfile} className="profileForm">
                                <div className="profileFormGrid">
                                    <div className="inputGroup">
                                        <label>Display Name</label>
                                        <input 
                                            type="text" 
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            placeholder="Enter display name"
                                            required
                                        />
                                    </div>
                                    <div className="inputGroup">
                                        <label>Status Text / Mood</label>
                                        <select 
                                            value={profileStatus} 
                                            onChange={(e) => setProfileStatus(e.target.value)}
                                            className="profileSelect"
                                        >
                                            <option value="Active">🟢 Active</option>
                                            <option value="Away">🟡 Away</option>
                                            <option value="Do Not Disturb">🔴 Do Not Disturb</option>
                                            <option value="Coding">💻 In deep flow</option>
                                        </select>
                                    </div>
                                    
                                    <div className="inputGroup" style={{ gridColumn: 'span 2' }}>
                                        <label>Biography</label>
                                        <textarea 
                                            value={profileBio}
                                            onChange={(e) => setProfileBio(e.target.value)}
                                            placeholder="Write something about yourself..."
                                            rows="3"
                                        />
                                    </div>
                                    
                                    <div className="inputGroup" style={{ gridColumn: 'span 2' }}>
                                        <label>Select Avatar Emoji</label>
                                        <div className="avatarGrid">
                                            {["👤", "🚀", "💻", "🎨", "🎭", "🦊", "🌟", "🥑", "🤖", "👻", "🦄", "🐼"].map(emoji => (
                                                <button 
                                                    type="button" 
                                                    key={emoji}
                                                    className={`avatarChoiceBtn ${profileAvatar === emoji ? 'active' : ''}`}
                                                    onClick={() => setProfileAvatar(emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="inputGroup" style={{ gridColumn: 'span 2' }}>
                                        <label>App accent color (3D glass glow theme)</label>
                                        <div className="accentGrid">
                                            {[
                                                { label: "Warm Sunset", value: "#ff9839" },
                                                { label: "Cyber Purple", value: "#a855f7" },
                                                { label: "Deep Blue", value: "#3b82f6" },
                                                { label: "Emerald Mint", value: "#10b981" }
                                            ].map(color => (
                                                <button
                                                    type="button"
                                                    key={color.value}
                                                    className={`accentChoiceBtn ${profileAccent === color.value ? 'active' : ''}`}
                                                    style={{ '--accent-color': color.value }}
                                                    onClick={() => setProfileAccent(color.value)}
                                                    title={color.label}
                                                >
                                                    <span className="accentColorDot" style={{ backgroundColor: color.value }}></span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{color.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-dashboard-action" style={{ marginTop: '2rem', width: '220px' }}>
                                    Save Profile Settings
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="dashboardHeader">
                            <div>
                                <h1>Dashboard Workspace</h1>
                                <p>Welcome back, {userData?.name || "User"}! Start hosting instantly or enter a code to join a room.</p>
                            </div>
                            <div className="meetingBadge">
                                <span className="liveDot"></span> Server Connected
                            </div>
                        </header>

                        {/* Stats Row */}
                        <section className="statsRow">
                            <div className="statCard glass-panel glassy-3d">
                                <div className="statCardIcon">🎥</div>
                                <div className="statCardInfo">
                                    <h4>Unlimited</h4>
                                    <p>Call Time</p>
                                </div>
                            </div>
                            <div className="statCard glass-panel glassy-3d">
                                <div className="statCardIcon">👥</div>
                                <div className="statCardInfo">
                                    <h4>100%</h4>
                                    <p>Free Account</p>
                                </div>
                            </div>
                            <div className="statCard glass-panel glassy-3d">
                                <div className="statCardIcon">🔒</div>
                                <div className="statCardInfo">
                                    <h4>AES-256</h4>
                                    <p>Call Security</p>
                                </div>
                            </div>
                        </section>

                        {/* Action Cards */}
                        <section className="actionGrid">
                            <div className="actionCard glass-panel glassy-3d">
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

                            <div className="actionCard glass-panel glassy-3d">
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
                            <div className="dashboardSectionCard glass-panel glassy-3d">
                                <h3>Upcoming Schedule (Mock)</h3>
                                <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.05)', color: 'var(--text-dim)' }}>
                                    📅 No meetings scheduled for today. Start a quick meeting instead!
                                </div>
                            </div>

                            <div className="dashboardSectionCard glass-panel glassy-3d">
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
                    </>
                )}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="mobileBottomNav glass-panel">
                <button 
                    className={`mobileNavItem ${activeTab === 'dashboard' ? 'active' : ''}`} 
                    onClick={() => setActiveTab("dashboard")}
                >
                    <span className="mobileNavIcon">🏠</span>
                    <span className="mobileNavText">Home</span>
                </button>
                <button 
                    className={`mobileNavItem ${activeTab === 'profile' ? 'active' : ''}`} 
                    onClick={() => setActiveTab("profile")}
                >
                    <span className="mobileNavIcon">👤</span>
                    <span className="mobileNavText">Profile</span>
                </button>
                <button className="mobileNavItem" onClick={() => navigate("/history")}>
                    <span className="mobileNavIcon">🕒</span>
                    <span className="mobileNavText">History</span>
                </button>
                <button 
                    className="mobileNavItem" 
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/auth");
                    }}
                    style={{ color: '#ef4444' }}
                >
                    <span className="mobileNavIcon">🚪</span>
                    <span className="mobileNavText">Logout</span>
                </button>
            </nav>
        </div>
    );
}

export default withAuth(HomeComponent)