import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
export default function LandingPage() {


    const router = useNavigate();

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



        </div>
    )
}
