# MeetSphere User Profiles, Mobile Responsiveness, and Zen Workspace Features

This implementation plan outlines the architecture and execution strategy to add customizable User Profiles, full mobile responsiveness (mobile display settings/layouts), and a set of innovative meeting features called the "Zen Workspace" (Collaborative Notes, Pomodoro Study Timer, Ambient Soundscapes, Team Icebreakers, and Interactive Polls). Additionally, this plan outlines the strategy to perform a minimum of 20 atomic git commits and pushes.

## User Review Required
> [!IMPORTANT]
> - **Theme Accent Colors**: We will allow users to pick a custom accent color (orange, purple, blue, green) that will update the UI variables.
> - **No Third-Party Media Hosting**: For custom user profile avatars, we will support standard inline emoji select and custom image URLs, eliminating the need to configure file storage.
> - **Zen Workspace Features**: These features will work in both Live (Socket) mode and the Sandbox preview mode, making them highly interactive and reliable for testing.

## Open Questions
None. The specifications are fully understood and the database schema and layout mockups are designed.

## Proposed Changes

---

### Backend Components

#### [MODIFY] [user.model.js](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/backend/src/models/user.model.js)
- Update Schema to support profile fields: `bio` (String), `avatar` (String), `status` (String), and `accentColor` (String).

#### [MODIFY] [user.controller.js](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/backend/src/controllers/user.controller.js)
- Add controller functions `getUserProfile` and `updateUserProfile`.
- Update `register` to initialize fields with default values.

#### [MODIFY] [users.routes.js](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/backend/src/routes/users.routes.js)
- Add `/profile` route (`GET` and `PUT`) mapped to the controllers.

---

### Frontend Components

#### [MODIFY] [AuthContext.jsx](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/frontend/src/contexts/AuthContext.jsx)
- Fetch the user's profile details during login/initial load.
- Store profile details in `userData`.
- Expose `updateUserProfile` and `userProfile` states.

#### [MODIFY] [home.jsx](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/frontend/src/pages/home.jsx)
- Redesign sidebar layout to add a "My Profile" tab.
- Add a beautiful glassmorphic User Profile panel/modal allowing editing of display name, bio, avatar emoji, accent color, and custom status.
- Dynamically inject the chosen `accentColor` into the root CSS variables so the dashboard and other components match the user's selected accent.
- Make navigation responsive: hide sidebar on screens under 768px and show a mobile-responsive bottom navbar/header.

#### [MODIFY] [VideoMeet.jsx](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/frontend/src/pages/VideoMeet.jsx)
- Automatically load display name and avatar from profile (bypass text prompt if user is logged in).
- Redesign the meet room layout to be mobile responsive.
- Replace/enhance the right sidebar: add tabs for "Chat" and "Zen Workspace" (or a split layout on larger screens).
- Implement Zen Workspace elements:
  - **Collaborative Notes**: A shared textarea synced via Socket.io (with offline fallback).
  - **Pomodoro Focus Timer**: Synced focus session timer with standard start/pause/reset states.
  - **Ambient Soundscapes**: Selectable background sound players (Lofi, Cafe, Rain, Forest) with localized playback.
  - **Icebreaker Generator**: Button displaying fun quick prompt questions.
  - **Interactive Polls**: Host can launch a poll, other users vote, display real-time results in a bar graph.

#### [MODIFY] [videoComponent.module.css](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/frontend/src/styles/videoComponent.module.css)
- Update layouts to use flexwrap and css grids optimized for mobile screen sizes (<= 768px).
- Add styles for the sidebar tab selectors, Pomodoro, Soundscapes, and Notes controls.

#### [MODIFY] [App.css](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/MeetSphere/frontend/src/App.css)
- Add responsive media queries for landing, authentication, and history pages.
- Add mobile navigation drawer and profile styling classes.

---

## 20-Commit Roadmap
To satisfy the requirement of minimum 20 commits and push each time:
1. `backend: add profile fields to user schema`
2. `backend: implement getProfile and updateProfile controllers`
3. `backend: register user profile routes`
4. `frontend: fetch profile data on auth state update`
5. `frontend: expose updateProfile methods in AuthContext`
6. `frontend: build My Profile tab panel in dashboard home`
7. `frontend: implement accent theme color engine in dashboard`
8. `frontend: add mobile hamburger and bottom navbar for dashboard`
9. `frontend: optimize authentication page responsiveness`
10. `frontend: make history logs and landing page fully mobile responsive`
11. `frontend: bypass lobby username prompt if logged in`
12. `frontend: implement meeting Zen Workspace UI tabs`
13. `frontend: build collaborative notes module synced over socket.io`
14. `frontend: implement interactive Pomodoro focus timer`
15. `frontend: add ambient soundscapes player to video lobby`
16. `frontend: implement quick icebreaker question generator`
17. `frontend: create interactive meeting polls drawer`
18. `frontend: apply video grid responsive layouts for mobile screens`
19. `style: polish typography and transitions for all new elements`
20. `docs: update documentation with User Profile and Zen Workspace features`

## Verification Plan

### Automated Verification
- Run local servers and run linting/testing scripts.

### Manual Verification
1. Open Profile Settings, change accent color and observe theme styling change instantly.
2. Edit Name, Bio, and Avatar. Save and verify database update.
3. Open call: check that the profile username is pre-filled.
4. Toggle screen sizes in browser inspector to mobile (375px/412px). Ensure layout scales, sidebar toggles, and video elements layout correctly.
5. In video meet room, check the Pomodoro timer, play Ambient soundscapes, pull Icebreaker questions, launch a Poll, vote, and verify synced notes.
