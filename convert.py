from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from PIL import Image
import glob
import sys
import numpy as np
import tensorflow as tf

FLAGS =tf.app.flags.FLAGS
tf.app.flags.DEFINE_string('data_dir','/tmp/seongah_data',
                          """Directory where to store data""")

def convert():
  imgs=glob.glob("data/*.jpg")
  output=[]
  output.append(FLAGS.data_dir+"/")
  output.append("train"+sys.argv[1])
  output.append('.bin')
  outputstr=''.join(output)
  result=np.array([],np.uint8)
  for img in imgs:
    im = Image.open(img)
    im = (np.array(im))
    r = im[:,:,0].flatten()
    g = im[:,:,1].flatten()
    b = im[:,:,2].flatten()
    label = [sys.argv[1]]
    out = np.array(list(label) + list(r) + list(g) + list(b),np.uint8)
    if result.size==0:
      result=out
    else:
      result=np.vstack([result,out])
  print(result)
  result.tofile(outputstr)


def main(argv=None):
  convert()
  

if __name__ =='__main__':
  tf.app.run()
