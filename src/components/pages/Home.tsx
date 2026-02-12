import { useNavigate } from "react-router-dom";
import { Presentation, Gamepad2 } from "lucide-react";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Logo/Title */}
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>QueryHoot</h1>
          <p style={styles.tagline}>Learn React Query Through Interactive Gameplay</p>
        </div>

       {/* Cards */}
<div style={styles.cardsGrid}>
  <div style={styles.card}>
    <div style={{ ...styles.cardIcon, background: "#46178f" }}>
      <Presentation size={48} color="white" />
    </div>
    <h2 style={styles.cardTitle}>Presenter</h2>
    <p style={styles.cardDescription}>
      Create a room code, start rounds, and push "server updates" to demonstrate 
      React Query concepts.
    </p>
    <button style={styles.presenterButton} onClick={() => nav("/presenter")}>
      Launch Presenter
    </button>
  </div>

  <div style={styles.card}>
    <div style={{ ...styles.cardIcon, background: "#ffc107" }}>
      <Gamepad2 size={48} color="white" />
    </div>
    <h2 style={styles.cardTitle}>Player</h2>
    <p style={styles.cardDescription}>
      Join with a room code on your phone and experience Round 1 (manual) vs 
      Round 2 (auto) updates.
    </p>
    <button style={styles.playerButton} onClick={() => nav("/player")}>
      Join as Player
    </button>
  </div>
</div>

        {/* Info section */}
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <strong>Workshop Flow:</strong> Experience the pain of manual state management (Round 1) 
            vs the ease of React Query (Round 2)
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  
  content: {
    maxWidth: "1000px",
    width: "100%",
  },
  
  logoSection: {
    textAlign: "center" as const,
    marginBottom: "48px",
  },
  
  logo: {
    fontSize: "64px",
    fontWeight: 900,
    color: "white",
    margin: 0,
    marginBottom: "12px",
    textShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  
  tagline: {
    fontSize: "20px",
    color: "rgba(255,255,255,0.9)",
    margin: 0,
    fontWeight: 500,
  },
  
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "40px 32px",
    textAlign: "center" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    transition: "transform 0.2s",
  },
  
  cardIcon: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  
  cardTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#333",
    margin: "0 0 16px 0",
  },
  
  cardDescription: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  
  presenterButton: {
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    fontWeight: 700,
    color: "white",
    background: "#46178f",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(70, 23, 143, 0.4)",
  },
  
  playerButton: {
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#333",
    background: "#ffc107",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(255, 193, 7, 0.4)",
  },
  
  infoBox: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: "16px",
    padding: "20px 24px",
    textAlign: "center" as const,
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
  
  infoText: {
    margin: 0,
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.6",
  },
};