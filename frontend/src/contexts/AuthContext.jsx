import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";


export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`
})


export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);


    const [userData, setUserData] = useState(authContext);


    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            console.log(username, password)
            console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                await getUserProfile(request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    const getUserProfile = async (customToken) => {
        const activeToken = customToken || localStorage.getItem("token");
        if (!activeToken) return null;
        try {
            let request = await client.get("/profile", {
                params: {
                    token: activeToken
                }
            });
            if (request.status === httpStatus.OK) {
                setUserData(request.data);
            }
            return request.data;
        } catch (err) {
            console.error("Failed to load profile:", err);
            return null;
        }
    }

    const updateUserProfile = async (profileData) => {
        try {
            let request = await client.put("/profile", {
                token: localStorage.getItem("token"),
                ...profileData
            });
            if (request.status === httpStatus.OK) {
                setUserData(request.data.user);
            }
            return request.data;
        } catch (err) {
            throw err;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserProfile(token);
        }
    }, []);

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }


    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin, getUserProfile, updateUserProfile
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}
