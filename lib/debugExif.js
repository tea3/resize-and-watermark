"use strict";

const fs      = require('fs')
const assign  = require('object-assign')
const Promise = require('bluebird')
const exif    = require('exif-reader')

// debug edited exif
module.exports.debugExif = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
        fs.readFile(fileObj.outputFilePath , ( err , data ) => {
            let meta = exif(data.slice(data.toString('ascii', 0, 100).indexOf('Exif')));
            console.log(meta)
            resolve( fileObj )
        })
    })
  ))