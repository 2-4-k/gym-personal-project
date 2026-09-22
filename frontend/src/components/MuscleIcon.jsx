// A minimal geometric body silhouette. Each muscle group highlights the
// shapes roughly corresponding to its location; not anatomically precise,
// just enough to make the card instantly recognizable at a glance.

const OUTLINE_SHAPES = [
  { tag: "circle", cx: 50, cy: 14, r: 9 },
  { tag: "rect", x: 33, y: 26, width: 34, height: 56, rx: 12 },
  { tag: "rect", x: 16, y: 30, width: 13, height: 34, rx: 6 },
  { tag: "rect", x: 71, y: 30, width: 13, height: 34, rx: 6 },
  { tag: "rect", x: 14, y: 64, width: 11, height: 30, rx: 5 },
  { tag: "rect", x: 75, y: 64, width: 11, height: 30, rx: 5 },
  { tag: "rect", x: 36, y: 82, width: 13, height: 42, rx: 6 },
  { tag: "rect", x: 51, y: 82, width: 13, height: 42, rx: 6 },
  { tag: "rect", x: 37, y: 124, width: 11, height: 40, rx: 5 },
  { tag: "rect", x: 52, y: 124, width: 11, height: 40, rx: 5 },
];

const MUSCLE_REGIONS = {
  Chest: [{ tag: "rect", x: 35, y: 28, width: 30, height: 24, rx: 8 }],
  Back: [{ tag: "rect", x: 33, y: 26, width: 34, height: 56, rx: 12 }],
  Shoulders: [
    { tag: "circle", cx: 22, cy: 32, r: 7 },
    { tag: "circle", cx: 78, cy: 32, r: 7 },
  ],
  Biceps: [
    { tag: "rect", x: 16, y: 34, width: 13, height: 28, rx: 6 },
    { tag: "rect", x: 71, y: 34, width: 13, height: 28, rx: 6 },
  ],
  Triceps: [
    { tag: "rect", x: 16, y: 34, width: 13, height: 28, rx: 6 },
    { tag: "rect", x: 71, y: 34, width: 13, height: 28, rx: 6 },
  ],
  Core: [{ tag: "rect", x: 37, y: 54, width: 26, height: 26, rx: 8 }],
  Quads: [
    { tag: "rect", x: 36, y: 82, width: 13, height: 42, rx: 6 },
    { tag: "rect", x: 51, y: 82, width: 13, height: 42, rx: 6 },
  ],
  Hamstrings: [
    { tag: "rect", x: 36, y: 82, width: 13, height: 42, rx: 6 },
    { tag: "rect", x: 51, y: 82, width: 13, height: 42, rx: 6 },
  ],
  Glutes: [{ tag: "rect", x: 35, y: 78, width: 30, height: 14, rx: 8 }],
  Calves: [
    { tag: "rect", x: 37, y: 124, width: 11, height: 40, rx: 5 },
    { tag: "rect", x: 52, y: 124, width: 11, height: 40, rx: 5 },
  ],
};

function Shape({ shape }) {
  if (shape.tag === "circle") {
    return <circle cx={shape.cx} cy={shape.cy} r={shape.r} />;
  }
  return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />;
}

export default function MuscleIcon({ muscleName, ready }) {
  const regions = MUSCLE_REGIONS[muscleName] || [];

  return (
    <svg viewBox="0 0 100 190" className={`muscle-icon ${ready ? "ready" : "recovering"}`} aria-hidden="true">
      <g className="muscle-icon-outline">
        {OUTLINE_SHAPES.map((shape, i) => (
          <Shape key={i} shape={shape} />
        ))}
      </g>
      <g className="muscle-icon-region">
        {regions.map((shape, i) => (
          <Shape key={i} shape={shape} />
        ))}
      </g>
    </svg>
  );
}
