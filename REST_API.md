## REST API


### POST /upload

#### Parameters
* <strong>image_dir</strong> : Directory that stores image to convert
* <strong>file</strong> : Images that you want to convert

#### Output
* true

#### Example Result
```
true
```

### GET /convert

#### Parameters
* <strong>image_dir</strong> : Directory that stores image to convert
* <strong>data_dir</strong> : Directory that stores converted binary file which is result of convert
* <strong>label</strong> : Label that you want to attach

#### Output
* true

#### Example Result
```
true
```

### GET /train

#### Parameters
* <strong>data_dir</strong> : Directory that stores converted binary files
* <strong>train_dir</strong> : Directory that stores model which is result of train

#### Output
* result

#### Example Result
```
true
```

### GET /mosaic

#### Parameters
* <strong>video_path</strong> : Path of your video
* <strong>train_dir</strong> : Directory that stores model which is result of train

#### Output
* label
* precision

#### Example Result
```
{
  '1' : 0.8765432,
  '0' : 0.1234568
}
```
