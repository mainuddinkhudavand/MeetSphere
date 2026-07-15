import mongoose, { Schema } from "mongoose";

const userScheme = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        token: { type: String },
        avatar: { type: String, default: "👤" },
        bio: { type: String, default: "Hello! I am using MeetSphere." },
        status: { type: String, default: "Active" },
        accentColor: { type: String, default: "#ff9839" }
    }
)

const User = mongoose.model("User", userScheme);

export { User };