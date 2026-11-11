"""Editorial footer loop v3: the reference's measured movement, acted on the approved character.

Offline tool; not a dependency of the site. Uses no model weights and downloads nothing.

- Position comes frame by frame from motion-channels.json (extract_motion.py).
- Turn and nod are locked to that same path, so they cannot drift apart from it.
- Depth comes from the 478 face points measured on the approved image, not a plain ellipsoid.
- Eyes and brows come from the channels stored in ../volume-light/rig-input.json; blinks are authored.
- The mouth has no control at all, so it stays closed.

Usage (from the repository root):
  python docs/research/avatar-motion-github/reference-loop/render_reference_loop.py --out DIR --sheet
  python docs/research/avatar-motion-github/reference-loop/render_reference_loop.py --out DIR --video
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from scipy.interpolate import LinearNDInterpolator
from scipy.ndimage import binary_fill_holes, gaussian_filter1d

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "beat-loop"))
from render_beat_loop import BASE, CX, MASK, MONITOR_Y, RX, RY, RZ, build_plate  # noqa: E402

# The approved character's own contour is kept. The base image's monitor only cuts off the end of the chin
# (the real portrait puts the chin about 10 px past that edge), so the jawline drawn in the image is continued
# until it closes, and the head rises just enough for that to show. Nothing above the jaw changes.
LIFT = 14
CY = 407 - LIFT
PIVOT = (783.0, 554.0 - LIFT)  # Neck base, hidden behind the monitor.
SKIN_LAST_ROW = 511     # Below this row the monitor's glow tints the base image. Later rows repeat it, unstretched.
# The jawline in the base image: its centre, and half-width where it leaves the cheek and where the monitor cuts it.
JAW_CENTER, JAW_TOP_Y, JAW_TOP_HALF, JAW_CUT_Y, JAW_CUT_HALF = 783.5, 491, 55.0, 516, 32.5
CHIN_Y = 527            # Where the same line closes, from the real portrait's proportions.
NECK_LEFT, NECK_RIGHT = 728.5, 839.0    # The neck's edges, as drawn in the base image.
# The jacket from the real portrait, scaled by its lip-to-chin distance (0.373, which also reproduces this neck's
# width). Its collar rises beside the neck to the height of the lower lip and opens outward. In that scale the true
# shoulders fall behind the monitor, so the line past the collar is a design decision: low and quiet.
# Half-distance from the centre, and lifted row of the top of the garment:
GARMENT_TOP = ((50, 488), (56, 491), (66, 498), (78, 506), (96, 509), (140, 511.5), (185, 514), (225, 517), (262, 532))
COLLAR_INNER, COLLAR_TOP_ROW, COLLAR_SPREAD = 51.0, 488.0, 1.0  # Inner edge, peak row, and outward run per row.
GARMENT_COLOR, RIM_GAIN = (22, 17, 23), 30.0
# The trapezius: the neck's sides leave the straight line at this lifted row and open in a curve toward the monitor.
TRAP_FROM_ROW, TRAP_REACH, TRAP_CURVE = 486.0, 72.0, 2.1
SHOW_GARMENT = False    # The painted collar and shoulders were rejected as unreal; kept off until a drawn reference arrives.

FPS = 30
HEAD_SCALE = .83          # Head width here against the head width in the recording.
YAW_DEG, PITCH_DEG = 2.8, 2.6   # Peak turn and nod. The reference is smaller; this keeps depth readable.
ROLL_GAIN = 1.5
IRIS_GAIN = 1.7
# Eyes move together: one gaze for both, held on a point and then moved in a quick jump, as real eyes do.
GAZE_HOLD_FRAMES, GAZE_JUMP_SIGMA = 37, 1.1
GAZE_LIMIT_X, GAZE_LIMIT_Y = 1.7, .6     # Pixels. Keeps the iris sitting naturally between the lids.
BLINKS = (2.9, 8.1)       # Seconds. Authored: the stored channels hold no blink.
BLINK_FRAMES = 4
CENTRE_DEPTH = RZ * .6


def build_head(base, mask):
    """The head as drawn in the base image, with the jawline continued until the chin closes, in lifted coordinates."""
    h, w = mask.shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    # Real pixels down to the last clean row. Nothing is stretched, so the lips and the skin keep their shape.
    color = cv2.remap(base.astype(np.float32), xs, np.minimum(ys, SKIN_LAST_ROW), cv2.INTER_LINEAR)

    slope = np.clip((ys - JAW_TOP_Y) / (JAW_CUT_Y - JAW_TOP_Y), 0, None)
    half = JAW_TOP_HALF + (JAW_CUT_HALF - JAW_TOP_HALF) * np.minimum(slope, 1)
    close = np.clip((ys - JAW_CUT_Y) / (CHIN_Y - JAW_CUT_Y), 0, 1)
    half = half * np.sqrt(np.clip(1 - close ** 2, 0, 1))
    jaw = (np.abs(xs - JAW_CENTER) < half).astype(np.float32)
    alpha = mask.astype(np.float32).copy()
    alpha[JAW_TOP_Y:] = jaw[JAW_TOP_Y:]
    rounded = np.clip((cv2.GaussianBlur(alpha, (0, 0), 1.8) - .5) * 5 + .5, 0, 1)
    blend = np.clip((ys - (JAW_TOP_Y - 8)) / 8, 0, 1)
    alpha = alpha * (1 - blend) + rounded * blend

    # A very slight turn at the very edge of the new part of the chin.
    inside = cv2.distanceTransform((alpha > .5).astype(np.uint8), cv2.DIST_L2, 5)
    turn = (1 - np.clip(inside / 5, 0, 1)) * np.clip((ys - 510) / 6, 0, 1)
    color = color * (1 - .16 * turn)[:, :, None]

    shift = np.float32([[1, 0, 0], [0, 1, -LIFT]])
    color = cv2.warpAffine(color, shift, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    alpha = cv2.warpAffine(cv2.GaussianBlur(alpha, (0, 0), .9), shift, (w, h), flags=cv2.INTER_LINEAR)
    return color, alpha


def build_neck(base, shape):
    """The neck in the colours the base image already gives it, in lifted coordinates."""
    h, w = shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    rows = np.clip(ys + LIFT, 493, SKIN_LAST_ROW).astype(np.int32)[:, 0]
    source = base.astype(np.float32)
    left = source[rows, 731:737].mean(1)
    right = source[rows, 831:837].mean(1)
    across = np.clip((xs - NECK_LEFT) / (NECK_RIGHT - NECK_LEFT), 0, 1)[:, :, None]
    color = left[:, None, :] * (1 - across) + right[:, None, :] * across
    # The sides curve outward into the trapezius, which falls away from the light as it goes.
    centre = (NECK_LEFT + NECK_RIGHT) / 2
    straight = (NECK_RIGHT - NECK_LEFT) / 2
    dx = np.abs(xs - centre)
    opening = np.clip((ys - TRAP_FROM_ROW) / (MONITOR_Y - TRAP_FROM_ROW), 0, 1.4) ** TRAP_CURVE
    half = straight + TRAP_REACH * opening
    beyond = np.clip((dx - straight) / TRAP_REACH, 0, 1)
    color = color * (1 - .42 * beyond ** .8)[:, :, None]
    alpha = np.clip((half - dx) / 1.3 + .5, 0, 1) * (ys > 420).astype(np.float32)
    return color.astype(np.float32), cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), .8)


def build_shoulders(shape):
    """Jacket collar and shoulder line from the real portrait, disappearing behind the monitor."""
    h, w = shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    dx = np.abs(xs - JAW_CENTER)
    distances, rows = zip(*GARMENT_TOP)
    top = cv2.GaussianBlur(np.interp(dx, distances, rows).astype(np.float32), (0, 0), 2.2)
    inner = COLLAR_INNER + np.clip(ys - COLLAR_TOP_ROW, 0, None) * .06
    alpha = np.clip((ys - top) / 1.3 + .5, 0, 1) * np.clip((dx - inner) / 1.2 + .5, 0, 1)

    # The collar lies over the shoulder: slightly lighter, with its own edge and a fold shadow beneath it.
    collar_edge = COLLAR_INNER + (ys - COLLAR_TOP_ROW) * COLLAR_SPREAD
    on_collar = np.clip((collar_edge - dx) / 1.2 + .5, 0, 1)
    fold = np.exp(-((dx - collar_edge - 2.5) / 3.0) ** 2) * (ys > COLLAR_TOP_ROW)
    base = np.array(GARMENT_COLOR, np.float32)
    color = base[None, None] * (1 + .5 * on_collar - .4 * fold)[:, :, None]
    # Everything is lit by the scene: warmed by the monitor below, with a soft red rim along the top.
    color = color * (1 + .3 * np.clip((ys - top) / 22, 0, 1))[:, :, None]
    rim = np.exp(-((ys - top) / 1.8) ** 2)
    color[..., 2] += RIM_GAIN * rim
    color[..., 1] += RIM_GAIN * .2 * rim
    color[..., 0] += RIM_GAIN * .23 * rim
    return color.astype(np.float32), cv2.GaussianBlur(alpha.astype(np.float32), (0, 0), .6)


def periodic(values, sigma):
    values = np.asarray(values, float)
    ramp = (values[-1] - values[0]) * np.arange(len(values)) / (len(values) - 1)
    return gaussian_filter1d(values - ramp + ramp.mean(), sigma, mode="wrap")


def channels():
    motion = json.loads((HERE / "motion-channels.json").read_text())
    rig = json.loads((HERE.parent / "volume-light" / "rig-input.json").read_text())
    n, shift = motion["cycle_frames"], motion["rig_shift_frames"]
    x = periodic(motion["x_px"], .8)
    y = periodic(motion["y_px"], .8)
    roll = periodic(motion["roll_deg"], 2)

    def follow(values):  # Rig channel → this recording's timeline.
        values = np.asarray(values, float)
        resampled = np.interp(np.arange(n) * len(values) / n, np.arange(len(values)), values)
        return periodic(np.roll(resampled - np.median(resampled), shift), 1.2)

    eyes = {}
    for side in ("right", "left"):
        frames = [f["eyes"][side] for f in rig["frames"]]
        iris = np.array([f["iris"] for f in frames])
        eyes[side] = {"ix": follow(iris[:, 0]), "iy": follow(iris[:, 1])}

    blink = np.zeros(n)
    for centre in BLINKS:
        distance = np.abs(np.arange(n) - centre * FPS)
        distance = np.minimum(distance, n - distance)
        blink = np.maximum(blink, np.cos(np.clip(distance / BLINK_FRAMES, 0, 1) * np.pi / 2) ** 2)

    # Tilting around the neck also carries the head sideways; x was measured with that already in it.
    tilt = np.radians(roll * ROLL_GAIN)
    data = {
        "tx": x * HEAD_SCALE - np.sin(tilt) * (PIVOT[1] - CY),
        "ty": y * HEAD_SCALE,
        "yaw": np.radians(YAW_DEG) * x / np.abs(x).max(),
        "pitch": np.radians(PITCH_DEG) * y / np.abs(y).max(),
        "roll": tilt,
        "blink": blink,
        "progress": np.arange(n) / n,
    }
    # The two tracked irises disagree with each other, which reads as crossed eyes: only their shared motion is used.
    width = float(np.ptp(np.array(rig["sourceLandmarks"])[[33, 133], 0]))
    for axis, limit in (("x", GAZE_LIMIT_X), ("y", GAZE_LIMIT_Y)):
        shared = (eyes["right"][f"i{axis}"] + eyes["left"][f"i{axis}"]) / 2 * width * IRIS_GAIN
        holds = np.zeros(n)
        for start in range(0, n, GAZE_HOLD_FRAMES):
            holds[start:start + GAZE_HOLD_FRAMES] = shared[start:start + GAZE_HOLD_FRAMES].mean()
        data[f"gaze_{axis}"] = gaussian_filter1d(np.clip(holds, -limit, limit), GAZE_JUMP_SIGMA, mode="wrap")
    return n, data, rig, motion


def build_depth(landmarks, shape):
    """Face depth from the measured points, blended into a plain volume for hair and ears."""
    h, w = shape
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    rho = np.clip(np.sqrt(((xs - CX) / RX) ** 2 + ((ys - CY) / RY) ** 2), 0, 1)
    volume = RZ * np.cos(np.pi / 2 * rho)
    px, py, pz = landmarks[:, 0], landmarks[:, 1] - LIFT, landmarks[:, 2]
    face = LinearNDInterpolator(np.c_[px, py], (pz.max() - pz) * .68)(xs, ys).astype(np.float32)
    inside = ~np.isnan(face)
    face = np.nan_to_num(face)
    weight = cv2.GaussianBlur(cv2.erode(inside.astype(np.uint8), np.ones((15, 15), np.uint8)).astype(np.float32), (0, 0), 9)
    return cv2.GaussianBlur(face * weight + volume * (1 - weight), (0, 0), 2.2)


def build_normals(depth):
    # Broad forms only: small bumps in the measured mesh would catch the light unevenly around the eyes.
    smooth = cv2.GaussianBlur(depth, (0, 0), 11)
    dx = cv2.Sobel(smooth, cv2.CV_32F, 1, 0, ksize=3) / 8
    dy = cv2.Sobel(smooth, cv2.CV_32F, 0, 1, ksize=3) / 8
    normals = np.dstack([-dx, -dy, np.ones_like(dx)])
    return normals / np.linalg.norm(normals, axis=2, keepdims=True)


class Eye:
    """One eye: lets the iris travel behind the lids and the upper lid come down."""

    def __init__(self, head, landmarks, contour, iris_index):
        points = landmarks[contour][:, :2] - np.array([0, LIFT])
        self.x0, self.y0 = (points.min(0) - 8).astype(int)
        self.x1, self.y1 = (points.max(0) + 8).astype(int)
        size = (self.y1 - self.y0, self.x1 - self.x0)
        local = points - np.array([self.x0, self.y0])
        mask = np.zeros(size, np.uint8)
        cv2.fillPoly(mask, [np.round(local * 16).astype(np.int32)], 255, cv2.LINE_AA, shift=4)
        self.inside = mask > 127
        self.mask = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), .6)
        self.source = head[self.y0:self.y1, self.x0:self.x1].copy()
        centre = landmarks[iris_index][:2] - np.array([self.x0, self.y0 + LIFT])
        radius = float(np.linalg.norm(landmarks[iris_index + 1][:2] - landmarks[iris_index][:2]))
        self.width = float(np.ptp(points[:, 0]))
        yy, xx = np.mgrid[0:size[0], 0:size[1]].astype(np.float32)
        disc = np.hypot(xx - centre[0], yy - centre[1])
        self.sprite_alpha = np.clip(radius + .8 - disc, 0, 1) * self.mask
        hole = ((disc < radius + 2) & (self.mask > .02)).astype(np.uint8) * 255
        self.plate = cv2.inpaint(np.clip(self.source, 0, 255).astype(np.uint8), hole, 2, cv2.INPAINT_TELEA).astype(np.float32)
        # The lids travel along smooth curves fitted to the opening, never along its pixel steps.
        columns = np.where(self.inside.any(axis=0))[0]
        upper = np.array([np.where(self.inside[:, c])[0][0] for c in columns], np.float32)
        lower = np.array([np.where(self.inside[:, c])[0][-1] for c in columns], np.float32)
        across = np.arange(size[1], dtype=np.float32)
        self.top = np.polyval(np.polyfit(columns, upper, 2), across) - 2.5
        self.bottom = np.polyval(np.polyfit(columns, lower, 2), across) + .5
        self.yy = yy
        # Soft outline of the area a closing lid covers: it also hides the thick drawn lash line above the opening.
        wide = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
        self.wide = cv2.GaussianBlur(wide.astype(np.float32) / 255, (0, 0), 2.2)
        # The lid's skin is rebuilt from the skin around the eye, so it keeps that area's light instead of a flat tone.
        filled = cv2.inpaint(np.clip(self.source, 0, 255).astype(np.uint8), wide, 4, cv2.INPAINT_TELEA).astype(np.float32)
        self.lid = cv2.GaussianBlur(filled, (0, 0), 1.6) * .94
        # The closed lash line fades toward the corners.
        span = np.clip((across - columns[0]) / max(columns[-1] - columns[0], 1), 0, 1)
        self.lash_fade = np.sin(np.pi * span) ** .45

    def paint(self, head, dx, dy, blink):
        move = np.float32([[1, 0, dx], [0, 1, dy]])
        size = (self.source.shape[1], self.source.shape[0])
        sprite = cv2.warpAffine(self.source, move, size, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        alpha = (cv2.warpAffine(self.sprite_alpha, move, size, flags=cv2.INTER_LINEAR) * self.mask)[:, :, None]
        eye = self.plate * (1 - alpha) + sprite * alpha
        mask = self.mask[:, :, None]
        result = self.source * (1 - mask) + eye * mask
        if blink > .01:
            edge = self.top + (self.bottom - self.top) * blink
            covered = (np.clip((edge - self.yy) / 1.4 + .5, 0, 1) * self.wide)[:, :, None]
            result = result * (1 - covered) + self.lid * covered
            lash = np.exp(-((self.yy - edge) / 1.05) ** 2) * self.lash_fade * min(blink * 3, 1)
            lash = (lash * .78)[:, :, None]
            result = result * (1 - lash) + np.array([20, 17, 20], np.float32) * lash
        head[self.y0:self.y1, self.x0:self.x1] = result


class Steam:
    """Steam from the coffee: soft wisps whose whole-number phase cycles close exactly with the video loop."""

    RIM_X, RIM_Y, HEIGHT = 1231.0, 806.0, 190.0
    # Start x, phases, sway cycles (slow, fast), puff cycles, strength.
    WISPS = (
        (1217.0, .0, 1.7, 3, 5, 4, .17),
        (1236.0, 2.3, .6, 4, 6, 3, .21),
        (1249.0, 4.1, 3.2, 3, 4, 5, .14),
    )
    COLOR = np.array([206, 212, 240], np.float32)

    def __init__(self):
        self.x0, self.x1, self.y0, self.y1 = 1130, 1340, 606, 812
        ys, xs = np.mgrid[self.y0:self.y1, self.x0:self.x1].astype(np.float32)
        self.xs, self.ys = xs, ys
        self.height = np.clip((self.RIM_Y - ys) / self.HEIGHT, 0, 1)

    def paint(self, image, progress):
        h, alpha = self.height, np.zeros_like(self.xs)
        for x0, phase_a, phase_b, slow, fast, puffs, strength in self.WISPS:
            # A pattern in (y / wavelength + cycles * progress) travels upward as progress grows.
            sway = (4 + 24 * h) * np.sin(2 * np.pi * (self.ys / 96 + slow * progress) + phase_a)
            sway += (2 + 11 * h) * np.sin(2 * np.pi * (self.ys / 44 + fast * progress) + phase_b)
            centre = x0 + (self.RIM_X - x0) * .2 + sway
            width = 5 + 21 * h
            band = np.exp(-((self.xs - centre) / width) ** 2)
            puff = .58 + .42 * np.sin(2 * np.pi * (self.ys / 70 + puffs * progress) + phase_a + phase_b)
            fade = np.clip(h / .07, 0, 1) * (1 - h) ** 1.5
            alpha += strength * band * puff * fade
        alpha = np.clip(cv2.GaussianBlur(alpha, (0, 0), 2.2), 0, .42)[:, :, None]
        window = image[self.y0:self.y1, self.x0:self.x1]
        window[:] = window * (1 - alpha) + self.COLOR * alpha


class Scene:
    def __init__(self, rig):
        base = cv2.imread(str(BASE))
        mask = binary_fill_holes(cv2.imread(str(MASK), cv2.IMREAD_GRAYSCALE) > 127)
        self.shape = mask.shape
        hole = cv2.dilate(mask.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
        hole[MONITOR_Y:] = False
        self.plate = build_plate(base, hole)
        landmarks = np.array(rig["sourceLandmarks"])
        self.head, self.head_alpha = build_head(base, mask)
        self.head = self.head.astype(np.float32)
        self.neck, self.neck_alpha = build_neck(base, self.shape)
        self.shirt, self.shirt_alpha = build_shoulders(self.shape)
        if not SHOW_GARMENT:
            self.shirt_alpha = np.zeros_like(self.shirt_alpha)
        self.depth = build_depth(landmarks, self.shape)
        self.normals = build_normals(self.depth)
        self.eyes = {
            "right": Eye(self.head, landmarks, rig["eyeContours"]["right"], 468),
            "left": Eye(self.head, landmarks, rig["eyeContours"]["left"], 473),
        }
        self.steam = Steam()
        self.x0, self.x1, self.y0, self.y1 = 560, 1010, 150, MONITOR_Y + 6
        ys, xs = np.mgrid[self.y0:self.y1, self.x0:self.x1].astype(np.float32)
        self.xs, self.ys = xs, ys
        self.monitor_edge = np.clip((ys - MONITOR_Y) / 1.5, 0, 1)[:, :, None]
        self.glow = np.clip((ys - (MONITOR_Y - 26)) / 26, 0, 1)[:, :, None] ** 2
        light = np.array([.18, .5, .85], np.float32)
        self.light = light / np.linalg.norm(light)

    def map_pose(self, pose):
        xs, ys = self.xs, self.ys
        cos_r, sin_r = np.cos(pose["roll"]), np.sin(pose["roll"])
        qx = xs - pose["tx"] - PIVOT[0]
        qy = ys - pose["ty"] - PIVOT[1]
        # Inverse of the measured rotation: this maps each output pixel back to the neutral head.
        rx = cos_r * qx + sin_r * qy + PIVOT[0]
        ry = -sin_r * qx + cos_r * qy + PIVOT[1]
        map_x, map_y = rx.astype(np.float32), ry.astype(np.float32)
        sin_y, sin_p = np.sin(pose["yaw"]), np.sin(pose["pitch"])
        for _ in range(3):
            z = cv2.remap(self.depth, map_x, map_y, cv2.INTER_LINEAR) - CENTRE_DEPTH
            map_x = (rx - z * sin_y).astype(np.float32)
            map_y = (ry - z * sin_p).astype(np.float32)
        return map_x, map_y

    def shade(self, map_x, map_y, pose):
        """Light stays in the room while the head turns under it."""
        normals = cv2.remap(self.normals, map_x, map_y, cv2.INTER_LINEAR)
        cy, sy = np.cos(pose["yaw"]), np.sin(pose["yaw"])
        cp, sp = np.cos(pose["pitch"]), np.sin(pose["pitch"])
        nx = normals[..., 0] * cy + normals[..., 2] * sy
        nz = -normals[..., 0] * sy + normals[..., 2] * cy
        ny = normals[..., 1] * cp + nz * sp
        nz = -normals[..., 1] * sp + nz * cp
        before = np.clip(normals @ self.light, .15, 1)
        after = np.clip(nx * self.light[0] + ny * self.light[1] + nz * self.light[2], .15, 1)
        return np.clip((after / before) ** 1.8, .78, 1.3)[:, :, None]

    def frame(self, pose):
        for side, eye in self.eyes.items():
            eye.paint(self.head, pose["gaze_x"], pose["gaze_y"], pose["blink"])
        out = self.plate.copy()
        window = out[self.y0:self.y1, self.x0:self.x1]
        base_window = window.copy()
        xs, ys = self.xs, self.ys

        # The neck follows the head near the jaw and moves less where it meets the body.
        follow = np.clip((MONITOR_Y + 6 - ys) / 60, .55, 1)
        neck_x = (xs - pose["tx"] * follow).astype(np.float32)
        neck_y = (ys - pose["ty"] * follow).astype(np.float32)
        neck = cv2.remap(self.neck, neck_x, neck_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        neck_alpha = cv2.remap(self.neck_alpha, neck_x, neck_y, cv2.INTER_LINEAR)[:, :, None]

        map_x, map_y = self.map_pose(pose)
        head = cv2.remap(self.head, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE) * self.shade(map_x, map_y, pose)
        head_alpha = cv2.remap(self.head_alpha, map_x, map_y, cv2.INTER_LINEAR)[:, :, None]

        # The neck sits one tone under the chin, with a soft contact shadow, so the chin's line reads without a dark patch.
        contact = cv2.GaussianBlur(np.roll(head_alpha, 5, axis=0), (0, 0), 3.5)
        if contact.ndim == 2:
            contact = contact[:, :, None]
        window[:] = window * (1 - neck_alpha) + neck * .84 * (1 - .3 * contact) * neck_alpha

        # Shoulders answer the head softly: they are what the neck moves from.
        shirt_x = (xs - pose["tx"] * .28).astype(np.float32)
        shirt_y = (ys - pose["ty"] * .34).astype(np.float32)
        shirt = cv2.remap(self.shirt, shirt_x, shirt_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        shirt_alpha = cv2.remap(self.shirt_alpha, shirt_x, shirt_y, cv2.INTER_LINEAR)[:, :, None]
        window[:] = window * (1 - shirt_alpha) + shirt * (1 - .25 * contact) * shirt_alpha
        window[:] = window * (1 - head_alpha) + head * head_alpha

        figure = np.maximum(np.maximum(neck_alpha, shirt_alpha), head_alpha)
        window[..., 2:3] += 34 * self.glow * figure
        window[..., 1:2] += 4 * self.glow * figure
        window[:] = window * (1 - self.monitor_edge) + base_window * self.monitor_edge
        self.steam.paint(out, pose["progress"])
        return np.clip(out, 0, 255).astype(np.uint8)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--sheet", action="store_true")
    parser.add_argument("--video", action="store_true")
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    n, data, rig, motion = channels()
    scene = Scene(rig)
    pose = lambda i: {key: float(values[i % n]) for key, values in data.items()}

    if args.sheet:
        marks = sorted({int(np.argmax(data["tx"])), int(np.argmin(data["tx"])), int(np.argmax(data["ty"])), int(np.argmin(data["ty"])),
                        int(BLINKS[0] * FPS), int(BLINKS[0] * FPS) - 3, int(BLINKS[1] * FPS), 0})
        tiles = []
        for i in marks:
            tile = scene.frame(pose(i))[300:530, 560:1010]
            cv2.putText(tile, f"f{i}", (8, 20), cv2.FONT_HERSHEY_SIMPLEX, .55, (255, 255, 255), 1, cv2.LINE_AA)
            tiles.append(tile)
        cv2.imwrite(str(out / "poses.jpg"), np.vstack([np.hstack(tiles[:2]), np.hstack(tiles[2:4]), np.hstack(tiles[4:6]), np.hstack(tiles[6:8])]), [cv2.IMWRITE_JPEG_QUALITY, 90])
        steam = [scene.frame(pose(i))[590:900, 1110:1360] for i in range(0, n, n // 6)][:6]
        cv2.imwrite(str(out / "steam.jpg"), np.hstack(steam), [cv2.IMWRITE_JPEG_QUALITY, 90])

    if args.video:
        h, w = scene.shape
        target = out / "gabriel-avatar-loop-v11.mp4"
        writer = subprocess.Popen(
            ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(FPS), "-i", "pipe:0", "-an",
             "-vf", "scale=1280:818:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-profile:v", "baseline", "-level", "4.0", "-preset", "slow", "-crf", "17",
             # aq-mode 3 keeps faint detail in dark areas, such as the steam, from fading until the next keyframe.
             "-x264-params", f"keyint={n}:min-keyint={n}:scenecut=0:ipratio=1.0:aq-mode=3", "-movflags", "+faststart", str(target)],
            stdin=subprocess.PIPE,
        )
        for i in range(n):
            frame = scene.frame(pose(i))
            if i == 0:
                cv2.imwrite(str(out / "poster.png"), cv2.resize(frame, (1280, 818), interpolation=cv2.INTER_AREA))
            writer.stdin.write(frame.tobytes())
        writer.stdin.close()
        if writer.wait():
            raise SystemExit("ffmpeg failed")
        report = {
            "frames": n, "fps": FPS, "seconds": n / FPS,
            "rig_shift_frames": motion["rig_shift_frames"], "rig_roll_correlation": motion["rig_roll_correlation"],
            "pose_ranges": {key: [round(float(v.min()), 4), round(float(v.max()), 4)] for key, v in data.items()},
            "seam_step_vs_median_step": {key: [round(float(abs(v[0] - v[-1])), 4), round(float(np.median(np.abs(np.diff(v)))), 4)] for key, v in data.items()},
        }
        (out / "render-report.json").write_text(json.dumps(report, indent=1))
        print(report["pose_ranges"])


if __name__ == "__main__":
    main()
