import { rooms } from "@/lib/vao";
import styles from "./vao.module.css";

/** Where each room sits on the drawing (viewBox 600×400) and the hour written in it. */
const layout: Record<string, { x: number; y: number; w: number; h: number; hour: string }> = {
  varanda: { x: 0, y: 0, w: 80, h: 400, hour: "18h" },
  sala: { x: 80, y: 0, w: 250, h: 230, hour: "Sáb." },
  cozinha: { x: 80, y: 230, w: 150, h: 170, hour: "7h" },
  trabalho: { x: 230, y: 230, w: 100, h: 170, hour: "9h" },
  quarto: { x: 330, y: 0, w: 270, h: 250, hour: "22h" },
  banho: { x: 330, y: 250, w: 130, h: 150, hour: "19h" },
};

/**
 * The routine plan (composição-assinatura of Vão): the floor plan of the illustrative apartment, drawn in line, with a
 * moment of the day in each room instead of its name; the list beside says what the project solves there. Static:
 * everything is visible. The drawing repeats the list for the eye, so it is hidden from assistive technology.
 */
export function RoutinePlan() {
  return <div className={styles.plan}>
    <svg className={styles.planDrawing} viewBox="-6 -6 612 412" aria-hidden="true">
      <rect x="460" y="250" width="140" height="150" className={styles.planService} />
      {rooms.map((room, i) => {
        const r = layout[room.id];
        const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        return <g key={room.id}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} className={room.id === "varanda" ? styles.planOpen : styles.planRoom} />
          <circle cx={cx} cy={cy - 12} r="17" className={styles.planDot} />
          <text x={cx} y={cy - 5} className={styles.planNum}>{i + 1}</text>
          <text x={cx} y={cy + 30} className={styles.planHour}>{r.hour}</text>
        </g>;
      })}
      <rect x="0" y="0" width="600" height="400" className={styles.planOuter} />
      {/* The open kitchen: no wall between it and the living room, only a dashed line. */}
      <path d="M86 230 H226" className={styles.planGap} /><path d="M86 230 H226" className={styles.planOpen} />
      {/* Doors: the gap in the wall and the leaf's swing. */}
      {["M330 148 V192", "M248 230 H292", "M348 250 H386", "M498 400 H552"].map(d => <path key={d} d={d} className={styles.planGap} />)}
      <path d="M330 150 H370 A40 40 0 0 1 330 190" className={styles.planDoor} />
      <path d="M250 230 V270 A40 40 0 0 0 290 230" className={styles.planDoor} />
      <path d="M350 250 V285 A35 35 0 0 0 385 250" className={styles.planDoor} />
      <path d="M500 400 V355 A45 45 0 0 1 545 400" className={styles.planDoor} />
      {/* Windows on the outer wall. */}
      {["M110 0 H300", "M370 0 H570"].map(d => <g key={d}><path d={d} className={styles.planGap} /><path d={d} className={styles.planWindow} /></g>)}
    </svg>
    <ol className={styles.planList}>{rooms.map((room, i) => <li key={room.id}>
      <span className={styles.planBadge} aria-hidden="true">{i + 1}</span>
      <div><h3>{room.moment}<small>{room.room}</small></h3><p>{room.text}</p></div>
    </li>)}</ol>
  </div>;
}
