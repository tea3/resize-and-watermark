"use strict";

const fs      = require('fs')
const yaml    = require('js-yaml')


// read _config.yml
module.exports.readConfigYAML = (inFileList , pos1 , pos2 , fileName ) =>
  new Promise( (resolve , reject) => {
    try {
      let doc = yaml.safeLoad( fs.readFileSync('./_config.yml', 'utf8') )
      
      // orverride readDir
      if(inFileList.length > 0){
        doc.readDir = inFileList
      }
      
      if(fileName && pos1 && pos2){
        doc.changeFileName = fileName
        doc.pos1 = pos1
        doc.pos2 = pos2
        resolve( {
          "config" : doc
        } )
      }
      else reject( new Error('Please set the file name') )

    } catch (e) {
      reject( new Error(e) )
    }
  })