const fs=require('fs'),vm=require('vm');
const root=__dirname;
const ctx={console};vm.createContext(ctx);vm.runInContext(fs.readFileSync('/workspace/library-files/tool-runtimes/coordinated-avatar-gaze/node_modules/kalidokit/dist/kalidokit.umd.js','utf8'),ctx);
const K=ctx.Kalidokit;if(!K?.Face?.solve)throw new Error('Missing solver');
const raw=JSON.parse(fs.readFileSync(root+'/reference-raw-tracking.json','utf8'));
const frames=raw.frames.map(f=>{
 if(!f.landmarks)return {frame:f.frame,time:f.time,valid:false};
 const solved=K.Face.solve(f.landmarks.map(v=>({...v})),{runtime:'mediapipe',imageSize:raw.imageSize,smoothBlink:true});
 const eyeChannels=Object.fromEntries(Object.entries(f.blendshapes).filter(([k])=>k.startsWith('eye')));
 const browChannels=Object.fromEntries(Object.entries(f.blendshapes).filter(([k])=>k.startsWith('brow')));
 return {frame:f.frame,time:f.time,valid:true,headMatrix:f.head_matrix,eyes:eyeChannels,brows:browChannels,legacyKalidokit:{head:solved.head,eye:solved.eye,pupil:solved.pupil},mouthPolicy:'Hold the approved avatar neutral mouth; do not zero eye or brow channels.'};
});
const result={source:'desk_jm3.mp4',fps:raw.fps,frames,notes:['MediaPipe Face Landmarker on cropped stylized face; uncalibrated estimates, not ground truth.','Kalidokit 1.1.5 UMD executed only as deprecated comparison solver; not recommended production dependency.','One timeline for head, iris, eyelids and brows. No generated random acting.','This file contains estimated animation controls, not a 3D avatar or final render.']};
fs.writeFileSync(root+'/reference-coordinated-controls.json',JSON.stringify(result,null,2));
const pupils=frames.filter(f=>f.valid).map(f=>f.legacyKalidokit.pupil);
const summary={frames:frames.length,valid:frames.filter(f=>f.valid).length,fps:raw.fps,kalidokitVersion:'1.1.5',pupilXRange:[Math.min(...pupils.map(p=>p.x)),Math.max(...pupils.map(p=>p.x))],pupilYRange:[Math.min(...pupils.map(p=>p.y)),Math.max(...pupils.map(p=>p.y))],eyeChannels:Object.keys(frames.find(f=>f.valid).eyes),rendered:false};
fs.writeFileSync(root+'/control-extraction-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
