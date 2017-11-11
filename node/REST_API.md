## REST API


### POST /api/upload

#### Parameters
* <strong>file</strong> : File to upload
* <strong>folder</strong> : Folder to upload

#### Output
* good

#### Example Result
```
{
  good
}
```

### POST /api/makeFolder

#### Parameters
* <strong>folder</strong> : Folder to make

#### Output
* directory

#### Example Result
```
/tmp/test/upload/folder
```

### GET /api/convert

#### Parameters
* <strong>folder</strong> : Folder to convert

#### Output
* true

#### Example Result
```
true
```

### GET /api/train

#### Parameters
* <string>name</string> : Model name
* <stirng>folders</strong> : directories to train

#### Output
* true

#### Example Result
```
true
```


### GET /api/mosaic

#### Parameters
* <strong>filename</strong> : Name of file to mosaic

#### Output
* true

#### Example Result
```
true
```


### POST /api/donwload

#### Parameters
* <strong>filename</strong> : Name of file to download

#### Output
* download file


# Not Used Now

### POST /api/compare

#### Parameters
* <strong>images</strong> : Images to classification

#### Output
* label : label
* precision : precision of the label

#### Example Result
```
{
  '0' : 0.99999,
  '1' : 0.00001
}
```
