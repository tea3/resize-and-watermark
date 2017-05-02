"use strict";

const assign  = require('object-assign')
const Promise = require('bluebird')
const sizeOf  = require('image-size')

// get image size
module.exports.getImgSize = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      sizeOf( fileObj.path , ( err, dimensions ) => {
        resolve( assign( fileObj , {
          width : dimensions.width ,
          height: dimensions.height
        }))
      })
    })
  ))
