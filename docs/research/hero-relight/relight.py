"""Relight the hero portrait like a three-light studio set, without moving a single pixel of the face.

Reference the user sent (15/11/2026): a key spotlight on the model, a red spotlight on the wall behind the head, and a
red light behind the model rimming hair and shoulders. Here, from the existing photo:
  - MODNet (ZHKKKe/MODNet, Apache-2.0, ONNX from Xenova/modnet) cuts the person out, curls included;
  - Depth Anything V2 Small (Apache-2.0, ONNX from onnx-community) gives relative depth, turned into surface normals;
  - the background's off-centre red smudge goes grey, and a red halo is laid centred behind the head;
  - a red rim follows the cut-out's edge where the surface turns away from the camera;
  - a side key light only changes brightness along the normals: shape, features, hair and skin texture stay.
Offline tool; models live in %LOCALAPPDATA%\\relight, outside the repository.

Usage (from the repository root):
  python docs/research/hero-relight/relight.py OUT_DIR
"""
import os
import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parents[3]
WIDE = ROOT / "public/images/hero/gabriel-hero-wide.webp"
MOBILE_X, MOBILE_W = 2476, 1650             # The phone image is this slice of the wide one (template match 0.998).
MODELS = Path(os.environ["LOCALAPPDATA"]) / "relight"
CROP = (2000, 4800)                         # Columns around the person, for the models.

# Light. Directions are camera space: x right, y down, z toward the camera.
KEY = np.float32([-.55, -.35, .76])         # From the viewer's left, a little above.
KEY_STRENGTH = .55
HALO_RGB = np.float32([128, 10, 16])        # Deep red on the wall.
RIM_RGB = np.float32([255, 36, 36])
RIM_STRENGTH = .75
RIM_WIDTH = 9                               # Pixels of erosion: the rim's thickness at full size.


def session(name):
    return ort.InferenceSession(str(MODELS / name), providers=["CPUExecutionProvider"])


def matte(image):
    h, w = image.shape[:2]
    size = (int(round(w * 1024 / h / 32)) * 32, 1024)
    x = cv2.resize(image, size, interpolation=cv2.INTER_AREA)[:, :, ::-1].astype(np.float32) / 255
    x = ((x - .5) / .5).transpose(2, 0, 1)[None]
    alpha = session("modnet.onnx").run(None, {"input": x})[0][0, 0]
    alpha = cv2.resize(alpha, (w, h), interpolation=cv2.INTER_CUBIC)
    # Back at full size, the photo itself guides the edge so single curls keep their outline.
    guide = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    alpha = cv2.ximgproc.guidedFilter(guide, np.clip(alpha, 0, 1).astype(np.float32), 8, 1e-4)
    return np.clip(alpha, 0, 1)


def depth(image):
    h, w = image.shape[:2]
    size = (int(round(w * 518 / h / 14)) * 14, 518)
    x = cv2.resize(image, size, interpolation=cv2.INTER_AREA)[:, :, ::-1].astype(np.float32) / 255
    x = ((x - (.485, .456, .406)) / (.229, .224, .225)).astype(np.float32).transpose(2, 0, 1)[None]
    d = session("depth-anything-v2-small.onnx").run(None, {"pixel_values": x})[0][0]
    return cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)


def normals(d, alpha):
    """Surface normals from relative (inverse) depth: nearer is larger. Smoothed so pores never catch the light."""
    d = (d - d.min()) / (np.ptp(d) + 1e-6)
    d = cv2.GaussianBlur(d, (0, 0), 6)
    scale = d.shape[0] * .35                  # How far the face stands out, in pixels of the photo.
    gx = cv2.Sobel(d, cv2.CV_32F, 1, 0, ksize=5) * scale / 32
    gy = cv2.Sobel(d, cv2.CV_32F, 0, 1, ksize=5) * scale / 32
    n = np.dstack([-gx, -gy, np.ones_like(d)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    return n * alpha[:, :, None] + np.float32([0, 0, 1]) * (1 - alpha[:, :, None])


def relight(intensity=1.0):
    """intensity scales the three lights together (key contrast, halo, rim); 1 is the first preview."""
    wide = cv2.imread(str(WIDE))
    h, w = wide.shape[:2]
    x0, x1 = CROP
    part = wide[:, x0:x1]
    alpha_part = matte(part)
    depth_part = depth(part)
    alpha = np.zeros((h, w), np.float32)
    alpha[:, x0:x1] = alpha_part
    n = np.zeros((h, w, 3), np.float32)
    n[...] = (0, 0, 1)
    n[:, x0:x1] = normals(depth_part, alpha_part)

    img = wide.astype(np.float32)
    rgb = img[:, :, ::-1]

    # Head centre from the cut-out: the top quarter of the person's rows.
    rows = np.flatnonzero(alpha.max(axis=1) > .5)
    top = rows[0]
    band = alpha[top:top + int(h * .28)] > .5
    cols = np.flatnonzero(band.any(axis=0))
    head = ((cols[0] + cols[-1]) / 2, top + h * .16)

    # The old background alone, smooth: the person filled in from around them (at a small size, it is soft anyway).
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    small = cv2.resize(rgb, (w // 8, h // 8), interpolation=cv2.INTER_AREA).astype(np.uint8)
    hole = cv2.dilate((cv2.resize(alpha, (w // 8, h // 8)) > .02).astype(np.uint8), np.ones((9, 9), np.uint8))
    old_bg = cv2.inpaint(small, hole, 15, cv2.INPAINT_TELEA)
    old_bg = cv2.resize(cv2.GaussianBlur(old_bg.astype(np.float32), (0, 0), 6), (w, h), interpolation=cv2.INTER_CUBIC)

    # Background: grey out the old red smudge, darken toward the edges, then the red halo centred behind the head.
    grey = old_bg.mean(axis=2, keepdims=True) * .9
    radius = h * .42
    r = np.hypot((xs - head[0]) / 1.05, ys - head[1]) / radius
    halo = np.clip(np.exp(-r ** 2 * 1.6) * intensity, 0, 1)[:, :, None]
    vignette = np.clip(1 - .55 * (np.hypot((xs - head[0]) / w, (ys - head[1]) / h) * 1.6), .35, 1)[:, :, None]
    background = grey * vignette * (1 - .55 * halo) + HALO_RGB * halo * .95

    # Person: side key light by the normals (brightness only), then the red rim on the turned-away edges.
    lit = np.clip(n @ (KEY / np.linalg.norm(KEY)), 0, 1)
    front = n[..., 2]
    shade = (.62 + .55 * lit) / (.62 + .55 * np.clip(front * KEY[2] / np.linalg.norm(KEY), 0, 1))
    shade = 1 + KEY_STRENGTH * intensity * (np.clip(shade, .55, 1.5) - 1)
    # Side light, not more light: the person's average brightness stays, one side rises and the other falls.
    body = alpha > .9
    shade /= float(np.median(shade[body]))
    a = alpha[:, :, None]
    # Only the background's share of each pixel changes: I + (1 - a)(new - old). Curls and their gaps keep the
    # photo's own pixels; no grey fringe from the old wall is left around the hair.
    out = rgb + (1 - a) * (background - old_bg)
    out = out * (1 + (shade[:, :, None] - 1) * a)                 # Key light on the person only.
    # The red light behind: a thin band inside the outline, strongest where the surface turns away and up top.
    inner = cv2.GaussianBlur(cv2.erode(alpha, np.ones((3, 3), np.uint8), iterations=RIM_WIDTH), (0, 0), RIM_WIDTH * .6)
    edge = np.clip(alpha - inner, 0, 1)
    turned = np.clip(1 - front, 0, 1) ** .5
    rim = (edge * (.3 + .7 * turned) * RIM_STRENGTH * intensity)[:, :, None]
    rim *= np.clip(1.5 - ys / h, 0, 1)[:, :, None]               # Hair and shoulders, fading lower.
    lum = out.mean(axis=2, keepdims=True) / 255
    out = out + RIM_RGB * rim * (.55 + .45 * lum)                 # Added light: brighter strands catch more.
    out = np.clip(out, 0, 255)[:, :, ::-1].astype(np.uint8)
    return wide, out, alpha


if __name__ == "__main__":
    out_dir = Path(sys.argv[1])
    out_dir.mkdir(parents=True, exist_ok=True)
    before, after, alpha = relight(float(sys.argv[2]) if len(sys.argv) > 2 else 1.0)
    cv2.imwrite(str(out_dir / "hero-wide-relit.png"), after)
    cv2.imwrite(str(out_dir / "hero-mobile-relit.png"), after[:, MOBILE_X:MOBILE_X + MOBILE_W])
    cv2.imwrite(str(out_dir / "alpha.png"), (alpha * 255).astype(np.uint8))
    small = lambda im: cv2.resize(im[:, 1900:4900], None, fx=.25, fy=.25, interpolation=cv2.INTER_AREA)
    cv2.imwrite(str(out_dir / "antes-depois.jpg"), np.hstack([small(before), small(after)]), [cv2.IMWRITE_JPEG_QUALITY, 92])
