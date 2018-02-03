import os
import shutil
import sys
import time

import cv2
import face_recognition
import tensorflow as tf

import binary_convert
import compare
import config

FLAGS = tf.app.flags.FLAGS


def capture(video_path, train_dir, label=None):
    """

    To extract face from video and digitize it

    Args:
        video_path : directory + name of video
        train_dir : directory stores result of train
        label : label
    """
    video_dir, filename = os.path.split(video_path)
    result_dir = os.path.join(video_dir, 'result')  # directory to save result of digitization
    file_name = os.path.splitext(filename)[0]
    file_path = os.path.join("image", file_name)  # image/video_name is a directory to save images

    if not os.path.exists(file_path):
        os.makedirs(file_path)
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)

    if type(label) is str:
        label = int(label)

    index = 0
    cap = cv2.VideoCapture(video_path)
    fps = 30.0
    width = int(cap.get(3))
    height = int(cap.get(4))
    start_time = time.time()
    foc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(os.path.join(result_dir, filename), foc, fps, (width, height))
    face_count = 0

    while (cap.isOpened()):
        ret, frame = cap.read()
        if not ret:  # finished
            break

        if index % FLAGS.skip_frame == 0:
            faces = face_recognition.face_locations(frame, number_of_times_to_upsample=0, model="cnn")
        for (top, right, bottom, left) in faces:
            imgFace = frame[top:bottom, left:right]
            img_yuv = cv2.cvtColor(imgFace, cv2.COLOR_BGR2YUV)

            # equalize the histogram of the Y channel
            img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])

            # convert the YUV image back to RGB format
            img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
            img_output2 = cv2.resize(img_output, (FLAGS.image_size, FLAGS.image_size), interpolation=cv2.INTER_AREA)
            face_path = os.path.join(file_path, str(face_count) + FLAGS.extension)
            cv2.imwrite(face_path, img_output2)

            # Mosaic Process
            if label is not None and check_image(video_name=file_name, train_dir=train_dir, label=label,
                                                 count=face_count):
                frame = digitize(frame=frame, x=left, y=top, w=right - left, h=bottom - top)

            if index % fps == 0:  # save face per 1 sec
                shutil.move(face_path,os.path.join(file_path,'face',face_count))  # temp
                face_count += 1
        index += 1
        out.write(frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    end_time = time.time()
    cap.release()
    out.release()
    print('time : {0}'.format(end_time - start_time))
    return 'finish'


def digitize(frame, x, y, w, h, ):
    blur = cv2.blur(frame[y:y + h, x:x + w, :], (70, 70))
    frame[y:y + h, x:x + w, :] = blur
    return frame


def check_image(video_name, train_dir, label, count):
    """

    function to check if a image is the one that I want to digitize

    Args:
        video_name : video name
        train_dir : directory stores result of train
        label : label
        count : save face or not

    """
    threshold = FLAGS.threshold
    file_name = str(count) + FLAGS.extension
    folder_path = os.path.join("image", video_name)
    full_path = os.path.join(folder_path, file_name)
    output = binary_convert.convert(full_path)

    """
    # Make Dirs
    if not os.path.exists(os.path.join(folder_path, str(label))):
        os.makedirs(os.path.join(folder_path, str(label)))
    if not os.path.exists(os.path.join(folder_path, str(0))):
        os.makedirs(os.path.join(folder_path, str(0)))
    if not os.path.exists(os.path.join(folder_path, "etc")):
        os.makedirs(os.path.join(folder_path, "etc"))
    """

    precision = compare.evaluate(output, train_dir)


    print(precision)


    if precision[label] > threshold:
        return True
    else:
        return False


def classify(src, des):
    if os.path.exists(des):
        os.remove(des)
    shutil.move(src, des)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('[Error] ./%s [filename]' % sys.argv[0])
    else:
        path = os.path.join(FLAGS.video_dir, sys.argv[1])
        capture(video_path=path, train_dir=FLAGS.train_dir, label=FLAGS.target_label)
