## REST API

### upload(image_dir, images)

#### image_dir
type : `string`
Directory that stores image to convert

#### images
type : `file`
Images that you want to convert




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




### train(data_dir, train_dir) : boolean

#### data_dir
type : `string`
Directory that stores converted bianry files

#### train_dir
type : `string`
Directory that stores model which is result of train


### mosaic(video_path, train_dir)

#### video_path
type : `string`
Path of your video

#### train_dir
type : `string`
Directory that stores model which is result of train
