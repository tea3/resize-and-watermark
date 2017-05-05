"use strict";

const assign  = require('object-assign')
const Promise = require('bluebird')
const sizeOf  = require('probe-image-size')
const fs      = require('fs');

// get image size
module.exports.getImgSize = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      let dimensions = sizeOf.sync(fs.readFileSync(fileObj.path))
      // sizeOf( fileObj.path , ( err, dimensions ) => {
        if(!dimensions) reject( new Error('sizeOf error') )
        else{
          resolve( assign( fileObj , {
            width : dimensions.width ,
            height: dimensions.height
          }))
        }
      // })
    })
  ))
