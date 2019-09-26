import argparse
import json
import logging

import faiss
from feature import DirectoryFeature
from file_util import make_model

INDEX_PATH = './model/train.index'
ID_PATH = 'data.json'


class Similarity(object):
    def __init__(self):
        self.feature = None

    def set_feature(self, feature):
        self.feature = feature

    def calculate(self, images):
        """Calculate similarity
        Subclasses should override for any actions to run.
        :arg
            images: numpy array, shape(N, image_size, image_size, 3)
        :return:
            names: list[string], predicted person names
        """


class PeopleSimilarity(Similarity):
    def __init__(self, feature, index_path, id_path):
        super(PeopleSimilarity, self).__init__()
        self.feature = feature
        self.index_path = index_path
        self.id_path = id_path

    def calculate(self, images):
        predicted = []
        index = faiss.read_index(self.index_path)
        with open(self.id_path) as f:
            id_json = json.load(f)
        logging.info('database load')
        imgs = self.feature.get_feature(images)
        D, I = index.search(imgs, k=1)
        for p in I:
            predicted.append(id_json[str(p[0])])
        return predicted


def predict(feature, imgs):
    count_frame = []
    array_image = []
    # frame별로 수정해야댐...
    # for frame in imgs:
    #     count_frame.append(len(frame))
    #     for face in frame:
    #         array_image.append(face)
    # image_list = None
    # for img in array_image:
    #     x = image.img_to_array(img)
    #     x = np.expand_dims(x, axis=0)
    #     x = preprocess_input(x)
    #     image_list = np.concatenate((image_list, x)) if image_list is not None else x

    similarity = PeopleSimilarity(feature, INDEX_PATH, ID_PATH)
    preds = similarity.calculate(imgs)
    pred_list = []
    cnt = 0
    for count in count_frame:
        pred_frame = []
        for i in range(count):
            pred_frame.append(preds[cnt])
            cnt += 1
        pred_list.append(pred_frame)

    return pred_list


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", "--model", help="model path", default="model/train.index")
    parser.add_argument("--width", help="image width size", default=224)
    parser.add_argument("--height", help="image height size", default=224)
    parser.add_argument("-i", "--image", help="image", default="./image/jo/val/0jo2.jpg")
    args = parser.parse_args()
    IMAGE_SIZE = (args.width, args.height)
    model = make_model('vgg16', IMAGE_SIZE)
    print(predict(DirectoryFeature(model), 'image/jo'))
