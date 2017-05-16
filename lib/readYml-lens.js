"use strict";

const fs      = require('fs')
const yaml    = require('js-yaml')


// read _config.yml
module.exports.readConfigYAML = (inFileList , lens , fileName ) =>
  new Promise( (resolve , reject) => {
    try {
      let doc = yaml.safeLoad( fs.readFileSync('./_config.yml', 'utf8') )
      
      // orverride readDir
      if(inFileList.length > 0){
        doc.readDir = inFileList
      }
      
      if(fileName && lens){
        doc.changeFileName = fileName
        doc.lensKwd = lens
        resolve( {
          "config" : doc
        } )
      }
      else reject( new Error('Please set the file name and lens keyword') )

    } catch (e) {
      reject( new Error(e) )
    }
  })