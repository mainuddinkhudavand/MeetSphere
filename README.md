# 🌐 MeetSphere

A state-of-the-art, high-fidelity video conferencing and team collaboration platform. MeetSphere features an ultra-premium glassmorphic user interface, designed to impress at first glance. 

**Note for Reviewers:** MeetSphere is equipped with an **Offline Sandbox/Simulation Mode**. Even if you do not run or deploy the backend server database, you can fully explore the dashboard, test camera/microphone toggles, run simulated screen sharing, and interact with chat bots in the mock meeting space!

---

## ✨ Features Revamp

### 1. Interactive Landing Page
- **Hero Area**: Beautiful, responsive layout with floating 3D-like badges, call-to-actions, and glowing radial ambient effects.
- **Interactive Mock Call Simulator**: Test camera/microphone triggers, simulate screen shares, and send chats to get automated replies from bots.
- **Feature Cards**: A detailed grid highlighting HD video streams, WebRTC security, and activity history.
- **"How It Works" Roadmap**: A vertical, scroll-based roadmap showing the path to collaboration.
- **Testimonial Slider**: Fully interactive testimonials carousel.
- **Pricing Switcher**: Toggle billing cycles between monthly/yearly plans with discounts.
- **FAQs Accordion**: Expandable Q&A panel using clean glassmorphism.
- **Newsletter Subscription**: Responsive subscription form with immediate validation feedback.

### 2. Glassmorphic Authentication
- tabbed navigation between "Sign In" and "Sign Up" options.
- Client-side validation checks for display names, username length, and password rules.
- Password hide/show visibility toggling.

### 3. Dashboard Workspace
- Left sidebar navigation syncing Dashboard, History Logs, and device health status.
- **Host Instant Call**: Auto-generates unique 6-character room codes with instant copy-to-clipboard actions.
- **Join Call**: Connect to active rooms via room code.

### 4. Meeting Space
- Clean, Zoom/Teams-inspired camera tile grids.
- Floating control bar with immediate action updates.
- Real-time slide-out side panel syncing chats and notifications.

---

## 🛠️ Technology Stack
- **Frontend**: React.js (v18), React Router (v6)
- **Styling**: Vanilla CSS with HSL variables, glassmorphic filters, and keyframe animations
- **Real-Time Feed**: WebRTC (RTCPeerConnection) & Socket.io-client
- **Icons & Theme**: Custom SVG designs & Google Fonts (Outfit, Inter)

---

## 🚀 How to Run the Frontend Locally

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. Select **Sandbox (Mock)** when entering rooms to inspect design layouts without running the backend!
