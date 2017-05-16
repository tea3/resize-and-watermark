"use strict";

const assign  = require('object-assign')
const sizeOf  = require('probe-image-size')
const fs      = require('fs');
const path    = require('path')
const util    = require('./util.js')

module.exports.getImgSize = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      let dimensions = sizeOf.sync(fs.readFileSync(fileObj.path))
      // sizeOf( fileObj.path , ( err, dimensions ) => {
        if(!dimensions) reject( new Error('sizeOf error') )
        else{
          util.progressLog( path.basename(fileObj.path) , "Get ImgSize" )
          resolve( assign( fileObj , {
            width : dimensions.width ,
            height: dimensions.height
          }))
        }
      // })
    })
  ))