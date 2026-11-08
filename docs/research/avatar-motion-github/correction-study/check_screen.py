import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
import cv2,numpy as np,json,mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from scipy.spatial.transform import Rotation
from pathlib import Path
p=Path(__file__).resolve().parent
opts=vision.FaceLandmarkerOptions(base_options=python.BaseOptions(model_asset_path='/workspace/library-files/tool-runtimes/avatar-motion/ComfyUI-LivePortraitKJ/media_pipe/mp_models/face_landmarker_v2_with_blendshapes.task'),num_faces=1,min_face_detection_confidence=.5,min_face_presence_confidence=.5,output_facial_transformation_matrixes=True)
paths=[('reference','/workspace/attachments/6620a7ac-a650-4d04-bfc8-cc847c9f5c2c/desk_jm3.mp4',[820,320,1240,720]),('v1','/workspace/gbd-envio-github/public/videos/editorial/gabriel-avatar-loop-v1.mp4',[530,200,750,440]),('correction',str(p/'screen-proof/gabriel-expression.mp4'),[530,200,750,440])]
result={};arrays={}
with vision.FaceLandmarker.create_from_options(opts) as det:
 for name,path,roi in paths:
  cap=cv2.VideoCapture(path);values=[];lips=[];background=[];first=None
  for i in range(90):
   ok,im=cap.read()
   if not ok:break
   if first is None:first=im.copy()
   if name!='reference':background.append(float(np.abs(im[160:188,620:720].astype(float)-first[160:188,620:720]).mean()))
   if i%3:continue
   x,y,x1,y1=roi;crop=cv2.cvtColor(im[y:y1,x:x1],cv2.COLOR_BGR2RGB);r=det.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(crop)))
   if not r.face_landmarks:continue
   m=r.facial_transformation_matrixes[0][:3,:3];u,_,v=np.linalg.svd(m);values.append(Rotation.from_matrix(u@v).as_euler('xyz',degrees=True))
   lm=np.array([[q.x*(x1-x),q.y*(y1-y)] for q in r.face_landmarks[0]])
   lips.append(float(np.linalg.norm(lm[13]-lm[14])/np.linalg.norm(lm[61]-lm[291])))
  cap.release();arr=np.array(values);arrays[name]=arr
  result[name]={'samples':len(arr),'angle_span':np.ptp(arr,axis=0).tolist(),'lip_opening_ratio_span':float(np.ptp(lips)),'album_mean_difference_max_after_compression':max(background) if background else None}
 for name in ['v1','correction']:
  result[name]['angle_correlation_with_reference']=[float(np.corrcoef(arrays['reference'][:,i],arrays[name][:,i])[0,1]) for i in range(3)]
(p/'screen-proof/independent-check.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
