"""Measure the head's acting from a screen recording of the reference, as one averaged cycle.

Each frame is compared with one fixed key frame, so errors do not accumulate. Only points on the head are
used: the wall behind it never moves and would pull the estimate toward zero.

- Position and tilt come from a similarity fit over all head points.
- Turn comes from parallax: when a head turns, the glasses and nose (near) shift more than the headphones and
  hair edge (far). That difference, divided by the depth between them, gives yaw and pitch.

The output holds numbers only, never pixels from the recording.
Usage: python extract_motion.py RECORDING.mp4 motion-channels.json
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.spatial.transform import Rotation

HEAD_BOX = (830, 110, 1170, 450)    # x0, y0, x1, y1 around the head in a 1910×866 recording.
HEAD = (130, 195, 104, 138)         # Ellipse inside that box: centre x, y, radius x, y.
NEAR = (130, 215, 62, 62)           # Glasses, nose and moustache.
DEPTH_PX = 85.0                     # Near-to-far depth, assumed from the head's width in the recording.
SEARCH = (260, 420)                 # Candidate cycle lengths in frames.
RIG = Path(__file__).resolve().parent.parent / "volume-light" / "rig-input.json"


def ellipse(points, box):
    cx, cy, rx, ry = box
    return ((points[:, 0] - cx) / rx) ** 2 + ((points[:, 1] - cy) / ry) ** 2 < 1


def load(path):
    capture = cv2.VideoCapture(str(path))
    x0, y0, x1, y1 = HEAD_BOX
    frames = []
    while True:
        ok, frame = capture.read()
        if not ok:
            return frames
        frames.append(cv2.cvtColor(frame[y0:y1, x0:x1], cv2.COLOR_BGR2GRAY))


def track(frames):
    key = frames[0]
    mask = np.zeros(key.shape, np.uint8)
    cv2.ellipse(mask, (HEAD[0], HEAD[1]), (HEAD[2], HEAD[3]), 0, 0, 360, 255, -1)
    mask[318:] = 0  # The monitor's edge does not move with the head.
    points = cv2.goodFeaturesToTrack(key, 500, .006, 4, mask=mask).reshape(-1, 2).astype(np.float32)
    near = ellipse(points, NEAR)
    print("head points", len(points), "near", int(near.sum()), "far", int((~near).sum()))
    guess = points.copy()
    rows = []
    for frame in frames:
        moved, status, _ = cv2.calcOpticalFlowPyrLK(key, frame, points, guess.copy(), winSize=(25, 25), maxLevel=3,
                                                    flags=cv2.OPTFLOW_USE_INITIAL_FLOW)
        back, back_status, _ = cv2.calcOpticalFlowPyrLK(frame, key, moved, points.copy(), winSize=(25, 25), maxLevel=3,
                                                        flags=cv2.OPTFLOW_USE_INITIAL_FLOW)
        good = (status.ravel() == 1) & (back_status.ravel() == 1) & (np.linalg.norm(back - points, axis=1) < 1.0)
        M, inliers = cv2.estimateAffinePartial2D(points[good], moved[good], method=cv2.RANSAC, ransacReprojThreshold=2.5)
        if M is None:
            rows.append(rows[-1] if rows else [0, 0, 0, 0, 0])
            continue
        centre = np.array([HEAD[0], HEAD[1], 1.0])
        tx, ty = M @ centre - centre[:2]
        roll = np.degrees(np.arctan2(M[1, 0], M[0, 0]))
        # Fit the far points alone, then measure how much further the near points travelled.
        far_good = good & ~near
        near_good = good & near
        far_fit, _ = cv2.estimateAffinePartial2D(points[far_good], moved[far_good], method=cv2.RANSAC, ransacReprojThreshold=2.5)
        if far_fit is None or near_good.sum() < 8:
            rows.append(rows[-1] if rows else [tx, ty, roll, 0, 0])
            continue
        predicted = points[near_good] @ far_fit[:, :2].T + far_fit[:, 2]
        residual = np.median(moved[near_good] - predicted, axis=0)
        rows.append([tx, ty, roll, residual[0], residual[1]])
        guess = np.where(good[:, None], moved, guess)
    return np.array(rows, float)


def find_cycle(frames):
    """The cycle length from the images themselves: the lag at which the head looks most like itself."""
    small = np.stack([cv2.resize(f, (85, 85), interpolation=cv2.INTER_AREA) for f in frames]).astype(np.float32)
    scores = [(lag, float(np.abs(small[lag:] - small[:-lag]).mean())) for lag in range(*SEARCH)]
    return min(scores, key=lambda item: item[1])


def fold(values, cycle):
    cycles = len(values) // cycle
    stack = values[:cycles * cycle].reshape(cycles, cycle, -1)
    return stack.mean(0), stack, cycles


def main():
    recording, target = sys.argv[1], sys.argv[2]
    frames = load(recording)
    cycle, difference = find_cycle(frames)
    print("cycle", cycle, "frames; mean difference at that lag", round(difference, 3))
    rows = track(frames)
    folded, stack, cycles = fold(rows, cycle)
    repeatability = [float(np.corrcoef(stack[0, :, i], stack[-1, :, i])[0, 1]) for i in range(rows.shape[1])]
    print("raw std x y roll nearx neary", rows.std(0).round(3).tolist(), "averaged std", folded.std(0).round(3).tolist())
    print("raw roll range", rows[:, 2].min().round(2), rows[:, 2].max().round(2), "repeatability", [round(v, 2) for v in repeatability])
    folded -= folded.mean(0)
    yaw = np.degrees(np.arcsin(np.clip(folded[:, 3] / DEPTH_PX, -1, 1)))
    pitch = np.degrees(np.arcsin(np.clip(folded[:, 4] / DEPTH_PX, -1, 1)))

    # Eye and brow channels were tracked from the original clip: find where this recording's cycle starts.
    rig = json.loads(RIG.read_text())["frames"]
    euler = Rotation.from_matrix(np.array([f["matrix"] for f in rig])[:, :3, :3]).as_euler("YXZ", degrees=True)
    rig_len = len(euler)
    resampled = np.interp(np.arange(cycle) * rig_len / cycle, np.arange(rig_len), euler[:, 2])
    smooth = gaussian_filter1d(folded[:, 2], 2, mode="wrap")
    scores = [np.corrcoef(smooth, np.roll(resampled, shift))[0, 1] for shift in range(cycle)]
    shift = int(np.argmax(scores))

    report = {
        "cycle_frames": cycle,
        "cycles_averaged": cycles,
        "repeatability_x_y_roll_nearx_neary": [round(v, 3) for v in repeatability],
        "rig_shift_frames": shift,
        "rig_roll_correlation": round(float(scores[shift]), 3),
        "x_px": folded[:, 0].round(3).tolist(),
        "y_px": folded[:, 1].round(3).tolist(),
        "roll_deg": folded[:, 2].round(3).tolist(),
        "yaw_deg": yaw.round(3).tolist(),
        "pitch_deg": pitch.round(3).tolist(),
    }
    Path(target).write_text(json.dumps(report))
    print({k: v for k, v in report.items() if not isinstance(v, list)})
    for name in ("x_px", "y_px", "roll_deg", "yaw_deg", "pitch_deg"):
        values = np.array(report[name])
        spectrum = np.abs(np.fft.rfft(values - values.mean()))
        frequencies = np.fft.rfftfreq(len(values), 1 / 30)
        peaks = np.argsort(spectrum[1:])[-3:][::-1] + 1
        print(name, "range", round(float(values.min()), 2), round(float(values.max()), 2), "std", round(float(values.std()), 2),
              "peaks Hz", [round(float(frequencies[i]), 2) for i in peaks])


if __name__ == "__main__":
    main()
