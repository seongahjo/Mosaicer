import argparse

import numpy as np

from keras.engine.saving import load_model
from keras_applications.inception_v3 import preprocess_input
from keras_preprocessing import image


def predict(model, imgs):
    image_list = np.zeros((1, 299, 299, 3))
    count_frame = []
    array_image = []
    for frame in imgs:
        count_frame.append(len(frame))
        for face in frame:
            array_image.append(face)

    for img in array_image:
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        image_list = np.concatenate((image_list, x))

    image_list = np.delete(image_list, 0, axis=0)
    preds = model.predict(image_list)
    pred_list = []
    cnt = 0
    for count in count_frame:
        pred_frame = []
        for i in range(count):
            pred_frame.append(preds[cnt])
            cnt += 1
        pred_list.append(pred_frame)

    return pred_list


def predict_one(model, img):
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    preds = model.predict(x)

    return preds[0]


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", "--model", help="model path", default="model/test.h5")
    parser.add_argument("--width", help="image width size", default=299)
    parser.add_argument("--height", help="image height size", default=299)
    parser.add_argument("-i", "--image", help="image", default="./image/jo/test.avi_face2.jpg")
    args = parser.parse_args()
    IMAGE_SIZE = (args.width, args.height)
    input_img = image.load_img(args.image, target_size=IMAGE_SIZE)
    input_model = load_model(args.model)
    pred = predict_one(input_model, input_img)
    print(pred)
