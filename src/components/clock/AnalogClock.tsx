type Props = {
  hour: number;
  minute: number;
  second: number;
};

export default function AnalogClock({ hour, minute, second }: Props) {
  const hourDeg = (hour % 12) * 30 + minute * 0.5;
  const minuteDeg = minute * 6;
  const secondDeg = second * 6;

  return (
    <div style={styles.clock}>
      <div style={{ ...styles.hand, transform: `rotate(${hourDeg}deg)`, width: "70px", height: "4px" }} />
      <div style={{ ...styles.hand, transform: `rotate(${minuteDeg}deg)`, width: "100px", height: "3px" }} />
      <div style={{ ...styles.second, transform: `rotate(${secondDeg}deg)` }} />
      <div style={styles.center} />
    </div>
  );
}

const styles = {
  clock: {
    width: "280px",
    height: "280px",
    borderRadius: "50%",
    border: "8px solid #46178f",
    position: "relative" as const,
    background: "white",
    boxShadow: "0 8px 24px rgba(70, 23, 143, 0.2)",
  },
  hand: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transformOrigin: "left center",
    background: "#333",
    borderRadius: "4px",
  },
  second: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    width: "120px",
    height: "2px",
    background: "#e91e63",
    transformOrigin: "left center",
  },
  center: {
    position: "absolute" as const,
    width: "14px",
    height: "14px",
    background: "#46178f",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
};
