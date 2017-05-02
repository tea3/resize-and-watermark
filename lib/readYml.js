"use strict";

const Promise = require('bluebird')
const fs      = require('fs')
const yaml    = require('js-yaml')


// read _config.yml
module.exports.readConfigYAML = (inFileList) =>
  new Promise( (resolve , reject) => {
    try {
      let doc = yaml.safeLoad( fs.readFileSync('./_config.yml', 'utf8') )
      
      // orverride readDir
      if(inFileList.length > 0){
        doc.readDir = inFileList
      }
      
      resolve( {
        "config" : doc
      } )
    } catch (e) {
      reject( new Error(e) )
    }
  })