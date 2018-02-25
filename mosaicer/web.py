from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import os
import face_recognition as fr
import cv2
from flask import Flask, request

# from convert import convert_image, convert_images

import mosaicer
import retrain

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'image')


@app.route('/tracker')
def upload():
    print('tracker start')
    image_path = request.args.get('path').split(os.sep)[1:]
    print(image_path)
    image_path = os.sep.join(image_path)
    image_dir = os.path.dirname(image_path)
    image_name = os.path.basename(image_path)
    print(image_path)
    image = cv2.imread(image_path)
    faces = fr.face_locations(image,
                              number_of_times_to_upsample=0, model="cnn")
    index = 0

    for (top, right, bottom, left) in faces:
        imgFace = image[top:bottom, left:right]
        img_output = cv2.resize(imgFace, (299, 299),
                                interpolation=cv2.INTER_AREA)
        face_path = os.path.join(image_dir, str(index) + image_name)
        index += 1
        cv2.imwrite(face_path, img_output)
    os.remove(image_path)
    print('tracker end')
    return 'true'


@app.route('/train')
def train():
    print('train start')
    data_dir = request.args.get('data_dir')
    print(data_dir)
    train_dir = request.args.get('train_dir')
    retrain.run(image_dir=data_dir, model_dir=train_dir)
    # ProtoBuf
    print('train end')
    return 'true'


@app.route('/mosaic')
def mosaic():
    print('mosaic start')
    video_path = request.args.get('video_path')
    train_dir = request.args.get('train_dir')
    label = request.args.getlist('label[]')
    value = mosaicer.capture(video_path=video_path, train_dir=train_dir, label=label)
    print('mosaic end')
    return value


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)
