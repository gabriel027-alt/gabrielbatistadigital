import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test("Each complete film has a matching manifest, captions and CTA chapters", async () => {
  for (const brand of ["aura", "orla"]) {
    const manifest = JSON.parse(readFileSync(`public/videos/projects/${brand}-showcase.json`, "utf8"));
    const bytes = readFileSync(`public/videos/projects/${brand}-showcase.mp4`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(manifest.sha256);
    expect(bytes.length).toBe(manifest.bytes);
    expect(manifest.localInteractionsOnly).toBe(true);
    expect(manifest.chapters.map((chapter: {label: string}) => chapter.label)).toEqual(expect.arrayContaining(["Experiência pelo scroll", "CTA e escolhas", "Resumo revisável"]));
    for (const chapter of manifest.chapters) expect(chapter.seconds).toBeLessThan(manifest.durationSeconds);
    expect(readFileSync(`public/videos/projects/${brand}-showcase.pt.vtt`, "utf8")).toContain("Resumo revisável");
  }
});
