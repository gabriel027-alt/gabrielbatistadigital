"""Give the approved portrait room around it, without touching the person.

The original has only 13 px between the hair and the top edge, so any crop or zoom cuts the hair.
This adds background on the top, sides and bottom. The original pixels are copied unchanged into the
middle of the new canvas; only the added margin is synthesized, from the background next to it.

Usage (from the repository root):
  python scripts/extend-hero-portrait.py
"""
from pathlib import Path

import cv2
import numpy as np

SOURCE = Path("public/images/hero/gabriel-approved-red.png")
TARGET = Path("public/images/hero/gabriel-approved-red-framed.webp")
TOP, SIDE, BOTTOM = 230, 200, 160   # Added margin, in source pixels.
SCALE = 8                            # The margin is filled at 1/8 resolution, then smoothed: backgrounds here are soft gradients.


def main():
    photo = cv2.imread(str(SOURCE))
    h, w = photo.shape[:2]
    # Below the photo the jacket simply continues: its last rows carried downward and slowly darkened,
    # instead of a flat fill that would end it in a hard line. Mirroring was tried and reflected the collar.
    # Wide horizontal smoothing: a single bright stitch in the last row would otherwise become a stripe.
    raw = photo[h - 1:].astype(np.float32)
    smooth = cv2.GaussianBlur(photo[h - 6:].astype(np.float32).mean(0, keepdims=True), (0, 0), sigmaX=12, sigmaY=.1)
    # Start exactly on the last real row, then ease into the smoothed colour, so there is no step at the seam.
    ease = np.clip(np.arange(BOTTOM) / 45, 0, 1)[:, None, None]
    below = raw * (1 - ease) + smooth * ease
    below = below * np.linspace(1, .8, BOTTOM)[:, None, None]
    below += np.random.default_rng(5).normal(0, 1.8, below.shape[:2])[:, :, None].astype(np.float32) * ease
    tall = np.vstack([photo.astype(np.float32), below])
    # Clip before converting: negative grain would otherwise wrap around to white.
    canvas = cv2.copyMakeBorder(np.clip(tall, 0, 255), TOP, 0, SIDE, SIDE, cv2.BORDER_CONSTANT, value=0).astype(np.uint8)
    hole = np.full(canvas.shape[:2], 255, np.uint8)
    hole[TOP:TOP + h + BOTTOM, SIDE:SIDE + w] = 0

    small = cv2.resize(canvas, None, fx=1 / SCALE, fy=1 / SCALE, interpolation=cv2.INTER_AREA)
    small_hole = cv2.resize(hole, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_NEAREST)
    # Keep a little of the original's edge out of the small hole so the fill starts from real background colours.
    small_hole = cv2.dilate(small_hole, np.ones((2, 2), np.uint8))
    filled = cv2.inpaint(small, small_hole, 6, cv2.INPAINT_TELEA)
    filled = cv2.resize(filled, (canvas.shape[1], canvas.shape[0]), interpolation=cv2.INTER_CUBIC)
    filled = cv2.GaussianBlur(filled, (0, 0), 14)

    # Film grain over the added margin, so it matches the photo's texture.
    rng = np.random.default_rng(3)
    grain = rng.normal(0, 2.2, filled.shape).astype(np.float32)
    margin = (hole > 0).astype(np.float32)
    # Blend over a short band at the photo's edge only on the margin side: the photo itself stays untouched.
    blend = cv2.GaussianBlur(margin, (0, 0), 6)
    blend = np.maximum(blend, margin)[:, :, None]
    result = canvas.astype(np.float32) * (1 - blend) + (filled.astype(np.float32) + grain) * blend
    result[TOP:TOP + h, SIDE:SIDE + w] = photo  # The person is never altered.
    result = np.clip(result, 0, 255).astype(np.uint8)

    cv2.imwrite(str(TARGET), result, [cv2.IMWRITE_WEBP_QUALITY, 92])
    unchanged = np.array_equal(result[TOP:TOP + h, SIDE:SIDE + w], photo)
    print(TARGET, result.shape[1], "x", result.shape[0], "original area unchanged:", unchanged)


if __name__ == "__main__":
    main()
