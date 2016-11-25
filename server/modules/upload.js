'use strict'
// path.resolve(__dirname, '..', '..');

var exports = module.exports = function upload(req, res){
  var fs = require('fs-extra');   //File System - for file manipulation


  var fstream;

      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
          var path = require('path')
          var imgPath = path.resolve(__dirname, '..', '..');

          //Path where image will be uploaded
          fstream = fs.createWriteStream(imgPath +'/client/assets/img/phones/'+ filename);
          // console.log(imgPath +'/client/assets/img/phones/'+ filename);
          file.pipe(fstream);
          fstream.on('close', function () {
              console.log("Upload Finished of " + filename);
              // console.log("Req body is",req.busboy);
              res.json({file});

          });
      });
}
