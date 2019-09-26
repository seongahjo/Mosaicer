import os
import numpy as np
from keras.applications.vgg16 import preprocess_input
from keras.preprocessing import image


def preprocess_image(img):
    img_data = image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = preprocess_input(img_data)
    return img_data


class Feature(object):
    def __init__(self):
        self.model = None
        self.image_size = None

    def set_model(self, model):
        self.model = model

    def _open_file(self, path):
        """Read images.
        Subclasses should override for any actions to run.
        # Arguments
            path: string, path or directory
        :return:
            images: numpy array, shape(N, image_size, image_size, 3)
        """

    def _load_images(self, path):
        """Load images.
        Subclasses should override for any actions to run.
        # Arguments
            path: string, path or directory
       :return:
            images: numpy array, shape (N, image_size, image_size, 3)
        """
        image_list = np.zeros((1,) + self.image_size + (3,))
        images = self._open_file(path)
        for f in images:
            image_list = np.concatenate((image_list, f))
        image_list = np.delete(image_list, 0, axis=0)
        return image_list

    def _extract_feature(self, images):
        """Extract features from image
        Subclasses should override for any actions to run.
        # Arugments
            images: string, path or directory
        :return:
            features: numpy array, shape ( N, 7 * 7 * 512)
        """
        features = self.model.predict(images)
        features = features.reshape(images.shape[0], 7 * 7 * 512)
        return features

    def get_feature(self, path):
        return self._extract_feature(self._load_images(path))


class DirectoryFeature(Feature):
    """
    Extract feature from directory
    """

    def __init__(self, model, image_size=(224, 224)):
        super(DirectoryFeature, self).__init__()
        self.model = model
        self.image_size = image_size

    def _open_file(self, path):
        return [preprocess_image(image.load_img(os.path.join(path, f), target_size=self.image_size)) for f in
                os.listdir(path) if
                os.path.isfile(os.path.join(path, f))]


class ImageLoadFeature(Feature):
    """
    Extract feature after loading single image
    """

    def __init__(self, model, image_size=(224, 224)):
        super(ImageLoadFeature, self).__init__()
        self.model = model
        self.image_size = image_size

    def _open_file(self, path):
        return [preprocess_image(image.load_img(path, target_size=self.image_size))]


class ImageReadFeature(Feature):
    """
    Extract feature from images
    """

    def __init__(self, model, image_size=(224, 224)):
        super(ImageReadFeature, self).__init__()
        self.model = model
        self.image_size = image_size

    def _load_images(self, images):
        return images
