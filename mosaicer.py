import os
import shutil
import sys
import time

import cv2
import face_recognition
import tensorflow as tf
import label_image
import binary_convert


def capture(video_path, train_dir, label=None):
    """

    To extract face from video and digitize it

    Args:
        video_path : directory + name of video
        train_dir : directory stores result of train
        label : label
    """
    images = []
    video_dir, filename = os.path.split(video_path)
    result_dir = os.path.join(video_dir, 'result')  # directory to save result of digitization
    file_name = os.path.splitext(filename)[0]
    file_path = os.path.join("image", file_name)  # image/video_name is a directory to save images
    skip_frame = 30
    image_size = 32
    if not os.path.exists(file_path):
        os.makedirs(file_path)
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)

    index = 0
    cap = cv2.VideoCapture(video_path)
    fps = 30.0
    width = int(cap.get(3))
    height = int(cap.get(4))
    start_time = time.time()
    foc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(os.path.join(result_dir, filename), foc, fps, (width, height))

    while (cap.isOpened()):
        ret, frame = cap.read()
        if not ret:  # finished
            break

        if index % skip_frame == 0:
            faces = face_recognition.face_locations(frame, number_of_times_to_upsample=0, model="cnn")
        for (top, right, bottom, left) in faces:
            imgFace = frame[top:bottom, left:right]
            images.append(imgFace)
            """else:
                orb = cv2.ORB_create()
                chk = False
                _, des2 = orb.detectAndCompute(imgFace, None)
                for image in images:
                    _, des1 = orb.detectAndCompute(image, None)
                    # create BFMatcher object
                    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
                    # Match descriptors.
                    matches = bf.match(des2, des1)
                    # Sort them in the order of their distance.
                    matches = sorted(matches, key=lambda x: x.distance)
                    retval = 0
                    for m in matches[:10]:
                        if m.distance < 50:
                            retval = retval + 1
                    if retval > 5:
                        chk = False
                        continue
                    else:
                        chk = True
                if chk:
                    images.append(imgFace)"""
            img_yuv = cv2.cvtColor(imgFace, cv2.COLOR_BGR2YUV)

            # equalize the histogram of the Y channel
            img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])

            # convert the YUV image back to RGB format
            img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
            img_output2 = cv2.resize(img_output, (image_size, image_size), interpolation=cv2.INTER_AREA)
            face_path = os.path.join(file_path, "temp.jpg")
            cv2.imwrite(face_path, img_output2)

            # Mosaic Process
            if label is not None and check_image(video_name=file_name, train_dir=train_dir, label=label[0]):
                frame = digitize(frame=frame, x=left, y=top, w=right - left, h=bottom - top)

                # if index % fps == 0:  # save face per 1 sec
                #    shutil.move(face_path, os.path.join(file_path, 'face' + str(face_count) + ".jpg"))  # temp
                #    face_count += 1
        index += 1
        out.write(frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    end_time = time.time()
    cap.release()
    out.release()
    print('time : {0}'.format(end_time - start_time))
    count = 0
    for image in images:
        count += 1
        cv2.imwrite(os.path.join('image', 'test', 'face' + str(count) + '.jpg'), image)
    return 'finish'


def digitize(frame, x, y, w, h):
    blur = cv2.blur(frame[y:y + h, x:x + w, :], (70, 70))
    frame[y:y + h, x:x + w, :] = blur
    return frame


def check_image(video_name, train_dir, label):
    """

    function to check if a image is the one that I want to digitize

    Args:
        video_name : video name
        train_dir : directory stores result of train
        label : label
        count : save face or not

    """
    threshold = 0.7
    file_name = "temp.jpg"
    folder_path = os.path.join("test", video_name)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    full_path = os.path.join(folder_path, file_name)

    """
    # Make Dirs
    if not os.path.exists(os.path.join(folder_path, str(label))):
        os.makedirs(os.path.join(folder_path, str(label)))
    if not os.path.exists(os.path.join(folder_path, str(0))):
        os.makedirs(os.path.join(folder_path, str(0)))
    if not os.path.exists(os.path.join(folder_path, "etc")):
        os.makedirs(os.path.join(folder_path, "etc"))
    """

    precision = label_image.run(full_path, train_dir)
    print(precision)
    if max(precision, key=(lambda key: precision[key])) == label:
        return False
    else:
        return True


def classify(src, des):
    if os.path.exists(des):
        os.remove(des)
    shutil.move(src, des)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('[Error] ./%s [filename]' % sys.argv[0])
    else:
        path = os.path.join('video', sys.argv[1])
        capture(video_path=path, train_dir='model/test2', label="nam")
