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

    // Testimonial States
    const testimonials = [
        {
            quote: "MeetSphere has completely transformed how our remote team communicates. The latency is practically zero, and setup takes seconds.",
            name: "Emily Watson",
            role: "Product Lead at VeloTech",
            avatar: "EW"
        },
        {
            quote: "I use MeetSphere for tutoring sessions. The interactive chat and flawless screen sharing make teaching online an absolute breeze.",
            name: "Marcus Aurelius",
            role: "Online Educator",
            avatar: "MA"
        },
        {
            quote: "Finally, a video call platform that doesn't eat up my memory. Super light, glassmorphic UI looks stunning too!",
            name: "Sophia Chen",
            role: "UX Researcher",
            avatar: "SC"
        }
    ];
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        {
            question: "Is MeetSphere free to use?",
            answer: "Yes! MeetSphere offers a fully-functional Starter free tier where you can hold calls for up to 4 participants with a 40-minute duration limit."
        },
        {
            question: "How do I invite teammates to a call?",
            answer: "Simply share your custom meeting room code with them. They can type it in their home dashboard or join directly as a guest."
        },
        {
            question: "Can I share my screen and application tabs?",
            answer: "Absolutely. Screen sharing is supported natively via WebRTC. You can share your entire desktop, a single application window, or a specific browser tab in high definition."
        },
        {
            question: "Do I need to download any desktop app?",
            answer: "No! MeetSphere is a web-native application that runs directly inside modern web browsers (Chrome, Firefox, Safari, Edge) without requiring any browser plugins or installations."
        }
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

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

            {/* Features Grid Section */}
            <section id="features" className="featuresSection">
                <div className="sectionHeader">
                    <h2>Everything You Need, <span className="text-gradient">Fully Optimized</span></h2>
                    <p>MeetSphere offers a wide array of tools to ensure your meetings run flawlessly.</p>
                </div>

                <div className="featuresGrid">
                    <div className="featureCard">
                        <div className="featureIcon">📹</div>
                        <h3>HD Video & Audio</h3>
                        <p>Stream meetings in full high-definition video and audio with auto-adjusting bitrate to match your connection speed.</p>
                    </div>

                    <div className="featureCard">
                        <div className="featureIcon">🖥️</div>
                        <h3>Instant Screen Share</h3>
                        <p>Share your full screen, specific app windows, or browser tabs with other attendees in real-time with ultra-low latency.</p>
                    </div>

                    <div className="featureCard">
                        <div className="featureIcon">💬</div>
                        <h3>Real-time Chat Sidebar</h3>
                        <p>Chat with participants, send resource links, or write quick meeting notes in a beautifully designed sidebar workspace.</p>
                    </div>

                    <div className="featureCard">
                        <div className="featureIcon">🔒</div>
                        <h3>Secure Connections</h3>
                        <p>Rest easy knowing all WebRTC connections are authenticated and encrypted to prevent unwanted intruders.</p>
                    </div>

                    <div className="featureCard">
                        <div className="featureIcon">🕒</div>
                        <h3>Meeting History Log</h3>
                        <p>Track your past meeting timelines, joining timestamps, and session history inside a clean, modern user dashboard.</p>
                    </div>

                    <div className="featureCard">
                        <div className="featureIcon">⚡</div>
                        <h3>Quick Join Codes</h3>
                        <p>Join any active room code directly from your dashboard or guest link with zero sign-up required for guests.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="howItWorksSection">
                <div className="sectionHeader">
                    <h2>Simple, <span className="text-gradient">Yet Powerful</span> Workflow</h2>
                    <p>Get your team together in three straightforward steps.</p>
                </div>

                <div className="roadmapContainer">
                    <div className="roadmapStep">
                        <div className="roadmapContent">
                            <span className="roadmapNumber">1</span>
                            <h3>Create an Account</h3>
                            <p>Register a username and password. Keep all your past activities, customized settings, and logs synchronized in your user workspace.</p>
                        </div>
                        <div className="roadmapDot"></div>
                        <div style={{ width: '42%' }}></div>
                    </div>

                    <div className="roadmapStep">
                        <div style={{ width: '42%' }}></div>
                        <div className="roadmapDot"></div>
                        <div className="roadmapContent">
                            <span className="roadmapNumber">2</span>
                            <h3>Generate or Enter Code</h3>
                            <p>Generate a unique meeting room identifier code instantly with one click, or type a code provided by a teammate to join a room.</p>
                        </div>
                    </div>

                    <div className="roadmapStep">
                        <div className="roadmapContent">
                            <span className="roadmapNumber">3</span>
                            <h3>Start Collaborating</h3>
                            <p>Share your screen, chat with peers, select audio/video input devices, and collaborate seamlessly in HD quality.</p>
                        </div>
                        <div className="roadmapDot"></div>
                        <div style={{ width: '42%' }}></div>
                    </div>
                </div>
            </section>

            {/* Testimonials Slider Section */}
            <section className="testimonialsSection">
                <div className="sectionHeader">
                    <h2>Loved by <span className="text-gradient">Teams Worldwide</span></h2>
                    <p>Read what our creators and companies say about their experiences.</p>
                </div>

                <div className="sliderContainer">
                    <div className="testimonialCard">
                        <p className="testimonialQuote">
                            "{testimonials[currentTestimonial].quote}"
                        </p>
                        <div className="testimonialUser">
                            <div className="userAvatar">
                                {testimonials[currentTestimonial].avatar}
                            </div>
                            <div className="userMeta">
                                <h4>{testimonials[currentTestimonial].name}</h4>
                                <p>{testimonials[currentTestimonial].role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="sliderControls">
                        <button className="sliderBtn" onClick={prevTestimonial}>
                            ◀
                        </button>
                        <button className="sliderBtn" onClick={nextTestimonial}>
                            ▶
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricingSection">
                <div className="sectionHeader">
                    <h2>Flexible Plans for <span className="text-gradient">Every Team</span></h2>
                    <p>Get started for free or upgrade for advanced security, transcripts, and unlimited participant logs.</p>
                </div>

                <div className="billingToggle">
                    <span style={{ color: billingCycle === 'monthly' ? 'var(--primary)' : 'var(--text-muted)' }}>Monthly</span>
                    <div 
                        className="toggleContainer" 
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    >
                        <div className={`toggleBtn ${billingCycle === 'monthly' ? 'active' : ''}`}>Monthly</div>
                        <div className={`toggleBtn ${billingCycle === 'yearly' ? 'active' : ''}`}>Yearly (-20%)</div>
                    </div>
                    <span style={{ color: billingCycle === 'yearly' ? 'var(--primary)' : 'var(--text-muted)' }}>Yearly</span>
                </div>

                <div className="pricingGrid">
                    <div className="pricingCard">
                        <h3>Starter</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>For casual conversations</p>
                        <div className="pricingPrice">
                            <span className="priceVal">$0</span>
                            <span className="pricePeriod">/forever</span>
                        </div>
                        <ul>
                            <li>Up to 4 participants</li>
                            <li>40-minute call duration limit</li>
                            <li>Basic in-call sidebar chat</li>
                            <li>No card registration needed</li>
                        </ul>
                        <button className="btn-pricing" onClick={() => router("/auth")}>Get Started</button>
                    </div>

                    <div className="pricingCard popular">
                        <span className="popularBadge">Most Popular</span>
                        <h3>Pro Professional</h3>
                        <p style={{ color: 'var(--text-muted)', opacity: 0.8, fontSize: '0.85rem' }}>For growing startup teams</p>
                        <div className="pricingPrice">
                            <span className="priceVal">{billingCycle === 'monthly' ? '$15' : '$12'}</span>
                            <span className="pricePeriod">/user/mo</span>
                        </div>
                        <ul>
                            <li>Up to 100 participants</li>
                            <li>Unlimited meeting duration</li>
                            <li>High quality HD screen sharing</li>
                            <li>Saves up to 30 meeting logs</li>
                            <li>Priority chat customer support</li>
                        </ul>
                        <button className="btn-pricing" onClick={() => router("/auth")}>Go Pro</button>
                    </div>

                    <div className="pricingCard">
                        <h3>Enterprise</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>For large organizational work</p>
                        <div className="pricingPrice">
                            <span className="priceVal">{billingCycle === 'monthly' ? '$39' : '$31'}</span>
                            <span className="pricePeriod">/user/mo</span>
                        </div>
                        <ul>
                            <li>Unlimited participants</li>
                            <li>Custom security integrations</li>
                            <li>Dedicated room servers</li>
                            <li>Full transcript logs sync</li>
                            <li>24/7 account manager support</li>
                        </ul>
                        <button className="btn-pricing" onClick={() => alert("Please contact sales at sales@meetsphere.com to set up Enterprise custom servers!")}>Contact Sales</button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faqs" className="faqSection">
                <div className="sectionHeader">
                    <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
                    <p>Got questions? We have answers. If you don't find what you are looking for, contact our support.</p>
                </div>

                <div className="faqContainer">
                    {faqs.map((faq, i) => (
                        <div key={i} className={`faqItem ${activeFaq === i ? 'active' : ''}`}>
                            <div className="faqQuestion" onClick={() => toggleFaq(i)}>
                                <span>{faq.question}</span>
                                <span className="faqIcon">+</span>
                            </div>
                            <div className="faqAnswer">
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    )
}

