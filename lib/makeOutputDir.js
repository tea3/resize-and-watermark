"use strict";

const path    = require('path')
const mkdirp  = require('mkdirp')
const util    = require('./util.js');

// make output dir
module.exports.makeOutputDir = inObj =>
  new Promise( (resolve , reject) => {
    let outPutPath = path.resolve( inObj[0].config.distDir )
    let createDir = []
    for(let fileObj of inObj ){
      let subDirName = util.subDirName( fileObj.resizedPxLongSide , fileObj.enabledWatermark )
      if( createDir.indexOf(fileObj.subDirName) == -1 ){
      	mkdirp.sync( path.join( outPutPath , subDirName ))
      	createDir.push(subDirName)
      }
    }
    resolve(inObj)
  })