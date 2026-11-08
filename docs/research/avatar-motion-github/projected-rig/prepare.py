import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
import cv2,numpy as np,json,mediapipe as mp
from scipy.spatial import Delaunay,cKDTree
from scipy.interpolate import LinearNDInterpolator
from pathlib import Path
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
root=Path(__file__).resolve().parent
src=cv2.imread('/workspace/generated_images/exec-11c43e51-0077-477c-9c14-bb754e6ef5c6.png');h,w=src.shape[:2]
mask=np.load(root.parent/'rigid-correction/head-mask.npy').astype(np.uint8)*255
# Fill segmentation pinholes only; preserve external source silhouette.
contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);mask[:]=0;cv2.drawContours(mask,contours,-1,255,-1)
rgba=cv2.cvtColor(src,cv2.COLOR_BGR2BGRA);rgba[:,:,3]=mask;cv2.imwrite(str(root/'head-texture.png'),rgba)
cv2.imwrite(str(root/'scene-source.png'),src)
plate=cv2.inpaint(src,cv2.dilate(mask,np.ones((3,3),np.uint8)),5,cv2.INPAINT_TELEA);cv2.imwrite(str(root/'background-plate.png'),plate)
opts=vision.FaceLandmarkerOptions(base_options=python.BaseOptions(model_asset_path='/workspace/library-files/tool-runtimes/avatar-motion/ComfyUI-LivePortraitKJ/media_pipe/mp_models/face_landmarker_v2_with_blendshapes.task'),num_faces=1,min_face_detection_confidence=.5,min_face_presence_confidence=.5)
with vision.FaceLandmarker.create_from_options(opts)as det:
 crop=cv2.cvtColor(src[245:540,650:920],cv2.COLOR_BGR2RGB);r=det.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(crop)));lm=np.array([[p.x*270+650,p.y*295+245,p.z*270] for p in r.face_landmarks[0]])
np.save(root/'source-landmarks.npy',lm)
# Texture-projected partial shell: real landmark depth in face; estimated continuation at hair/ears.
xy=lm[:468,:2];grid=np.array([[x,y] for y in range(272,519,5) for x in range(688,879,5) if mask[y,x]>0],float)
near=cKDTree(xy).query(grid)[1];z=LinearNDInterpolator(xy,lm[:468,2])(grid);z=np.where(np.isnan(z),lm[near,2],z)
allpoints=np.vstack([lm[:468],np.column_stack([grid,z])]);allpoints=allpoints[np.unique(np.round(allpoints[:,:2],2),axis=0,return_index=True)[1]]
# Keep stable landmark indices first to allow eyelid controls.
keep=np.ones(len(grid),bool)
for i,p in enumerate(grid):
 if cKDTree(xy).query(p)[0]<1.5:keep[i]=False
allpoints=np.vstack([lm[:468],np.column_stack([grid[keep],z[keep]])])
eyes={'right':[33,246,161,160,159,158,157,173,133,155,154,153,145,144,163,7], 'left':[362,398,384,385,386,387,388,466,263,249,390,373,374,380,381,382]}
tris=[]
for tri in Delaunay(allpoints[:,:2]).simplices:
 center=allpoints[tri,:2].mean(axis=0);x,y=np.rint(center).astype(int)
 # Alpha texture clips the silhouette; do not discard boundary triangles by centroid.
 if any(cv2.pointPolygonTest(lm[ids,:2].astype(np.float32),tuple(center),False)>=0 for ids in eyes.values()):continue
 tris.append(tri.tolist())
ref=json.loads(Path('/workspace/library-files/research/coordinated-avatar-gaze/reference-raw-tracking.json').read_text())
frames=[]
ref0=np.array([[v['x']*420+820,v['y']*400+320]for v in ref['frames'][0]['landmarks']]);motion_scale=float(np.linalg.norm(lm[263,:2]-lm[33,:2])/np.linalg.norm(ref0[263]-ref0[33]))
for f in ref['frames']:
 points=np.array([[v['x']*420+820,v['y']*400+320]for v in f['landmarks']]);info={}
 for side,ids in eyes.items():
  a,b=points[ids[0]],points[ids[8]];unit=(b-a)/np.linalg.norm(b-a);normal=np.array([-unit[1],unit[0]]);center=(a+b)/2;iris=points[468 if side=='right' else 473];off=iris-center
  upper,lower=(159,145)if side=='right'else(386,374)
  brow_ids=[70,63,105,66,107]if side=='right'else[336,296,334,293,300]
  brow=float(((points[brow_ids].mean(axis=0)-center)@normal)/np.linalg.norm(b-a))
  info[side]={'brow':brow,'iris':((np.array([off@unit,off@normal]))/np.linalg.norm(b-a)).tolist(),'open':float(np.linalg.norm(points[upper]-points[lower])/np.linalg.norm(b-a))}
 frames.append({'frame':f['frame'],'time':f['time'],'matrix':f['head_matrix'],'eyes':info,'center':points[[1,4,6,33,133,168,263,362]].mean(axis=0).tolist()})
result={'motionScale':motion_scale,'width':w,'height':h,'points':allpoints.tolist(),'triangles':tris,'sourceLandmarks':lm.tolist(),'eyeContours':eyes,'frames':frames,'fps':30,'note':'Partial projected rig. Facial depth estimated by MediaPipe; hair/ears depth extrapolated; no recovered full 3D identity.'}
(root/'rig-input.json').write_text(json.dumps(result))
print('Prepared',len(allpoints),'vertices',len(tris),'triangles',len(frames),'motion frames')
