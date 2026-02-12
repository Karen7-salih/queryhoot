import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="container">

      <h1 className="h1" style={{ marginTop: 14 }}>
        QueryHoot
      </h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: 620 }}>
        A tiny game to *feel* the difference between manual fetching (useEffect pain) and
        automatic server-state management (React Query magic).
      </p>

      <div className="grid2" style={{ marginTop: 18 }}>
        <div className="card">
          <h2 className="h2">Presenter</h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Create a room code, start rounds, and push “server updates”.
          </p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={() => nav("/presenter")}>
              Open Presenter
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="h2">Player</h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Join with a room code on your phone and play Round 1 + Round 2.
          </p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => nav("/player")}>
              Open Player
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row">
          <span className="badge">Round 1: Manual refresh</span>
          <span className="badge">Round 2: Auto sync</span>
          <span className="badge">Goal: reduce cognitive load</span>
        </div>
      </div>
    </div>
  );
}
