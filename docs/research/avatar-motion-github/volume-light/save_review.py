import bpy
from pathlib import Path
p=Path('/workspace/library-files/tool-runtimes/avatar-motion/volume-light');s=bpy.context.scene;s.frame_set(1);s.eevee.taa_render_samples=32;s.render.use_border=False;s.render.use_crop_to_border=False
for screen in bpy.data.screens:
 for area in screen.areas:
  if area.type=='VIEW_3D':
   area.spaces.active.region_3d.view_perspective='CAMERA';area.spaces.active.overlay.show_overlays=False
bpy.ops.wm.save_as_mainfile(filepath=str(p/'gabriel-volume-light.blend'),compress=True)
