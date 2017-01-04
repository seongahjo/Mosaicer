# Mosaicer
Using OpenCV & Tensorflow Digitize One's face on Video or Picture

* Slideshare : http://www.slideshare.net/SuekyeongNam/mosaicer
* Youtube : https://youtu.be/qifwKGzVR4c

## Requirement
+ OpenCV & Tensorflow & PIL
+ Flask (web.py)

## Modules
* Convert
 * Image files to Labeled Binary file
* Train
 * Make model by labeled binary files
* Evaluate
 * Classify image by model which is a result of Train
* Mosaic
 * Digitize your video by model 
* Web
 * Support above functions by REST API request


### How To Train
```
1. Put your 32x32 Images on 'DATA' folder

2. RUN python convert.py with label

  EX) [python convert.py 1] or [python convert.py 0]

  images with label 1 is digitized by default

3. RUN python train.py
```


### How To
```
1. If you want to digitize one's face on the video

2. Put the video on 'VIDEO' folder

3. RUN python mosaicer.py with your video name

  EX) [python mosacier.py test.avi]

4. WATCH YOUR VIDEO 'result.avi'
```

## [API]


## [REST API]
For Web Module


## License
Mosaicer is released under [MIT License]

[MIT License]: https://github.com/seongahjo/Mosaicer/blob/dev/LICENSE
[API]: https://github.com/seongahjo/Mosaicer/blob/dev/LICENSE
[REST API]: https://github.com/seongahjo/Mosaicer/blob/dev/LICENSE
