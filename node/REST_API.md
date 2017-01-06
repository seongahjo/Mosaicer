## REST API


### POST /api/upload

#### Parameters
* <strong>file</strong> : file to upload
* <strong>id</strong> : service id
* <strong>folder</strong> : folder to upload

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
* <strong>id</strong> : service id
* <strong>folder</strong> : folder to make

#### Output
* good

#### Example Result
```
{
  good
}
```

### GET /api/convert

#### Parameters
* <strong>id</strong> : service id
* <strong>folder</strong> : directory to convert

#### Output
* good

#### Example Result
```
{
  good
}
```

### GET /api/train

#### Parameters
* <strong>id</strong> : service id

#### Output
* good

#### Example Result
```
{
  good
}
```

### POST /api/compare

#### Parameters
* <strong>id</strong> : service id
* <strong>images</strong> : name of file to download

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
* <strong>id</strong> : service id
* <strong>filename</strong> : name of file to mosaic
* <strong>label</strong> : label to mosaic

#### Output
* good

#### Example Result
```
{
  good
}
```


### POST /api/donwload

#### Parameters
* <strong>id</strong> : service id
* <strong>filename</strong> : name of file to download

#### Output
* download file
