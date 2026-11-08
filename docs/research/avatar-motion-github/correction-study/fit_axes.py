exec(open('/workspace/library-files/tool-runtimes/avatar-motion/rigid-correction/check_motion.py').read().split('paths=')[0])
angles=[]
with vision.FaceLandmarker.create_from_options(opts) as det:
 for i in range(7):
  im=cv2.imread(str(p/f'calibration/frame-{i:03}.jpg'));crop=cv2.cvtColor(im[245:540,650:920],cv2.COLOR_BGR2RGB)
  r=det.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=np.ascontiguousarray(crop)))
  m=r.facial_transformation_matrixes[0][:3,:3];u,_,v=np.linalg.svd(m);angles.append(Rotation.from_matrix(u@v).as_euler('xyz',degrees=True))
angles=np.array(angles);J=np.stack([(angles[1]-angles[2])/10,(angles[3]-angles[4])/10,(angles[5]-angles[6])/10],axis=1)
print(J);print('condition number',np.linalg.cond(J))
(p/'axis-calibration.json').write_text(json.dumps({'observed_angles':angles.tolist(),'jacobian':J.tolist(),'inverse':np.linalg.inv(J).tolist(),'method':'Finite difference of independent MediaPipe output angles for +/-5 degree LivePortrait controls; approximate local calibration, not native rig recovery.'},indent=2))
s=(p/'render_pose_only.py').read_text()
s=s.replace("smooth_angles=smooth_angles[0]+(smooth_angles-smooth_angles[0])*np.array([2.14,1.11,1.80])", "measured=np.array(json.loads((root/'rigid-correction/reference-euler.json').read_text()))[:len(driving)]\n  inverse=np.array(json.loads((root/'rigid-correction/axis-calibration.json').read_text())['inverse'])\n  smooth_angles=smooth_angles[0]+(measured-measured[0])@inverse.T")
s=s.replace("if i in [0,a.frames//2,a.frames-1,82,84,86,88,218,220,222]:", "if i in [0,15,30,45,60,75,a.frames-1]:")
(p/'render_calibrated.py').write_text(s)
