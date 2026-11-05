"""Prepare the pinned CC0 MPFB sample for the isolated Aura motion study.

Usage: blender -b --python scripts/assets/prepare-aura-character.py -- source.glb raw.glb
Then optimize textures with glTF Transform as documented in docs/AURA-PERSONAGEM.md.
This script does not fetch assets and does not encode a clinical treatment model.
"""
import bpy,sys,math,hashlib
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
src,out=args
if hashlib.sha256(Path(src).read_bytes()).hexdigest() != "63c645a2a863b9972e9a9c2ed576a1de4c390b8475508e1473e69c87a3ee299c":
 raise ValueError("Unexpected input: use the pinned MPFB source recorded in provenance.json")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
keep={'Basis','eyeBlinkLeft','eyeBlinkRight'}
for obj in list(bpy.data.objects):
 if obj.name=='Icosphere': bpy.data.objects.remove(obj,do_unlink=True);continue
 if obj.type!='MESH':continue
 if obj.data.shape_keys:
  for k in list(obj.data.shape_keys.key_blocks):
   if k.name not in keep:obj.shape_key_remove(k)
 if obj.name=='Human':
  key=obj.shape_key_add(name='auraMalarProjection');affected=0;maximum=0
  for v in key.data:
   world=obj.matrix_world@v.co
   x,y,z=world
   # Bilateral, localized design morph; not derived from a clinical outcome.
   w=math.exp(-0.5*((abs(x)-.048)/.020)**2-0.5*((z-1.623)/.018)**2-0.5*((y+.126)/.022)**2)
   delta=Vector((math.copysign(.0015,x)*w,-.005*w,.001*w))
   if w>.02:affected+=1
   maximum=max(maximum,delta.length)
   v.co+=obj.matrix_world.inverted().to_3x3()@delta
  key.value=0
  print('MALAR',affected,'max displacement',maximum)
for mat in bpy.data.materials:
 if not mat.use_nodes:continue
 for node in mat.node_tree.nodes:
  if node.type=='BSDF_PRINCIPLED':
   node.inputs['Roughness'].default_value=.58
   if 'body' in mat.name:node.inputs['Subsurface Weight'].default_value=.07
  if node.type=='NORMAL_MAP' and 'casualsuit' in mat.name:
   for link in list(mat.node_tree.links):
    if link.from_node==node:mat.node_tree.links.remove(link)
for im in bpy.data.images:
 if not im.has_data:continue
 limit=2048 if 'female_diffuse' in im.name else 1024 if 'eye' in im.name or 'ponytail' in im.name else 512
 if max(im.size)>limit:im.scale(limit,limit)
# Remove unused source textures after unplugging the clothing normal.
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_animations=False,export_morph=True,export_morph_normal=True,export_image_format='JPEG',export_jpeg_quality=85,export_cameras=False,export_lights=False,export_extras=True)
print('OUTPUT',Path(out).stat().st_size,'SOURCE_SHA256',hashlib.sha256(Path(src).read_bytes()).hexdigest())
