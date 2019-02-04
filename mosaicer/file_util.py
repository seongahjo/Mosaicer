import os
import unicodedata
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
