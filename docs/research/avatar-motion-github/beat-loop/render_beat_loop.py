"""Authored head-motion loop for the editorial footer. Offline tool; not a dependency of the site.

Everything comes from the approved base image: no driving video, no model weights, no downloads.
The head is projected on an approximate volume and rotated by periodic curves, so the mouth has no
geometry that could articulate and the last frame leads exactly into the first.

Usage (from the repository root):
  python docs/research/avatar-motion-github/beat-loop/render_beat_loop.py --out DIR --sheet
  python docs/research/avatar-motion-github/beat-loop/render_beat_loop.py --out DIR --video
"""
import argparse
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np
from scipy.interpolate import CubicSpline
from scipy.ndimage import binary_fill_holes

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / "expression-loop" / "source-base.png"
MASK = HERE.parent / "correction-study" / "head-mask-1.png"

# Timing: 12 beats at 90 BPM, 20 frames per beat, 30 fps, so 8 seconds per cycle.
FPS, FRAMES_PER_BEAT, BEATS = 30, 20, 12
FRAMES = FRAMES_PER_BEAT * BEATS

# Slip per beat, +1 = screen right: R L R, settle, L R L, settle, then four beats of nodding.
SLIP_KEYS = [1, -1, 1, .22, -1, 1, -1, -.22, .1, -.1, .1, -.1]
# How strong the nod is on each beat. The last four beats are the "agreeing" passage.
NOD_KEYS = [.55, .55, .55, .8, .55, .55, .55, .8, 1, 1, 1, 1]

SLIP_PX, YAW_DEG, ROLL_DEG, DIP_PX = 19, 11, 5.5, 9
NOD_PITCH_DEG, NOD_PX = 9, 7

MONITOR_Y = 516      # First row of the monitor edge in the base image.
LIFT = 62            # The base image cuts the chin at the monitor; the head is raised to reveal a neck.
CHIN_STRETCH_FROM = 507
# Jawline in the base image: half-width where it leaves the cheek and where the monitor cuts it.
JAW_CENTER, JAW_TOP_Y, JAW_TOP_HALF, JAW_CUT_Y, JAW_CUT_HALF, CHIN_BOTTOM_Y = 783.5, 491, 55, 516, 32.5, 541
CX, CY, RX, RY, RZ = 783, 345, 98, 134, 88   # Head volume, in lifted coordinates.
PIVOT = (783.0, 492.0)  # Neck base: roll turns around it, as a real neck does.
NOSE = (0.0, 58.0, 22.0)  # Offset from the head centre, and how far the nose stands out.

# The six sleeves in the base image: x0, y0, x1, y1, brightness.
SLEEVES = [
    (531, 27, 687, 165, .42), (747, 27, 906, 165, .62), (962, 27, 1124, 165, .4),
    (505, 196, 675, 344, .46), (754, 196, 923, 344, .46), (986, 196, 1153, 344, .9),
]


def art(index, w, h):
    """Original abstract sleeves in the scene palette (BGR), with no lettering or third-party marks."""
    s = 4
    W, H = w * s, h * s
    bone, peach, copper, red, ink, dark = (214, 226, 236), (149, 188, 255), (43, 75, 153), (40, 38, 205), (24, 18, 18), (34, 24, 26)
    canvas = np.full((H, W, 3), dark, np.uint8)
    if index == 0:  # Concentric rings
        canvas[:] = ink
        for k, color in enumerate((peach, ink, copper, ink, peach, ink)):
            cv2.circle(canvas, (W // 2, int(H * .56)), int(W * (.36 - k * .055)), color, -1, cv2.LINE_AA)
    elif index == 1:  # Bone field with a diagonal band and a single disc
        canvas[:] = bone
        band = np.array([[0, int(H * .78)], [W, int(H * .2)], [W, int(H * .42)], [0, H]], np.int32)
        cv2.fillPoly(canvas, [band], copper, cv2.LINE_AA)
        cv2.circle(canvas, (int(W * .3), int(H * .3)), int(W * .13), red, -1, cv2.LINE_AA)
    elif index == 2:  # The brand arrow
        canvas[:] = ink
        a, b = (int(W * .22), int(H * .8)), (int(W * .78), int(H * .24))
        t = int(W * .075)
        cv2.line(canvas, a, b, red, t, cv2.LINE_AA)
        cv2.line(canvas, (int(W * .36), b[1]), b, red, t, cv2.LINE_AA)
        cv2.line(canvas, b, (b[0], int(H * .68)), red, t, cv2.LINE_AA)
    elif index == 3:  # Stacked pills
        canvas[:] = dark
        for k, (shift, color) in enumerate(((.12, bone), (-.1, copper), (.06, bone), (-.04, red))):
            y = int(H * (.2 + k * .2))
            x0, x1 = int(W * (.2 + shift)), int(W * (.8 + shift))
            cv2.line(canvas, (x0, y), (x1, y), color, int(H * .115), cv2.LINE_AA)
    elif index == 4:  # Half disc over parallel lines
        canvas[:] = (22, 16, 74)
        cv2.circle(canvas, (W // 2, int(H * .44)), int(W * .3), peach, -1, cv2.LINE_AA)
        canvas[int(H * .44):] = (22, 16, 74)
        for k in range(6):
            y = int(H * (.5 + k * .08))
            cv2.line(canvas, (int(W * (.12 + k * .03)), y), (int(W * (.88 - k * .03)), y), peach, int(H * .016), cv2.LINE_AA)
    else:  # Warm field with a low disc and a dark horizon, keeping the scene's one warm accent
        canvas[:] = (46, 92, 226)
        cv2.circle(canvas, (int(W * .66), int(H * .36)), int(W * .14), (20, 34, 96), -1, cv2.LINE_AA)
        canvas[int(H * .58):] = (22, 40, 120)
        for k in range(4):
            y = int(H * (.66 + k * .075))
            cv2.line(canvas, (0, y), (W, y - int(H * .02)), (40, 70, 190), int(H * .012), cv2.LINE_AA)
    return cv2.resize(canvas, (w, h), interpolation=cv2.INTER_AREA)


def build_plate(base, hole):
    """Remove the head row by row: the scene behind it runs horizontally (wall, shelf, sofa, glow)."""
    plate = base.astype(np.float32).copy()
    rows = np.where(hole.any(axis=1))[0]
    for y in rows:
        xs = np.where(hole[y])[0]
        x0, x1 = max(xs[0] - 3, 0), min(xs[-1] + 3, plate.shape[1] - 1)
        left, right = base[y, max(x0 - 6, 0):x0 + 1].mean(0), base[y, x1:x1 + 7].mean(0)
        weight = np.linspace(0, 1, x1 - x0 + 1)[:, None]
        plate[y, x0:x1 + 1] = left * (1 - weight) + right * weight
    # Keep the band smooth vertically, only inside the repaired area.
    blurred = cv2.GaussianBlur(plate, (0, 0), 1.2)
    region = cv2.GaussianBlur(hole.astype(np.float32), (0, 0), 2)[:, :, None]
    plate = plate * (1 - region) + blurred * region

    rng = np.random.default_rng(7)
    for index, (x0, y0, x1, y1, gain) in enumerate(SLEEVES):
        w, h = x1 - x0, y1 - y0
        sleeve = art(index, w, h).astype(np.float32)
        # Light falls from the room's red glow: dimmer at the top, tinted, and softly grained.
        light = np.linspace(.82, 1.05, h)[:, None, None]
        sleeve = sleeve * light * gain * np.array([.74, .8, 1.0], np.float32)
        sleeve += rng.normal(0, 1.6, sleeve.shape)
        sleeve = cv2.GaussianBlur(sleeve, (0, 0), .7)
        alpha = np.zeros((h, w), np.float32)
        alpha[1:-1, 1:-1] = 1
        alpha = cv2.GaussianBlur(alpha, (0, 0), .8)[:, :, None]
        contact = np.ones((h, 1, 1), np.float32)
        contact[-7:] = np.linspace(1, .62, 7)[:, None, None]
        plate[y0:y1, x0:x1] = plate[y0:y1, x0:x1] * (1 - alpha) + sleeve * contact * alpha
    return plate


def build_head(base, mask):
    """Neutral head layer in lifted coordinates, with the chin the base image cuts off rebuilt."""
    h, w = mask.shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    # Stretch the last clean skin rows downward to recover the chin below the lower lip.
    src_y = np.where(ys > CHIN_STRETCH_FROM, CHIN_STRETCH_FROM + (ys - CHIN_STRETCH_FROM) * .24, ys)
    # Rows next to the monitor carry its red edge: stop before them.
    src_y = np.minimum(src_y, JAW_CUT_Y - 3)
    # Keep the chin's sampling inside the real skin so the new contour never picks up the background.
    below_cut = ys > JAW_CUT_Y - 3
    src_x = np.where(below_cut, JAW_CENTER + np.clip(xs - JAW_CENTER, -JAW_CUT_HALF + 2, JAW_CUT_HALF - 2), xs)
    color = cv2.remap(base.astype(np.float32), src_x.astype(np.float32), src_y.astype(np.float32), cv2.INTER_LINEAR)
    # The segmented mask also holds the two neck wedges beside the jaw. From JAW_TOP_Y down, cut along
    # the jawline measured in the base image, then close it into a rounded chin.
    alpha = mask.astype(np.float32).copy()
    alpha[JAW_TOP_Y:] = 0
    slope = np.clip((ys - JAW_TOP_Y) / (JAW_CUT_Y - JAW_TOP_Y), 0, 1)
    close = np.clip((ys - JAW_CUT_Y) / (CHIN_BOTTOM_Y - JAW_CUT_Y), 0, 1)
    half = (JAW_TOP_HALF + (JAW_CUT_HALF - JAW_TOP_HALF) * slope) * np.clip(1 - close ** 2, 0, 1) ** .5
    jaw = (np.abs(xs - JAW_CENTER) < half) & (ys >= JAW_TOP_Y) & (ys <= CHIN_BOTTOM_Y)
    alpha = np.maximum(alpha, jaw.astype(np.float32))
    # Round the corners where the cheek, the jawline and the rebuilt chin meet.
    rounded = np.clip((cv2.GaussianBlur(alpha, (0, 0), 5) - .5) * 5 + .5, 0, 1)
    blend = np.clip((ys - 462) / 18, 0, 1)
    alpha = alpha * (1 - blend) + rounded * blend
    alpha = cv2.GaussianBlur(alpha, (0, 0), .9)
    # The face was lit from the monitor directly below; soften that where the chin now sits higher.
    below = np.clip((ys - 500) / 42, 0, 1)[:, :, None]
    color = color * (1 - .28 * below)
    shift = np.float32([[1, 0, 0], [0, 1, -LIFT]])
    color = cv2.warpAffine(color, shift, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    alpha = cv2.warpAffine(alpha, shift, (w, h), flags=cv2.INTER_LINEAR)
    return color, alpha


def build_body(shape):
    """Neck, collar and shoulders that disappear behind the monitor. BGRA float layer."""
    h, w = shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    dx = xs - CX
    # Shoulders: a dark garment that slopes away from the neck and disappears behind the monitor.
    span = np.abs(dx) / 215
    top = 487 + 25 * span ** 2 + 60 * np.clip(span - 1, 0, None) ** 1.2 * 4
    # A crew neckline dips at the centre of the throat.
    neckline = 488 + 11 * np.clip(1 - (dx / 58) ** 2, 0, 1)
    top = np.where(np.abs(dx) < 58, neckline, top)
    shoulders = np.clip((ys - top) / 1.6, 0, 1)
    rim = np.exp(-((ys - top) / 2.2) ** 2) * shoulders
    garment = np.stack([np.full_like(xs, 19), np.full_like(xs, 13), np.full_like(xs, 16)], -1)
    garment = garment * (1 + np.clip((ys - 490) / 26, 0, 1)[:, :, None] * .6)
    garment[..., 2] += 58 * rim
    garment[..., 1] += 10 * rim
    garment[..., 0] += 12 * rim

    # Neck: the jaw's skin family, in shadow under the chin and warmed by the monitor below.
    half = 53 + 5 * np.clip((ys - 470) / 30, 0, 1)
    neck = np.clip((half - np.abs(dx)) / 1.5, 0, 1) * (ys > 420).astype(np.float32)
    round_shade = 1 - .55 * np.clip(np.abs(dx) / half, 0, 1) ** 2.2
    under_chin = np.clip((ys - 470) / 34, 0, 1)
    skin = np.array([70, 84, 150], np.float32)
    tone = skin[None, None] * (round_shade * (.38 + .5 * under_chin))[:, :, None]

    color = tone * neck[:, :, None] * (1 - shoulders[:, :, None]) + garment * shoulders[:, :, None]
    alpha = np.maximum(shoulders, neck)
    return cv2.GaussianBlur(color.astype(np.float32), (0, 0), .7), cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), .6)


def curves():
    """Periodic pose curves, one value per frame."""
    beats = np.arange(BEATS + 1)
    slip_spline = CubicSpline(beats, SLIP_KEYS + SLIP_KEYS[:1], bc_type="periodic")
    strength_spline = CubicSpline(beats, NOD_KEYS + NOD_KEYS[:1], bc_type="periodic")
    t = np.arange(FRAMES) / FRAMES_PER_BEAT
    slip = slip_spline(t)
    strength = strength_spline(t)
    # A nod lands on every beat, sharper going down than coming back up.
    phase = t % 1
    bounce = np.sin(np.pi * np.clip(phase / .42, 0, 1)) ** 2 * (phase < .42)
    release = np.sin(np.pi * np.clip((phase - .42) / .58, 0, 1)) ** 2 * (phase >= .42) * .24
    nod = (bounce + release) * strength

    def late(values, frames):  # The head follows the neck: yaw and roll trail the slip slightly.
        return np.interp((np.arange(FRAMES) - frames) % FRAMES, np.arange(FRAMES + 1), np.r_[values, values[0]])

    return {
        "tx": SLIP_PX * slip,
        "ty": DIP_PX * (1 - np.clip(slip, -1, 1) ** 2) + NOD_PX * nod,
        "yaw": np.radians(YAW_DEG) * late(slip, 1.0),
        "roll": np.radians(ROLL_DEG) * late(slip, 2.0),
        "pitch": np.radians(NOD_PITCH_DEG) * nod,
        "slip": slip,
        "nod": nod,
    }


def surface(X, Y):
    rho = np.clip(np.sqrt((X / RX) ** 2 + (Y / RY) ** 2), 0, 1)
    Z = RZ * np.cos(np.pi / 2 * rho)
    nose = NOSE[2] * np.exp(-(((X - NOSE[0]) / 17) ** 2 + ((Y - NOSE[1]) / 30) ** 2))
    return Z + nose


def pose_map(xs, ys, pose):
    """For each output pixel, the point of the neutral head that lands on it."""
    cos_r, sin_r = np.cos(pose["roll"]), np.sin(pose["roll"])
    qx = xs - pose["tx"] - PIVOT[0]
    qy = ys - pose["ty"] - PIVOT[1]
    # Inverse roll around the neck base (positive roll tips the top of the head to screen right).
    rx = cos_r * qx - sin_r * qy + PIVOT[0]
    ry = sin_r * qx + cos_r * qy + PIVOT[1]
    X, Y = rx - CX, ry - CY
    X0, Y0 = X.copy(), Y.copy()
    # Two fixed-point passes keep the surface height tied to the neutral point, not the output pixel.
    for _ in range(3):
        Z = surface(X0, Y0)
        X0 = X - Z * np.sin(pose["yaw"])
        Y0 = Y - Z * np.sin(pose["pitch"])
    return (X0 + CX).astype(np.float32), (Y0 + CY).astype(np.float32)


class Scene:
    def __init__(self):
        base = cv2.imread(str(BASE))
        mask = cv2.imread(str(MASK), cv2.IMREAD_GRAYSCALE) > 127
        mask = binary_fill_holes(mask)
        self.shape = mask.shape
        hole = cv2.dilate(mask.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
        hole[MONITOR_Y:] = False
        self.plate = build_plate(base, hole)
        self.head, self.head_alpha = build_head(base, mask)
        self.body, self.body_alpha = build_body(self.shape)
        # Everything happens in this window, so rendering stays fast.
        self.x0, self.x1, self.y0, self.y1 = 520, 1050, 130, MONITOR_Y + 6
        ys, xs = np.mgrid[self.y0:self.y1, self.x0:self.x1].astype(np.float32)
        self.xs, self.ys = xs, ys
        self.monitor_edge = np.clip((ys - MONITOR_Y) / 1.5, 0, 1)[:, :, None]
        self.glow = np.clip((ys - (MONITOR_Y - 26)) / 26, 0, 1)[:, :, None] ** 2

    def frame(self, pose):
        out = self.plate.copy()
        x0, x1, y0, y1 = self.x0, self.x1, self.y0, self.y1
        window = out[y0:y1, x0:x1]
        base_window = window.copy()
        xs, ys = self.xs, self.ys

        # Body: shoulders barely answer the head; the neck leans from its base toward the chin.
        chin_x = pose["tx"] + np.sin(pose["roll"]) * (PIVOT[1] - 470)
        chin_y = pose["ty"]
        lean = np.clip((PIVOT[1] + 14 - ys) / 60, 0, 1)
        body_x = (xs - chin_x * lean - pose["tx"] * .12).astype(np.float32)
        body_y = (ys - chin_y * lean - pose["ty"] * .22).astype(np.float32)
        body = cv2.remap(self.body, body_x, body_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        body_alpha = cv2.remap(self.body_alpha, body_x, body_y, cv2.INTER_LINEAR)[:, :, None]
        window[:] = window * (1 - body_alpha) + body * body_alpha

        # Soft contact shadow from the head onto the neck.
        map_x, map_y = pose_map(xs, ys, pose)
        head = cv2.remap(self.head, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        head_alpha = cv2.remap(self.head_alpha, map_x, map_y, cv2.INTER_LINEAR)[:, :, None]
        shadow = cv2.GaussianBlur(head_alpha, (0, 0), 7)
        if shadow.ndim == 2:
            shadow = shadow[:, :, None]
        shade = np.clip((shadow - head_alpha) * .55 * body_alpha, 0, .6)
        window[:] = window * (1 - shade)
        window[:] = window * (1 - head_alpha) + head * head_alpha

        # The monitor's red light still reaches whatever stands right above its edge.
        figure = np.maximum(body_alpha, head_alpha)
        window[..., 2:3] += 62 * self.glow * figure
        window[..., 1:2] += 7 * self.glow * figure

        # The monitor stays in front of everything.
        window[:] = window * (1 - self.monitor_edge) + base_window * self.monitor_edge
        return np.clip(out, 0, 255).astype(np.uint8)


def pose_at(data, index):
    return {key: float(values[index]) for key, values in data.items()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--sheet", action="store_true", help="Save the plate and a sheet of key poses.")
    parser.add_argument("--video", action="store_true", help="Render the full loop.")
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    scene = Scene()
    data = curves()

    if args.sheet:
        cv2.imwrite(str(out / "plate.png"), np.clip(scene.plate, 0, 255).astype(np.uint8))
        zero = {key: 0.0 for key in data}
        cv2.imwrite(str(out / "neutral.png"), scene.frame(zero))
        tiles = []
        for beat in (0, 1, 2, 3, 4, 5, 6, 8):
            tile = scene.frame(pose_at(data, beat * FRAMES_PER_BEAT + 4))[170:540, 560:1010]
            cv2.putText(tile, f"beat {beat}", (10, 22), cv2.FONT_HERSHEY_SIMPLEX, .6, (255, 255, 255), 1, cv2.LINE_AA)
            tiles.append(tile)
        cv2.imwrite(str(out / "poses.jpg"), np.vstack([np.hstack(tiles[:4]), np.hstack(tiles[4:])]), [cv2.IMWRITE_JPEG_QUALITY, 88])

    if args.video:
        h, w = scene.shape
        target = out / "gabriel-avatar-loop-v2.mp4"
        writer = subprocess.Popen(
            ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(FPS), "-i", "pipe:0", "-an",
             "-vf", "scale=1280:818:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-profile:v", "baseline", "-level", "4.0", "-preset", "slow", "-crf", "19",
             # One keyframe at the same quality as the rest: periodic keyframes make the still scene pulse.
             "-x264-params", f"keyint={FRAMES}:min-keyint={FRAMES}:scenecut=0:ipratio=1.0", "-movflags", "+faststart", str(target)],
            stdin=subprocess.PIPE,
        )
        first = None
        for index in range(FRAMES):
            frame = scene.frame(pose_at(data, index))
            if first is None:
                first = frame.copy()
                cv2.imwrite(str(out / "poster.png"), cv2.resize(frame, (1280, 818), interpolation=cv2.INTER_AREA))
            writer.stdin.write(frame.tobytes())
        writer.stdin.close()
        if writer.wait():
            raise SystemExit("ffmpeg failed")
        # The next frame after the last is the first by construction; record that it holds.
        wrapped = scene.frame(pose_at(data, 0))
        report = {
            "frames": FRAMES, "fps": FPS, "seconds": FRAMES / FPS, "bpm": 60 * FPS / FRAMES_PER_BEAT,
            "slip_keys": SLIP_KEYS, "nod_keys": NOD_KEYS,
            "pose_ranges": {key: [float(values.min()), float(values.max())] for key, values in data.items()},
            "seam_step_vs_typical_step": {
                key: [float(abs(values[0] - values[-1])), float(np.median(np.abs(np.diff(values))))] for key, values in data.items()
            },
            "frame0_rerender_max_error": int(np.abs(wrapped.astype(int) - first.astype(int)).max()),
        }
        (out / "render-report.json").write_text(json.dumps(report, indent=1))
        print(json.dumps(report["seam_step_vs_typical_step"]))


if __name__ == "__main__":
    main()
