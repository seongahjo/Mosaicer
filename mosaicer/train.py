import argparse
import json
import logging
import math
import os

import faiss
import numpy as np
from feature import DirectoryFeature
from file_util import make_model

MODEL = "vgg16"
MODEL_SAVE_FOLDER_PATH = './model/'
model_path = MODEL_SAVE_FOLDER_PATH + 'train.index'
IMAGE_SIZE = (224, 224)
IMAGE_PATH = './image'
BATCH_SIZE = 10


def faiss_train(fn_feature, root_path, index_path='train.index', id_path='data.json'):
    folder_names = os.listdir(root_path)
    logging.info('directory %s ', folder_names)
    ids = None
    vals = None
    id_json = {}
    print(folder_names)
    for idx, folder_name in enumerate(folder_names):
        id_json[str(idx)] = folder_name
        now_path = os.path.join(root_path, folder_name)
        feature_val = fn_feature(now_path)
        vals = np.concatenate((feature_val, vals), axis=0) if vals is not None else feature_val
        id_np = np.asarray([idx] * feature_val.shape[0])
        ids = np.concatenate((id_np, ids), axis=0) if ids is not None else id_np
    N, dim = vals.shape
    x = int(2 * math.sqrt(N))
    index_description = "IVF{x},Flat".format(x=x)
    index = faiss.index_factory(7 * 7 * 512, index_description, faiss.METRIC_INNER_PRODUCT)
    index.train(vals)
    index.add_with_ids(vals, ids)
    faiss.write_index(index, index_path)
    with open(id_path, 'w', encoding='utf-8') as f:
        json.dump(id_json, f, ensure_ascii=False, indent=4)
    print(id_json)
    return index, id_json


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", "--model", help="choose model", default="vgg16")
    parser.add_argument("--width", help="image width size", default=224)
    parser.add_argument("--height", help="image height size", default=224)
    parser.add_argument("-i", "--image", help="image path", default="./image")
    args = parser.parse_args()
    IMAGE_SIZE = (args.width, args.height)
    IMAGE_PATH = args.image
    MODEL = args.model
    model = make_model(MODEL, IMAGE_SIZE)
    feature = DirectoryFeature(model, IMAGE_SIZE)
    faiss_train(fn_feature=feature.get_feature, root_path=IMAGE_PATH, index_path=model_path)
