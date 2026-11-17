"""Footer loop v14: the approved v11, unchanged, with the monitor's top edge a little higher.

The user read v11's skin-coloured shoulders as "without a shirt". Dressing the figure failed twice (v12 garment from a
generated image, v13 garment drawn in code). Here nothing is added: the monitor rises by RAISE pixels and hides the
shoulders, so only the head shows behind the screen, as in the original footer reference. The monitor's own top band
(bezel, red rim light and the start of its back) is moved up; its straight sides simply continue.

Usage (from the repository root):
  python docs/research/avatar-motion-github/reference-loop/render_monitor.py --out DIR --raise 16 --still
  python docs/research/avatar-motion-github/reference-loop/render_monitor.py --out DIR --raise 16 --video
"""
import argparse
import sys
from pathlib import Path

import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_reference_loop as R  # noqa: E402

MONITOR_X = (428, 1122)   # The monitor's horizontal extent in the base image (outside it, the sofa stays).
BAND = 90                 # Rows of the monitor's top that are moved up.


class RaisedScene(R.Scene):
    def __init__(self, rig, lift):
        super().__init__(rig)
        top, (x0, x1) = R.MONITOR_Y, MONITOR_X
        plate = self.plate.astype(np.float32)
        band = plate[top - 3:top + BAND, x0:x1].copy()
        plate[top - 3 - lift:top + BAND - lift, x0:x1] = band
        self.plate = plate.astype(self.plate.dtype)
        edge = top - lift
        ys = self.ys
        self.monitor_edge = np.clip((ys - edge) / 1.5, 0, 1)[:, :, None]
        self.glow = np.clip((ys - (edge - 26)) / 26, 0, 1)[:, :, None] ** 2


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--raise", dest="lift", type=int, default=16)
    parser.add_argument("--still", action="store_true")
    parser.add_argument("--video", action="store_true")
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    n, data, rig, motion = R.channels()
    scene = RaisedScene(rig, args.lift)
    pose = lambda i: {key: float(values[i % n]) for key, values in data.items()}
    if args.still:
        cv2.imwrite(str(out / f"v14-{args.lift}-frame0.png"), scene.frame(pose(0)))
        # The poses that show most below the chin: head highest, lowest, and furthest to each side.
        marks = sorted({int(np.argmin(data["ty"])), int(np.argmax(data["ty"])), int(np.argmax(data["tx"])), int(np.argmin(data["tx"])), 0})
        tiles = [scene.frame(pose(i))[300:560, 560:1010] for i in marks]
        cv2.imwrite(str(out / f"v14-{args.lift}-poses.jpg"), np.hstack(tiles), [cv2.IMWRITE_JPEG_QUALITY, 92])
    if args.video:
        frames = out / "frames"
        frames.mkdir(exist_ok=True)
        for i in range(n):
            cv2.imwrite(str(frames / f"{i:04d}.png"), scene.frame(pose(i)))


if __name__ == "__main__":
    main()
