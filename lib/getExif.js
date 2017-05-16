"use strict";

const fs      = require('fs')
const assign  = require('object-assign')
const piexif  = require("piexifjs")
const iptc    = require('node-iptc')
const path    = require('path')
const util    = require('./util.js')
// const exif = require('exif-reader')

// get exif
module.exports.getExif = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      fs.readFile( fileObj.path , ( err , data ) => {
        if( err ) reject( new Error(err) )
        else{
          // case1 : use exif-reader
          // let meta1 = exif(data.slice(data.toString('ascii', 0, 100).indexOf('Exif')));
          // console.log(meta1);

          // case2 : use piexifjs
          let meta      = piexif.load( data.toString('binary') )
          let iptc_data = iptc(data) || {}

          util.progressLog( path.basename(fileObj.path) , "Get Exif" )
          resolve( assign( fileObj , {
            "exif" : meta ,
            "iptc" : iptc_data
          }) )
        }
      })
    })
  ))