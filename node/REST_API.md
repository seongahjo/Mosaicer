## REST API


### POST /api/upload

#### Parameters
* <strong>file</strong> : File to upload
* <strong>id</strong> : Service id
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
* <strong>id</strong> : Service id
* <strong>folder</strong> : Folder to make

#### Output
* directory

#### Example Result
```
/tmp/test/upload/folder
```

### GET /api/convert

#### Parameters
* <strong>id</strong> : Service id
* <strong>folder</strong> : Folder to convert

#### Output
* true

#### Example Result
```
true
```

### GET /api/train

#### Parameters
* <strong>id</strong> : Service id

#### Output
* true

#### Example Result
```
true
```

### POST /api/compare

#### Parameters
* <strong>id</strong> : Service id
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



### GET /api/mosaic

#### Parameters
* <strong>id</strong> : Service id
* <strong>filename</strong> : Name of file to mosaic
* <strong>label</strong> : Label to mosaic

#### Output
* true

#### Example Result
```
true
```


### POST /api/donwload

#### Parameters
* <strong>id</strong> : Service id
* <strong>filename</strong> : Name of file to download

#### Output
* download file
