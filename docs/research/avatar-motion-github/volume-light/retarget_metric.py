import json,numpy as np
from pathlib import Path
from scipy.spatial.transform import Rotation
from scipy.ndimage import gaussian_filter1d
p=Path(__file__).parent;d=json.loads((p/'rig-input.json').read_text());lm=np.array(d['sourceLandmarks']);raw=json.loads(Path('/workspace/library-files/research/coordinated-avatar-gaze/reference-raw-tracking.json').read_text())['frames'];canonical=np.array([[float(v)for v in s.split()[1:]]for s in (p/'canonical_face_model.obj').read_text().splitlines()if s.startswith('v ')])
W,H=d['width'],d['height'];cameraDistance=20.;pivot=np.array([(d['pivotPixel'][0]-W/2)/100,(H/2-d['pivotPixel'][1])/100,0.])
z=-lm[:,2]/100;own=np.column_stack([(lm[:,0]-W/2)/100*(cameraDistance-z)/cameraDistance,(H/2-lm[:,1])/100*(cameraDistance-z)/cameraDistance,z])
ids=[1,4,6,10,33,133,168,197,234,263,362,454,127,356,152,93,323,129,358];X=canonical[ids];Y=own[ids];xc=X.mean(0);yc=Y.mean(0);u,s,vt=np.linalg.svd((Y-yc).T@(X-xc));fix=np.diag([1,1,np.linalg.det(u@vt)]);RA=u@fix@vt;scale=np.trace(np.diag(s)@fix)/np.square(X-xc).sum();origin=yc-scale*RA@xc
matrices=np.array([f['head_matrix']for f in raw]);rotations=[]
for m in matrices:
 u,_,v=np.linalg.svd(m[:3,:3]);rotations.append(u@v)
R0=rotations[0];rv=np.array([Rotation.from_matrix(RA@R0.T@r@RA.T).as_rotvec()for r in rotations]);rv=gaussian_filter1d(rv,.8,axis=0);rv-=rv[0]
translations=gaussian_filter1d(matrices[:,:3,3],.8,axis=0);T0=translations[0]
# Match observed first-frame eye span to the virtual cropped camera; do not claim author intrinsics.
ref=np.array([[v['x']*420+820,v['y']*400+320]for v in raw[0]['landmarks']]);srcSpan=np.linalg.norm(ref[263]-ref[33]);worldEyes=np.array([R0@canonical[i]+T0 for i in [33,263]]);normEyes=worldEyes[:,:2]/(-worldEyes[:,2,None]);virtualFocal=srcSpan/np.linalg.norm(normEyes[1]-normEyes[0]);ownSpan=np.linalg.norm(lm[263,:2]-lm[33,:2]);screenScale=ownSpan/srcSpan
originPx=np.array([origin[0]*cameraDistance/(cameraDistance-origin[2])*100+W/2,H/2-origin[1]*cameraDistance/(cameraDistance-origin[2])*100]);sourceScreen0=T0[:2]/(-T0[2])*virtualFocal;depth0=cameraDistance-origin[2]
for i,f in enumerate(d['frames']):
 R=Rotation.from_rotvec(rv[i]).as_matrix();T=translations[i];sourceScreen=T[:2]/(-T[2])*virtualFocal;offset=(sourceScreen-sourceScreen0)*screenScale;desiredPx=originPx+np.array([offset[0],-offset[1]]);depth=depth0*(-T[2])/(-T0[2]);desired=np.array([(desiredPx[0]-W/2)/100*depth/cameraDistance,(H/2-desiredPx[1])/100*depth/cameraDistance,cameraDistance-depth]);root=desired-R@(origin-pivot)
 m=np.eye(4);m[:3,:3]=R;f['matrix']=m.tolist();f['positionDelta']=(root-pivot).tolist()
d['motionMethod']='Single MediaPipe metric rotation+translation stream, canonical-to-native alignment, observed eye-span framing normalization and fractional depth preservation. Virtual-camera calibration is inferred, not author camera recovery.'
(p/'rig-input.json').write_text(json.dumps(d));(p/'metric-retarget.json').write_text(json.dumps({'canonicalToNativeScale':scale,'canonicalToNativeRotation':RA.tolist(),'nativeCanonicalOrigin':origin.tolist(),'virtualFocalPixels':virtualFocal,'sourceEyeSpanPixels':srcSpan,'ownEyeSpanPixels':ownSpan,'cameraDistance':cameraDistance,'sourceMetricTranslationSpan':np.ptp(translations,axis=0).tolist(),'note':d['motionMethod'],'pnpAuditRejected':'PnP rotation disagreed with reference pitch and was not used for the final acting stream.'},indent=2));print('Metric retarget prepared',virtualFocal,scale)
