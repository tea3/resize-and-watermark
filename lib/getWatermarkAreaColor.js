"use strict";

const assign     = require('object-assign')
const ColorThief = require('color-thief')
const Clr        = require('color')
const fs         = require('fs')
const path       = require('path')
const util       = require('./util.js')
const Canvas     = require('canvas')
const Image      = Canvas.Image

// get exif
module.exports.getWMAreaColor = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      if( fileObj.config.watermarkColor && fileObj.config.watermarkColor == "auto" ){
        fs.readFile( fileObj.path , ( err , data ) => {
          
          // culculate watermark position
          let rPLS = util.getLongSideSize(fileObj.width , fileObj.height)
          let resizedWaterMarkSize = util.getResizeSize( fileObj.watermarkSize.width , fileObj.watermarkSize.height , Math.floor( Number(rPLS * Number(fileObj.config.watermarkWidthRate) ) ))
          let watermarkMarginPx = Math.floor(rPLS * fileObj.config.watermarkMarginRate)
          
          let wPos_X = Math.floor( fileObj.width * (fileObj.watermarkPosition.x + 0.5 ) + watermarkMarginPx * fileObj.watermarkPosition.x * (-2) - ( fileObj.watermarkPosition.x > 0 ? resizedWaterMarkSize.width : 0 ) - ( fileObj.watermarkPosition.x == 0 ? resizedWaterMarkSize.width / 2 : 0 ) )
          let wPos_Y = Math.floor( fileObj.height * (fileObj.watermarkPosition.y + 0.5 ) + watermarkMarginPx * fileObj.watermarkPosition.y * (-2) - ( fileObj.watermarkPosition.y > 0 ? resizedWaterMarkSize.height : 0 ) - ( fileObj.watermarkPosition.y == 0 ? resizedWaterMarkSize.height / 2 : 0 ) )
          
          let img = new Image;
          img.src = data;
          let canvas = new Canvas(img.width, img.height);
          let ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          
          // RGBの画素値の配列を取得
          
          let imagedata = ctx.getImageData(0, 0, img.width, img.height);
          
          let avgR = 0;
          let avgG = 0;
          let avgB = 0;
          
          // RGBの平均色を取得
          for(var y=wPos_Y; y< (wPos_Y + resizedWaterMarkSize.height) ; y++){
              for(var x=wPos_X; x< (wPos_X + resizedWaterMarkSize.width) ; x++){
                  var index = (y*imagedata.width+x)*4;
                  avgR += imagedata.data[index];    // R
                  avgG += imagedata.data[index+1];  // G
                  avgB += imagedata.data[index+2];  // B
              }
          }
          
          avgR = Math.floor(avgR / (resizedWaterMarkSize.height*resizedWaterMarkSize.width) );
          avgG = Math.floor(avgG / (resizedWaterMarkSize.height*resizedWaterMarkSize.width) );
          avgB = Math.floor(avgB / (resizedWaterMarkSize.height*resizedWaterMarkSize.width) );
          
          util.progressLog( path.basename(fileObj.path) , "Get WAColor" )
          resolve( assign( fileObj , {
              "watermarkAreaColorAvg" : [ avgR , avgG , avgB ]
          }) )
        })
      }
      else resolve( assign( fileObj , {
            "watermarkAreaColorAvg" : []
          }) )
    })
  ))



// module.exports.getWMAreaColor =  (inObj) =>
//   inObj.reduce( (promise, value) =>
//     promise.then( (editedArray) =>
//       getWMAClr(value).then( (editedElement) => {
//         editedArray.push(editedElement);
//         return editedArray;
//       })
//     )
//   , Promise.resolve([]))

// // get exif
// let getWMAClr = (fileObj) =>
//     new Promise( ( resolve , reject ) => {
//       if( fileObj.config.watermarkColor && fileObj.config.watermarkColor == "auto" ){
//         fs.readFile( fileObj.path , ( err , data ) => {
          
//           // culculate watermark position
//           let rPLS = util.getLongSideSize(fileObj.width , fileObj.height)
//           let resizedWaterMarkSize = util.getResizeSize( fileObj.watermarkSize.width , fileObj.watermarkSize.height , Math.floor( Number(rPLS * Number(fileObj.config.watermarkWidthRate) ) ))
//           let watermarkMarginPx = Math.floor(rPLS * fileObj.config.watermarkMarginRate)
          
//           let wPos_X = Math.floor( fileObj.width * (fileObj.watermarkPosition.x + 0.5 ) + watermarkMarginPx * fileObj.watermarkPosition.x * (-2) - ( fileObj.watermarkPosition.x > 0 ? resizedWaterMarkSize.width : 0 ) - ( fileObj.watermarkPosition.x == 0 ? resizedWaterMarkSize.width / 2 : 0 ) )
//           let wPos_Y = Math.floor( fileObj.height * (fileObj.watermarkPosition.y + 0.5 ) + watermarkMarginPx * fileObj.watermarkPosition.y * (-2) - ( fileObj.watermarkPosition.y > 0 ? resizedWaterMarkSize.height : 0 ) - ( fileObj.watermarkPosition.y == 0 ? resizedWaterMarkSize.height / 2 : 0 ) )
          
//           let img = new Image;
//           img.src = data;
//           let canvas = new Canvas(img.width, img.height);
//           let ctx = canvas.getContext('2d');
//           ctx.drawImage(img, 0, 0, img.width, img.height);
          
//           // RGBの画素値の配列を取得
          
//           let imagedata = ctx.getImageData(0, 0, img.width, img.height);
          
//           let avgR = 0;
//           let avgG = 0;
//           let avgB = 0;
          
//           // RGBの平均色を取得
//           for(var y=wPos_Y; y< (wPos_Y + resizedWaterMarkSize.height) ; y++){
//               for(var x=wPos_X; x< (wPos_X + resizedWaterMarkSize.width) ; x++){
//                   var index = (y*imagedata.width+x)*4;
//                   avgR += imagedata.data[index];    // R
//                   avgG += imagedata.data[index+1];  // G
//                   avgB += imagedata.data[index+2];  // B
//               }
//           }
          
//           avgR = Math.floor(avgR / (resizedWaterMarkSize.height*resizedWaterMarkSize.width) );
//           avgG = Math.floor(avgG / (resizedWaterMarkSize.height*resizedWaterMarkSize.width) );
//           avgB = Math.floor(avgB / (resizedWaterMarkSize.height*resizedWaterMarkSize.width) );
          
//           util.progressLog( path.basename(fileObj.path) , "Get WAColor" )
//           resolve( assign( fileObj , {
//               "watermarkAreaColorAvg" : [ avgR , avgG , avgB ]
//           }) )
//         })
//       }
//       else resolve( assign( fileObj , {
//             "watermarkAreaColorAvg" : []
//           }) )
//     })