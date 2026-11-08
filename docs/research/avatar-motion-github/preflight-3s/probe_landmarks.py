"""CPU landmark preflight only; does not produce an animated avatar."""
import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
os.environ.setdefault('XDG_CACHE_HOME','/tmp/avatar-cache')
import argparse,json,math
from pathlib import Path
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--driving',required=True);p.add_argument('--model',required=True);p.add_argument('--output',required=True);a=p.parse_args()
out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
options=vision.FaceLandmarkerOptions(base_options=python.BaseOptions(model_asset_path=a.model,delegate=python.BaseOptions.Delegate.CPU),running_mode=vision.RunningMode.IMAGE,num_faces=1,min_face_detection_confidence=.5,min_face_presence_confidence=.5,min_tracking_confidence=.5,output_facial_transformation_matrixes=True)
results={'type':'landmark_preflight_only','model':a.model,'mediapipe':mp.__version__,'thresholds':{'detection':.5,'presence':.5,'tracking':.5},'source':{},'driving':{}}
def probe(detector,bgr,roi=None):
 if roi:
  x0,y0,x1,y1=roi;frame=bgr[y0:y1,x0:x1].copy()
 else:frame=bgr.copy()
 rgb=cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
 r=detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=rgb))
 record={'detected':bool(r.face_landmarks),'landmark_count':len(r.face_landmarks[0]) if r.face_landmarks else 0}
 if r.face_landmarks:
  points=r.face_landmarks[0]
  record['bbox_normalized']=[min(l.x for l in points),min(l.y for l in points),max(l.x for l in points),max(l.y for l in points)]
  if r.facial_transformation_matrixes:record['transform']=r.facial_transformation_matrixes[0].tolist()
  for lm in points:
   cv2.circle(frame,(round(lm.x*frame.shape[1]),round(lm.y*frame.shape[0])),1,(0,255,0),-1)
 return record,frame
with vision.FaceLandmarker.create_from_options(options) as detector:
 src=cv2.imread(a.source)
 for label,roi in [('full',None),('head_roi',[650,245,920,540])]:
  record,vis=probe(detector,src,roi);results['source'][label]={'roi':roi,**record};cv2.imwrite(str(out/f'source-{label}-landmarks.jpg'),vis)
 cap=cv2.VideoCapture(a.driving);fps=cap.get(cv2.CAP_PROP_FPS);n=int(round(fps*3));results['driving']['fps']=fps;results['driving']['frames_requested']=n;results['driving']['head_roi']=[820,320,1240,720]
 full=[];cropped=[]
 for i in range(n):
  ok,frame=cap.read()
  if not ok:break
  r,v=probe(detector,frame);full.append({'frame':i,'seconds':i/fps,**r})
  r,v=probe(detector,frame,[820,320,1240,720]);cropped.append({'frame':i,'seconds':i/fps,**r})
  if i in [0,n//2,n-1]:cv2.imwrite(str(out/f'driving-{i:03}-landmarks.jpg'),v)
 cap.release()
 results['driving']['full']={'detected':sum(r['detected'] for r in full),'frames':len(full)}
 results['driving']['cropped']={'detected':sum(r['detected'] for r in cropped),'frames':len(cropped)}
 results['driving']['full_trace']=full;results['driving']['cropped_trace']=cropped
(out/'landmark-results.json').write_text(json.dumps(results,indent=2))
print(json.dumps({'source':{k:{'detected':v['detected'],'landmark_count':v['landmark_count']} for k,v in results['source'].items()},'driving':{k:results['driving'][k] for k in ['full','cropped']},'output':str(out)}))
