[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/seongahjo/Mosaicer.svg?branch=master)](https://travis-ci.org/seongahjo/Mosaicer)
<br>

<img width="234" alt="2018-01-10 12 47 25" src="https://user-images.githubusercontent.com/10272119/34729417-f20aa9bc-f59f-11e7-8059-bb4acf7c432a.png">

Using OpenCV & Tensorflow Digitize One's face on Video <strong>Automatically</strong>

* Slideshare : https://www.slideshare.net/SuekyeongNam/mosaicer-82561931
* Youtube : https://www.youtube.com/watch?v=c5qYdZi6Dpk


## Requirement
+ Python3 

## Modules
* Convert
  * Image files to Labeled Binary file
  * Append image files in existing file
* Train
  * Make model by labeled binary files
* Evaluate
  * Classify image by model which is a result of Train
* Mosaic
  * Digitize your video by model
* Web
  * Support above functions on REST API request
* [Mosaic WEB]
  * Use Mosaicer simply by web


## How To Train
<strong>Before RUN you should configure your directory on 'config.py'</strong>

```
1. Put your 32x32 Images on 'Image' folder

2. RUN python binary_convert.py (with label, foldername)

  EX) [python binary_convert.py (1) (foldername)] or [python binary_convert.py (0) (foldername)]

  images with label 1 is digitized by default

  You should do this step twice by different label

3. RUN python train.py
```


## How To
```
1. If you want to digitize one's face on the video

2. Put the video on 'VIDEO' folder

3. RUN python mosaicer.py with your video name

  EX) [python mosacier.py test.avi]

4. WATCH YOUR VIDEO 'result.avi' in video/result folder
```

<strong>Or just Use [Mosaic WEB]</strong>

## [API]


## [REST API]
For Web Module

## [Library]


## License
Mosaicer is released under [MIT License]

[Library]: https://github.com/seongahjo/Mosaicer/blob/master/NOTICE
[MIT License]: https://github.com/seongahjo/Mosaicer/blob/dev/LICENSE
[API]: https://github.com/seongahjo/Mosaicer/blob/master/API.md
[REST API]: https://github.com/seongahjo/Mosaicer/blob/master/REST_API.md
[Mosaic WEB]: https://github.com/seongahjo/Mosaicer/tree/master/node
