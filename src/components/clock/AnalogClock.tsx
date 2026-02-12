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
    border: "10px solid black",
    position: "relative" as const,
    background: "white",
  },
  hand: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transformOrigin: "left center",
    background: "black",
  },
  second: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    width: "120px",
    height: "2px",
    background: "red",
    transformOrigin: "left center",
  },
  center: {
    position: "absolute" as const,
    width: "10px",
    height: "10px",
    background: "black",
    borderRadius: "50%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};
