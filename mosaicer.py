import cv2
import numpy as nu
import binary_convert
import compare
import os
import sys
import tensorflow as tf
import config
import face_recognition as fr

FLAGS = tf.app.flags.FLAGS

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
        faces = fr.face_locations(frame)

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
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                avg_r = 0
                avg_g = 0
                avg_b = 0



        out.write(frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    out.release()
    return 'finish'

def check_image(train_dir, label):
    threshold=FLAGS.threshold
    threshold=0.47
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
