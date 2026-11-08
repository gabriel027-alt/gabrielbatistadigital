import json,cv2,numpy as np
from pathlib import Path
from scipy.spatial.transform import Rotation
p=Path(__file__).parent;raw=json.loads(Path('/workspace/library-files/research/coordinated-avatar-gaze/reference-raw-tracking.json').read_text())
ids=[1,4,6,10,33,133,168,197,234,263,362,454,127,356,152,93,323,129,358]
a=raw['frames'][0]['landmarks'];lm0=np.array([[v['x']*420+820,v['y']*400+320,v['z']*420]for v in a]);focal=2050.;camera=np.array([[focal,0,1025],[0,focal,655],[0,0,1.]])
model=lm0[ids].copy();model[:,0]=(model[:,0]-1025)*(focal+model[:,2])/focal;model[:,1]=(model[:,1]-655)*(focal+model[:,2])/focal
rvec=np.zeros((3,1));tvec=np.array([[0.],[0.],[focal]]);poses=[];errors=[]
for frame in raw['frames']:
 pts=np.array([[v['x']*420+820,v['y']*400+320]for v in frame['landmarks']])[ids].astype(float)
 ok,rvec,tvec=cv2.solvePnP(model,pts,camera,None,rvec,tvec,True,cv2.SOLVEPNP_ITERATIVE)
 R,_=cv2.Rodrigues(rvec);projection=cv2.projectPoints(model,rvec,tvec,camera,None)[0][:,0];error=float(np.linalg.norm(projection-pts,axis=1).mean());errors.append(error)
 poses.append({'frame':frame['frame'],'R':R.tolist(),'t':tvec[:,0].tolist(),'error_pixels':error})
angles=np.array([Rotation.from_matrix(v['R']).as_euler('xyz',degrees=True)for v in poses]);A=np.vstack([np.array(v['R'])-np.array(poses[0]['R'])for v in poses]);b=np.concatenate([-(np.array(v['t'])-poses[0]['t'])for v in poses]);pivot=np.linalg.lstsq(A,b,rcond=None)[0]
summary={'angles_range_xyz':np.ptp(angles,axis=0).tolist(),'mean_reprojection_error_pixels':np.mean(errors),'fixed_pivot_object_space':pivot.tolist(),'method':'OpenCV iterative PnP using a fixed initial reference landmark surface; initialized from known first projection. Depth/camera are assumptions, not recovered author camera.'}
(p/'reference-pnp.json').write_text(json.dumps({'summary':summary,'model':model.tolist(),'camera':camera.tolist(),'poses':poses},indent=2));print(json.dumps(summary,indent=2))
