import os
os.environ.setdefault('MPLCONFIGDIR','/tmp/avatar-matplotlib')
import cv2,numpy as np,torch,json
from pathlib import Path
from mobile_sam import sam_model_registry,SamPredictor
root=Path('/workspace/library-files/tool-runtimes/avatar-motion/rigid-correction');torch.set_num_threads(4)
source=cv2.imread('/workspace/generated_images/exec-11c43e51-0077-477c-9c14-bb754e6ef5c6.png');rgb=cv2.cvtColor(source,cv2.COLOR_BGR2RGB)
model=sam_model_registry['vit_t'](checkpoint='/workspace/library-files/tool-runtimes/avatar-motion/MobileSAM/weights/mobile_sam.pt');model.to('cpu').eval();predictor=SamPredictor(model);predictor.set_image(rgb)
positive=[[780,380],[775,305],[705,440],[860,440],[780,490]];negative=[[800,245],[890,300],[680,320],[900,450],[780,540]]
masks,scores,_=predictor.predict(point_coords=np.array(positive+negative),point_labels=np.array([1]*len(positive)+[0]*len(negative)),box=np.array([688,272,878,518]),multimask_output=True)
print('Scores',scores)
for i,mask in enumerate(masks):
 mask[:272]=False;mask[518:]=False
 cv2.imwrite(str(root/f'head-mask-{i}.png'),mask.astype(np.uint8)*255)
 preview=source.copy();overlay=preview.copy();overlay[mask]=(0,255,0);preview=cv2.addWeighted(preview,.65,overlay,.35,0)
 cv2.imwrite(str(root/f'head-mask-{i}-preview.jpg'),preview[240:540,640:930])
np.save(root/'head-mask.npy',masks[int(np.argmax(scores))]);(root/'segmentation-scores.json').write_text(json.dumps(scores.tolist()))
