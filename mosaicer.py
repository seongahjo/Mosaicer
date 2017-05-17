import cv2
import numpy as nu
import binary_convert
import compare
import os
import sys
import tensorflow as tf
import config
import dlib

FLAGS = tf.app.flags.FLAGS

face_detector = dlib.get_frontal_face_detector()


def _trim_css_to_bounds(css, image_shape):
    """
    Make sure a tuple in (top, right, bottom, left) order is within the bounds of the image.
    :param css:  plain tuple representation of the rect in (top, right, bottom, left) order
    :param image_shape: numpy shape of the image array
    :return: a trimmed plain tuple representation of the rect in (top, right, bottom, left) order
    """
    return max(css[0], 0), min(css[1], image_shape[1]), min(css[2], image_shape[0]), max(css[3], 0)

def _raw_face_locations(img, number_of_times_to_upsample=1):
    """
    Returns an array of bounding boxes of human faces in a image
    :param img: An image (as a numpy array)
    :param number_of_times_to_upsample: How many times to upsample the image looking for faces. Higher numbers find smaller faces.
    :return: A list of dlib 'rect' objects of found face locations
    """
    return face_detector(img, number_of_times_to_upsample)

def _rect_to_css(rect):
    """
    Convert a dlib 'rect' object to a plain tuple in (top, right, bottom, left) order
    :param rect: a dlib 'rect' object
    :return: a plain tuple representation of the rect in (top, right, bottom, left) order
    """
    return rect.top(), rect.right(), rect.bottom(), rect.left()


def face_locations(img, number_of_times_to_upsample=1):
    """
    Returns an array of bounding boxes of human faces in a image
    :param img: An image (as a numpy array)
    :param number_of_times_to_upsample: How many times to upsample the image looking for faces. Higher numbers find smaller faces.
    :return: A list of tuples of found face locations in css (top, right, bottom, left) order
    """
    return [_trim_css_to_bounds(_rect_to_css(face), img.shape) for face in _raw_face_locations(img, number_of_times_to_upsample)]




def mosaic(video_path,train_dir, label):
    data=video_path
    video_dir,filename=os.path.split(video_path)
    result_dir= os.path.join(video_dir,'result')
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)

    cap = cv2.VideoCapture(data)
    fps = 20.0
    width = int(cap.get(3))
    height = int(cap.get(4))
    foc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(os.path.join(result_dir,filename), foc, fps, (width, height))

    while(cap.isOpened()):
        ret, frame = cap.read()
        faces = face_locations(frame)

        for (top,right,bottom,left) in faces:
            imgFace = frame[top:bottom, left:right]
            img_yuv = cv2.cvtColor(imgFace, cv2.COLOR_BGR2YUV)

            # equalize the histogram of the Y channel
            img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])

            # convert the YUV image back to RGB format
            img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
            img_output2 = cv2.resize(img_output,(32,32),interpolation = cv2.INTER_AREA)
            cv2.imwrite("image/test_data.jpg", img_output2)
            if check_image(train_dir=train_dir, label=label):
                x=left
                y=top
                w=right-left
                h=bottom-top

                avg_r = 0
                avg_g = 0
                avg_b = 0

                temp = w % 30
                if temp != 0:
                  w = w + (30-temp)
                  temp = h % 30
                  if temp != 0:
                    h = h + (30-temp)
                  tx = int(w / 30)
                  ty = int(h / 30)

                  for time_x in range(0,tx):
                      for time_y in range(0,ty):
                          for m in range(0,30):
                              for n in range(0,30):
                                  if time_y*30+y+m < height:
                                      if time_x*30+x+n < width:
                                          if time_y*30+y+m > 0:
                                              if time_x*30+x+n > 0:
                                                  avg_r = avg_r + frame[time_y*30+y+m,time_x*30+x+n,2]
                                                  avg_g = avg_g + frame[time_y*30+y+m,time_x*30+x+n,1]
                                                  avg_b = avg_b + frame[time_y*30+y+m,time_x*30+x+n,0]
                          avg_r = avg_r / 900
                          avg_g = avg_g / 900
                          avg_b = avg_b / 900

                          for m in range(0,30):
                              for n in range(0,30):
                                  if time_y*30+y+m < height:
                                      if time_x*30+x+n < width:
                                          if time_y*30+y+m > 0:
                                              if time_x*30+x+n > 0:
                                                  frame[time_y*30+y+m,time_x*30+x+n,2] = avg_r
                                                  frame[time_y*30+y+m,time_x*30+x+n,1] = avg_g
                                                  frame[time_y*30+y+m,time_x*30+x+n,0] = avg_b


        out.write(frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    out.release()
    return 'finish'

def check_image(train_dir, label):
    threshold=FLAGS.threshold
    output=binary_convert.convert("image/test_data.jpg")
    precision=compare.evaluate(output,train_dir)
    print (precision)
    #No checkpoint file found Exception
    if precision[label] > threshold :
      return True
    else :
      return False

if __name__ == "__main__":
    if len(sys.argv) < 2 :
            print ('[Error] ./%s [filename]' %sys.argv[0])
    else:
        video_path=os.path.join(FLAGS.video_dir,sys.argv[1])
        mosaic(video_path=video_path,train_dir=FLAGS.train_dir, label=FLAGS.mosaic_label)
