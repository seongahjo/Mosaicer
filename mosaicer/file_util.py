import os
import unicodedata

from keras.applications import InceptionV3, VGG16, MobileNet

image_type = ['.jpg']


def check_img(file_name):
    """To check image

    Args:
        file_name : file name
    Returns:
        if this file is image
    """
    file_name, file_ext = os.path.splitext(file_name)
    if file_ext in image_type:
        return True
    return False


def extract_type(file_name, delimiter):
    """To extract type from file name

    Args:
        file_name : face img name
        delimiter : delimiter
    Returns:
        type: type of face
    """
    file_name, ext = os.path.splitext(file_name)
    type = file_name
    if delimiter in type:
        type = type.split(delimiter)[0]
    type = unicodedata.normalize('NFC', type)
    return type


def make_model(model, image_size):
    if model == "inceptionv3":
        base_model = InceptionV3(include_top=False, input_shape=image_size + (3,))
    elif model == "vgg16" or model is None:
        base_model = VGG16(include_top=False, input_shape=image_size + (3,))
    elif model == "mobilenet":
        base_model = MobileNet(include_top=False, input_shape=image_size + (3,))
    return base_model
