"""Silhouette masks of the hero portrait, so the block trail (components/HeroBlocks.tsx) stays behind Gabriel.

Only a mask is made: the photo itself is not touched. MODNet (ZHKKKe/MODNet, Apache-2.0, ONNX from Xenova/modnet) cuts the
person out; the result is saved small and grey (white = person), softened and grown a little so blocks never touch the hair.

Usage (from the repository root):
  python docs/research/hero-relight/person_mask.py
"""
from pathlib import Path

import cv2
import numpy as np

import relight

ROOT = Path(__file__).resolve().parents[3]
HERO = ROOT / "public/images/hero"
WIDTH = {"gabriel-hero-wide": 1320, "gabriel-hero-mobile": 412}   # A fifth of the photo is plenty for a soft mask.

for name, width in WIDTH.items():
    image = cv2.imread(str(HERO / f"{name}.webp"))
    h, w = image.shape[:2]
    # The wide photo is mostly wall: the model looks at the columns around the person, as in relight.py.
    x0, x1 = (relight.CROP if name.endswith("wide") else (0, w))
    alpha = np.zeros((h, w), np.float32)
    alpha[:, x0:x1] = relight.matte(image[:, x0:x1])
    size = (width, round(h * width / w))
    small = cv2.resize(alpha, size, interpolation=cv2.INTER_AREA)
    # No margin: anything drawn behind him must meet his own outline, or the wall shows as a contour around him.
    small = cv2.GaussianBlur(small, (0, 0), 1.0)
    # Green: a wide soft glow around the silhouette, where the block field gathers around him.
    halo = np.clip(cv2.GaussianBlur(small, (0, 0), max(size) * .045) * 1.8, 0, 1)
    out = HERO / f"{name}-mask.webp"
    # Red = person, green = halo (OpenCV writes BGR).
    mask = np.dstack([np.zeros_like(small), halo, np.clip(small, 0, 1)])
    cv2.imwrite(str(out), (mask * 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 85])
    print(out.name, size, out.stat().st_size, "bytes")
    # The wall behind him, rebuilt from the wall around him: what shows through where his face breaks into dust.
    # Filled in small (the wall is soft light anyway), then brought back to the mask's size and smoothed.
    tiny = (max(8, w // 16), max(8, h // 16))
    hole = cv2.dilate((cv2.resize(alpha, tiny, interpolation=cv2.INTER_AREA) > .02).astype(np.uint8), np.ones((5, 5), np.uint8))
    wall = cv2.inpaint(cv2.resize(image, tiny, interpolation=cv2.INTER_AREA), hole, 9, cv2.INPAINT_TELEA)
    wall = cv2.GaussianBlur(cv2.resize(wall, size, interpolation=cv2.INTER_CUBIC).astype(np.float32), (0, 0), max(size) * .012)
    plate = HERO / f"{name}-wall.webp"
    cv2.imwrite(str(plate), np.clip(wall, 0, 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 82])
    print(plate.name, size, plate.stat().st_size, "bytes")
