var express= require('express')
var router = express.Router()
var path= require('path')
var axios = require('axios')

var pythonServer='http://localhost:9999/'


router.get('/convert',function(req,res,next){
    var id=req.query.id
    var folder = req.query.folder
    var label = req.query.label
    var imageDir=path.join('/tmp/',id,'upload',folder)
    var dataDir= path.join('/tmp/',id,'data')
    var data={
      'image_dir': imageDir,
      'data_dir':dataDir,
      'label':label
    }
    axios.get(pythonServer+'convert',{
      params : data
    }).then(function(response){
        console.log(response.data)
    res.json(response.data)
	})
})


router.get('/train',function(req,res,next){
    var id=req.query.id
    var trainDir=path.join('/tmp/',id,'train')
    var dataDir= path.join('/tmp/',id,'data')
    var data={
      'train_dir': trainDir,
      'data_dir':dataDir
    }
    axios.get(pythonServer+'train',{
      params : data
    }).then(function(response){
        console.log(response.data)
    res.json(response.data)
	})
})


module.exports=router
