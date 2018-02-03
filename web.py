from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import json
import os

from flask import Flask, jsonify, request

# from convert import convert_image, convert_images
import binary_convert as bc
import compare
import mosaicer
from train import train_data
import train_gpu

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'image')


@app.route('/train')
def train():
    print('train start')
    data_dir = request.args.get('data_dir')
    train_dir = request.args.get('train_dir')
    train_dir = makeDir(train_dir)

    if train_gpu.train(data_dir=data_dir, train_dir=train_dir):
        json_path = os.path.join(data_dir, 'state.json')
        json_state = {"names": []}
        filenames = os.listdir(data_dir)
        for filename in filenames:
            extension = os.path.splitext(filename)[1][1:].strip()
            if extension == 'bin':
                json_temp = {"name": filename}
                json_state['names'].append(json_temp)
        with open(json_path, "w") as outfile:
            json.dump(json_state, outfile)
            print(json_state)
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


# Convert Images to binary files
@app.route('/convert')
def convert():
    print('convert start')
    image_dir = request.args.get('image_dir')
    data_dir = request.args.get('data_dir')
    label = request.args.get('label')
    print('image ', image_dir)
    data_dir = makeDir(data_dir)
    bc.convert_global(image_dir=image_dir, data_dir=data_dir, label=label)

    json_path = os.path.join(data_dir, 'label.json')
    json_state = {"names": []}
    filenames = os.listdir(data_dir)
    for filename in filenames:
        extension = os.path.splitext(filename)[1][1:].strip()
        if extension == 'bin':
            json_temp = {"name": filename}
            json_state['names'].append(json_temp)
    with open(json_path, "w") as outfile:
        json.dump(json_state, outfile)
        print(json_state)
    print('convert finished')
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
    app.run(host='0.0.0.0', port='9999')
