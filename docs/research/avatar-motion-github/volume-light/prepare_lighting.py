import json,cv2,numpy as np
from pathlib import Path
from scipy.interpolate import LinearNDInterpolator,NearestNDInterpolator
from scipy.ndimage import gaussian_filter1d
from scipy.spatial.transform import Rotation
p=Path(__file__).parent;old=p.parent/'projected-rig';d=json.loads((p/'rig-input.json').read_text());pts=np.array(d['points']);xyz=np.column_stack([pts[:,0],-pts[:,1],-pts[:,2]]);norm=np.zeros_like(xyz)
for face in d['triangles']:
 for j in range(1,len(face)-1):
  ids=[face[0],face[j],face[j+1]];n=np.cross(xyz[ids[1]]-xyz[ids[0]],xyz[ids[2]]-xyz[ids[0]])
  for k in ids:norm[k]+=n
norm/=np.maximum(np.linalg.norm(norm,axis=1,keepdims=True),1e-10)
front=norm[:,2]>.08;H,W=d['height'],d['width'];gridx,gridy=np.meshgrid(np.arange(W),np.arange(H));bbox=(gridx>670)&(gridx<910)&(gridy>260)&(gridy<580);coords=np.column_stack([gridx[bbox],gridy[bbox]]);nmap=np.zeros((H,W,3));nmap[:,:,2]=1;values=LinearNDInterpolator(pts[front,:2],norm[front])(coords);bad=np.isnan(values).any(1);values[bad]=NearestNDInterpolator(pts[front,:2],norm[front])(coords[bad]);values/=np.maximum(np.linalg.norm(values,axis=1,keepdims=True),1e-10);nmap[bbox]=values
src=cv2.imread(str(old/'scene-source.png'))[:,:,::-1]/255.;linear=np.where(src<=.04045,src/12.92,((src+.055)/1.055)**2.4);lm=np.array(d['sourceLandmarks']);mask=np.zeros((H,W),np.uint8);cv2.fillConvexPoly(mask,cv2.convexHull(lm[:468,:2].astype(np.float32)).astype(np.int32),1)
for ids in [[33,133,159,145],[362,263,386,374],[61,291,0,17],[70,63,105,66,107,55,65,52,53,46],[336,296,334,293,300,285,295,282,283,276]]:
 region=np.zeros_like(mask);cv2.fillConvexPoly(region,cv2.convexHull(lm[ids,:2].astype(np.float32)).astype(np.int32),1);region=cv2.dilate(region,np.ones((9,9),np.uint8));mask[region>0]=0
mask=(mask>0)&(src[:,:,0]>.20)&(src[:,:,0]>src[:,:,1]*1.05)&(nmap[:,:,2]>.2)
def basis(n):
 x,y,z=np.moveaxis(n,-1,0);return np.stack([np.ones_like(x),x,y,z,x*y,x*z,y*z,x*x-y*y,3*z*z-1],axis=-1)
B=basis(nmap[mask]);target=linear[mask]/np.maximum(np.median(linear[mask],axis=0),.01);weights=np.ones(len(B));reg=np.diag([.001,.5,.5,.5,2,2,2,2,2])
for _ in range(4):
 coeff=np.linalg.solve(B.T@(weights[:,None]*B)+reg,B.T@(weights[:,None]*target));error=np.linalg.norm(B@coeff-target,axis=1);weights=np.minimum(1,.15/np.maximum(error,1e-6))
shade=np.clip(basis(nmap)@coeff,.35,2.8);alb=linear.copy();alb[bbox]=linear[bbox]/shade[bbox];srgb=np.where(alb<=.0031308,alb*12.92,1.055*np.maximum(alb,0)**(1/2.4)-.055);rgba=cv2.imread(str(old/'head-texture.png'),-1);rgba[:,:,:3]=np.rint(np.clip(srgb[:,:,::-1],0,1)*255).astype(np.uint8)
# Extend only the hidden neck texture below the monitor to support real head/neck motion.
for y in range(518,575):
 half=34+(y-518)*.06;x0,x1=int(784-half),int(784+half);row=510+min(6,int((y-518)/9));rgba[y,x0:x1,:3]=rgba[row,x0:x1,:3];rgba[y,x0:x1,3]=255
cv2.imwrite(str(p/'head-albedo.png'),rgba);cv2.imwrite(str(p/'head-original.png'),cv2.imread(str(old/'head-texture.png'),-1))
for f in ['scene-source.png','background-plate.png']:(p/f).write_bytes((old/f).read_bytes())
# Drive rigid 3D pose/translation jointly from PnP. Do not impose a face centroid in screen space.
pnp=json.loads((p/'reference-pnp.json').read_text());ids=[1,4,6,10,33,133,168,197,234,263,362,454,127,356,152,93,323,129,358];refpivot=np.array(pnp['model'][ids.index(152)])+np.array([0,30,70]);R0=np.array(pnp['poses'][0]['R']);t0=np.array(pnp['poses'][0]['t']);center0=R0@refpivot+t0;D=np.diag([1,-1,-1]);rotvec=np.stack([Rotation.from_matrix(D@(np.array(v['R'])@R0.T)@D).as_rotvec() for v in pnp['poses']]);rotvec=gaussian_filter1d(rotvec,.8,axis=0);rotvec-=rotvec[0]
positions=np.stack([D@(np.array(v['R'])@refpivot+v['t']-center0)*d['motionScale']/100 for v in pnp['poses']]);positions=gaussian_filter1d(positions,.8,axis=0);positions-=positions[0]
for i,f in enumerate(d['frames']):
 f['matrix']=np.eye(4).tolist();r=Rotation.from_rotvec(rotvec[i]).as_matrix()
 for x in range(3):
  for y in range(3):f['matrix'][x][y]=float(r[x,y])
 f['positionDelta']=positions[i].tolist()
(p/'rig-input.json').write_text(json.dumps(d));(p/'lighting-preparation.json').write_text(json.dumps({'skinFitSamples':int(mask.sum()),'shading_coefficients':coeff.tolist(),'method':'Approximate diffuse shading removal using robust second-order spherical-harmonic fit on fitted native head normals; no claim of recovered true albedo or original lights.','pose':'Joint PnP rigid rotation and 3D position, zero-phase sigma .8 frame filtering, without face-centroid constraint.'},indent=2));print('Prepared approximate albedo and joint 3D motion',int(mask.sum()))
