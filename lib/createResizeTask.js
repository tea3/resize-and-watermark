"use strict";

const Promise = require('bluebird')

// create resize task
module.exports.createResizeTask = ( inObj ) =>
    new Promise( ( resolve , reject ) => {
      if(!inObj.config.resizePix || inObj.config.resizePix.length == 0) reject("Not found resizePix option. Please eidt the _config.yml .")
      else {
        let resizeTask = []
        for(let resizePxLongSide of inObj.config.resizePix ){
          for(let fileElm of inObj.files){
            let isEnabledWatermark = !isContainElm(resizePxLongSide , inObj.config.ignoreWatermark)
            
            resizeTask.push( {
              "path"                    : fileElm.path ,
              "resizedPxLongSide"       : resizePxLongSide ,
              "enabledWatermark"        : isEnabledWatermark ,
              "watermarkSize"           : inObj.watermarkSize ,
              "config"                  : inObj.config ,
              "camLens"                 : inObj.camLens ,
              "watermarkPositionSetting": inObj.watermarkPositionSetting
            } );
          }
        }
        resolve( resizeTask )
      }
    })


// Confirm whether array elements are included
let isContainElm = ( inElm , inSearchArr ) => {
  if( !inSearchArr || inSearchArr.length == 0 )return false
  for( let i of inSearchArr) {
    if( i == inElm ) {
      return true
      break
    }
  }
  return false
}