"use strict";

const path        = require('path')
const exec        = require('child_process').exec;


// write iptc & xmp
module.exports.editXmpAndIPTC = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let update_kws = []
      let isPosEdit  = false
      let isLensEdit = false
      if(fileObj.iptc.keywords){
        for( let kw of fileObj.iptc.keywords){
          if(kw.match(/^pos\:/)){
            if( fileObj.config.pos1 && fileObj.config.pos2 ){
              update_kws.push( "pos:" + fileObj.config.pos1 + "-" + fileObj.config.pos2 )
              isPosEdit = true
            }
            else update_kws.push( kw )
          }
          else if(kw.match(/^lens\:/)){
            if( fileObj.config.lensKwd ){
              update_kws.push( "lens:" + fileObj.config.lensKwd )
              isLensEdit = true
            }
            else update_kws.push( kw )
          }
          else update_kws.push( kw )
        }
      }
      if( !isPosEdit && fileObj.config.pos1 && fileObj.config.pos2 )update_kws.push( "pos:" + fileObj.config.pos1 + "-" + fileObj.config.pos2 )
      if( !isLensEdit && fileObj.config.lensKwd )update_kws.push( "lens:" + fileObj.config.lensKwd )
      
      // set keywords
      let cmd_keywords = ""
      for(let tag of update_kws){
        cmd_keywords += ' -keywords="' + tag + '"'
      }
      
      console.log( ' -> \u001b[36m'+ path.basename(fileObj.outputFilePath) +'\u001b[0m : ' + update_kws.toString() )
      
      exec('exiftool -overwrite_original -codedcharacterset=utf8 -charset iptc=latin2' + cmd_keywords + ' "'+ fileObj.outputFilePath +'"' , (err, stdout, stderr) => {
        if (err) reject( new Error(err) )
        else{
          // console.log(`stdout: ${stdout}`);
          // console.log(`stderr: ${stderr}`);
          resolve(fileObj)
        }
      })
      
    })
  ))
