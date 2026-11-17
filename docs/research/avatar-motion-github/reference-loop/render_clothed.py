"""Footer loop v12: the approved v11 head (face, gaze, blinks and movement unchanged) now wears the black jacket.

The user found the bare neck and shoulders of v11 read as "without a shirt". The garment comes from base-com-roupa.png,
which the user generated from base-para-gpt.png: same room, same framing, chin at the same height, but the monitor
31 px lower so the collar and the shoulders show. From that image this script takes only the jacket and t-shirt
(an overlay that follows the head softly) and the room below the shoulders (the lower monitor, desk and mug). The head,
the neck and everything above the shoulders still come from the approved image, through render_reference_loop.py.

Usage (from the repository root):
  python docs/research/avatar-motion-github/reference-loop/render_clothed.py --out DIR --still
  python docs/research/avatar-motion-github/reference-loop/render_clothed.py --out DIR --video
"""
import argparse
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from scipy.ndimage import binary_fill_holes

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render_reference_loop as R  # noqa: E402

CLOTHED = HERE / "base-com-roupa.png"
NEW_MONITOR_Y = 549        # Monitor top edge in base-com-roupa.png (518 in the approved base).
ROOM_FROM_ROW = 492        # From here down the room comes from base-com-roupa.png; above it, the approved plate.
# The jacket and t-shirt, traced on base-com-roupa.png: outer shoulder line, collar peaks beside the jaw, and the
# t-shirt neckline. Skin inside the outline is left out, so the approved neck shows between the collars.
# The outline closes inside the neck; the neck itself is cut out of it (build_garment), so the collars meet it exactly.
GARMENT_OUTLINE = [(588, 552), (600, 541), (640, 526), (694, 507), (712, 494), (731, 471), (760, 480), (760, 552),
                   (810, 552), (810, 480), (856, 472), (872, 493), (891, 507), (940, 523), (990, 541), (1002, 552)]
MUG_SHIFT = 20             # The mug sits 20 px further right in base-com-roupa.png.
# The user then asked for only the black t-shirt (base-camiseta.png). That image came back at another size and with
# the room redrawn, so it is placed by the face, not by the room: ear to ear 194 px there against 170 px here, chin
# (x 879, y 552 there) under the approved chin. Its monitor then lands on row 553, matching base-com-roupa's 549.
TEE = HERE / "base-camiseta.png"
TEE_SCALE, TEE_CHIN, APPROVED_CHIN = 170 / 194, (879.0, 552.0), (783.5, 516.0)
# The t-shirt and the neck below the chin in base-camiseta.png coordinates: shoulders from the monitor up to the
# collar, across under the chin (row 552 there, the chin's own shadow, lands just under the approved chin). Its round
# neckline is a deep U that meets the monitor at the centre, so the neck there comes from the same image.
TEE_OUTLINE = [(664, 600), (668, 594), (700, 578), (740, 562), (790, 548), (815, 536), (838, 534), (860, 538),
               (880, 539), (900, 538), (922, 534), (948, 536), (975, 548), (1030, 565), (1080, 582), (1118, 594), (1122, 600)]
BODY_SHIFT = -9.5          # Generated neck centre (x 793) to approved face centre (x 783.5).
# Head rows (lifted coordinates) where the old monitor's red light sits on the chin, and the cheek row used as reference.
CHIN_REF_ROW, CHIN_FROM_ROW, CHIN_TO_ROW = 418, 474, 514


NECK_FROM_ROW = 494        # The generated neck starts under the approved jaw, which covers everything above it.


NECKLINE_CENTER, NECKLINE_X, NECKLINE_RISE, NECKLINE_HALF = 537.0, 793.0, 9.0, 46.0


def above_neckline(shape):
    """Rows above the t-shirt's round neckline (lowest at the centre, rising toward the sides), in clothed coordinates."""
    ys, xs = np.mgrid[0:shape[0], 0:shape[1]].astype(np.float32)
    line = NECKLINE_CENTER - NECKLINE_RISE * np.clip(np.abs(xs - NECKLINE_X) / NECKLINE_HALF, 0, 1.4) ** 2
    return ys < line


def neck_mask(clothed):
    """The generated neck: its skin between the collars down to the t-shirt neckline, as one solid shape."""
    b, g, r = [clothed[..., i].astype(np.float32) for i in range(3)]
    skin = (g > 55) & (r > 105)
    region = np.zeros(skin.shape, bool)
    region[NECK_FROM_ROW - 12:NEW_MONITOR_Y + 2, 722:862] = True
    skin = cv2.morphologyEx((skin & region).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    count, labels, stats, _ = cv2.connectedComponentsWithStats(skin)
    keep = labels == 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    # The red glow near the monitor makes the black t-shirt read as skin; the neckline is drawn instead.
    return binary_fill_holes(keep) & above_neckline(keep.shape)


def build_clothed_neck(clothed, base):
    """The neck drawn in the clothed image (a real neck: narrower than the jaw, rounded, in the jaw's shadow),
    recoloured to the approved skin so it continues the approved face. It fades in under the jaw."""
    keep = neck_mask(clothed)
    lab = cv2.cvtColor(clothed, cv2.COLOR_BGR2LAB).astype(np.float32)
    ref = cv2.cvtColor(base[493:511, 742:828], cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)
    src = lab[keep]
    lab = (lab - src.mean(0)) / (src.std(0) + 1e-3) * np.array([ref.std(0)[0], src.std(0)[1], src.std(0)[2]]) + ref.mean(0)
    color = cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
    rows = np.arange(keep.shape[0], dtype=np.float32)[:, None]
    alpha = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.0) * np.clip((rows - NECK_FROM_ROW) / 8, 0, 1)
    return color, alpha


def build_tee(shape):
    """The black t-shirt from base-camiseta.png, scaled and placed by the face onto the approved grid."""
    tee = cv2.imread(str(TEE))
    s = TEE_SCALE
    matrix = np.float32([[s, 0, APPROVED_CHIN[0] - s * TEE_CHIN[0]], [0, s, APPROVED_CHIN[1] - s * TEE_CHIN[1]]])
    size = (shape[1], shape[0])
    color = cv2.warpAffine(tee, matrix, size, flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
    outline = np.int32(np.round(np.float32(TEE_OUTLINE) @ matrix[:, :2].T + matrix[:, 2]))
    mask = np.zeros(shape, np.uint8)
    cv2.fillPoly(mask, [outline], 255, cv2.LINE_AA)
    alpha = mask.astype(np.float32) / 255
    alpha[NEW_MONITOR_Y + 3:] = 0
    # The image already carries the monitor's red light; the render adds it to the figure again near the monitor.
    rows = np.arange(shape[0], dtype=np.float32)
    glow = (np.clip((rows - (NEW_MONITOR_Y - 26)) / 26, 0, 1) ** 2)[:, None]
    color[..., 2] -= 34 * glow
    color[..., 1] -= 4 * glow
    return np.clip(color, 0, 255), cv2.GaussianBlur(alpha, (0, 0), .7)


def build_garment(clothed):
    h, w = clothed.shape[:2]
    outline = np.zeros((h, w), np.uint8)
    cv2.fillPoly(outline, [np.int32(GARMENT_OUTLINE)], 255, cv2.LINE_AA)
    # The collars meet the generated neck exactly: everything inside the outline that is not neck is garment.
    alpha = ((outline > 127) & ~neck_mask(clothed)).astype(np.float32)
    alpha[NEW_MONITOR_Y + 3:] = 0
    alpha = cv2.GaussianBlur(alpha, (0, 0), .8)
    # Inside the t-shirt neckline the generated neck dips a few pixels lower than the outline: paint it as t-shirt.
    color = clothed.astype(np.float32)
    b, g, r = color[..., 0], color[..., 1], color[..., 2]
    skin = ((g > 55) & (r > 105) & (alpha > .01)) | ((r > g * 1.6) & (r > 90) & ~above_neckline(alpha.shape) & (np.abs(np.arange(alpha.shape[1]) - NECKLINE_X) < 60)[None, :])
    skin = (skin & (alpha > .01)).astype(np.uint8)
    soft = cv2.GaussianBlur(cv2.dilate(skin, np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 1.6)[:, :, None]
    shirt_tone = np.median(color[536:546, 700:720].reshape(-1, 3), axis=0)
    color = color * (1 - soft) + shirt_tone * soft
    return color, alpha


class ClothedScene(R.Scene):
    def __init__(self, rig):
        super().__init__(rig)
        clothed = cv2.imread(str(CLOTHED)).astype(np.float32)
        # The room below the shoulders from the clothed image, blended into the approved plate over a few rows.
        rows = np.arange(self.plate.shape[0], dtype=np.float32)
        mix = np.clip((rows - ROOM_FROM_ROW) / 10, 0, 1)[:, None, None]
        plate = np.clip(self.plate.astype(np.float32) * (1 - mix) + clothed * mix, 0, 255).astype(np.uint8)
        # Only the sofa may show behind the figure: the clothed image's own body (and the rough reconstruction that the
        # v11 shoulders used to hide) is rebuilt from the sofa around it, so the moving garment never uncovers a copy.
        behind = np.zeros(plate.shape[:2], np.uint8)
        cv2.fillPoly(behind, [np.int32(GARMENT_OUTLINE)], 255)
        cv2.ellipse(behind, (784, 505), (98, 52), 0, 0, 360, 255, -1)
        behind = cv2.dilate(behind, np.ones((9, 9), np.uint8))
        behind[NEW_MONITOR_Y - 2:] = 0
        self.plate = cv2.inpaint(plate, behind, 9, cv2.INPAINT_TELEA).astype(self.plate.dtype)
        # The generated body is centred 9.5 px right of the approved face: move it under the face.
        shift = np.float32([[1, 0, BODY_SHIFT], [0, 1, 0]])
        size = (clothed.shape[1], clothed.shape[0])
        move = lambda image: cv2.warpAffine(image, shift, size, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        if TEE.exists():
            self.shirt, self.shirt_alpha = build_tee(self.shape)
            # Under the chin the t-shirt image keeps the neck in shadow: match the neck to it there (the monitor's glow,
            # added on top of the figure near the monitor, is taken off the target so it is not counted twice).
            # The neck under the chin comes with the t-shirt from the same image; the jacket image's neck is not needed.
            self.neck_alpha = np.zeros_like(self.neck_alpha)
        else:
            shirt, shirt_alpha = build_garment(clothed)
            self.shirt, self.shirt_alpha = move(shirt), move(shirt_alpha)
        # The v11 neck was a flat band that only showed for a few rows; above the collar it reads as a block.
        neck, neck_alpha = build_clothed_neck(clothed, cv2.imread(str(R.BASE)))
        self.neck, self.neck_alpha = move(neck), move(neck_alpha)
        # In the approved base the monitor sat right under the chin and lit it red. It is lower now: the chin takes the
        # tone of the face above, going a little darker toward the neck, so the jaw and the neck join without a patch.
        # One colour gain (cheek tone over the lit chin), faded in smoothly with the height: no per-row bands.
        ref = self.head[CHIN_REF_ROW - 3:CHIN_REF_ROW + 3, 765:802].reshape(-1, 3).mean(0)
        chin = self.head[CHIN_TO_ROW - 18:CHIN_TO_ROW - 4, 768:800].reshape(-1, 3).mean(0)
        gain = ref * .9 / np.maximum(chin, 1)
        rows = np.arange(self.head.shape[0], dtype=np.float32)
        t = np.clip((rows - CHIN_FROM_ROW) / (CHIN_TO_ROW - 12 - CHIN_FROM_ROW), 0, 1)
        t = (t * t * (3 - 2 * t))[:, None, None]
        self.head = self.head * (1 + (gain[None, None, :] - 1) * t)
        # v11 continued the chin by repeating the last clean row, which shows as a flat block now that the whole chin is
        # visible. Give it volume: rounder toward its sides, and turning away from the light toward its underside.
        ys, xs = np.mgrid[0:self.head.shape[0], 0:self.head.shape[1]].astype(np.float32)
        lower = np.clip((ys - (CHIN_FROM_ROW + 6)) / (CHIN_TO_ROW - CHIN_FROM_ROW - 6), 0, 1)
        lower = lower * lower * (3 - 2 * lower)
        side = np.clip(np.abs(xs - 783.5) / 52, 0, 1) ** 2
        under = np.clip((ys - (CHIN_TO_ROW - 14)) / 14, 0, 1)
        self.head = self.head * (1 - lower * (.22 * side + .16 * under))[:, :, None]
        # The window, the monitor line and its glow move down with the monitor.
        self.y1 = NEW_MONITOR_Y + 6
        ys, xs = np.mgrid[self.y0:self.y1, self.x0:self.x1].astype(np.float32)
        self.xs, self.ys = xs, ys
        self.monitor_edge = np.clip((ys - NEW_MONITOR_Y) / 1.5, 0, 1)[:, :, None]
        self.glow = np.clip((ys - (NEW_MONITOR_Y - 26)) / 26, 0, 1)[:, :, None] ** 2
        # Steam rises from the mug where the clothed image puts it.
        self.steam.x0 += MUG_SHIFT; self.steam.x1 += MUG_SHIFT
        self.steam.xs = self.steam.xs + MUG_SHIFT
        self.steam.RIM_X += MUG_SHIFT
        self.steam.WISPS = tuple((x + MUG_SHIFT, *rest) for x, *rest in self.steam.WISPS)


def main():
    # The neck now runs down into the t-shirt collar instead of opening into bare shoulders.
    R.MONITOR_Y = NEW_MONITOR_Y
    R.TRAP_REACH = 6.0
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", required=True)
    parser.add_argument("--still", action="store_true")
    parser.add_argument("--video", action="store_true")
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    n, data, rig, motion = R.channels()
    scene = ClothedScene(rig)
    pose = lambda i: {key: float(values[i % n]) for key, values in data.items()}

    if args.still:
        cv2.imwrite(str(out / "v12-frame0.png"), scene.frame(pose(0)))
        marks = sorted({0, int(np.argmax(data["tx"])), int(np.argmin(data["tx"])), int(np.argmax(data["ty"])), int(np.argmin(data["ty"]))})
        tiles = [scene.frame(pose(i))[330:600, 540:1030] for i in marks]
        cv2.imwrite(str(out / "v12-poses.jpg"), np.hstack(tiles), [cv2.IMWRITE_JPEG_QUALITY, 92])

    if args.video:
        # Lossless frames at the base size; they are upscaled and encoded afterwards (see README.md, v12).
        frames = out / "frames"
        frames.mkdir(exist_ok=True)
        for i in range(n):
            cv2.imwrite(str(frames / f"{i:04d}.png"), scene.frame(pose(i)))


if __name__ == "__main__":
    main()
