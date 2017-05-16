"use strict";

const path        = require('path')
const exec        = require('child_process').exec;


// write iptc & xmp
module.exports.writeXmpAndIPTC = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let fileName = "";
      if( fileObj.path.match(/(DSC\_|DSC|\_DSC)/) ) fileName = path.basename( fileObj.path ).replace(/(DSC\_|DSC|\_DSC)/,"").replace(/(\.jpg|\.JPG|\.jpeg|\.JPEG)/,"")
      
      // set keywords
      let cmd_keywords = ""
      for(let tag of fileObj.tags){
        cmd_keywords += ' -keywords="' + tag + '"'
      }
      if(fileObj.config.constTag && fileObj.config.constTag.length > 0 ){
        for(let cTag of fileObj.config.constTag){
          cmd_keywords += ' -keywords="' + cTag + '"'
        }
      }
      
      if( !fileObj.buildCamLensInfo.LensName ) console.log( "\u001b[33mNot Found lens name. Please set the keyword of lens: \u001b[0m" + path.basename( fileObj.path ) )
      
      exec('exiftool -overwrite_original -codedcharacterset=utf8 -charset iptc=latin2 -title="' + fileObj.config.fileTitle + " " + fileName + " | " + fileObj.buildCamLensInfo.CameraName + " + " + fileObj.buildCamLensInfo.LensName + '"' + cmd_keywords + ' "'+ fileObj.outputFilePath +'"' , (err, stdout, stderr) => {
        if (err) reject( new Error(err) )
        else{
          // console.log(`stdout: ${stdout}`);
          // console.log(`stderr: ${stderr}`);
          resolve(fileObj)
        }
      })
      
    })
  ))
