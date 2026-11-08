import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
import cv2,numpy as np,mediapipe as mp,json
from pathlib import Path
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
root=Path(__file__).resolve().parent
opts=vision.FaceLandmarkerOptions(base_options=python.BaseOptions(model_asset_path='/workspace/library-files/tool-runtimes/avatar-motion/ComfyUI-LivePortraitKJ/media_pipe/mp_models/face_landmarker_v2_with_blendshapes.task'),num_faces=1,min_face_detection_confidence=.5,min_face_presence_confidence=.5,output_face_blendshapes=True,output_facial_transformation_matrixes=True)
cap=cv2.VideoCapture('/workspace/attachments/6620a7ac-a650-4d04-bfc8-cc847c9f5c2c/desk_jm3.mp4');frames=[];i=0
with vision.FaceLandmarker.create_from_options(opts)as detector:
 while True:
  ok,bgr=cap.read()
  if not ok:break
  crop=cv2.cvtColor(bgr[320:720,820:1240],cv2.COLOR_BGR2RGB);r=detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(crop)))
  if r.face_landmarks:
   frames.append({'frame':i,'time':i/30,'landmarks':[{'x':v.x,'y':v.y,'z':v.z} for v in r.face_landmarks[0]],'blendshapes':{v.category_name:v.score for v in r.face_blendshapes[0]},'head_matrix':r.facial_transformation_matrixes[0].tolist()})
  else:frames.append({'frame':i,'time':i/30,'landmarks':None})
  i+=1
cap.release();(root/'reference-raw-tracking.json').write_text(json.dumps({'fps':30,'imageSize':{'width':420,'height':400},'crop':[820,320,1240,720],'frames':frames}));print('Tracked',sum(v['landmarks'] is not None for v in frames),'of',len(frames))
