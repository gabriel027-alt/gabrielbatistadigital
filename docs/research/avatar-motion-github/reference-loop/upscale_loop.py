"""Upscale the rendered footer frames like the approved portrait: 65% Real-ESRGAN x4 + 35% the original enlarged.

Offline tool; Real-ESRGAN ncnn-vulkan (BSD-3) lives outside the repository, in %LOCALAPPDATA%\\realesrgan.
One frame at a time, so the 4x intermediates (about 30 MB each) never pile up on disk.

Usage:
  python upscale_loop.py FRAMES_DIR OUT_DIR [WxH]    (writes OUT_DIR/blend/NNNN.png, 2560 x 1636 by default)
"""
import os
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np

SIZE = tuple(map(int, sys.argv[3].split("x"))) if len(sys.argv) > 3 else (2560, 1636)
TOOL = Path(os.environ["LOCALAPPDATA"]) / "realesrgan"

frames, out = Path(sys.argv[1]), Path(sys.argv[2])
blend = out / "blend"
blend.mkdir(parents=True, exist_ok=True)
temp = out / "x4.png"
for source in sorted(frames.glob("*.png")):
    target = blend / source.name
    if target.exists():
        continue
    subprocess.run([str(TOOL / "realesrgan-ncnn-vulkan.exe"), "-i", str(source), "-o", str(temp), "-n", "realesrgan-x4plus",
                    "-m", str(TOOL / "models")], check=True, capture_output=True)
    ai = cv2.resize(cv2.imread(str(temp)), SIZE, interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
    original = cv2.resize(cv2.imread(str(source)), SIZE, interpolation=cv2.INTER_CUBIC).astype(np.float32)
    cv2.imwrite(str(target), np.clip(ai * .65 + original * .35, 0, 255).astype(np.uint8))
    print(source.name, flush=True)
temp.unlink(missing_ok=True)
