"use strict";

const assign  = require('object-assign')
const Promise = require('bluebird')
const path    = require('path')
const nfl     = require('node-filelist')

// get file list
module.exports.fileList = ( inObj ) =>
    new Promise( ( resolve , reject ) => {
      let retrunFileList = []
      let readFileDir    = []
      
      for(let i of inObj.config.readDir){
        readFileDir.push( i )
      }
      
      nfl.read( readFileDir , { "ext" : "jpeg|jpg|JPG|JPEG" } , results => {
          if( !results || results.length == 0 ) reject( new Error('Image files not found.') )
          else {
            for(let res of results ){
              retrunFileList.push({
                path : res.path
              })
            }
            
            resolve( assign( inObj , {
                "files" : retrunFileList
            }) )
          }
      })
    })
