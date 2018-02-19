import os
import shutil
import sys
import time

import cv2
import face_recognition
import tensorflow as tf
import numpy as np
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
    frames = []
    positions = []
    video_dir, filename = os.path.split(video_path)
    feedback_dir = 'feedback'
    result_dir = os.path.join(video_dir, 'result')  # directory to save result of digitization

    file_name = os.path.splitext(filename)[0]
    skip_frame = 30
    image_size = 299
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)
    if not os.path.exists(feedback_dir):
        os.makedirs(feedback_dir)
    index = 0
    cap = cv2.VideoCapture(video_path)
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))  # total frames
    fps = 30.0
    width = int(cap.get(3))
    height = int(cap.get(4))
    start_time = time.time()
    feedback = []
    foc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(os.path.join(result_dir, filename), foc, fps, (width, height))
    face_count = [0] * length * 100
    while (cap.isOpened()):

        ret, frame = cap.read()
        if not ret:  # finished
            break
        position = []

        if index % skip_frame == 0:
            faces = face_recognition.face_locations(frame, number_of_times_to_upsample=0, model="cnn")
        for (top, right, bottom, left) in faces:
            img_face = frame[top:bottom, left:right]
            img_yuv = cv2.cvtColor(img_face, cv2.COLOR_BGR2YUV)
            face_count[index] += 1
            # equalize the histogram of the Y channel
            img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])

            # convert the YUV image back to RGB format
            img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
            img_output2 = cv2.resize(img_output, (image_size, image_size), interpolation=cv2.INTER_AREA)
            images.append(img_output2)  # faces
            positions.append((top, right, bottom, left))

        index += 1
        frames.append(frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    if label is not None:
        cnt = 0
        chk, feedback = check_image(images=images, train_dir=train_dir, label=label)
        for idx, frame in enumerate(frames):
            for i in range(face_count[idx]):
                if chk[cnt]:
                    (top, right, bottom, left) = positions[cnt]
                    frame = digitize(frame, top, right, bottom, left)
                cnt += 1
            out.write(frame)
    out.release()
    end_time = time.time()
    print('time : {0}'.format(end_time - start_time))

    count = 0
    for image in feedback:
        count += 1
        cv2.imwrite(os.path.join('feedback', file_name + '_face' + str(count) + '.jpg'), image)
    return 'finish'


def digitize(frame, top, right, bottom, left):
    blur = cv2.blur(frame[top:bottom, left:right], (70, 70))
    frame[top:bottom, left:right] = blur
    return frame


def check_image(images, train_dir, label):
    """

    function to check if a image is the one that I want to digitize

    Args:
        images : images to check
        train_dir : directory stores result of train
        label : label
    """

    """
    # Make Dirs
    if not os.path.exists(os.path.join(folder_path, str(label))):
        os.makedirs(os.path.join(folder_path, str(label)))
    if not os.path.exists(os.path.join(folder_path, str(0))):
        os.makedirs(os.path.join(folder_path, str(0)))
    if not os.path.exists(os.path.join(folder_path, "etc")):
        os.makedirs(os.path.join(folder_path, "etc"))
    """
    chk = []
    precisions = label_image.run(images, train_dir)
    feedback = []
    for idx, precision in enumerate(precisions):
        biggest = max(precision, key=(lambda key: precision[key]))
        if biggest in label:
            chk.append(False)
        else:
            chk.append(True)
        temp = []
        for data in precision.values():
            temp.append(data)
        temp = np.array(temp)

        std = np.std(temp)
        if 0 <= std < 1:
            print(std)
            feedback.append(images[idx])
    return chk, feedback


def classify(src, des):
    if os.path.exists(des):
        os.remove(des)
    shutil.move(src, des)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('[Error] ./%s [filename]' % sys.argv[0])
    else:
        path = os.path.join('video', sys.argv[1])
        capture(video_path=path, train_dir='model', label="jo")
