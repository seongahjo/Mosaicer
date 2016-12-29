var express= require('exprss')
var router = express.Router()
var path= require('path')
var axios = require('axios')

router.get('/convert',function(req,res,next){
    var id=req.query.id
    var folder = req.query.folder
    var label = req.query.label
    var image_dir=path.join('/tmp/',id,'upload')
    var data_dir path.join('/tmp/',id,'data')
    var data={
      'image_dir': image_dir,
      'data_dir':,data_dir
      'label':label
    }
    axios.get('http://localhost:9999/convert',{
      params : data
    }).then(function(response){
        console.log(response)
    })

})

module.exports=router
