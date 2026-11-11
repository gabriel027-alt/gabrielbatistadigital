"""Original instrumental for the footer's optional sound, generated from scratch: no samples, no third-party material.

It lasts exactly two video cycles and its kick lands when the head reaches the bottom of each nod, so the
character moves with it. Every note is written circularly into the buffer, so the loop has no seam.

Usage: python make_groove.py motion-channels.json OUTPUT.m4a
"""
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

RATE = 44100
BEATS_PER_CYCLE = 17  # Strongest nod frequency: 1.53 Hz over an 11.13 s cycle.
RNG = np.random.default_rng(27)


def place(buffer, sound, seconds, gain=1.0):
    start = int(round(seconds * RATE))
    index = (start + np.arange(len(sound))) % len(buffer)
    np.add.at(buffer, index, sound * gain)


def kick():
    t = np.arange(int(.32 * RATE)) / RATE
    pitch = 46 + 115 * np.exp(-t * 34)
    body = np.sin(2 * np.pi * np.cumsum(pitch) / RATE) * np.exp(-t * 11)
    click = np.exp(-t * 900) * .5
    return np.tanh((body + click) * 1.6)


def snare():
    t = np.arange(int(.24 * RATE)) / RATE
    noise = RNG.normal(0, 1, len(t))
    noise = noise - np.r_[0, noise[:-1]] * .75
    return np.tanh((noise * np.exp(-t * 20) * .6 + np.sin(2 * np.pi * 186 * t) * np.exp(-t * 28)) * 1.5)


def hat(length=.05):
    t = np.arange(int(length * RATE)) / RATE
    noise = RNG.normal(0, 1, len(t))
    return np.diff(noise, 1, prepend=0) * np.exp(-t * (5 / length)) * .5


def bass(freq, seconds):
    t = np.arange(int(seconds * RATE)) / RATE
    envelope = np.minimum(t / .006, 1) * np.exp(-t * 2.6)
    return np.tanh((np.sin(2 * np.pi * freq * t) + .35 * np.sin(4 * np.pi * freq * t)) * 1.4) * envelope


def plucked(freq, seconds, damping):
    """Karplus-Strong string."""
    period = max(int(RATE / freq), 2)
    line = RNG.uniform(-1, 1, period)
    out = np.zeros(int(seconds * RATE))
    for i in range(len(out)):
        j = i % period
        out[i] = line[j]
        line[j] = damping * .5 * (line[j] + line[(j + 1) % period])
    return out


def chord(root, seconds, muted):
    """Power chord through a drive stage. Muted notes are shorter and darker."""
    damping = .93 if muted else .992
    voices = sum(plucked(root * ratio, seconds, damping) for ratio in (1, 1.498, 2))
    driven = np.tanh(voices * 4.5)
    # One-pole tone control takes the fizz off the drive.
    smooth = np.zeros_like(driven)
    state = 0.0
    for i, sample in enumerate(driven):
        state += .22 * (sample - state)
        smooth[i] = state
    t = np.arange(len(smooth)) / RATE
    return smooth * np.minimum(t / .003, 1) * np.minimum((seconds - t) / .012, 1).clip(0, 1)


def main():
    motion = json.loads(Path(sys.argv[1]).read_text())
    target = sys.argv[2]
    y = np.array(motion["y_px"])
    cycle_seconds = motion["cycle_frames"] / 30
    length = int(round(cycle_seconds * 2 * RATE))
    total_beats = BEATS_PER_CYCLE * 2
    beat = cycle_seconds / BEATS_PER_CYCLE
    # Phase of the nod: where the head is lowest on the beat grid.
    time = np.arange(len(y)) / len(y)
    component = np.sum((y - y.mean()) * np.exp(-2j * np.pi * BEATS_PER_CYCLE * time))
    peak_share = np.abs(component) / np.sum(np.abs(np.fft.rfft(y - y.mean())))
    first_downbeat = ((-np.angle(component) / (2 * np.pi)) % 1) * beat * -1 % beat
    # Sign check: evaluate the fitted wave at the chosen instant, it must be at its maximum.
    fitted = np.real(component * np.exp(2j * np.pi * BEATS_PER_CYCLE * first_downbeat / cycle_seconds))
    best = max(np.linspace(0, beat, 64, endpoint=False), key=lambda t: np.real(component * np.exp(2j * np.pi * BEATS_PER_CYCLE * t / cycle_seconds)))
    first_downbeat = float(best)
    print("beat %.4f s (%.1f BPM), nod share of motion %.2f, first kick at %.3f s" % (beat, 60 / beat, peak_share, first_downbeat), "fit", round(float(fitted), 1))

    drums, low, guitar = (np.zeros(length) for _ in range(3))
    kick_sound, snare_sound = kick(), snare()
    # Roots for the riff, one per bar: an original figure around D.
    roots = [73.42, 73.42, 87.31, 65.41]
    sixteenth = beat / 4
    # Palm-muted figure, by sixteenth, across one bar: 1 = muted hit, 2 = open accent.
    figure = [1, 0, 1, 1, 0, 1, 0, 0, 2, 0, 0, 1, 0, 1, 1, 0]

    for b in range(total_beats):
        at = first_downbeat + b * beat
        bar, in_bar = b // 4, b % 4
        fill = b >= total_beats - 2  # 34 beats: the last two are a turnaround back to the top.
        if in_bar in (0,) or (in_bar == 2 and bar % 2 == 1):
            place(drums, kick_sound, at, .95)
        if in_bar == 2 and bar % 2 == 0:
            place(drums, kick_sound, at + beat / 2, .75)
        if in_bar in (1, 3):
            place(drums, snare_sound, at, .72)
        for step in range(2):
            place(drums, hat(.07 if step else .04), at + step * beat / 2, .17 if step else .24)
        if fill:
            for step in range(4):
                place(drums, snare_sound, at + step * sixteenth, .3 + .12 * step)

    chords = {}
    for b in range(0, total_beats - (total_beats % 4), 4):
        bar = b // 4
        root = roots[bar % len(roots)]
        for step, kind in enumerate(figure):
            if not kind:
                continue
            at = first_downbeat + b * beat + step * sixteenth
            muted = kind == 1
            key = (root, muted)
            chords.setdefault(key, chord(root, sixteenth * (.95 if muted else 3.4), muted))
            place(guitar, chords[key], at, .34 if muted else .5)
            if step % 8 == 0:
                place(low, bass(root / 2 if root > 70 else root, beat * 1.3), at, .62)
    # Turnaround: a single sustained chord.
    end_root = roots[0]
    place(guitar, chord(end_root * 1.335, beat * 1.9, False), first_downbeat + (total_beats - 2) * beat, .46)

    left = drums + low + guitar * .96
    right = drums + low + guitar * .84 + np.roll(guitar, int(.011 * RATE)) * .12
    mix = np.stack([left, right], 1)
    mix = np.tanh(mix * .9)
    mix *= .71 / np.abs(mix).max()  # Peak at -3 dBFS.
    rms = float(np.sqrt((mix ** 2).mean()))
    seam = float(np.abs(mix[0] - mix[-1]).max())
    print("seconds %.3f peak %.3f rms dBFS %.1f seam step %.4f" % (length / RATE, np.abs(mix).max(), 20 * np.log10(rms), seam))

    with tempfile.TemporaryDirectory() as folder:
        raw = Path(folder) / "groove.wav"
        with wave.open(str(raw), "wb") as handle:
            handle.setnchannels(2)
            handle.setsampwidth(2)
            handle.setframerate(RATE)
            handle.writeframes((mix * 32767).astype(np.int16).tobytes())
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", target], check=True)


if __name__ == "__main__":
    main()
