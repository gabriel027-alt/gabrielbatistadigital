from pathlib import Path
import cv2,numpy as np,subprocess,json
root=Path(__file__).resolve().parent;meta=json.loads((root/'short-render.json').read_text());base=cv2.imread(str(root/'proof-001.png'));x0,y0,x1,y1=meta['crop'];h,w=base.shape[:2]
command=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{w}x{h}','-r','30','-i','pipe:0','-an','-c:v','libx264','-profile:v','baseline','-level','4.1','-crf','17','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',str(root/'gabriel-volume-light-3s.mp4')]
writer=subprocess.Popen(command,stdin=subprocess.PIPE);max_album=0;first=None;rawframes=[]
try:
 for i in range(1,91):
  crop=cv2.imread(str(root/'short-frames'/f'{i:04}.png'));assert crop is not None and crop.shape[:2]==(y1-y0,x1-x0)
  full=base.copy();full[y0:y1,x0:x1]=crop
  if first is None:first=full.copy()
  # Visible upper-right Iron Maiden artwork, outside all head occlusions.
  max_album=max(max_album,int(np.abs(full[166:197,679:726].astype(int)-first[166:197,679:726].astype(int)).max()))
  writer.stdin.write(full.tobytes())
finally:
 writer.stdin.close();assert writer.wait()==0
(root/'composition-verification.json').write_text(json.dumps({'frames':90,'fps':30,'duplicate_frames_intentionally_inserted':False,'raw_album_roi_max_error':max_album,'album_roi_xyxy':[679,166,726,197],'limitations':'ROI check does not certify all background pixels. Actual occlusion by head is allowed. No perfect-motion or likeness claim.'},indent=2))
print('Composed 90 actual rendered frames; album ROI max raw difference:',max_album)
