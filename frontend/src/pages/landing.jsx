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


            <div className="landingMainContainer">
                <div>
                    <h1><span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>

                    <p>Cover a distance by MeetSphere</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>

                    <img src="/mobile.png" alt="" />

                </div>
            </div>



        </div>
    )
}
