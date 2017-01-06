## REST API


### POST /upload

#### Parameters
* <strong>image_dir</strong> : Directory that stores image to convert
* <strong>file</strong> : Images that you want to convert

#### Output
* good

#### Example Result
```
{
  good
}
```

### GET /convert

#### Parameters
* <strong>image_dir</strong> : Directory that stores image to convert
* <strong>data_dir</strong> : Directory that stores converted binary file which is result of convert
* <strong>label</strong> : Label that you want to attach

#### Output
* good

#### Example Result
```
{
  good
}
```

### GET /train

#### Parameters
* <strong>data_dir</strong> : Directory that stores converted binary files
* <strong>train_dir</strong> : Directory that stores model which is result of train

#### Output
* result

#### Example Result
```
{
  result : 'true'
}
```

### GET /mosaic

#### Parameters
* <strong>video_path</strong> : Path of your video
* <strong>train_dir</strong> : Directory that stores model which is result of train

#### Output
* good

#### Example Result
```
{
  good
}
```
