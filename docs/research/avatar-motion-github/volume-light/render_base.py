import bpy,math,json
from pathlib import Path
from mathutils import Vector
p=Path(__file__).parent;bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath='/workspace/gbd-envio-github/public/models/aura-character/character.glb')
for o in bpy.data.objects:
 if o.type=='MESH' and o.name not in ['Human','Human.high-poly','Human.mindfront_eyebrows_02','Human.mindfront_eyelashes_02','Human.teeth_base']:o.hide_render=True
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE_NEXT';scene.eevee.taa_render_samples=8;scene.render.resolution_x=512;scene.render.resolution_y=512;scene.render.resolution_percentage=100;scene.render.threads_mode='FIXED';scene.render.threads=4
scene.world=bpy.data.worlds.new('Neutral preview world');scene.world.color=(.3,.3,.3);scene.view_settings.view_transform='Standard';scene.view_settings.look='None'
for loc,power,size in [((-1,-2,3),120,2),((1,-2,2),70,2)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,-.05,1.64))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(0,-3,1.64));cam=bpy.context.object;cam.rotation_euler=(Vector((0,-.05,1.64))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=.32;scene.camera=cam
scene.render.filepath=str(p/'base-neutral.png');bpy.ops.render.render(write_still=True)
obj=bpy.data.objects['Human'];verts=[list(obj.matrix_world@v.co)for v in obj.data.vertices];faces=[list(poly.vertices)for poly in obj.data.polygons]
(p/'base-mesh.json').write_text(json.dumps({'verts':verts,'faces':faces,'cameraWidthMeters':.32,'cameraCenterZ':1.64,'imageSize':512}));print('BASE_EXPORTED',len(verts))
