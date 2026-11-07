import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

export async function recordLocalPage(page, destination, action, { width = 960, height = 600 } = {}) {
  if (!['localhost', '127.0.0.1'].includes(new URL(page.url()).hostname)) throw new Error('Local page required');
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', frame => {
    frames.push({ data: Buffer.from(frame.data, 'base64'), time: frame.metadata.timestamp });
    void cdp.send('Page.screencastFrameAck', { sessionId: frame.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: 1280, maxHeight: 800, everyNthFrame: 1 });
  try { await action(); } finally { await cdp.send('Page.stopScreencast'); await cdp.detach(); }
  if (frames.length < 10) throw new Error('Insufficient rendered frames');
  const temp = await mkdtemp('/tmp/brand-film-');
  const list = [];
  for (let i = 0; i < frames.length; i++) {
    const file = `frame-${String(i).padStart(5, '0')}.jpg`;
    await writeFile(path.join(temp, file), frames[i].data);
    list.push(`file '${file}'`, `duration ${i + 1 < frames.length ? Math.max(.001, frames[i + 1].time - frames[i].time) : 1}`);
  }
  list.push(`file 'frame-${String(frames.length - 1).padStart(5, '0')}.jpg'`);
  const source = path.join(temp, 'frames.txt');
  await writeFile(source, list.join('\n') + '\n');
  await mkdir(path.dirname(destination), { recursive: true });
  const result = spawnSync('/usr/bin/ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', source, '-an', '-vf', `fps=30,scale=${width}:${height}:in_range=full:out_range=tv,format=yuv420p`, '-c:v', 'libx264', '-profile:v', 'baseline', '-level:v', width > 960 ? '4.0' : '3.1', '-preset', 'fast', '-crf', '23', '-color_range', 'tv', '-movflags', '+faststart', destination], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
}
