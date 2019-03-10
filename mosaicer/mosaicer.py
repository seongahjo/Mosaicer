import math
import os
import shutil
import sys
import time
import cv2
import face_recognition
import numpy as np
from keras.engine.saving import load_model

from label import predict


class Mosaicer(object):
    """ Do Digitize """

    def __init__(self, model, batch_size):
        self.images = []
        self.positions = []
        self.batch_size = batch_size
        self.frames = []
        self.model = model

    def batch_job(self, frames):
        batch_of_face_locations = face_recognition.batch_face_locations(frames, number_of_times_to_upsample=0,
                                                                        batch_size=self.batch_size)
        for frame, faces in zip(frames, batch_of_face_locations):
            position = []
            image_array = []
            for (top, right, bottom, left) in faces:
                img_face = frame[top:bottom, left:right]
                img_yuv = cv2.cvtColor(img_face, cv2.COLOR_BGR2YUV)
                img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])
                img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)
                image_array.append(cv2.resize(
                    img_output, (299, 299), interpolation=cv2.INTER_AREA))
                position.append((top, right, bottom, left))
            self.images.append(image_array)  # faces
            self.positions.append(position)

    def capture(self, video_path, label):
        file_name = os.path.split(video_path)[-1]
        result_path = pre_capture(video_path)
        cap = cv2.VideoCapture(video_path)
        fps = 30.0
        width = int(cap.get(3))
        height = int(cap.get(4))
        start_time = time.time()
        feedback = []
        foc = cv2.VideoWriter_fourcc(*'XVID')
        out = cv2.VideoWriter(result_path, foc, fps, (width, height))
        temp = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or cv2.waitKey(1) & 0xFF == ord('q'):  # finished
                break
            temp.append(frame)
            self.frames.append(frame)
        cap.release()
        print('frames : {0}'.format(len(self.frames)))

        frame_size = len(self.frames)
        for i in range(math.ceil(frame_size / self.batch_size)):
            print(i)
            if (i + 1) * self.batch_size > frame_size:
                self.batch_job(frames=self.frames[i * self.batch_size: frame_size])
            else:
                self.batch_job(frames=self.frames[i * self.batch_size:(i + 1) * self.batch_size])

        if label is not None:
            chks, feedback = self.check_image(label=label)
            # mosaic 과정
            for chk, frame, position in zip(chks, self.frames, self.positions):
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
            cv2.imwrite(file_path, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))

    def check_image(self, label):
        chks = []
        precisions = predict(self.model, self.images)
        feedback = []

        for frame_image, frame_precision in zip(self.images, precisions):
            chk = []
            for face, precision in zip(frame_image, frame_precision):
                print(precision)
                # biggest = max(precision, key=(lambda key: precision[key]))
                if precision[0] > 0.5:
                    chk.append(False)
                else:
                    chk.append(True)

            chks.append(chk)
            norm = np.std(precision)
            if 0 <= norm < 0.3:
                print('feedback_add')
                feedback.append(face)

            # 자 이제 라벨을 어떻게할까
            # 폴더 불러올 때 라벨 따로 불러오던가 해야함
            # Feedback
            # temp = []
            # for data in precision.values():
            #     temp.append(data)
            # temp = np.array(temp)
            # std = np.std(temp)
            # if 0 <= std < 0.2:
            #     if not compare_face(feedback, image):
            #         feedback.append(image)
        return chks, feedback


def digitize(frame, top, right, bottom, left):
    blur = cv2.blur(frame[top:bottom, left:right], (70, 70))
    frame[top:bottom, left:right] = blur
    return frame


def pre_capture(video_path):
    video_dir, filename = os.path.split(video_path)
    feedback_dir = 'feedback'
    result_dir = os.path.join(video_dir, 'result')
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)
    if not os.path.exists(feedback_dir):
        os.makedirs(feedback_dir)
    return os.path.join(result_dir, filename)


def classify(src, des):
    if os.path.exists(des):
        os.remove(des)
    shutil.move(src, des)


# Feedback
# def compare_face(images, new_image):
#     if not images:
#         return False
#     image_encodings = []
#     for image in images:
#         image_encoding = face_recognition.face_encodings(image)
#         if image_encoding:
#             image_encodings.append(image_encoding[0])
#     unknown_encoding = face_recognition.face_encodings(new_image)
#     if not unknown_encoding:
#         return False
#     unknown_encoding = unknown_encoding[0]
#     face_distances = face_recognition.face_distance(
#         image_encodings, unknown_encoding)
#     return any(face_distance > 0.1 for face_distance in face_distances)

if __name__ == "__main__":
    mosaicer = Mosaicer(model=load_model('model/test2.h5'), batch_size=20)
    if len(sys.argv) < 2:
        print('[Error] ./%s [filename]' % sys.argv[0])
    else:
        path = os.path.join('video', sys.argv[1])
        mosaicer.capture(video_path=path, label="test")
