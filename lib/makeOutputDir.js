"use strict";

const Promise = require('bluebird')
const path    = require('path')
const mkdirp  = require('mkdirp')
const util    = require('./util.js');

// make output dir
module.exports.makeOutputDir = inObj =>
  new Promise( (resolve , reject) => {
    let outPutPath = path.resolve( inObj[0].config.distDir )
    for(let resPx of inObj[0].config.resizePix ){
      mkdirp.sync( path.join( outPutPath , ( resPx == 0 ? util.originName() : String( resPx ) + "px" ) ))
    }
    resolve(inObj)
  })