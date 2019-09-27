import math
import os
import shutil
import time

import cv2
import face_recognition

FPS = 30


def frame_pre_processing(img):
    img_yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
    img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])
    img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)
    return img_output


class Mosaicer(object):
    """ Do Digitize """

    def __init__(self, batch_size):
        self.batch_size = batch_size
        self.image_size = (224, 224)

    def _face_recognition(self, frames):
        """ 얼굴 찾기

        :param frames: 입력된 동영상 프레임들
        :return:
            faces: 얼굴 이미지 배열, (frame_size, face_count)
            positions: 동영상 얼굴 위치 배열, (frame_size, face_count)
        """

        def fn_batch(now_frames, face_locations):
            face_images = []
            positions = []

            for frame, faces in zip(now_frames, face_locations):
                position = []
                each_face = []
                for (top, right, bottom, left) in faces:
                    img_face = frame[top:bottom, left:right]
                    img_output = frame_pre_processing(img_face)
                    each_face.append(cv2.resize(
                        img_output, self.image_size, interpolation=cv2.INTER_AREA))
                    position.append((top, right, bottom, left))
                face_images.append(each_face)  # faces
                positions.append(position)
            return face_images, positions

        frame_size = len(frames)
        epoch = math.ceil(frame_size / self.batch_size)

        batch_of_face_locations = face_recognition.batch_face_locations(frames, number_of_times_to_upsample=0,
                                                                        batch_size=self.batch_size)
        for i in range(epoch):
            epoch_from = i * self.batch_size
            epoch_to = (i + 1) * self.batch_size if i < epoch - 1 else frame_size

            faces, positions = fn_batch(frames[epoch_from:epoch_to], batch_of_face_locations[epoch_from: epoch_to])
            print('epoch {} found {} faces in {} frames'.format(i, len(faces), epoch_to - epoch_from))

        return faces, positions

    def _write(self, frames, video_size, result_path='video/result.avi'):
        """
        모자이크 처리된 동영상 쓰기
        :param frames: 모자이크 처리된 프레임
        :param video_size: 비디오 크기
        :param result_path: 모자이크 처리된 동영상이 저장될 위치
        :return:
        """
        foc = cv2.VideoWriter_fourcc(*'XVID')
        out = cv2.VideoWriter(result_path, foc, FPS, video_size)
        for frame in frames:
            out.write(frame)
        out.release()
        print('video digitized : {} '.format(result_path))

    def _digitize(self, frames, list_pos):
        """
        프레임 모자이크
        :param frames: 동영상 프레임 배열
        :param list_pos: 얼굴 위치 배열
        :return:
            digitize_frames: 모자이크 처리된 동영상 프레임
        """

        def fn_digitize(f, p):
            (top, right, bottom, left) = p
            blur = cv2.blur(f[top:bottom, left:right], (70, 70))
            f[top:bottom, left:right] = blur
            return f

        digitize_frames = []
        for frame, frame_pos in zip(frames, list_pos):
            now_frame = frame
            for pos in frame_pos:
                now_frame = fn_digitize(now_frame, pos)
            digitize_frames.append(now_frame)

        return digitize_frames

    def _capture(self, video_path):
        """
        동영상 읽기
        :param video_path:
        :return:
            frames: 동영상의 프레임들
            video_size: 비디오 크기
        """
        cap = cv2.VideoCapture(video_path)
        width = int(cap.get(3))
        height = int(cap.get(4))
        start_time = time.time()
        frames = []
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or cv2.waitKey(1) & 0xFF == ord('q'):  # finished
                break
            frames.append(frame)
        cap.release()
        print('frames : {0}'.format(len(frames)))
        end_time = time.time()
        print('time : {0}'.format(end_time - start_time))
        return frames, (width, height)

    def run(self, video_path):
        frames, video_size = self._capture(video_path)
        faces, positions = self._face_recognition(frames)
        self._write(self._digitize(frames, positions), video_size=video_size)


def classify(src, des):
    if os.path.exists(des):
        os.remove(des)
    shutil.move(src, des)


if __name__ == "__main__":
    mosaicer = Mosaicer(batch_size=20)
    mosaicer.run(video_path='video/test.avi')