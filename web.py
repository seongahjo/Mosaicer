from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import json
import os

from flask import Flask, jsonify, request

# from convert import convert_image, convert_images

import mosaicer
import retrain

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'image')


@app.route('/train')
def train():
    print('train start')
    data_dir = request.args.get('data_dir')
    train_dir = request.args.get('train_dir')
    train_dir = makeDir(train_dir)

    #  if retrain.run(data_dir=data_dir, train_dir=train_dir):
   #ProtoBuf
    print('train end')
    return 'true'


@app.route('/upload', methods=['POST'])
def upload():
    image_dir = request.form['image_dir']
    directory = makeDir(image_dir)
    for image in request.files.getlist('images'):
        path = os.path.join(directory, image.filename)
        image.save(path)
    return 'true'


@app.route('/mosaic')
def mosaic():
    print('mosaic start')
    video_path = request.args.get('video_path')
    train_dir = request.args.get('train_dir')
    label = request.args.get('label')
    value = mosaicer.capture(video_path=video_path, train_dir=train_dir, label=label)
    print('mosaic end')
    return value


def makeDir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
    return directory


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)
