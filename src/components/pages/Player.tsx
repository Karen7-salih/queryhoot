import { useEffect, useState } from "react";
import AnalogClock from "../clock/AnalogClock";

export default function Player() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const digital = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div style={styles.container}>
      <h1>⏰ SyncTime Game</h1>

      <AnalogClock
        hour={hours}
        minute={minutes}
        second={seconds}
      />

      <h2 style={styles.digital}>{digital}</h2>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    background: "#fefaf3",
  },
  digital: {
    fontSize: "32px",
    fontWeight: "bold",
  },
};
