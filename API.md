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



### convert(img) : string

#### img
type : `image`
image to convert binary file



## Train

### train(data_dir, train_dir) : boolean

#### data_dir
type : `string`
Directory that stores converted bianry files

#### train_dir
type : `string`
Directory that stores model which is result of train



## Compare
### evaluate(output, train_dir)

#### output
type : `string`
Path of binary file

#### train_dir
type : `string`
Directory that stores model which is result of train


## Mosaicer
### mosaic(video_path, train_dir)

#### video_path
type : `string`
Path of your video

#### train_dir
type : `string`
Directory that stores model which is result of train
