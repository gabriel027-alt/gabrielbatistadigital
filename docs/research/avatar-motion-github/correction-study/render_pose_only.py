"""Research harness: genuine Kijai LivePortrait models, CPU, expression/eye and seamless-loop research.
Comfy adapters below supply device/file/progress helpers, not model behavior.
No web app or installed ComfyUI instance is required by this harness.
"""
import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
os.environ.setdefault('XDG_CACHE_HOME','/tmp/avatar-cache')
import sys,types,importlib,json,time,subprocess,argparse
from pathlib import Path
import cv2,numpy as np,torch
from safetensors.torch import load_file
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
p=argparse.ArgumentParser();p.add_argument('--frames',type=int,default=90);p.add_argument('--output',required=True);p.add_argument('--expression-gain',type=float,default=.65);p.add_argument('--bf16-decoder',action='store_true');p.add_argument('--loop',action='store_true');a=p.parse_args()
root=Path('/workspace/library-files/tool-runtimes/avatar-motion');repo=root/'ComfyUI-LivePortraitKJ';out=Path(a.output);out.mkdir(parents=True,exist_ok=True)
torch.set_num_threads(4);torch.set_num_interop_threads(1);cv2.setNumThreads(1)
# Only the hosting helpers used by imported model/node code are implemented.
comfy=types.ModuleType('comfy');comfy.__path__=[]
mm=types.ModuleType('comfy.model_management');mm.get_torch_device=lambda:torch.device('cpu');mm.soft_empty_cache=lambda:None;mm.is_device_mps=lambda d:False;mm.should_use_fp16=lambda:False;mm.get_autocast_device=lambda d:torch.device(d).type
utils=types.ModuleType('comfy.utils')
class ProgressBar:
 def __init__(self,total):self.total=total
 def update(self,n=1):pass
utils.ProgressBar=ProgressBar;utils.load_torch_file=lambda path:load_file(path,device='cpu')
utils.common_upscale=lambda x,w,h,method,crop:torch.nn.functional.interpolate(x,size=(h,w),mode='bilinear',align_corners=False)
comfy.model_management=mm;comfy.utils=utils
sys.modules.update({'comfy':comfy,'comfy.model_management':mm,'comfy.utils':utils})
folders=types.ModuleType('folder_paths');folders.models_dir=str(root/'models');sys.modules['folder_paths']=folders
pkg=types.ModuleType('lp_kj');pkg.__path__=[str(repo)];sys.modules['lp_kj']=pkg
nodes=importlib.import_module('lp_kj.nodes')
from lp_kj.liveportrait.utils.crop import crop_image
from lp_kj.liveportrait.utils.camera import get_rotation_matrix
from lp_kj.liveportrait.utils.landmark_runner import LandmarkRunner
from lp_kj.liveportrait.utils.retargeting_utils import calc_eye_close_ratio
from scipy.ndimage import gaussian_filter1d
from scipy.spatial.transform import Rotation
print('Loading actual LivePortrait weights...',flush=True)
pipeline=nodes.DownloadAndLoadLivePortraitModels().loadmodel('fp32','human')[0];wrapper=pipeline.live_portrait_wrapper
wrapper.cfg.flag_lip_zero=False;wrapper.cfg.flag_eye_retargeting=False;wrapper.cfg.flag_lip_retargeting=False
source_path=Path('/workspace/generated_images/exec-11c43e51-0077-477c-9c14-bb754e6ef5c6.png')
driving_path=Path('/workspace/attachments/6620a7ac-a650-4d04-bfc8-cc847c9f5c2c/desk_jm3.mp4')
source=cv2.cvtColor(cv2.imread(str(source_path)),cv2.COLOR_BGR2RGB)
options=vision.FaceLandmarkerOptions(base_options=python.BaseOptions(model_asset_path=str(repo/'media_pipe/mp_models/face_landmarker_v2_with_blendshapes.task'),delegate=python.BaseOptions.Delegate.CPU),num_faces=1,min_face_detection_confidence=.5,min_face_presence_confidence=.5)
def points(detector,image,roi):
 x0,y0,x1,y1=roi;region=np.ascontiguousarray(image[y0:y1,x0:x1]);r=detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB,data=region))
 if not r.face_landmarks:raise RuntimeError('Face detection failed in supplied ROI')
 return np.array([[lm.x*(x1-x0)+x0,lm.y*(y1-y0)+y0]for lm in r.face_landmarks[0]],dtype=np.float32)
cap=cv2.VideoCapture(str(driving_path));fps=cap.get(cv2.CAP_PROP_FPS);ok,first_bgr=cap.read()
if not ok:raise RuntimeError('Cannot read reference video')
first=cv2.cvtColor(first_bgr,cv2.COLOR_BGR2RGB)
with vision.FaceLandmarker.create_from_options(options)as detector:
 s_pts=points(detector,source,[650,245,920,540]);d_pts=points(detector,first,[820,320,1240,720])
s_crop,s_image=crop_image(source,s_pts,dsize=512,scale=2.3,vy_ratio=-.125,rotate=True)
d_crop,d_image=crop_image(first,d_pts,dsize=512,scale=2.3,vy_ratio=-.125,rotate=True)
cv2.imwrite(str(out/'source-model-input.jpg'),cv2.cvtColor(s_image,cv2.COLOR_RGB2BGR))
# Fixed first-frame reference crop retains movement instead of normalizing each frame away.
d_matrix=d_crop['M_o2c'];s_inverse=s_crop['M_c2o']
mask=cv2.imread(str(repo/'liveportrait/utils/resources/mask_template.png'),cv2.IMREAD_COLOR).astype(np.float32)/255
mask=cv2.resize(mask,(512,512));h,w=source.shape[:2]
seg=np.load(root/'rigid-correction/head-mask.npy').astype(np.uint8)*255
mask_full=cv2.GaussianBlur(seg.astype(np.float32)/255,(3,3),.6)[:,:,None]
plate=cv2.inpaint(source,cv2.dilate(seg,np.ones((3,3),np.uint8)),5,cv2.INPAINT_TELEA).astype(np.float32)/255
motion_data=json.loads((root/'rigid-correction/trajectory.json').read_text())
C=np.array(motion_data['mapping']);Ci=np.linalg.inv(C)

source_float=source.astype(np.float32)/255
landmark_runner=LandmarkRunner(ckpt_path=str(root/'models/liveportrait/landmark.onnx'),onnx_provider='CPU')
source_203=landmark_runner.run(source,s_pts)['pts']
source_eye_ratios=calc_eye_close_ratio(source_203[None])
print('Source eye ratios:',source_eye_ratios.tolist(),flush=True)
diagnostic=source.copy()
for point in source_203:cv2.circle(diagnostic,tuple(np.round(point).astype(int)),1,(0,255,0),-1)
cv2.imwrite(str(out/'source-203-landmarks.jpg'),cv2.cvtColor(diagnostic,cv2.COLOR_RGB2BGR))
if a.bf16_decoder:
 class CpuBF16Decoder(torch.nn.Module):
  def __init__(self,inner):super().__init__();self.inner=inner
  def forward(self,feature):
   with torch.autocast(device_type='cpu',dtype=torch.bfloat16):result=self.inner(feature)
   return result.float()
 wrapper.spade_generator=CpuBF16Decoder(wrapper.spade_generator)
writer=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r',str(fps),'-i','pipe:0','-an','-vf','scale=1280:-2,format=yuv420p','-c:v','libx264','-profile:v','baseline','-level','4.1','-crf','18','-preset','fast','-movflags','+faststart',str(out/'gabriel-expression.mp4')],stdin=subprocess.PIPE)
trace=[];start=time.monotonic();cap.set(cv2.CAP_PROP_POS_FRAMES,0)
try:
 with torch.inference_mode():
  s_tensor=wrapper.prepare_source(s_image);s_info=wrapper.get_kp_info(s_tensor);x_s=wrapper.transform_keypoint(s_info);f_s=wrapper.extract_feature_3d(s_tensor)
  r_s=get_rotation_matrix(s_info['pitch'],s_info['yaw'],s_info['roll'])
  # Extract driving motion once so temporal smoothing does not depend on render speed.
  driving=[]
  for i in range(a.frames):
   ok,bgr=cap.read()
   if not ok:break
   rgb=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB);d_rgb=cv2.warpAffine(rgb,d_matrix[:2],(512,512))
   driving.append(wrapper.get_kp_info(wrapper.prepare_source(d_rgb)))
  cap.release()
  angles=np.array([[d[k].item() for k in ['pitch','yaw','roll']] for d in driving])
  smooth_angles=gaussian_filter1d(angles,sigma=.8,axis=0,mode='nearest')
  # Gains calibrated from the independent v1/reference tracking spans; timing remains measured.
  smooth_angles=smooth_angles[0]+(smooth_angles-smooth_angles[0])*np.array([2.14,1.11,1.80])
  expressions=np.stack([d['exp'].cpu().numpy() for d in driving])
  expressions=gaussian_filter1d(expressions,sigma=.65,axis=0,mode='nearest')
  r_0=get_rotation_matrix(*[torch.tensor([[float(v)]])for v in smooth_angles[0]])
  t_0=driving[0]['t'].clone()
  eye_input=torch.tensor([[float(source_eye_ratios[0,0]),float(source_eye_ratios[0,1]),0]],dtype=torch.float32)
  closed_eye_delta=wrapper.retarget_eye(x_s,eye_input).reshape(1,-1,3)
  def smoothstep(v):v=np.clip(v,0,1);return float(v*v*(3-2*v))
  def blink_at(t,center):
   phase=(t-(center-.055))/.23
   if phase<0 or phase>1:return 0.
   return float(np.sin(np.pi*phase)**2)
  first_frame=None
  for i,d_info in enumerate(driving):
   t=i/fps;last=(len(driving)-1)/fps
   envelope=min(smoothstep(t/.4),smoothstep((last-t)/.7)) if a.loop else 1.
   r_d=get_rotation_matrix(*[torch.tensor([[float(v)]])for v in smooth_angles[i]])
   relative=r_d@r_0.transpose(1,2)
   if a.loop:
    rotvec=Rotation.from_matrix(relative[0].numpy().T).as_rotvec()*envelope
    relative=torch.tensor(Rotation.from_rotvec(rotvec).as_matrix().T[None],dtype=torch.float32)
   rotation=relative@r_s
   translation=s_info['t']+envelope*(d_info['t']-t_0);translation=translation.clone();translation[...,2]=0
   delta_expression=torch.from_numpy(expressions[i]-expressions[0])*a.expression_gain*envelope
   expression=s_info['exp']+delta_expression
   x_d=s_info['scale']*(s_info['kp']@rotation+expression)+translation[:,None,:]
   blink=0. # No authored expressions or extra blink timing.
   x_d=x_d+blink*closed_eye_delta
   if i==0:assert torch.max(torch.abs(x_d-x_s)).item()<1e-5,'First pose must equal source pose'
   # No expression-changing learned stitching.
   result=wrapper.warp_decode(f_s,x_s,x_d)['out']
   frame=result[0].permute(1,2,0).cpu().numpy();frame=np.clip(frame,0,1)
   warped=cv2.warpAffine(frame,s_inverse[:2],(w,h))
   A=np.vstack([motion_data['reference_affines'][i],[0,0,1]])
   H=(C@A@Ci)[:2]
   moving_mask=cv2.warpAffine(mask_full[:,:,0],H,(w,h))[:,:,None]
   composed=np.clip((moving_mask*warped+(1-moving_mask)*plate)*255,0,255).astype(np.uint8)
   composed[518:]=source[518:]

   if first_frame is None:first_frame=composed.copy()
   if i==len(driving)-1 and a.loop:loop_seam={'mae_rgb':float(np.abs(composed.astype(float)-first_frame).mean()),'max_error':int(np.abs(composed.astype(int)-first_frame).max())}
   writer.stdin.write(composed.tobytes())
   if i in [0,a.frames//2,a.frames-1,82,84,86,88,218,220,222]:cv2.imwrite(str(out/f'frame-{i:03}.jpg'),cv2.cvtColor(composed,cv2.COLOR_RGB2BGR))
   trace.append({'frame':i,'pitch':d_info['pitch'].item(),'yaw':d_info['yaw'].item(),'roll':d_info['roll'].item(),'blink_weight':blink,'loop_envelope':envelope})
   if i%10==0:print(f'Rendered {i+1}/{a.frames}; {time.monotonic()-start:.1f}s',flush=True)
finally:
 cap.release();writer.stdin.close();code=writer.wait()
 if code:raise RuntimeError(f'ffmpeg failed: {code}')
(out/'expression-trace.json').write_text(json.dumps({'frames':len(trace),'fps':fps,'elapsed_seconds':time.monotonic()-start,'mode':'calibrated relative pose only; segmented foreground, static plate; no expression transfer or stitching','expression_gain':a.expression_gain,'bf16_decoder':a.bf16_decoder,'loop':a.loop,'raw_loop_seam':loop_seam if a.loop else None,'source_eye_ratios':source_eye_ratios.tolist(),'blink_centers_seconds':[2.8,7.3],'blink_duration_seconds':.23,'blink_gain':.9,'input_pose_smoothing_sigma_frames':.8,'expression_smoothing_sigma_frames':.65,'fixed_driving_crop':True,'monitor_occlusion_y':518,'trace':trace},indent=2))
print('Completed genuine model inference:',out,flush=True)
