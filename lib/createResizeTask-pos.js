"use strict";

const path    = require('path')

// create resize task
module.exports.createResizeTask = ( inObj ) =>
    new Promise( ( resolve , reject ) => {
      
      let resizeTask = []
      for( let obj of inObj ){
        if( path.basename( obj.path ) == obj.config.changeFileName ){
          resizeTask.push( {
            "path"                    : obj.path ,
            "config"                  : obj.config ,
            "exif"                    : obj.exif ,
            "iptc"                    : obj.iptc ,
            "outputFilePath"          : obj.path
          } );
        }
      }
      resolve( resizeTask )
    })