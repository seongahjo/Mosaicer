# Mosaicer
Using OpenCV & Tensorflow Digitize One's face on Video or Picture

# Requirement
+ OpenCV & Tensorflow & PIL
+ Flask (web.py)

# How To Train
```
1. Put your 32x32 Images on 'DATA' folder

2. RUN python convert.py with label

  JUST LIKE [python convert.py 1] or [python convert.py 0]
  
  images with label 1 is digitized by default

3. RUN python train.py
```


# How To 
```
1. If you want to digitize one's face on the video

2. Put the video on 'MOVIE' folder

3. RUN python mosaicer.py with your video name

JUST LIKE [python mosacier.py test.avi]

4. WATCH YOUR VIDEO 'result.avi'
```

```
1. If you want to serve a Mosaic Server, RUN web.py

2. Let Clients upload 32x32 image to your server

3. Then It'll be tell you the results in JSON format
```
