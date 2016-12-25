from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from PIL import Image
import glob
import sys
import numpy as np
import tensorflow as tf


# Directory that stores image to convert
temp_image_dir='/tmp/seongah_image'

# Directory that stores images converted
temp_data_dir='/tmp/seongah_data'

# Driectory that stores image binary file which is converted
temp_dir='/tmp/seongah_temp'

def convert(image_dir,data_dir,label):
  # Load all images which extension is 'jpg'
    imgs=glob.glob(image_dir+"/*.jpg")
    result=np.array([],np.uint8)

  # Directory that stores image binary file
    output=[]
    output.append(data_dir+"/")
    output.append("train"+label+".bin")
    outputstr=''.join(output)

  # Single file
    for img in imgs:
        im = Image.open(img)
        im = (np.array(im))

        r = im[:,:,0].flatten()
        g = im[:,:,1].flatten()
        b = im[:,:,2].flatten()

        label = [label]

        out = np.array(list(label) + list(r) + list(g) + list(b),np.uint8)

        #if result is empty
        if result.size==0:
          result=out
        else:
          result=np.vstack([result,out])

    print(result)
    result.tofile(outputstr)


def convert(img):

    im= Image.open(img)
    # Resize image to (32,32)
    im= im.resize([32,32],Image.ANTIALIAS)
    im = (np.array(im))

    r = im[:,:,0].flatten()
    g = im[:,:,1].flatten()
    b = im[:,:,2].flatten()

    # Temp label that is useless
    label=[0]

    # Extract file name inlcudes extension
    filename=img.split('/')[1]

    # Extract file name except extension
    filename=filename.split('.')[0]

    # Directory that stores image binary file
    output=[]
    output.append(temp_dir)
    output.append('/')
    output.append(filename)
    output.append('.bin')
    outputstr=''.join(output)

    out = np.array(list(label) + list(r) + list(g) + list(b), np.uint8)
    out.tofile(outputstr)

    return outputstr

def main(argv=None):
  convert(image_dir=temp_image_dir,data_dir=temp_data_dir,label=sys.argv[1])

if __name__ =='__main__':
  tf.app.run()
