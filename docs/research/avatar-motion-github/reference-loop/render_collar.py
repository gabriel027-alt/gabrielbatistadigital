"""Footer loop v15: the approved v11, unchanged, wearing a black t-shirt whose shoulders show just above the monitor.

base-gola.png is the user's edit of base-para-gpt.png with a black crew-neck t-shirt. The generator still moved things:
monitor 18 px lower, head 16.5 px to the right, face redrawn. So only the two shoulder pieces are taken from it, moved
by (-16.5, -18): they then fill rows 485–518, exactly where v11 shows bare skin, and their inner edges meet the
approved neck (x 728.5–839). Face, chin, neck, monitor, room and motion stay v11's.

Usage (from the repository root):
  python docs/research/avatar-motion-github/reference-loop/render_collar.py --out DIR --still
  python docs/research/avatar-motion-github/reference-loop/render_collar.py --out DIR --video
"""
import argparse
import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_reference_loop as R  # noqa: E402

GOLA = HERE / "base-gola.png"
SWAY_SCALE, BOB_SCALE = 13.3 / 20.3, 16.9 / 22.3   # Reference over v11, both as a share of the eye spacing.
# (An 8° turn was tried on a misreading of "a partir dos 14 segundos" and rejected; the turn stays as approved.)
YAW_DEG, PITCH_DEG = 2.4, 1.9
SHIFT = (-16.5, -18.0)
# Each shoulder of the t-shirt, traced on base-gola.png down past its monitor edge (row 536).
LEFT = [(640, 545), (655, 537), (700, 522), (728, 512), (742, 503), (752, 505), (750, 520), (752, 545)]
RIGHT = [(848, 545), (850, 520), (848, 505), (858, 503), (872, 512), (900, 522), (945, 537), (960, 545)]


def build_shoulders(shape):
    gola = cv2.imread(str(GOLA))
    matrix = np.float32([[1, 0, SHIFT[0]], [0, 1, SHIFT[1]]])
    size = (shape[1], shape[0])
    color = cv2.warpAffine(gola, matrix, size, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
    mask = np.zeros(shape, np.uint8)
    for piece in (LEFT, RIGHT):
        points = np.float32(piece) + np.float32(SHIFT)
        cv2.fillPoly(mask, [np.int32(np.round(points * 4))], 255, cv2.LINE_AA, shift=2)
    alpha = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), .7)
    # The image already carries the monitor's red light; the render adds it to the figure again near the monitor.
    rows = np.arange(shape[0], dtype=np.float32)
    glow = (np.clip((rows - (R.MONITOR_Y - 26)) / 26, 0, 1) ** 2)[:, None]
    color[..., 2] -= 34 * glow
    color[..., 1] -= 4 * glow
    return np.clip(color, 0, 255), alpha


def neck_follow(ys):
    """How much of the head's movement each row of the neck carries (v11's own rule, from render_reference_loop)."""
    return np.clip((R.MONITOR_Y + 6 - ys) / 60, .55, 1)


class CollarScene(R.Scene):
    def __init__(self, rig):
        super().__init__(rig)
        self.shirt, self.shirt_alpha = build_shoulders(self.shape)

    def map_pose(self, pose):
        # Forward (toward the viewer) is drawn as growth around the moved base of the neck.
        scale = pose.get("scale", 1.0)
        if abs(scale - 1) < 1e-4:
            return super().map_pose(pose)
        xs0, ys0 = self.xs, self.ys
        cx, cy = R.PIVOT[0] + pose["tx"], R.PIVOT[1] + pose["ty"]
        self.xs, self.ys = (xs0 - cx) / scale + cx, (ys0 - cy) / scale + cy
        try:
            return super().map_pose(pose)
        finally:
            self.xs, self.ys = xs0, ys0

    def frame(self, pose):
        # Same as v11's frame, except that the shoulders move exactly like the base of the neck. v11's skin shoulders
        # were part of the neck layer; v11's garment layer followed the head far less (0.28 / 0.34), so the t-shirt
        # slid against the neck.
        for side, eye in self.eyes.items():
            eye.paint(self.head, pose["gaze_x"], pose["gaze_y"], pose["blink"])
        out = self.plate.copy()
        window = out[self.y0:self.y1, self.x0:self.x1]
        base_window = window.copy()
        xs, ys = self.xs, self.ys
        follow = neck_follow(ys)
        body_x = (xs - pose["tx"] * follow).astype(np.float32)
        body_y = (ys - pose["ty"] * follow).astype(np.float32)
        neck = cv2.remap(self.neck, body_x, body_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        neck_alpha = cv2.remap(self.neck_alpha, body_x, body_y, cv2.INTER_LINEAR)[:, :, None]
        map_x, map_y = self.map_pose(pose)
        head = cv2.remap(self.head, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE) * self.shade(map_x, map_y, pose)
        head_alpha = cv2.remap(self.head_alpha, map_x, map_y, cv2.INTER_LINEAR)[:, :, None]
        contact = cv2.GaussianBlur(np.roll(head_alpha, 5, axis=0), (0, 0), 3.5)
        if contact.ndim == 2:
            contact = contact[:, :, None]
        window[:] = window * (1 - neck_alpha) + neck * .84 * (1 - .3 * contact) * neck_alpha
        shirt = cv2.remap(self.shirt, body_x, body_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        shirt_alpha = cv2.remap(self.shirt_alpha, body_x, body_y, cv2.INTER_LINEAR)[:, :, None]
        window[:] = window * (1 - shirt_alpha) + shirt * (1 - .25 * contact) * shirt_alpha
        window[:] = window * (1 - head_alpha) + head * head_alpha
        figure = np.maximum(np.maximum(neck_alpha, shirt_alpha), head_alpha)
        window[..., 2:3] += 34 * self.glow * figure
        window[..., 1:2] += 4 * self.glow * figure
        window[:] = window * (1 - self.monitor_edge) + base_window * self.monitor_edge
        self.steam.paint(out, pose["progress"])
        return np.clip(out, 0, 255).astype(np.uint8)


# The break ("paradinha"): in the reference, once per loop (3.5–6.5 s here) the bob stops, the head stays higher and
# only slides side to side on the beat. The user asked for it to read more: the head rises further out from behind the
# monitor right as the break starts, and its slide (and the turn that goes with it) doubles; both ease back after.
BREAK_LIFT, BREAK_SLIDE = 7.0, 2.0       # Extra rise in pixels, and gain on the side slide during the break.
# Asked next (15/11/2026): a diagonal *forward*, rapper style. At each side of the slide the head pushes toward the
# viewer (it grows, around the base of the neck) and comes back as it crosses the centre. A screen-plane diagonal
# (rising to one side, dropping to the other) was tried first and rejected: "da forma que fez não existe".
BREAK_SLOPE, BREAK_LEAN_DEG, BREAK_FORWARD = 0.0, 1.0, .08


def accent_break(data, n):
    ty, tx = data["ty"], data["tx"]
    frames = np.arange(n)
    window = (frames[:, None] + np.arange(-10, 11)[None, :]) % n
    still = (np.ptp(ty[window], axis=1) < 3).astype(np.float32)        # Where the bob has stopped.
    # Rise fast as the break starts, settle back as the bob returns.
    envelope = np.clip(R.gaussian_filter1d(still, 2.5, mode="wrap") * 1.6, 0, 1)
    envelope = envelope ** .6
    centre = float(np.sum(tx * still) / max(still.sum(), 1))
    slide = (BREAK_SLIDE - 1) * envelope * (tx - centre)
    turn_per_px = float(np.abs(data["yaw"]).max() / max(np.abs(tx).max(), 1e-6))
    offset = (tx + slide - centre) * envelope                        # Side position within the break.
    reach = max(float(np.abs(offset).max()), 1e-6)
    data["ty"] = ty - BREAK_LIFT * envelope - BREAK_SLOPE * offset
    data["tx"] = tx + slide
    data["yaw"] = data["yaw"] + turn_per_px * slide
    data["roll"] = data["roll"] + np.radians(BREAK_LEAN_DEG) * offset / reach
    # Forward: strongest at each side of the slide, back at the centre; a quick push and an easier return.
    data["scale"] = 1 + BREAK_FORWARD * (np.abs(offset) / reach) ** .7
    return data


# The hit (what the user meant by "quebradinha" and "paradinha", explained 15/11/2026): "uma pausa súbita e seca no
# ponto mais baixo do movimento, marcando a batida forte da música antes de retornar à posição inicial", robotic and
# mechanical, as in urban dance and rap. Each beat: an accelerating drop, a dead stop held at the bottom, then a
# smoother return. Same tempo, depth and placement as the measured bob; the reference's break stays as measured.
HIT_DROP, HIT_HOLD = .30, .24       # Shares of the beat: the drop, and the freeze at the bottom.
# "Mais profundidade": the bottom goes deeper than the measured bob (the top stays), the chin dipping a little behind
# the monitor's edge on the hit, and the nod is stronger there.
HIT_DEPTH, HIT_NOD_DEG = 1.9, 3.4


def hit(data, n):
    y = data["ty"]
    frames = np.arange(n)
    window = (frames[:, None] + np.arange(-10, 11)[None, :]) % n
    active = R.gaussian_filter1d((np.ptp(y[window], axis=1) >= 3).astype(np.float32), 2.0, mode="wrap")
    moving = active > .5
    lo, hi = np.percentile(y[moving], 1), np.percentile(y[moving], 99)
    amplitude, centre = (hi - lo) / 2, (hi + lo) / 2
    period = n / BEATS

    def beat(offset):
        phase = np.mod(frames / period + offset, 1.0)
        rise = np.clip((phase - HIT_DROP - HIT_HOLD) / (1 - HIT_DROP - HIT_HOLD), 0, 1)
        return np.where(phase < HIT_DROP, -1 + 2 * (phase / HIT_DROP) ** 1.7,   # Drop, fastest just before the stop.
               np.where(phase < HIT_DROP + HIT_HOLD, 1.0,                        # Dead stop at the bottom.
                        1 - 2 * rise * rise * (3 - 2 * rise)))                    # Return.

    offsets = np.linspace(0, 1, 200, endpoint=False)
    best = max(offsets, key=lambda o: float(np.corrcoef(beat(o)[moving], y[moving])[0, 1]))
    data["_beat_offset"], data["_active"] = np.full(n, best), active
    shape = beat(best)
    deep = np.where(shape > 0, shape * HIT_DEPTH, shape)               # Only the way down reaches further.
    data["ty"] = y * (1 - active) + (centre + amplitude * deep) * active
    # The nod follows the same hit, so the chin stops dead with the head.
    nod = np.where(shape > 0, np.radians(HIT_NOD_DEG) * shape, np.radians(R.PITCH_DEG) * shape)
    data["pitch"] = data["pitch"] * (1 - active) + nod * active
    data["_hit_weight"] = (shape + 1) / 2 * active                     # 0 at the top of a beat, 1 held at the bottom.
    return data


# The two points of the user's description (15/11/2026) the hit lacked: the drop goes "levemente para o lado
# esquerdo", and the face takes "uma sutil tombada diagonal" that freezes with the stop and eases off on the return.
TILT_SHIFT_PX, TILT_ROLL_DEG = -2.5, 2.5


# The break's "nanão" (15/11/2026): while the bob stops, the head already snaps sideways and holds, but only 3.9 px and
# 1.8° of turn, mostly to one side, under half of the rest of the loop. Only inside the break, the same snaps and holds
# are centred and widened so the head goes right and left, turning more than it slides, like a "no" in the beat.
# First try (centred, right and left, turning more than sliding) was rejected: "o atual ainda é melhor". The user
# keeps the current one-sided snap and its slide/turn ratio and only wants it to read more, so each snap goes further
# from where the head rests in the break, with the same timing.
# Second try (both x2.2): "a face se mexe mais, a cabeça ainda não". The turn moves the features inside the head, the
# outline barely; so the whole head slides much further and the face turn stays close to the current one.
SHAKE_SWAY, SHAKE_TURN = 3.4, 1.3


def break_shake(data, n, both_sides=False):
    w = np.clip(1 - data["_active"], 0, 1)
    still = w > .5
    rest = data["tx"][still].max()                  # The head rests at the right; the snaps go left from there.
    rest_yaw = data["yaw"][still].max()
    if both_sides:                                  # Test (15/11/2026): the same snaps, centred, so the rests sit right.
        rest = (data["tx"][still].max() + data["tx"][still].min()) / 2
        rest_yaw = (data["yaw"][still].max() + data["yaw"][still].min()) / 2
    for key, gain, home in (("tx", SHAKE_SWAY, rest), ("yaw", SHAKE_TURN, rest_yaw)):
        values = data[key]
        data[key] = values + (home + (values - home) * gain - values) * w
    return data


def hit_tilt(data, n):
    w = data["_hit_weight"]
    data["tx"] = data["tx"] + TILT_SHIFT_PX * w
    data["roll"] = data["roll"] + np.radians(TILT_ROLL_DEG) * w
    return data


# The break, as the user's second recording shows it (15/11/2026, tracked frame by frame): while the bob stops, the
# head ticks sideways on the beat (5 px in 3 frames, a dead hold of about 9 frames, back in 3 frames, rising 1 px as
# it goes out); then, to leave the break, it pops up 3.6 px and drops deep (17.7 px in 8 frames) into a freeze before
# the bob returns. In eye-spacing terms ours is a little larger, so it reads at the footer's size.
TICK_PX, TICK_RISE, TICK_OUT, TICK_HOLD, TICK_BACK = 7.5, 1.5, 3, 9, 3
POP_PX, DROP_DEEP = 4.0, 1.5          # Pop before the drop, and how much deeper than a normal hit the drop goes.


def break_ticks(data, n):
    frames = np.arange(n)
    period = n / BEATS
    phase = np.mod(frames / period + data["_beat_offset"][0], 1.0)
    since = np.mod(phase - HIT_DROP, 1.0) * period          # Frames since the beat (the bottom of a hit).
    still = data["_active"] < .5
    # The break as one run of frames (the loop wraps), and the first beat after it.
    starts = [i for i in range(n) if still[i] and not still[i - 1]]
    ends = [i for i in range(n) if not still[i] and still[i - 1]]
    b0, b1 = starts[0], ends[0] if ends[0] > starts[0] else ends[0] + n
    inside = np.zeros(n, bool)
    inside[np.arange(b0, b1) % n] = True
    ease = lambda t: 1 - (1 - np.clip(t, 0, 1)) ** 2
    tick = np.where(since < TICK_OUT, ease(since / TICK_OUT),
           np.where(since < TICK_OUT + TICK_HOLD, 1.0,
                    1 - ease((since - TICK_OUT - TICK_HOLD) / TICK_BACK)))
    tick = np.clip(tick, 0, 1)
    # A tick runs whole, and only for beats that start inside the break and leave room for the closing drop.
    beat_at = np.round(frames - since).astype(int) % n
    room = (b1 - beat_at) % n > period
    allowed = inside[beat_at] & room
    tick = np.where(allowed, tick, 0.0)
    centre = float(np.mean(data["tx"][inside]))
    turn_per_px = float(np.abs(data["yaw"]).max() / max(np.abs(data["tx"]).max(), 1e-6))
    body = inside | (tick > 0)
    data["tx"] = np.where(body, centre + TICK_PX * tick, data["tx"])
    data["yaw"] = np.where(body, turn_per_px * TICK_PX * tick, data["yaw"])
    data["ty"] = data["ty"] - TICK_RISE * tick

    # Leaving the break: pop up, drop deep with an accelerating fall, freeze, then rise into the next beat.
    ty = data["ty"].copy()
    starts_of_drop = [i for i in range(n) if phase[i] < phase[i - 1]]           # Phase wraps: a drop begins.
    # The last beat that starts inside the break carries the closing drop; the rise lasts until the drop after the
    # next one, so the head is back on top, on the beat, when the bob resumes.
    d0 = max((i for i in starts_of_drop if inside[i]), key=lambda i: (i - b0) % n)
    top = float(ty[(d0 - 6) % n])
    normal_bottom = float(np.percentile(ty[~inside], 99))
    deep = top + (normal_bottom - top) * DROP_DEEP
    pop_f, fall_f, hold_f = 5, 7, 8
    following = sorted(((i - d0) % n for i in starts_of_drop if (i - d0) % n > 0))
    end = d0 + following[1]
    after = float(ty[end % n])
    for k in range(d0 - pop_f, end):
        i = k % n
        if k < d0:                                    # Pop up.
            ty[i] = top - POP_PX * ease((k - (d0 - pop_f) + 1) / pop_f)
        elif k < d0 + fall_f:                         # Fall, fastest just before the stop.
            t = (k - d0 + 1) / fall_f
            ty[i] = (top - POP_PX) + (deep - top + POP_PX) * t ** 1.8
        elif k < d0 + fall_f + hold_f:                # Freeze at the bottom.
            ty[i] = deep
        else:                                         # Rise into the bob.
            t = (k - d0 - fall_f - hold_f) / max(end - d0 - fall_f - hold_f, 1)
            ty[i] = deep + (after - deep) * t * t * (3 - 2 * t)
    data["ty"] = ty
    return data


# The groove ("quebradinha"): the measured bob is an even wave (3 averaged cycles smooth the hit away). Each beat is
# redrawn with the same tempo, depth and timing: the head drops fast into the beat, gives a small bounce, then rises
# slowly; the chin goes forward on the hit. The side-to-side sway, measured, is unchanged.
BEATS = 17                     # Bob cycles per loop (measured: 17 in 334 frames, about 92 BPM).
DROP, BOUNCE = .26, .12        # Share of the beat taken by the drop and by the bounce after it.
NOD_DEG, HIT_DEG = 2.6, 1.6    # Nod that follows the height, and extra nod on the hit (from the drop's speed).


def groove(data, n):
    y = data["ty"]
    amplitude = (np.percentile(y, 99) - np.percentile(y, 1)) / 2
    centre = (np.percentile(y, 99) + np.percentile(y, 1)) / 2
    period = n / BEATS
    frames = np.arange(n)
    ease_in = lambda t: t ** 2.2
    ease_inout = lambda t: t * t * (3 - 2 * t)

    def beat(offset):
        phase = np.mod(frames / period + offset, 1.0)
        shape = np.where(phase < DROP, -1 + 2 * ease_in(phase / DROP),                               # Drop: accelerating.
                 np.where(phase < DROP + BOUNCE, 1 - .32 * np.sin(np.pi * (phase - DROP) / BOUNCE),   # Bounce at the bottom.
                          1 - 2 * ease_inout((phase - DROP - BOUNCE) / (1 - DROP - BOUNCE))))         # Slow rise.
        return R.gaussian_filter1d(shape, .6, mode="wrap")

    # Place the beats where the measured bob has them: the offset that matches it best.
    offsets = np.linspace(0, 1, 200, endpoint=False)
    best = max(offsets, key=lambda o: float(np.corrcoef(beat(o), y)[0, 1]))
    shape = beat(best)
    data["ty"] = centre + amplitude * shape
    speed = np.gradient(shape)
    hit = np.clip(speed / max(float(speed.max()), 1e-6), 0, 1)
    data["pitch"] = np.radians(NOD_DEG) * shape + np.radians(HIT_DEG) * hit
    return data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--still", action="store_true")
    parser.add_argument("--video", action="store_true")
    parser.add_argument("--groove", action="store_true", help="redraw each beat with a fast drop (rejected: not in the reference)")
    parser.add_argument("--accent-break", action="store_true", help="exaggerated break: higher, wider, forward (rejected)")
    parser.add_argument("--break-ticks", action="store_true", help="sideways ticks and a deep closing drop in the break (rejected)")
    parser.add_argument("--hit-tilt", action="store_true", help="each hit drops a little to the left with a slight head tilt")
    parser.add_argument("--break-shake", action="store_true", help="wider right-and-left snaps while the bob stops")
    parser.add_argument("--break-shake-both", action="store_true", help="the same wider snaps, alternating right and left")
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    # Matched to the user's screen recording of the reference footer (15/11/2026), measured against the distance between
    # the eyes: sway 13 % and bob 17 % there, against 20 % and 22 % in v11, which read as loose. The face turns with
    # the sway (correlation 0.82 there) and nods with the bob; it barely tilts. Same tempo (91 BPM) and beat shape.
    R.YAW_DEG, R.PITCH_DEG = YAW_DEG, PITCH_DEG
    n, data, rig, motion = R.channels()
    data["tx"] = data["tx"] * SWAY_SCALE
    data["ty"] = data["ty"] * BOB_SCALE
    data = hit(data, n)
    if args.hit_tilt:
        data = hit_tilt(data, n)
    if args.break_shake or args.break_shake_both:
        data = break_shake(data, n, both_sides=args.break_shake_both)
    if args.break_ticks:
        data = break_ticks(data, n)
    data = {key: value for key, value in data.items() if not key.startswith("_")}
    if args.accent_break:
        data = accent_break(data, n)
    if args.groove:
        data = groove(data, n)
    scene = CollarScene(rig)
    pose = lambda i: {key: float(values[i % n]) for key, values in data.items()}
    if args.still:
        cv2.imwrite(str(out / "v15-frame0.png"), scene.frame(pose(0)))
        marks = sorted({0, int(np.argmax(data["tx"])), int(np.argmin(data["tx"])), int(np.argmax(data["ty"])), int(np.argmin(data["ty"]))})
        cv2.imwrite(str(out / "v15-poses.jpg"), np.hstack([scene.frame(pose(i))[300:560, 560:1010] for i in marks]), [cv2.IMWRITE_JPEG_QUALITY, 92])
    if args.video:
        frames = out / "frames"
        frames.mkdir(exist_ok=True)
        for i in range(n):
            cv2.imwrite(str(frames / f"{i:04d}.png"), scene.frame(pose(i)))


if __name__ == "__main__":
    main()
