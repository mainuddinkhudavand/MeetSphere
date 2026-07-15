import * as React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

export default function Authentication() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [formState, setFormState] = useState(0); // 0: Login, 1: Register
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { handleRegister, handleLogin } = useContext(AuthContext);

    let handleAuth = async () => {
        // Client side validation
        if (!username || !username.includes("@") || username.trim().length < 5) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (formState === 1 && (!name || name.trim().length < 2)) {
            setError("Please enter a valid full name (minimum 2 characters).");
            return;
        }

        try {
            setError("");
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
                setPassword("");
                setName("");
            }
        } catch (err) {
            console.log(err);
            let errMsg = err.response?.data?.message || "An authentication error occurred.";
            setError(errMsg);
        }
    };

    return (
        <div className="authPageContainer">
            <div className="authLeftGlow"></div>
            <div className="authRightGlow"></div>
            
            <div className="authCard glass-panel glassy-3d animate-float">
                <div className="authLogo" onClick={() => navigate("/")}>
                    MeetSphere
                </div>
                
                <h3 className="authTitle">
                    {formState === 0 ? "Welcome Back" : "Create Account"}
                </h3>
                <p className="authSubtitle">
                    {formState === 0 ? "Sign in to access your video space" : "Sign up to start hosting virtual meetings"}
                </p>

                <div className="authTabs">
                    <button 
                        className={`authTabBtn ${formState === 0 ? 'active' : ''}`}
                        onClick={() => { setFormState(0); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button 
                        className={`authTabBtn ${formState === 1 ? 'active' : ''}`}
                        onClick={() => { setFormState(1); setError(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="authForm" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                    {formState === 1 && (
                        <div className="inputGroup">
                            <label>Full Name</label>
                            <input 
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="inputGroup">
                        <label>Email</label>
                        <input 
                            type="email"
                            placeholder="Enter your email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="inputGroup">
                        <label>Password</label>
                        <div className="passwordWrapper">
                            <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="passwordToggle" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {error && <p className="authError">⚠️ {error}</p>}

                    <button type="submit" className="authSubmitBtn">
                        {formState === 0 ? "Login" : "Register"}
                    </button>
                </form>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}