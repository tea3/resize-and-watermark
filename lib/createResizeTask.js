"use strict";

const util    = require('./util.js')

// create resize task
module.exports.createResizeTask = ( inObj ) =>
    new Promise( ( resolve , reject ) => {
      
      let resizeTask = []
      for( let obj of inObj ){
      
        if(!obj.config.resizePix || obj.config.resizePix.length == 0) reject("Not found resizePix option. Please eidt the _config.yml .")
        else {
          
          for(let resizePxLongSide of util.distinguish(obj.config.resizePix) ){
            
            let isEnabledWatermark = !util.isContainElm(resizePxLongSide , obj.config.ignoreWatermark)
            
            resizeTask.push( {
              "path"                    : obj.path ,
              "resizedPxLongSide"       : util.unDistinguish(resizePxLongSide) ,
              "enabledWatermark"        : isEnabledWatermark ,
              "watermarkSize"           : obj.watermarkSize ,
              "watermarkPositionSetting": obj.watermarkPositionSetting ,
              "watermarkPosition"       : obj.watermarkPosition ,
              "config"                  : obj.config ,
              "camLens"                 : obj.camLens ,
              "width"                   : obj.width ,
              "height"                  : obj.height ,
              "color"                   : obj.color ,
              "exif"                    : obj.exif ,
              "iptc"                    : obj.iptc
            } );
            
          }
          
        }
      }
      resolve( resizeTask )
    })
