"use strict";

const assign  = require('object-assign')
const path    = require('path')
const util    = require('./util.js');

// culculate resized size and watermark size and watermark position
module.exports.culcSizeAndWatermarkPosition = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let subDirName = util.subDirName( fileObj.resizedPxLongSide , fileObj.enabledWatermark )
      let outputFile = path.normalize(path.join( path.resolve(fileObj.config.distDir) , subDirName , path.basename(fileObj.path).replace(path.extname(fileObj.path), "") + "_" + subDirName.replace(/px/,"").replace(/\swatermark$/,"") + path.extname(fileObj.path) ))
      
      let rPLS = (fileObj.resizedPxLongSide != 0 ? fileObj.resizedPxLongSide : util.getLongSideSize(fileObj.width , fileObj.height) )
      let resSize = util.getResizeSize( fileObj.width , fileObj.height , rPLS )
      let resizedWaterMarkSize = util.getResizeSize( fileObj.watermarkSize.width , fileObj.watermarkSize.height , Math.floor( Number(rPLS * Number(fileObj.config.watermarkWidthRate) ) ))
      let watermarkMarginPx = Math.floor(rPLS * fileObj.config.watermarkMarginRate)
      
      resolve( assign( fileObj  , {
        subDirName           : subDirName ,
        outputFilePath       : outputFile ,
        resizedPx            : resSize ,
        resizedWaterMarkSize : resizedWaterMarkSize ,
        watermarkMarginPx    : watermarkMarginPx
      }))

    })
  ))