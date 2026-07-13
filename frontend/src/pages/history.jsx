import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import "../App.css";

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                console.error("Failed to fetch meeting history:", err);
            }
        };

        fetchHistory();
    }, []);

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                        <button className="menuItem" onClick={() => navigate("/home")}>
                            <span>🏠</span> Dashboard
                        </button>
                        <button className="menuItem active" onClick={() => navigate("/history")}>
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
                        <h1>Meeting History</h1>
                        <p>View your past activities, session timestamps, and room log entries.</p>
                    </div>
                </header>

                <div className="dashboardSectionCard" style={{ width: '100%' }}>
                    {meetings && meetings.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="historyTable">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Meeting Code</th>
                                        <th>Date Started</th>
                                        <th>Duration (Mocked)</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meetings.map((meeting, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <code style={{ background: 'rgba(255,152,57,0.1)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                                                    {meeting.meetingCode}
                                                </code>
                                            </td>
                                            <td>{formatDate(meeting.date)}</td>
                                            <td>25 mins</td>
                                            <td>
                                                <span className="statusTag completed">Completed</span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn-dashboard-sec" 
                                                    onClick={() => navigate(`/${meeting.meetingCode}`)}
                                                    style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '8px' }}
                                                >
                                                    Rejoin Room
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
                            <p>No meeting logs found on this account yet. Start a call to log your activities!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
