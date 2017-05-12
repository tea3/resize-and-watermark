"use strict";

const fs      = require('fs')
const path    = require('path')
const Promise = require('bluebird')
const util    = require('./util.js');

// get Watermark Position
module.exports.removeFile = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      fs.readFile( fileObj.outputFilePath , ( err , data ) => {
        if( !err ) {
          fs.unlink( fileObj.outputFilePath , ( err , data ) => {
            if (err) reject( new Error(err) )
            else {
              util.progressLog( path.basename(fileObj.outputFilePath) , "RemoveFile" )
              resolve( fileObj )
            }
          })
        }
        else resolve( fileObj )
      })
    })
  ))
