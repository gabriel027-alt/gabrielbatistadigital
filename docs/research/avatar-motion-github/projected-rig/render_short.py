import bpy,json,time
from pathlib import Path
root=Path('/workspace/library-files/tool-runtimes/avatar-motion/projected-rig');scene=bpy.context.scene
scene.eevee.taa_render_samples=8;scene.render.resolution_percentage=100
x0,x1,y0,y1=530,754,194,458;W,H=1280,818
scene.render.use_border=True;scene.render.use_crop_to_border=True
scene.render.border_min_x=x0/W;scene.render.border_max_x=x1/W
scene.render.border_min_y=1-y1/H;scene.render.border_max_y=1-y0/H
out=root/'short-frames';out.mkdir(exist_ok=True);start=time.monotonic()
for frame in range(1,91):
 scene.frame_set(frame);scene.render.filepath=str(out/f'{frame:04}.png');bpy.ops.render.render(write_still=True)
 if frame%15==0:print('SHORT_RENDER_PROGRESS',frame,round(time.monotonic()-start,1),flush=True)
(root/'short-render.json').write_text(json.dumps({'frames':90,'fps':30,'crop':[x0,y0,x1,y1],'fullResolution':[W,H],'elapsed':time.monotonic()-start,'method':'Actual partial 3D shell, independent textured eyeballs and eyelid shape keys; fixed studio compositing'},indent=2))
