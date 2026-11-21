// Data for <StringWall />. The wall is a fixed 1400 x 1000 design canvas that is scaled to fit the screen,
// so x/y are percentages of that canvas and w is in canvas pixels. Images are placeholders in public/wall/.

export const CANVAS = { w: 1400, h: 1000 }

export type Anchor = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | "c"
export type Edge = { edge: "left" | "right" | "top" | "bottom"; at: number } // `at` = 0..1 along that edge

export type WallItem = {
  id: string
  type: "photo" | "note"
  src?: string
  alt: string
  text?: string // notes: lines separated by \n
  x: number // % of canvas width (may be negative or push past 100 to bleed off the edge)
  y: number // % of canvas height
  w: number // canvas px
  ratio?: number // photos: width / height
  rotate: number // deg, keep within ±2.5
  depth: number // 2..6: px of mouse parallax
  pin: "top" | "corners"
  mono?: boolean // black & white print
  worn?: boolean // darker, aged edges
  torn?: boolean // ragged border
  minor?: boolean // hidden on tablets (640–1023px), where the wall is scaled down
}

export type Connection = { from: string; to: string | Edge; fromAnchor?: Anchor; toAnchor?: Anchor }

export const ITEMS: WallItem[] = [
  { id: "eye", type: "photo", src: "/wall/eye.jpg", alt: "Extreme close-up of a pair of eyes behind glasses", x: -3, y: 6, w: 294, ratio: 16 / 9, rotate: -1.2, depth: 3, pin: "corners", mono: true, worn: true },
  { id: "wire", type: "photo", src: "/wall/barbed-wire.jpg", alt: "Two strands of barbed wire against a grey sky", x: 33, y: 2, w: 210, ratio: 4 / 3, rotate: 1.5, depth: 4, pin: "corners", mono: true },
  { id: "face", type: "photo", src: "/wall/portrait.jpg", alt: "Portrait, looking straight at the camera", x: 55, y: 20, w: 154, ratio: 4 / 3, rotate: -0.8, depth: 5, pin: "corners", mono: true },
  { id: "test1", type: "photo", src: "/wall/test-print-1.jpg", alt: "Small test print", x: 80, y: 24, w: 63, ratio: 3 / 4, rotate: 2, depth: 6, pin: "top", mono: true, minor: true },
  { id: "hand", type: "photo", src: "/wall/hand.jpg", alt: "A raised hand, close up", x: 91, y: 22, w: 98, ratio: 3 / 4, rotate: -1.5, depth: 4, pin: "corners", mono: true },
  { id: "night", type: "photo", src: "/wall/night.jpg", alt: "A figure lit in the dark", x: 32, y: 37, w: 140, ratio: 4 / 3, rotate: 1, depth: 5, pin: "corners", mono: true },
  { id: "note1", type: "note", alt: "Handwritten note", text: "who took\nthe photo?\n— check 02.11", x: 34, y: 53.5, w: 124, rotate: -2, depth: 5, pin: "top" },
  { id: "map", type: "photo", src: "/wall/map.jpg", alt: "A fragment of a map with a route marked in red", x: 57, y: 45, w: 147, ratio: 4 / 3, rotate: 0.6, depth: 3, pin: "corners", torn: true },
  { id: "test2", type: "photo", src: "/wall/test-print-2.jpg", alt: "Small test print", x: 80, y: 46, w: 50, ratio: 3 / 4, rotate: -2.2, depth: 6, pin: "top", mono: true, minor: true },
  { id: "field", type: "photo", src: "/wall/field.jpg", alt: "A green landscape", x: 89, y: 54, w: 112, ratio: 4 / 3, rotate: 1.8, depth: 4, pin: "corners" },
  { id: "tall", type: "photo", src: "/wall/tall.jpg", alt: "A tall portrait of a standing figure", x: -2, y: 38, w: 161, ratio: 2 / 3, rotate: 0.5, depth: 2, pin: "corners", mono: true, worn: true },
  { id: "note2", type: "note", alt: "Handwritten note", text: "same coat.\nsame corner.\ndifferent day?", x: 15.5, y: 40, w: 124, rotate: 1.5, depth: 3, pin: "top" },
  { id: "desk", type: "photo", src: "/wall/desk.jpg", alt: "A desk seen from above", x: 21, y: 66, w: 217, ratio: 4 / 3, rotate: -1, depth: 3, pin: "corners", mono: true, worn: true },
  { id: "test3", type: "photo", src: "/wall/test-print-3.jpg", alt: "Small test print with a burnt edge", x: 50, y: 67, w: 57, ratio: 3 / 4, rotate: 1.2, depth: 6, pin: "top", mono: true, torn: true, worn: true },
  { id: "test4", type: "photo", src: "/wall/test-print-4.jpg", alt: "Small test print", x: 70.5, y: 72, w: 49, ratio: 3 / 4, rotate: -1.8, depth: 6, pin: "top", mono: true, minor: true },
  { id: "doorway", type: "photo", src: "/wall/doorway.jpg", alt: "A dark doorway", x: 78, y: 68, w: 154, ratio: 4 / 3, rotate: 2, depth: 4, pin: "corners", mono: true },
  { id: "note3", type: "note", alt: "Handwritten note", text: "map ≠ route\nask about\nthe bus", x: 60, y: 63, w: 124, rotate: -1.2, depth: 4, pin: "top" },
  { id: "corner", type: "photo", src: "/wall/corner.jpg", alt: "A figure in a corner", x: 1, y: 80, w: 91, ratio: 3 / 4, rotate: -2, depth: 3, pin: "corners", mono: true },
]

// red-web: a dense mesh. Anchors left out are picked live as the closest corners of the two items;
// the explicit ones cross over prints on purpose, and the edge ones run off the wall.
export const WEB: Connection[] = [
  ...[
    ["eye", "wire"], ["eye", "night"], ["eye", "tall"], ["eye", "note2"], ["wire", "face"], ["wire", "night"],
    ["face", "test1"], ["face", "night"], ["face", "map"], ["test1", "hand"], ["test1", "test2"], ["hand", "field"],
    ["hand", "test2"], ["night", "note1"], ["night", "map"], ["night", "desk"], ["note1", "desk"], ["map", "test2"],
    ["map", "note3"], ["map", "doorway"], ["map", "test3"], ["test2", "field"], ["field", "doorway"], ["tall", "note2"],
    ["tall", "desk"], ["tall", "corner"], ["desk", "test3"], ["desk", "corner"], ["test3", "note3"], ["note3", "test4"],
    ["test4", "doorway"],
  ].map(([from, to]) => ({ from, to })),
  { from: "eye", fromAnchor: "br", to: "face", toAnchor: "bl" },
  { from: "wire", fromAnchor: "bl", to: "map", toAnchor: "tl" },
  { from: "night", fromAnchor: "tr", to: "test1", toAnchor: "bl" },
  { from: "desk", fromAnchor: "tr", to: "map", toAnchor: "bl" },
  { from: "tall", fromAnchor: "tr", to: "night", toAnchor: "bl" },
  { from: "hand", fromAnchor: "tr", to: { edge: "right", at: 0.1 } },
  { from: "field", fromAnchor: "br", to: { edge: "right", at: 0.75 } },
  { from: "eye", fromAnchor: "tl", to: { edge: "top", at: 0.05 } },
  { from: "wire", fromAnchor: "tr", to: { edge: "top", at: 0.7 } },
  { from: "corner", fromAnchor: "bl", to: { edge: "bottom", at: 0.3 } },
]

// hub: the map is the hub; threads radiate from its middle to most items, and a few shoot off the wall
export const HUB_ID = "map"
export const HUB: Connection[] = [
  ...["eye", "wire", "face", "test1", "hand", "night", "note1", "tall", "note2", "desk", "test3", "note3", "doorway", "field", "corner"]
    .map((to) => ({ from: HUB_ID, fromAnchor: "c" as const, to })),
  { from: HUB_ID, fromAnchor: "c", to: { edge: "right", at: 0.32 } },
  { from: HUB_ID, fromAnchor: "c", to: { edge: "bottom", at: 0.85 } },
  { from: HUB_ID, fromAnchor: "c", to: { edge: "left", at: 0.14 } },
]
