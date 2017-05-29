"use strict";

const fs      = require('fs')
const yaml    = require('js-yaml')


// read _config.yml
module.exports.readConfigYAML = (inFileList , pos1 , pos2 ) =>
  new Promise( (resolve , reject) => {
    try {
      let doc = yaml.safeLoad( fs.readFileSync('./_config.yml', 'utf8') )
      
      if(inFileList && inFileList.length > 0 && pos1 && pos2){
        doc.changeFileName = inFileList
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