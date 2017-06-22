"use strict";

const assign  = require('object-assign')
const path    = require('path')
const nfl     = require('node-filelist')

// get file list
module.exports.fileList = ( inObj ) =>
    new Promise( ( resolve , reject ) => {
      let retrunFileTask = []
      let readFileDir    = []
      
      for(let i of inObj.config.readDir){
        readFileDir.push( i )
      }
      
      nfl.read( readFileDir , { "ext" : "jpeg|jpg|JPG|JPEG" } , results => {
          if( !results || results.length == 0 ) reject( new Error('Image files not found.') )
          else {
            for(let res of results ){
              retrunFileTask.push({
                "path"                    : res.path ,
                "watermarkSize"           : inObj.watermarkSize ,
                "config"                  : inObj.config ,
                "camLens"                 : inObj.camLens ,
                "watermarkPositionSetting": inObj.watermarkPositionSetting
              })
            }
            
            retrunFileTask.sort( (a , b) => {
              return path.basename(b.path).toString().toLowerCase() - path.basename(a.path).toString().toLowerCase()
            } )
            
            resolve( retrunFileTask )
          }
      })
    })
