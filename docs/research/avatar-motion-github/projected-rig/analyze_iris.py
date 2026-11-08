import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
import cv2,numpy as np,mediapipe as mp,json
from pathlib import Path
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
root=Path(__file__).resolve().parent
model='/workspace/library-files/tool-runtimes/avatar-motion/ComfyUI-LivePortraitKJ/media_pipe/mp_models/face_landmarker_v2_with_blendshapes.task'
opts=vision.FaceLandmarkerOptions(base_options=python.BaseOptions(model_asset_path=model),num_faces=1,min_face_detection_confidence=.5,min_face_presence_confidence=.5,output_face_blendshapes=True,output_facial_transformation_matrixes=True)
sources=[('reference','/workspace/attachments/6620a7ac-a650-4d04-bfc8-cc847c9f5c2c/desk_jm3.mp4',[820,320,1240,720]),('candidate','/workspace/library-files/tool-runtimes/avatar-motion/projected-rig/gabriel-partial-rig-3s.mp4',[530,200,750,440])]
summary={};sheets=[]
with vision.FaceLandmarker.create_from_options(opts)as det:
 for label,path,roi in sources:
  cap=cv2.VideoCapture(path);idx=0;trace=[];cells=[]
  while True:
   ok,frame=cap.read()
   if not ok or idx>=90:break
   if idx%3:idx+=1;continue
   x,y,x1,y1=roi;crop=frame[y:y1,x:x1];r=det.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(cv2.cvtColor(crop,cv2.COLOR_BGR2RGB))))
   if not r.face_landmarks:idx+=1;continue
   lm=np.array([[v.x*crop.shape[1],v.y*crop.shape[0]] for v in r.face_landmarks[0]])
   eyes={}
   for side,corners,iris,lids in [('right',[33,133],468,[159,145]),('left',[362,263],473,[386,374])]:
    p0,p1=lm[corners];axis=p1-p0;width=float(np.linalg.norm(axis));u=axis/width;v=np.array([-u[1],u[0]]);center=(p0+p1)/2;offset=lm[iris]-center
    eyes[side]={'iris_relative_xy':(np.array([offset@u,offset@v])/width).tolist(),'eyelid_gap_relative':float(np.linalg.norm(lm[lids[0]]-lm[lids[1]])/width),'eye_width_original_pixels':width}
   blend={x.category_name:float(x.score) for x in r.face_blendshapes[0] if x.category_name.startswith(('eye','brow'))}
   trace.append({'frame':idx,'time':idx/30,'eyes':eyes,'blendshapes':blend})
   if idx in [0,15,30,45,60,75]:
    eye_points=lm[[33,133,362,263,159,145,386,374]];lo=np.floor(eye_points.min(axis=0)-[8,8]).astype(int);hi=np.ceil(eye_points.max(axis=0)+[8,8]).astype(int);lo=np.maximum(lo,0);hi=np.minimum(hi,[crop.shape[1],crop.shape[0]])
    band=crop[lo[1]:hi[1],lo[0]:hi[0]].copy()
    for k in [468,473]:cv2.circle(band,tuple(np.round(lm[k]-lo).astype(int)),2,(0,0,255),1)
    band=cv2.resize(band,(260,90),interpolation=cv2.INTER_NEAREST);cell=np.zeros((115,260,3),np.uint8);cell[25:]=band;cv2.putText(cell,f'{label} t={idx/30:.1f}s',(5,17),cv2.FONT_HERSHEY_SIMPLEX,.45,(255,255,255),1);cells.append(cell)
   idx+=1
  cap.release();(root/f'{label}-iris-trace.json').write_text(json.dumps(trace,indent=2))
  stats={}
  for side in ['left','right']:
   values=np.array([f['eyes'][side]['iris_relative_xy']for f in trace]);width=np.array([f['eyes'][side]['eye_width_original_pixels']for f in trace]);stats[side]={'p05_p95_relative_position':np.percentile(values,[5,95],axis=0).tolist(),'eye_width_pixels_median':float(np.median(width))}
  summary[label]={'samples':len(trace),'detected_iris_count':len(lm)-468,'stats':stats}
  sheets.append(np.hstack(cells))
cv2.imwrite(str(root/'iris-comparison.jpg'),np.vstack(sheets));(root/'iris-summary.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2))
