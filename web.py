
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from flask import Flask, jsonify,request
from flask.ext.api import status
import compare
#from convert import convert_image, convert_images
import binary_convert as bc
import train
import os
app = Flask(__name__)
app.config['UPLOAD_FOLDER']='/root/mosaicer32/image'

@app.route('/',methods=['POST'])
def api():
  results=[]
  for image in request.files.getlist('images'):
    path=os.path.join(app.config['UPLOAD_FOLDER'],image.filename)
    image.save(path)
    filename='image/'+image.filename
    output=bc.convert(img=filename)
    precision=compare.evaluate(output)
    results.append({'precision':precision})
  return jsonify(results=results)


@app.route('/train')
def train(data_dir,train_dir):
    data_dir=request.args.get('data_dir')
    train_dir=request.args.get('train_dir')

    data_dir=os.path.join('/tmp/',data_dir)

    if not os.path.exists(data_dir)
        return status.HTTP_400_BAD_REQUEST

    train_dir=makeDir(train_dir)
    train.train(data_dir=data_dir,train_dir=train_dir)
    return status.HTTP_202_ACCEPTED

@app.route('/upload',methods=['POST'])
def upload():
    image_dir=request.form['image_dir']
    directory=makeDir(image_dir)
    for image in request.files.getlist('images'):
        path=os.path.join(directory,image.filename)
        image.save(path)
    return status.HTTP_202_ACCEPTED


#Convert Images to binary files
@app.route('/convert')
def convert():
    image_dir=request.args.get('image_dir')
    data_dir=request.args.get('data_dir')
    label = request.args.get('label')

    image_dir=os.path.join('/tmp/',image_dir)
    if not os.path.exists(image_dir)
        return status.HTTP_400_BAD_REQUEST

    data_dir=makeDir(data_dir)
    bc.convert(image_dir=image_dir,data_dir=data_dir,label=label)
    return status.HTTP_202_ACCEPTED





def makeDir(dir_name):
    directory=os.path.join('/tmp/',dir_name)
    if not os.path.exists(directory):
        os.makedirs(directory)
    return directory


if __name__=='__main__':
  app.run(host='0.0.0.0', port='9999')
