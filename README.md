# QueryHoot

QueryHoot is a real-time interactive workshop application designed to teach the core concepts of server-state synchronization and demonstrate the value of React Query through hands-on experience.

Participants join a shared room and observe how client state behaves under two conditions:

- **Round 1 - Manual Sync:** Clients must manually refresh to stay up to date, simulating traditional `useEffect`-based fetching.
- **Round 2 - Auto Sync:** Clients update automatically, demonstrating the behavior and advantages of React Query-style synchronization.

This contrast helps developers understand server state, synchronization challenges, and how automatic state management improves reliability and developer experience.

## Features

- Real-time synchronization using Ably
- Presenter-controlled server state
- Multi-player room system
- Live board visualization of all connected clients
- Manual vs automatic synchronization modes
- Persistent presenter session state


## Tech Stack

- React
- TypeScript
- React Router
- Ably Realtime
- Vite


## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/queryhoot.git
cd queryhoot
2. Install dependencies
npm install
3. Configure environment variables
Create a .env file in the root directory:

VITE_ABLY_KEY=your_ably_api_key
You can obtain a key from: https://ably.com/

4. Run the development server
npm run dev
The app will start at:

http://localhost:5173
Usage
Presenter:

http://localhost:5173/presenter
Players:

http://localhost:5173/player?room=ROOM_CODE
Board:

http://localhost:5173/board?room=ROOM_CODE
