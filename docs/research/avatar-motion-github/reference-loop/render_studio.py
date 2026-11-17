"""Footer loop, strategist studio (15/11/2026): v25's figure and motion in the user's new room.

The user asked to leave the reference's room (sofa, album shelves, guitar, lamp, monitor) for something of his own:
"muito mais minimalista", with drawn conversion strategies, books and sticky notes, "o ar de estrategista". A room
drawn here in flat shapes read as an illustration next to the face; the user then generated base-estrategista.webp
(1536×1024): chalk board with funnel, flow chart, growth chart and journey line, a few books and plants, the grey
gaming notebook seen from behind (no logo), coffee, an open notebook with a pen.

Only the room is used. It is placed by the notebook (the generator redrew the face): the lid's top edge goes to
MONITOR_Y, where v25's monitor edge was, so it still hides the chin on the deepest hits, and the lid keeps the width
the earlier notebook had. The generated head and shoulders are filled from the board around them; v25's head, neck,
t-shirt and motion are drawn over it unchanged. Added here: the screen's red on the wall above the lid and the steam
moved to this mug (the steam painted in the image is removed). A red dot on the journey was tried and taken out
(SHOW_DOT). Phones get their own film (--mobile), with the board recomposed for the slice they show.

Usage (from the repository root):
  python docs/research/avatar-motion-github/reference-loop/render_studio.py --out DIR --still --break-shake-both
  python docs/research/avatar-motion-github/reference-loop/render_studio.py --out DIR --video --break-shake-both
"""
import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_collar as C  # noqa: E402
import render_reference_loop as R  # noqa: E402

ROOM = HERE / "base-estrategista.webp"
# Measured on base-estrategista.webp: lid top edge at row 593, sides at x 473 and 1062 (row 650). The earlier notebook,
# placed on the base, spanned x 455-1101 with its centre at 778.
LID_TOP, LID_LEFT, LID_RIGHT = 593.0, 473.0, 1062.0
SCALE = (1101 - 455) / (LID_RIGHT - LID_LEFT)
SHIFT_X = 778 - (LID_LEFT + LID_RIGHT) / 2 * SCALE
SHIFT_Y = R.MONITOR_Y - LID_TOP * SCALE
# The generated head and shoulders, in the room image's own pixels (filled from the board around them).
HEAD = ((770, 468), (96, 122))
SHOULDERS = [(622, 594), (690, 552), (850, 552), (918, 594)]
# The journey line's nodes on the board, left to right, in the room image's pixels; the last one becomes the red dot.
JOURNEY = [(960, 488), (1029, 478), (1083, 438), (1150, 475), (1215, 442), (1270, 438), (1336, 404)]
MUG_RIM = (1190, 821)
# Off (15/11/2026, the user agreed): the site's red dot is one dot from the hero to "Vamos conversar", right above
# the footer; a second red dot on the board, still or travelling, would appear from nowhere and pull the eye from the
# footer's WhatsApp link. The journey's last node stays in chalk, as generated.
SHOW_DOT = False
RED = np.float32((52, 44, 214))


def to_base(points):
    p = np.float32(points)
    return p * SCALE + (SHIFT_X, SHIFT_Y)


def clear_painted_steam(room):
    """The generated image already has steam above the mug; the loop draws its own, so the painted one goes."""
    mask = np.zeros(room.shape[:2], np.uint8)
    cv2.ellipse(mask, (1197, 742), (54, 82), 0, 0, 360, 255, -1)
    mask[MUG_RIM[1] - 4:] = 0
    # Inpainting pulled the rim's red up into a cone; the plain wall just right of the mug is used instead.
    alpha = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 4)[:, :, None]
    wall = np.roll(room, -110, axis=1).astype(np.float32)
    return np.clip(room * (1 - alpha) + wall * alpha, 0, 255).astype(np.uint8)


def place_room(shape):
    room = clear_painted_steam(cv2.imread(str(ROOM)))
    matrix = np.float32([[SCALE, 0, SHIFT_X], [0, SCALE, SHIFT_Y]])
    return cv2.warpAffine(room, matrix, (shape[1], shape[0]), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def clear_figure(plate):
    mask = np.zeros(plate.shape[:2], np.uint8)
    (cx, cy), (ax, ay) = HEAD
    centre = to_base([(cx, cy)])[0]
    cv2.ellipse(mask, (int(centre[0]), int(centre[1])), (int(ax * SCALE), int(ay * SCALE)), 0, 0, 360, 255, -1)
    cv2.fillPoly(mask, [np.int32(to_base(SHOULDERS))], 255)
    mask[R.MONITOR_Y + 2:] = 0                          # The lid stays as generated.
    mask = cv2.dilate(mask, np.ones((7, 7), np.uint8))
    filled = cv2.inpaint(plate, mask, 9, cv2.INPAINT_TELEA)
    # Just above the lid the screen's glow runs evenly along the edge; where the generated shoulders covered it,
    # each row is carried across from the clean pixels on either side, so the red line stays whole.
    # The board's bottom frame (rows 468-490 here) runs behind the neck the same way.
    for y in list(range(468, 491)) + list(range(R.MONITOR_Y - 24, R.MONITOR_Y + 2)):
        cols = np.flatnonzero(mask[y])
        if cols.size == 0:
            continue
        left, right = cols.min() - 2, cols.max() + 2
        t = ((cols - left) / (right - left))[:, None]
        filled[y, cols] = np.round(plate[y, left] * (1 - t) + plate[y, right] * t).astype(np.uint8)
    # Inpainting leaves a flat smear; a little noise lets it sit in the board's grain.
    noise = np.random.default_rng(3).normal(0, 2.2, plate.shape[:2]).astype(np.float32)
    soft = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 3)[:, :, None]
    out = filled.astype(np.float32) + noise[:, :, None] * soft
    return np.clip(out, 0, 255)


def journey_path():
    """A smooth path through the journey's nodes (Catmull-Rom), in base pixels."""
    nodes = to_base(JOURNEY)
    padded = np.vstack([nodes[0] * 2 - nodes[1], nodes, nodes[-1] * 2 - nodes[-2]])
    out = []
    for i in range(1, len(padded) - 2):
        p0, p1, p2, p3 = padded[i - 1:i + 3]
        for t in np.linspace(0, 1, 24, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(nodes[-1])
    return np.float32(out)


def dot(image, centre, radius, strength=1.0, glow=True):
    h, w = image.shape[:2]
    r = int(radius * 4 + 8)
    x0, y0 = max(int(centre[0]) - r, 0), max(int(centre[1]) - r, 0)
    x1, y1 = min(int(centre[0]) + r, w), min(int(centre[1]) + r, h)
    ys, xs = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    d = np.hypot(xs - centre[0], ys - centre[1])
    core = np.clip(radius + .6 - d, 0, 1)[:, :, None] * strength
    window = image[y0:y1, x0:x1]
    if glow:
        halo = (np.exp(-(d / (radius * 2.6)) ** 2) * .55 * strength)[:, :, None]
        window[:] = window + (RED - window) * halo * .5
    window[:] = window * (1 - core) + RED * core


def light(plate):
    h, w = plate.shape[:2]
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    lid_x = (to_base([(LID_LEFT, 0)])[0][0] + to_base([(LID_RIGHT, 0)])[0][0]) / 2
    # The screen's red rising on the wall and the board just above the lid, and a slight close-in of the corners.
    halo = np.exp(-((ys - R.MONITOR_Y) / 26) ** 2) * (ys < R.MONITOR_Y) * np.clip(1 - np.abs(xs - lid_x) / 380, 0, 1)
    spill = np.exp(-(((xs - lid_x) / 420) ** 2 + ((ys - R.MONITOR_Y + 40) / 150) ** 2)) * (ys < R.MONITOR_Y)
    plate[..., 2] += 70 * halo + 16 * spill
    plate[..., 1] += 6 * halo
    vignette = np.exp(-(((xs - w / 2) / (w * .72)) ** 2 + ((ys - h * .5) / (h * .8)) ** 2))
    return plate * (.72 + .28 * vignette)[:, :, None]


# Phones show only a narrow middle slice of the frame (object-fit: cover), about x 549-1012 here, so the journey and
# its red dot fell outside. The phone gets its own film: the same room, whose board shows, inside that slice, the
# journey with the red dot above the head, the funnel at its left and the growth chart at its right. Each piece is cut
# from the board itself, scaled, and laid on the board's own tone (the board with its chalk lines filtered out).
MOBILE_CROP = (520, 1040)                           # Columns of the phone film (aspect about 0.52).
# (source rectangle in base pixels x0, y0, x1, y1), scale, destination top-left.
PIECES = {
    "journey": ((950, 285, 1420, 425), .93, (565, 105)),
    "funnel": ((505, 85, 715, 325), .60, (558, 292)),
    "chart": ((1148, 61, 1378, 255), .52, (888, 304)),
}
BOARD_AREA = (532, 14, 1028, 468)


def piece_mask(name, w, h):
    mask = np.ones((h, w), np.float32)
    if name == "journey":
        mask[90:, 420:] = 0                             # Keep the yellow note at the board's right out of the piece.
        mask[:62, :128] = 0                             # And the flow chart's last box, above the first node.
    edge = np.minimum.reduce([np.arange(w)[None, :] + 1 + np.zeros((h, 1)), (w - np.arange(w))[None, :] + np.zeros((h, 1)),
                              np.arange(h)[:, None] + 1 + np.zeros((1, w)), (h - np.arange(h))[:, None] + np.zeros((1, w))])
    return cv2.GaussianBlur(mask, (0, 0), 3) * np.clip(edge / 10, 0, 1)


def mobile_board(plate):
    out = plate.copy()
    x0, y0, x1, y1 = BOARD_AREA
    # Chalk is light and thin on a dark board: an opening removes the strokes and keeps the board's tone and light.
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))
    clean = cv2.morphologyEx(np.clip(plate, 0, 255).astype(np.uint8), cv2.MORPH_OPEN, kernel)
    clean = cv2.GaussianBlur(clean, (0, 0), 4).astype(np.float32)
    ys, xs = np.mgrid[0:plate.shape[0], 0:plate.shape[1]].astype(np.float32)
    inside = np.clip(np.minimum.reduce([xs - x0, x1 - xs, ys - y0, y1 - ys]) / 12, 0, 1)[:, :, None]
    out = out * (1 - inside) + clean * inside
    for name, ((sx0, sy0, sx1, sy1), k, (dx, dy)) in PIECES.items():
        src = plate[sy0:sy1, sx0:sx1]
        w, h = int(round((sx1 - sx0) * k)), int(round((sy1 - sy0) * k))
        piece = cv2.resize(src, (w, h), interpolation=cv2.INTER_AREA)
        alpha = piece_mask(name, sx1 - sx0, sy1 - sy0)
        alpha = cv2.resize(alpha, (w, h), interpolation=cv2.INTER_AREA)[:, :, None]
        window = out[dy:dy + h, dx:dx + w]
        window[:] = window * (1 - alpha) + piece * alpha
    return out


def to_mobile_journey(points):
    (sx0, sy0, _, _), k, (dx, dy) = PIECES["journey"]
    return (np.float32(points) - (sx0, sy0)) * k + (dx, dy)


def build_plate(shape, mobile=False):
    plate = clear_figure(place_room(shape))
    end = to_base(JOURNEY)[-1]
    if mobile:
        plate = mobile_board(plate)
        end = to_mobile_journey([end])[0]
    plate = light(plate)
    if SHOW_DOT:
        dot(plate, end, 7.5 * SCALE * (PIECES["journey"][1] if mobile else 1))
    return np.clip(plate, 0, 255)


class StudioScene(C.CollarScene):
    TRAVEL = (.55, .80)          # Share of the loop in which the dot travels the journey, after the "não-não".
    MOBILE = False

    def __init__(self, rig):
        super().__init__(rig)
        self.plate = build_plate(self.shape, self.MOBILE)
        self.path = journey_path()
        if self.MOBILE:
            self.path = to_mobile_journey(self.path)
        steps = np.linalg.norm(np.diff(self.path, axis=0), axis=1)
        self.along = np.r_[0, np.cumsum(steps)] / steps.sum()
        # The steam rises from this mug: shift v5's steam to its rim.
        rim = to_base([MUG_RIM])[0]
        dx, dy = rim[0] - R.Steam.RIM_X, rim[1] - R.Steam.RIM_Y
        steam = self.steam
        steam.RIM_X, steam.RIM_Y = R.Steam.RIM_X + dx, R.Steam.RIM_Y + dy
        steam.WISPS = tuple((w[0] + dx,) + w[1:] for w in R.Steam.WISPS)
        steam.x0, steam.x1 = int(steam.x0 + dx), int(steam.x0 + dx) + (steam.x1 - steam.x0)
        steam.y0, steam.y1 = int(steam.y0 + dy), int(steam.y0 + dy) + (steam.y1 - steam.y0)
        steam.xs, steam.ys = steam.xs + int(dx), steam.ys + int(dy)

    def frame(self, pose):
        out = super().frame(pose).astype(np.float32)
        start, end = self.TRAVEL
        p = (pose["progress"] - start) / (end - start)
        if SHOW_DOT and 0 < p < 1:
            # Eased along the line; it fades in at the first node and settles into the red dot at the last.
            t = p * p * (3 - 2 * p)
            x = np.interp(t, self.along, self.path[:, 0])
            y = np.interp(t, self.along, self.path[:, 1])
            fade = min(1.0, p / .08, (1 - p) / .12)       # Fades in, and melts into the red dot on arrival.
            dot(out, (x, y), 5.0 * SCALE * (PIECES["journey"][1] if self.MOBILE else 1), fade)
        if self.MOBILE:
            out = out[:, MOBILE_CROP[0]:MOBILE_CROP[1]]
        return np.clip(out, 0, 255).astype(np.uint8)


if __name__ == "__main__":
    if "--mobile" in sys.argv:
        sys.argv.remove("--mobile")
        StudioScene.MOBILE = True
    C.CollarScene = StudioScene
    C.main()
