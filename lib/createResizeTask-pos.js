"use strict";

const path    = require('path')

// create resize task
module.exports.createResizeTask = ( inObj ) =>
    new Promise( ( resolve , reject ) => {
      
      let resizeTask = []
      for( let obj of inObj ){
        for( let cn of obj.config.changeFileName ){
          if( path.basename( obj.path ) == cn ){
            resizeTask.push( {
              "path"                    : obj.path ,
              "config"                  : obj.config ,
              "exif"                    : obj.exif ,
              "iptc"                    : obj.iptc ,
              "outputFilePath"          : obj.path
            } );
          }
        }
      }
      resolve( resizeTask )
    })