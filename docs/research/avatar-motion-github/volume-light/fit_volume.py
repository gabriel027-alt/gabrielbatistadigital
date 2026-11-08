import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
import cv2,numpy as np,json,mediapipe as mp
from pathlib import Path
from scipy.interpolate import RBFInterpolator,NearestNDInterpolator
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
p=Path(__file__).parent;old=p.parent/'projected-rig';data=json.loads((old/'rig-input.json').read_text());source_lm=np.array(data['sourceLandmarks']);base=json.loads((p/'base-mesh.json').read_text());im=cv2.imread(str(p/'base-neutral.png'))
opts=vision.FaceLandmarkerOptions(base_options=python.BaseOptions(model_asset_path='/workspace/library-files/tool-runtimes/avatar-motion/ComfyUI-LivePortraitKJ/media_pipe/mp_models/face_landmarker_v2_with_blendshapes.task'),num_faces=1,min_face_detection_confidence=.5,min_face_presence_confidence=.5)
with vision.FaceLandmarker.create_from_options(opts)as det:
 r=det.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB))))
 if not r.face_landmarks:raise RuntimeError('Neutral anatomical base face not detected')
 lm=np.array([[v.x*512,v.y*512,v.z*512]for v in r.face_landmarks[0]])
np.save(p/'base-landmarks.npy',lm)
# Fit frontal feature layout, retain actual anatomical depth/topology of licensed mesh.
verts=np.array(base['verts']);eligible=np.where(verts[:,2]>1.48)[0];original=verts[eligible];base_xy=np.column_stack([original[:,0]*1600+256,(1.64-original[:,2])*1600+256]);warp=RBFInterpolator(lm[:468,:2],source_lm[:468,:2],neighbors=40,smoothing=3,kernel='thin_plate_spline');xy=warp(base_xy)
scale=float(np.linalg.norm(source_lm[263,:2]-source_lm[33,:2])/np.linalg.norm(lm[263,:2]-lm[33,:2])*1600)
# Template skull center, derived from its head bounds, defines the depth origin.
head_region=original[original[:,2]>1.53];depth_center=(head_region[:,1].min()+head_region[:,1].max())/2
z=-(original[:,1]-depth_center)*scale
newpoints=np.column_stack([xy,-z]);idmap={int(v):i for i,v in enumerate(eligible)};faces=[]
for f in base['faces']:
 if all(v in idmap for v in f):faces.append([idmap[v]for v in f])
# Fitted scalp cap: add the approved curl silhouette's height above the anatomical skull.
# This is a textured scalp volume, not reconstructed individual hair strands.
normals=np.zeros_like(original)
for face in faces:
 for j in range(1,len(face)-1):
  idx=[face[0],face[j],face[j+1]];n=np.cross(original[idx[1]]-original[idx[0]],original[idx[2]]-original[idx[0]])
  for k in idx:normals[k]+=n
normals/=np.maximum(np.linalg.norm(normals,axis=1,keepdims=True),1e-12)
t=np.clip((355-xy[:,1])/45,0,1);weight=t*t*(3-2*t);amount=30*weight
xy[:,0]+=amount*normals[:,0];xy[:,1]-=amount*normals[:,2];z-=amount*normals[:,1]
newpoints=np.column_stack([xy,-z])

# Rasterize the front-most anatomical depth for feature/eye attachment coordinates.
H,W=data['height'],data['width'];depth=np.full((H,W),-1e6,dtype=np.float32)
for face in faces:
 for j in range(1,len(face)-1):
  ids=[face[0],face[j],face[j+1]]
  normal=np.cross(original[ids[1]]-original[ids[0]],original[ids[2]]-original[ids[0]])
  if normal[1]>=0:continue
  q=xy[ids];zz=z[ids];lo=np.maximum(np.floor(q.min(axis=0)).astype(int),[0,0]);hi=np.minimum(np.ceil(q.max(axis=0)).astype(int),[W-1,H-1])
  if (hi<lo).any():continue
  xx,yy=np.meshgrid(np.arange(lo[0],hi[0]+1),np.arange(lo[1],hi[1]+1));den=(q[1,1]-q[2,1])*(q[0,0]-q[2,0])+(q[2,0]-q[1,0])*(q[0,1]-q[2,1])
  if abs(den)<1e-8:continue
  a=((q[1,1]-q[2,1])*(xx-q[2,0])+(q[2,0]-q[1,0])*(yy-q[2,1]))/den;b=((q[2,1]-q[0,1])*(xx-q[2,0])+(q[0,0]-q[2,0])*(yy-q[2,1]))/den;c=1-a-b;inside=(a>=-1e-5)&(b>=-1e-5)&(c>=-1e-5);v=a*zz[0]+b*zz[1]+c*zz[2];region=depth[lo[1]:hi[1]+1,lo[0]:hi[0]+1];np.maximum(region,np.where(inside,v,-1e6),out=region)
yy,xx=np.where(depth>-1e5);interp=NearestNDInterpolator(np.column_stack([xx,yy]),depth[yy,xx]);source_lm[:,2]=-interp(source_lm[:,:2])
data['sourceLandmarks']=source_lm.tolist();data['points']=newpoints.tolist();data['triangles']=faces;data['volumeTemplate']='MPFB CC0 native head topology, frontal feature layout fitted to approved image; profile inferred from template, not observed identity.'
data['cameraDistance']=20.;data['depthCenterTemplateY']=float(depth_center)
# Use neck/occipital attachment behind the face; no face-centroid compensation.
pivot_xy=warp(np.array([[256,(1.64-1.55)*1600+256]]))[0];data['pivotPixel']=[float(pivot_xy[0]),float(pivot_xy[1]),0.0]
(p/'rig-input.json').write_text(json.dumps(data))
cv2.imwrite(str(p/'depth-front-preview.png'),np.where(depth>-1e5,np.clip((depth+120)/280*255,0,255),0).astype(np.uint8));np.save(p/'depth-front.npy',depth)
print('Fitted',len(newpoints),'head/neck vertices',len(faces),'native faces; depth range',float(z.min()),float(z.max()),'pivot',data['pivotPixel'])
