"use strict";

const fs      = require('fs')
const yaml    = require('js-yaml')


// read _config.yml
module.exports.readConfigYAML = (files , lens ) =>
  new Promise( (resolve , reject) => {
    try {
      let doc = yaml.safeLoad( fs.readFileSync('./_config.yml', 'utf8') )
      
      if(files && files.length > 0 && lens){
        doc.changeFileName = files
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