import bpy,json,math,sys
from pathlib import Path
from mathutils import Vector,Matrix,Quaternion,Euler
root=Path(__file__).resolve().parent;data=json.loads((root/'rig-input.json').read_text());W,H=data['width'],data['height'];lm=data['sourceLandmarks'];points=data['points']
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE_NEXT';scene.render.resolution_x=1280;scene.render.resolution_y=818;scene.render.resolution_percentage=100;scene.render.fps=30;scene.eevee.taa_render_samples=12
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False;scene.world.color=(0,0,0)
scene.view_settings.view_transform='Standard';scene.view_settings.look='None';scene.view_settings.exposure=0;scene.view_settings.gamma=1
scene.render.image_settings.color_mode='RGB';scene.render.threads_mode='FIXED';scene.render.threads=4
source=bpy.data.images.load(str(root/'scene-source.png'));headtex=bpy.data.images.load(str(root/'head-albedo.png'));plate=bpy.data.images.load(str(root/'background-plate.png'))
def material(name,img=None,color=None,alpha=False):
 mat=bpy.data.materials.new(name);mat.use_nodes=True;n=mat.node_tree.nodes;n.clear();out=n.new('ShaderNodeOutputMaterial');em=n.new('ShaderNodeEmission');mat.node_tree.links.new(em.outputs[0],out.inputs['Surface'])
 if img:
  tex=n.new('ShaderNodeTexImage');tex.image=img;tex.interpolation='Linear';mat.node_tree.links.new(tex.outputs['Color'],em.inputs['Color'])
  if alpha:
   trans=n.new('ShaderNodeBsdfTransparent');mix=n.new('ShaderNodeMixShader');mat.node_tree.links.new(tex.outputs['Alpha'],mix.inputs[0]);mat.node_tree.links.new(trans.outputs[0],mix.inputs[1]);mat.node_tree.links.new(em.outputs[0],mix.inputs[2]);mat.node_tree.links.new(mix.outputs[0],out.inputs['Surface']);mat.surface_render_method='DITHERED'
 else:em.inputs['Color'].default_value=color
 return mat
def skin_material(img):
 mat=bpy.data.materials.new('Skin: approximate albedo and dynamic PBR');mat.use_nodes=True;n=mat.node_tree.nodes;n.clear();out=n.new('ShaderNodeOutputMaterial');bsdf=n.new('ShaderNodeBsdfPrincipled');tex=n.new('ShaderNodeTexImage');tex.image=img
 mat.node_tree.links.new(tex.outputs['Color'],bsdf.inputs['Base Color']);bsdf.inputs['Roughness'].default_value=.60;bsdf.inputs['Specular IOR Level'].default_value=.25;bsdf.inputs['IOR'].default_value=1.43;bsdf.inputs['Subsurface Weight'].default_value=.04;bsdf.inputs['Coat Weight'].default_value=0;bsdf.inputs['Coat Roughness'].default_value=.22
 trans=n.new('ShaderNodeBsdfTransparent');mix=n.new('ShaderNodeMixShader');mat.node_tree.links.new(tex.outputs['Alpha'],mix.inputs[0]);mat.node_tree.links.new(trans.outputs[0],mix.inputs[1]);mat.node_tree.links.new(bsdf.outputs[0],mix.inputs[2]);mat.node_tree.links.new(mix.outputs[0],out.inputs['Surface']);mat.surface_render_method='DITHERED';return mat
headmat=skin_material(headtex);irisMat=material('Approved iris texture',source);bgmat=material('Fixed studio plate',plate);fgmat=material('Original monitor foreground',source)

CAMERA_DISTANCE=20.
def world(x,y,z=0):
 factor=(CAMERA_DISTANCE-z)/CAMERA_DISTANCE
 return ((x-W/2)/100*factor,(H/2-y)/100*factor,z)
def project(q):
 factor=CAMERA_DISTANCE/(CAMERA_DISTANCE-q.z)
 return Vector((q.x*factor*100+W/2,H/2-q.y*factor*100))
def sphere_target(pixel,center,radius):
 origin=Vector((0,0,CAMERA_DISTANCE));ray=(Vector(world(pixel.x,pixel.y,0))-origin).normalized();oc=origin-center;b=ray.dot(oc);c=oc.length_squared-radius*radius;discriminant=b*b-c
 distance=-b-math.sqrt(max(0,discriminant));hit=origin+distance*ray
 return hit-center

def mesh(name,verts,faces,uv,mat,parent=None):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);ob.data.materials.append(mat)
 layer=me.uv_layers.new(name='Original image projection')
 for poly in me.polygons:
  for li in poly.loop_indices:layer.data[li].uv=uv[me.loops[li].vertex_index]
 if parent:ob.parent=parent
 return ob
def plane(name,x0,y0,x1,y1,z,mat):
 pts=[(x0,y1),(x1,y1),(x1,y0),(x0,y0)];return mesh(name,[world(x,y,z)for x,y in pts],[(0,1,2,3)],[(x/W,1-y/H)for x,y in pts],mat)
plane('Studio: fixed background',0,0,W,H,-2,bgmat);plane('Monitor: fixed foreground occluder',0,518,W,H,2,fgmat)
head=bpy.data.objects.new('Head control: measured pose',None);bpy.context.collection.objects.link(head);head.location=world(*data['pivotPixel']);pivot=Vector(head.location)
markers=[Vector(world(x,y,-z/100))-pivot for x,y,z in lm]
verts=[tuple(Vector(world(x,y,-z/100))-pivot)for x,y,z in points];uv=[(p[0]/W,1-p[1]/H)for p in points]
face=mesh('Fitted anatomical head: native CC0 topology',verts,data['triangles'],uv,headmat,head)
hairmat=headmat.copy();hairmat.name='Textured curl scalp: matte'
for node in hairmat.node_tree.nodes:
 if node.type=='BSDF_PRINCIPLED':node.inputs['Roughness'].default_value=.85;node.inputs['Specular IOR Level'].default_value=.15
face.data.materials.append(hairmat)
for poly in face.data.polygons:
 poly.use_smooth=True
 if sum(points[k][1]for k in poly.vertices)/len(poly.vertices)<355:poly.material_index=1

face.shape_key_add(name='Basis');eyeobjects={};lidkeys={}
# Eye aperture geometry and source iris texture remain separate from mouth.
for side,ids in data['eyeContours'].items():
 p0,p1=lm[ids[0]],lm[ids[8]];cx=(p0[0]+p1[0])/2;cy=(p0[1]+p1[1])/2;width=math.dist(p0[:2],p1[:2]);ys=[lm[k][1]for k in ids];gap=max(ys)-min(ys)
 surface=-sum(lm[k][2]for k in ids)/len(ids)/100;radius=width*.52/100*(CAMERA_DISTANCE-surface)/CAMERA_DISTANCE
 eye=bpy.data.objects.new(side+' eye: independent rotation',None);bpy.context.collection.objects.link(eye);eye.parent=head;eye.location=Vector(world(cx,cy,surface-radius-.002))-pivot
 bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=24,radius=radius,location=(0,0,0));ball=bpy.context.object;ball.name=side+' sclera';ball.parent=eye;ball.location=(0,0,0)
 # Neutral shaded sclera; no generated expression or lip changes.
 ball.data.materials.append(irisMat)
 layer=ball.data.uv_layers.active;layer.name='Approved eye projection'
 for poly in ball.data.polygons:
  for li in poly.loop_indices:
   v=ball.data.vertices[ball.data.loops[li].vertex_index].co
   pixel=project(eye.location+pivot+v);layer.data[li].uv=(pixel.x/W,1-pixel.y/H)
 for poly in ball.data.polygons:poly.use_smooth=True
 iris_id=468 if side=='right' else 473;ic=lm[iris_id];rr=sum(math.dist(lm[k][:2],ic[:2])for k in range(iris_id+1,iris_id+5))/4
 key=face.shape_key_add(name=side+' lid closure');key.slider_min=-1;key.slider_max=1
 for i,p in enumerate(points):
  dx=abs(p[0]-cx)/(width*.75);dy=abs(p[1]-cy)/max(gap*1.8,1);weight=max(0,1-dx**4)*math.exp(-dy**4)
  if min(math.dist(p[:2],lm[k][:2])for k in [ids[0],ids[8]])<1.5:weight=0. # Canthi remain fixed while lids close.
  if weight>.001:
   key.data[i].co.y+=(p[1]-cy)/100*weight
   if min(math.dist(p[:2],lm[k][:2])for k in ids)<1.5:key.data[i].co.z+=(surface+.008-(key.data[i].co.z+pivot.z))*weight
 lidkeys[side]=key;eyeobjects[side]={'control':eye,'cx':cx,'cy':cy,'radius':radius,'width':width,'iris':ic}

browkeys={}
for side,ids in [('right',[70,63,105,66,107]),('left',[336,296,334,293,300])]:
 cx=sum(lm[k][0]for k in ids)/len(ids);cy=sum(lm[k][1]for k in ids)/len(ids);width=eyeobjects[side]['width']
 key=face.shape_key_add(name=side+' brow lift',from_mix=False);key.slider_min=-2;key.slider_max=2
 for i,p in enumerate(points):
  dx=(p[0]-cx)/(width*.65);dy=(p[1]-cy)/10;weight=math.exp(-(dx**4+dy**4))
  if weight>.001:key.data[i].co.y+=.05*weight
 browkeys[side]=key

D=Matrix.Identity(3) # Face transformation matrix is already in metric camera coordinates (unlike normalized landmark axes).
M0=Matrix(data['frames'][0]['matrix']).to_3x3();R0=M0.normalized();center0=Vector(data['frames'][0]['center']);scale=data['motionScale']
stableids=[1,4,6,33,133,168,263,362];localcenter=sum((markers[i]for i in stableids),Vector())/len(stableids);initialcenter=pivot+localcenter
for f in data['frames']:
 frame=f['frame']+1;R=Matrix(f['matrix']).to_3x3().normalized();Rb=D@(R@R0.inverted())@D
 head.rotation_mode='QUATERNION';head.rotation_quaternion=Rb.to_quaternion();delta=(Vector(f['center'])-center0)*scale/100
 head.location=pivot+Vector(f['positionDelta'])
 head.keyframe_insert(data_path='rotation_quaternion',frame=frame);head.keyframe_insert(data_path='location',frame=frame)
 for side,e in eyeobjects.items():
  initial=data['frames'][0]['eyes'][side];now=f['eyes'][side];ic=e['iris'];ids=data['eyeContours'][side]
  a=project(Rb@markers[ids[0]]+head.location);b=project(Rb@markers[ids[8]]+head.location)
  axis=(b-a).normalized();length=(b-a).length;normal=Vector((-axis.y,axis.x));center=(a+b)/2
  sa=Vector(lm[ids[0]][:2]);sb=Vector(lm[ids[8]][:2]);su=(sb-sa).normalized();sv=Vector((-su.y,su.x));source_offset=Vector(ic[:2])-(sa+sb)/2
  u=source_offset.dot(su)/(sb-sa).length+now['iris'][0]-initial['iris'][0];v=source_offset.dot(sv)/(sb-sa).length+now['iris'][1]-initial['iris'][1]
  target=center+length*(u*axis+v*normal);eye_center=Rb@e['control'].location+head.location
  desired_world=sphere_target(target,eye_center,e['radius']);original=sphere_target(Vector(ic[:2]),e['control'].location+pivot,e['radius']);local_target=Rb.inverted()@desired_world
  e['control'].rotation_mode='QUATERNION';e['control'].rotation_quaternion=original.rotation_difference(local_target);e['control'].keyframe_insert(data_path='rotation_quaternion',frame=frame)
  browkeys[side].value=max(-2,min(2,-(now['brow']-initial['brow'])*e['width']/5));browkeys[side].keyframe_insert(data_path='value',frame=frame)
  ratio=max(.05,min(1.65,now['open']/initial['open']));lidkeys[side].value=1-ratio;lidkeys[side].keyframe_insert(data_path='value',frame=frame)

# Close the anatomical template's resting mouth aperture with the approved lip texture.
# This rigid strip follows the head and has no speaking/jaw channel.
mx=(lm[13][0]+lm[14][0])/2;my=(lm[13][1]+lm[14][1])/2;mw=abs(lm[61][0]-lm[291][0])*.46;mz=-(lm[13][2]+lm[14][2])/200-.018
mv=[];mu=[];mf=[]
for yy in [my-3,my+3]:
 for j in range(9):
  xx=mx-mw+2*mw*j/8;mv.append(tuple(Vector(world(xx,yy,mz))-pivot));mu.append((xx/W,1-yy/H))
for j in range(8):mf.append((j,j+1,j+10,j+9))
mesh('Closed neutral lip aperture',mv,mf,mu,headmat,head)

# The native mesh includes a continuous neck below the monitor occluder.
bpy.ops.object.camera_add(location=(0,0,20));camera=bpy.context.object;camera.name='Fixed approved framing';camera.data.type='PERSP';camera.data.sensor_fit='HORIZONTAL';camera.data.sensor_width=36;camera.data.lens=CAMERA_DISTANCE*36/(W/100);scene.camera=camera

for name,loc,power,size,color in [('Key softbox',(3,3,6),450,3.5,(1,.90,.85)),('Monitor fill',(-2,-.08,4),150,2.4,(.55,.70,1)),('Red rim',(-3,1,-.3),8,2,(1,.035,.025))]:
 bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.name=name;light.data.energy=power;light.data.size=size;light.data.color=color;light.rotation_euler=(Vector(world(780,415,.8))-light.location).to_track_quat('-Z','Y').to_euler()

scene.frame_start=1;scene.frame_end=333;scene.frame_set(1)
scene['method']=data['motionMethod']+'; native CC0 fitted head topology, inferred profile, approximate albedo and dynamic PBR lights; not original rig recovery.'
for image in bpy.data.images:
 if image.source=='FILE':image.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(root/'gabriel-volume-light.blend'))
for f in [1,16,46]:
 scene.frame_set(f);scene.render.filepath=str(root/f'proof-{f:03}.png');bpy.ops.render.render(write_still=True)
print('Saved volumetric lighting study and three review frames',flush=True)
