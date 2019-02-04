import os
import shutil
import sys
import time

import cv2
import face_recognition
import numpy as np
import label_image


def batch_job(frames, images, positions, face_counts, batch_size):
    batch_of_face_locations = face_recognition.batch_face_locations(frames, number_of_times_to_upsample=0,
                                                                    batch_size=batch_size)

    for frame, faces in zip(frames, batch_of_face_locations):
        position = []
        for (top, right, bottom, left) in faces:
            img_face = frame[top:bottom, left:right]
            img_yuv = cv2.cvtColor(img_face, cv2.COLOR_BGR2YUV)
            # equalize the histogram of the Y channel
            img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])
            # convert the YUV image back to RGB format
            img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)
            img_output2 = cv2.resize(
                img_output, (299, 299), interpolation=cv2.INTER_AREA)
            images.append(img_output2)  # faces
            position.append((top, right, bottom, left))
        face_counts.append(len(faces))
        positions.append(position)


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
    # directory to save result of digitization
    result_dir = os.path.join(video_dir, 'result')

    file_name = os.path.splitext(filename)[0]
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)
    if not os.path.exists(feedback_dir):
        os.makedirs(feedback_dir)

    cap = cv2.VideoCapture(video_path)
    fps = 30.0
    width = int(cap.get(3))
    height = int(cap.get(4))
    start_time = time.time()
    feedback = []
    face_counts = []
    foc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(os.path.join(
        result_dir, filename), foc, fps, (width, height))
    batch_size = 20
    temp = []
    while cap.isOpened():

        ret, frame = cap.read()
        if not ret:  # finished
            break
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        temp.append(frame)
        frames.append(frame)

        if len(temp) == batch_size:
            batch_job(frames=temp, images=images, positions=positions,
                      face_counts=face_counts, batch_size=batch_size)
            temp = []
    cap.release()
    if len(temp) != 0:
        batch_job(frames=temp, images=images, positions=positions,
                  face_counts=face_counts, batch_size=len(temp))

    if label is not None:
        chks, feedback = check_image(
            images=images, train_dir=train_dir, face_count=face_counts, label=label)
        # per frame
        for chk, frame, position, face_count in zip(chks, frames, positions, face_counts):
            for flag, pos in zip(chk, position):
                if flag:
                    (top, right, bottom, left) = pos
                    frame = digitize(frame, top, right, bottom, left)
            out.write(frame)
    out.release()
    end_time = time.time()
    print('time : {0}'.format(end_time - start_time))

    count = 0
    for image in feedback:
        count += 1
        name = file_name + '_face' + str(count)
        file_path = os.path.join('feedback', name + '.jpg')
        cv2.imwrite(file_path, image)
    return 'finish'


def compare_face(images, new_image):
    if not images:
        return False

    image_encodings = []
    for image in images:
        image_encoding = face_recognition.face_encodings(image)
        if image_encoding:
            image_encodings.append(image_encoding[0])
    unknown_encoding = face_recognition.face_encodings(new_image)
    if not unknown_encoding:
        return False

    unknown_encoding = unknown_encoding[0]
    face_distances = face_recognition.face_distance(
        image_encodings, unknown_encoding)
    return any(face_distance > 0.1 for face_distance in face_distances)


def digitize(frame, top, right, bottom, left):
    blur = cv2.blur(frame[top:bottom, left:right], (70, 70))
    frame[top:bottom, left:right] = blur
    return frame


def check_image(images, train_dir, face_count, label):
    """

    function to check if a image is the one that I want to digitize

    Args:
        images : images to check
        train_dir : directory stores result of train
        face_count : count of faces
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
    chks = []
    precisions = label_image.run(images, train_dir)
    feedback = []
    now_frame = 0
    count_image = 0
    chk = []

    for image, precision in zip(images, precisions):
        count_image += 1

        biggest = max(precision, key=(lambda key: precision[key]))
        if biggest in label:
            chk.append(False)
        else:
            chk.append(True)

        if count_image == face_count[now_frame]:
            count_image = 0
            now_frame += 1
            chks.append(chk)
            chk = []

        temp = []
        for data in precision.values():
            temp.append(data)
        temp = np.array(temp)
        std = np.std(temp)
        if 0 <= std < 0.2:
            if not compare_face(feedback, image):
                feedback.append(image)
    return chks, feedback


def classify(src, des):
    if os.path.exists(des):
        os.remove(des)
    shutil.move(src, des)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('[Error] ./%s [filename]' % sys.argv[0])
    else:
        path = os.path.join('video', sys.argv[1])
        capture(video_path=path, train_dir='model', label="nam")
