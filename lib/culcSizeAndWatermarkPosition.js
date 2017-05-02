"use strict";

const assign  = require('object-assign')
const Promise = require('bluebird')
const path    = require('path')
const util    = require('./util.js');

// culculate resized size and watermark size and watermark position
module.exports.culcSizeAndWatermarkPosition = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let rPLS = (fileObj.resizedPxLongSide != 0 ? fileObj.resizedPxLongSide : util.getLongSideSize(fileObj.width , fileObj.height) )
      
      let subDirName = (fileObj.resizedPxLongSide != 0 ? String(fileObj.resizedPxLongSide) + "px" : util.originName() )
      
      let resSize = util.getResizeSize( fileObj.width , fileObj.height , rPLS )
      let outputFile = path.normalize(path.join( path.resolve(fileObj.config.distDir) , subDirName , path.basename(fileObj.path).replace(path.extname(fileObj.path), "") + "_" + subDirName.replace(/px/,"") + path.extname(fileObj.path) ))
      
      let resizedWaterMarkSize = util.getResizeSize( fileObj.watermarkSize.width , fileObj.watermarkSize.height , Math.floor( Number(rPLS * Number(fileObj.config.watermarkWidthRate) ) ))
      
      let watermarkMarginPx = Math.floor(rPLS * fileObj.config.watermarkMarginRate)
      
      resolve( assign( fileObj  , {
        resizedPx            : resSize ,
        resizedWaterMarkSize : resizedWaterMarkSize ,
        watermarkMarginPx    : watermarkMarginPx ,
        subDirName           : subDirName ,
        outputFilePath       : outputFile
      }))
      
    })
  ))