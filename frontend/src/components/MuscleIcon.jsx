// A minimal geometric body silhouette. Each muscle group highlights the
// shapes roughly corresponding to its location; not anatomically precise,
// just enough to make the card instantly recognizable at a glance.
//
// Front-of-body and back-of-body muscle groups share the same limb outline
// (an arm silhouette looks the same from front or back), so a face is drawn
// for front-view groups and a spine + shoulder blades for back-view ones —
// otherwise pairs like biceps/triceps or quads/hamstrings would be visually
// identical despite highlighting the same limb.

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

const FRONT_DECOR = [
  { tag: "circle", cx: 46, cy: 12, r: 1.4 },
  { tag: "circle", cx: 54, cy: 12, r: 1.4 },
];

const BACK_DECOR = [
  { tag: "line", x1: 50, y1: 28, x2: 50, y2: 80 },
  { tag: "ellipse", cx: 42, cy: 37, rx: 4.5, ry: 7 },
  { tag: "ellipse", cx: 58, cy: 37, rx: 4.5, ry: 7 },
];

const MUSCLE_VIEW = {
  Chest: "front",
  Shoulders: "front",
  Biceps: "front",
  Core: "front",
  Quads: "front",
  Back: "back",
  Triceps: "back",
  Glutes: "back",
  Hamstrings: "back",
  Calves: "back",
};

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
  switch (shape.tag) {
    case "circle":
      return <circle cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case "ellipse":
      return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />;
    case "line":
      return <line x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} />;
    default:
      return <rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />;
  }
}

export default function MuscleIcon({ muscleName, ready }) {
  const regions = MUSCLE_REGIONS[muscleName] || [];
  const view = MUSCLE_VIEW[muscleName] || "front";
  const decor = view === "front" ? FRONT_DECOR : BACK_DECOR;

  return (
    <svg viewBox="0 0 100 190" className={`muscle-icon ${ready ? "ready" : "recovering"}`} aria-hidden="true">
      <g className="muscle-icon-outline">
        {OUTLINE_SHAPES.map((shape, i) => (
          <Shape key={i} shape={shape} />
        ))}
      </g>
      <g className="muscle-icon-decor">
        {decor.map((shape, i) => (
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
