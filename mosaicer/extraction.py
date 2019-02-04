import face_recognition
import sys
import cv2
import os
import argparse
from file_util import check_img


def extract(folder, file_name):
    """Extract faces from images

    Args:
        folder: folder
        file_name : filename
    """
    if not os.path.exists('result'):
        os.makedirs('result')
    file_names = []
    if not file_name:
        for dirpath, dirnames, filenames in os.walk(folder):
            for file in filenames:
                if(check_img(file)):
                    full_path = os.path.join(dirpath, file)
                    file_names.append(full_path)
    else:
        file_names.append(os.path.join(folder, file_name))
    for file in file_names:
        print(file)
        image = face_recognition.load_image_file(file)
        #frontal_image = run(image)
        face_locations = face_recognition.face_locations(image)
        count = 0
        for face_locaiton in face_locations:
            top, right, bottom, left = face_locaiton
            face_image = image[top:bottom, left:right]
            img_output = cv2.resize(face_image, (299, 299),
                                    interpolation=cv2.INTER_AREA)
            file_name, file_ext = os.path.splitext(
                os.path.basename(file))
            delimiter = ''
            if count != 0:
                delimiter = '_' + str(count)

            path = file_name + delimiter + file_ext
            path = os.path.join('result', path)
            cv2.imwrite(path, cv2.cvtColor(img_output, cv2.COLOR_RGB2BGR))
            count += 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Extract face from image')
    parser.add_argument('-d', action='store', dest='directory',
                        help="directory stores images")
    parser.add_argument('-f', action='store', dest='file',
                        help="image to extract file")
    args = parser.parse_args()
    if not args.file:
        extract(folder=args.directory, file_name=None)
    else:
        extract(folder=args.directory, file_name=args.file)
