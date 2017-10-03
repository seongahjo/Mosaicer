import cv2
import numpy as nu
import binary_convert
import compare
import os
import sys
import tensorflow as tf
import config
import face_recognition
import shutil
import random
import time

FLAGS = tf.app.flags.FLAGS


def mosaic(video_path,train_dir, label):
    data=video_path
    video_dir,filename=os.path.split(video_path)
    result_dir= os.path.join(video_dir,'result')
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)
    index=0
    cap = cv2.VideoCapture(data)
    fps = 30.0
    width = int(cap.get(3))
    height = int(cap.get(4))
    start_time = time.time()
    foc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(os.path.join(result_dir,filename), foc, fps, (width, height))
    face_count=0
    while(cap.isOpened()):
        ret, frame = cap.read()
        if not ret:
            break
        if index%3==0:
            faces = face_recognition.face_locations(frame,number_of_times_to_upsample=0,model="cnn")
        for (top,right,bottom,left) in faces:
            imgFace = frame[top:bottom, left:right]
            img_yuv = cv2.cvtColor(imgFace, cv2.COLOR_BGR2YUV)

            # equalize the histogram of the Y channel
            img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])

            # convert the YUV image back to RGB format
            img_output = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
            img_output2 = cv2.resize(img_output,(32,32),interpolation = cv2.INTER_AREA)
            cv2.imwrite("image/"+filename[0]+str(face_count)+".jpg", img_output2)
            if check_image(filename=filename[0],train_dir=train_dir, label=label,count=face_count):
                frame=job(frame=frame,x=left,y=top,w=right-left,h=bottom-top,height=height,width=width)
            face_count+=1
        index+=1
        out.write(frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    end_time=time.time()
    cap.release()
    out.release()
    print('time : {0}'.format(end_time-start_time))
    return 'finish'


def job(frame,x,y,w,h,height,width):
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
                      if time_y*30+y+15 < height:
                          if time_x*30+x+15 < width:
                                      avg_r = frame[time_y*30+y+15,time_x*30+x+15,2]
                                      avg_g = frame[time_y*30+y+15,time_x*30+x+15,1]
                                      avg_b = frame[time_y*30+y+15,time_x*30+x+15,0]
                          else:
                                      avg_r = frame[time_y*30+y+15,time_x*30+x+1,2]
                                      avg_g = frame[time_y*30+y+15,time_x*30+x+1,1]
                                      avg_b = frame[time_y*30+y+15,time_x*30+x+1,0]
                      else:
                          if time_x*30+x+15 < width:
                                      avg_r = frame[time_y*30+y+1,time_x*30+x+15,2]
                                      avg_g = frame[time_y*30+y+1,time_x*30+x+15,1]
                                      avg_b = frame[time_y*30+y+1,time_x*30+x+15,0]
                          else:
                                      avg_r = frame[time_y*30+y+1,time_x*30+x+1,2]
                                      avg_g = frame[time_y*30+y+1,time_x*30+x+1,1]
                                      avg_b = frame[time_y*30+y+1,time_x*30+x+1,0]

                      for m in range(0,30):
                          for n in range(0,30):
                              if time_y*30+y+m < height:
                                  if time_x*30+x+n < width:
                                      frame[time_y*30+y+m,time_x*30+x+n,2] = avg_r
                                      frame[time_y*30+y+m,time_x*30+x+n,1] = avg_g
                                      frame[time_y*30+y+m,time_x*30+x+n,0] = avg_b
    return frame



def check_image(filename, train_dir, label,count):
    threshold=FLAGS.threshold
    filename="image/"+filename+str(count)+".jpg"
    output=binary_convert.convert(filename)
    if not os.path.exists("image/"+str(label)):
        os.makedirs("image/"+str(label))
    if not os.path.exists("image/"+str(0)):
        os.makedirs("image/"+str(0))
    precision=compare.evaluate(output,train_dir)
    print (precision)
    try:
        if precision[label] > threshold :
          path="image/"+str(label)+"/"
          if os.path.exists(os.path.join(path,filename))
            os.remove(os.path.join(path,filename))
          shutil.move(filename,path)
          return True
        else :
          path="image/"+str(0)+"/"
          if os.path.exists(os.path.join(path,filename))
            os.remove(os.path.join(path,filename))
          shutil.move(filename,path)
          return False
    except:
        shutil.move(filename,"image/"+str(label)+random.randint(1,100)+"/")
    finally:
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
