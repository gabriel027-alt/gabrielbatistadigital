"""Precompute the hero points (25/11/2026): where each point of the gathering and of the floating edge belongs, read once
from the silhouette mask, so the browser does not scan the mask on arrival.

Output: public/images/hero/<name>-points.bin
  header: uint32 gatherCount, uint32 emitCount (little endian)
  then gatherCount pairs and emitCount pairs of uint16 (x, y) as fractions of 65535,
  y already flipped for WebGL (0 = bottom), exactly as HeroClouds' plant() used to compute them.
Run: python -I docs/research/hero-relight/hero_points.py
"""
import random, struct, sys
from PIL import Image

COUNTS = {"gabriel-hero-mobile": (6500, 900), "gabriel-hero-wide": (14000, 1900)}

def build(name, gather_n, emit_n):
    im = Image.open(f"public/images/hero/{name}-mask.webp").convert("RGB")
    w, h = im.size
    px = im.load()
    red = lambda x, y: px[min(w - 1, max(0, x)), min(h - 1, max(0, y))][0]
    inside, edge = [], []
    for y in range(h):
        for x in range(w):
            if red(x, y) < 160:
                continue
            inside.append((x, y))
            if red(x, y - 3) < 90 or (y > h * .72 and (red(x - 3, y) < 90 or red(x + 3, y) < 90)):
                edge.append((x, y))
    rnd = random.Random(7)
    def pick(lst):
        x, y = lst[rnd.randrange(len(lst))]
        return (x + rnd.random()) / w, 1 - (y + rnd.random()) / h
    q = lambda v: max(0, min(65535, round(v * 65535)))
    gather = [pick(inside) for _ in range(gather_n)] if inside else []
    emit = [pick(edge) for _ in range(emit_n)] if edge else []
    data = struct.pack("<II", len(gather), len(emit))
    for a, b in gather + emit:
        data += struct.pack("<HH", q(a), q(b))
    out = f"public/images/hero/{name}-points.bin"
    open(out, "wb").write(data)
    print(out, w, h, "inside", len(inside), "edge", len(edge), "bytes", len(data))

for name, (g, e) in COUNTS.items():
    build(name, g, e)
