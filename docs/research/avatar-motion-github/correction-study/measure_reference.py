exec(open('/workspace/library-files/tool-runtimes/avatar-motion/rigid-correction/check_motion.py').read().split('paths=')[0])
root=p
cap=cv2.VideoCapture('/workspace/attachments/6620a7ac-a650-4d04-bfc8-cc847c9f5c2c/desk_jm3.mp4');trace=[]
with vision.FaceLandmarker.create_from_options(opts) as det:
 while True:
  ok,im=cap.read()
  if not ok:break
  crop=cv2.cvtColor(im[320:720,820:1240],cv2.COLOR_BGR2RGB);r=det.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(crop)))
  if not r.face_landmarks:raise RuntimeError('Tracking lost')
  m=r.facial_transformation_matrixes[0][:3,:3];u,_,v=np.linalg.svd(m)
  trace.append(Rotation.from_matrix(u@v).as_euler('xyz',degrees=True).tolist())
(root/'reference-euler.json').write_text(json.dumps(trace));print('Reference measured',len(trace))
