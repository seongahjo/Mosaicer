# Mosaicer
Using OpenCV & Tensorflow Digitize One's face on Video or Picture

## Requirement
+ OpenCV & Tensorflow & PIL
+ Flask (web.py)

## Modules
* Convert
* Train
* Evaluate
* Web
* Mosaic

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

# API

## Binary_Convert

### convert_global(image_dir,data_dir,label)

#### image_dir
type : `string`
Directory that stores image to convert

#### data_dir
type : `string`
Directory that stores converted binary file which is result of convert

#### label
type : `integer`
Label that you want to attach
<br>

### convert(img) : string

#### img
type : `image`
image to convert binary file

<br>
## Train

### train(data_dir, train_dir) : boolean

#### data_dir
type : `string`
Directory that stores converted bianry files

#### train_dir
type : `string`
Directory that stores model which is result of train

<br>
## Compare
### evaluate(output, train_dir)

#### output
type : `string`
Path of binary file

#### train_dir
type : `string`
Directory that stores model which is result of train
<br>


# Web Module

## REST API

### upload(image_dir, images)

#### image_dir
type : `string`
Directory that stores image to convert

#### images
type : `file`
Images that you want to convert


<br>
### convert(image_dir, data_dir, label)

#### image_dir
type : `string`
Directory that stores image to convert

#### data_dir
type : `string`
Directory that stores converted binary file which is result of convert

#### label
type : `integer`
Label that you want to attach


<br>
### train(data_dir, train_dir) : boolean

#### data_dir
type : `string`
Directory that stores converted bianry files

#### train_dir
type : `string`
Directory that stores model which is result of train


## License
Mosaicer is released under [MIT License]

[MIT License]: https://github.com/seongahjo/Mosaicer/blob/dev/LICENSE
