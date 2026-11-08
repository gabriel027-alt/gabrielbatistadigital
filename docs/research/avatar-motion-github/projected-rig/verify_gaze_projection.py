import bpy,json,math
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
root=Path('/workspace/library-files/tool-runtimes/avatar-motion/projected-rig');data=json.loads((root/'rig-input.json').read_text());scene=bpy.context.scene;face=bpy.data.objects['Partial head shell: estimated depth'];lm=data['sourceLandmarks'];result=[]
def project(p):
 q=world_to_camera_view(scene,scene.camera,p);return Vector((q.x*1280,(1-q.y)*818))
def normalized(iris,a,b):
 u=(b-a).normalized();v=Vector((-u.y,u.x));d=iris-(a+b)/2;return Vector((d.dot(u),d.dot(v)))/(b-a).length
for index in range(90):
 scene.frame_set(index+1);bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get();evaluated=face.evaluated_get(deps);mesh=evaluated.to_mesh();entry={'frame':index,'eyes':{}}
 for side,ids in data['eyeContours'].items():
  ctrl=bpy.data.objects[side+' eye: independent rotation'];a0,b0=Vector(lm[ids[0]][:2]),Vector(lm[ids[8]][:2]);ic=Vector(lm[468 if side=='right'else 473][:2]);center=(a0+b0)/2;width=(b0-a0).length;radius=width*.52/100;px=(ic.x-center.x)/100;py=(center.y-ic.y)/100;point=Vector((px,py,math.sqrt(max(0,radius*radius-px*px-py*py))))
  iris=project(ctrl.matrix_world@point);a=project(evaluated.matrix_world@mesh.vertices[ids[0]].co);b=project(evaluated.matrix_world@mesh.vertices[ids[8]].co);actual=normalized(iris,a,b)
  baseline=normalized(ic,a0,b0);now=Vector(data['frames'][index]['eyes'][side]['iris']);initial=Vector(data['frames'][0]['eyes'][side]['iris']);expected=baseline+now-initial;error=(actual-expected).length*(b-a).length
  entry['eyes'][side]={'actual_relative_xy':list(actual),'target_relative_xy':list(expected),'proxy_error_pixels':error}
 evaluated.to_mesh_clear();result.append(entry)
errors=[e['proxy_error_pixels']for f in result for e in f['eyes'].values()]
summary={'frames':90,'max_proxy_error_pixels':max(errors),'mean_proxy_error_pixels':sum(errors)/len(errors),'scope':'Projection of original iris texture point on the actual Blender eyeball control against eye-local target measured from reference. Not a pixel-level iris detector score, naturalness assessment or proof of full 3D reconstruction.'}
(root/'gaze-projection-check.json').write_text(json.dumps({'summary':summary,'frames':result},indent=2));print(json.dumps(summary,indent=2))
