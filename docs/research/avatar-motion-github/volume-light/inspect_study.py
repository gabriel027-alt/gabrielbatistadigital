import bpy,json,math
from pathlib import Path
p=Path('/workspace/library-files/tool-runtimes/avatar-motion/volume-light');d=json.loads((p/'rig-input.json').read_text());scene=bpy.context.scene;head=bpy.data.objects['Head control: measured pose'];face=bpy.data.objects['Fitted anatomical head: native CC0 topology']
lm=d['sourceLandmarks'];cx=(lm[13][0]+lm[14][0])/2;cy=(lm[13][1]+lm[14][1])/2;width=abs(lm[61][0]-lm[291][0]);mouth=[i for i,v in enumerate(d['points'])if ((v[0]-cx)/(width*.6))**2+((v[1]-cy)/12)**2<1]
keys=face.data.shape_keys.key_blocks;mouth_delta=max((key.data[i].co-keys['Basis'].data[i].co).length for key in keys if key.name!='Basis' for i in mouth)
samples=[]
for frame in range(1,91):
 scene.frame_set(frame);assert max(abs(s-1)for s in head.scale)<1e-6;samples.append({'frame':frame,'location':list(head.location),'rotation':list(head.rotation_quaternion)})
materials=[]
for mat in face.data.materials:
 bsdf=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');materials.append({'name':mat.name,'roughness':bsdf.inputs['Roughness'].default_value,'emission_rgb':list(bsdf.inputs['Emission Color'].default_value)[:3]})
lights=[{'name':o.name,'type':o.data.type,'energy':o.data.energy,'position':list(o.location),'animated':o.animation_data is not None or o.data.animation_data is not None}for o in bpy.data.objects if o.type=='LIGHT']
result={'blender':bpy.app.version_string,'headVertices':len(face.data.vertices),'headPolygons':len(face.data.polygons),'camera':scene.camera.data.type,'nativeRestDepthRange':max(v.co.z for v in face.data.vertices)-min(v.co.z for v in face.data.vertices),'skinMaterials':materials,'fixedLights':lights,'mouthRegionVerticesChecked':len(mouth),'mouthShapeKeyDisplacementMax':mouth_delta,'samples':samples,'note':'Technical checks do not prove likeness, realism or matching original lighting. Profile and albedo are inferred.'}
assert mouth_delta<1e-8;assert all(not v['animated'] for v in lights);assert scene.camera.data.type=='PERSP'
(p/'study-checks.json').write_text(json.dumps(result,indent=2));print('STUDY_CHECKS',len(face.data.vertices),'mouth delta',mouth_delta,'lights',len(lights),'depth',result['nativeRestDepthRange'])
