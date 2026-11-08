import bpy,json,math
from pathlib import Path
root=Path('/workspace/library-files/tool-runtimes/avatar-motion/projected-rig');scene=bpy.context.scene
face=bpy.data.objects['Partial head shell: estimated depth'];keys=face.data.shape_keys.key_blocks
mouth_ids=[0,13,14,17,61,291]
max_mouth=max((keys[k].data[i].co-keys['Basis'].data[i].co).length for k in ['right lid closure','left lid closure','right brow lift','left brow lift']for i in mouth_ids)
assert max_mouth<1e-8
samples=[]
for frame in [1,16,31,46,61,76,90]:
 scene.frame_set(frame);head=bpy.data.objects['Head control: measured pose'];samples.append({'frame':frame,'head_quaternion':list(head.rotation_quaternion),'eyes':{side:list(bpy.data.objects[side+' eye: independent rotation'].rotation_quaternion) for side in ['right','left']},'lid_closure':{side:float(keys[side+' lid closure'].value)for side in ['right','left']}})
assert any(abs(v['eyes']['right'][1])+abs(v['eyes']['right'][2])>1e-4 for v in samples)
assert any(abs(v['eyes']['left'][1])+abs(v['eyes']['left'][2])>1e-4 for v in samples)
result={'blender':bpy.app.version_string,'vertices':len(face.data.vertices),'triangles':len(face.data.polygons),'texture_images_packed':all(i.packed_file is not None for i in bpy.data.images if i.source=='FILE'),'mouth_vertex_displacement_from_eyelid_controls':max_mouth,'actual_3d_eye_objects':True,'full_3d_avatar':False,'samples':samples}
(root/'rig-verification.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
