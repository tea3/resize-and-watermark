"use strict";

const fs      = require('fs')
const path    = require('path')
const assign  = require('object-assign')
const Promise = require('bluebird')
const piexif  = require("piexifjs")
const util    = require('./util.js');

// edit exif
module.exports.writeExif = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      fs.readFile(fileObj.outputFilePath , ( err , data ) => {
          if( err ) reject( new Error(err) )
          else{
            let zeroth  = {}
            let exif    = {}
            let gps     = {}
            let imgData = data.toString('binary')
            
            zeroth[piexif.ImageIFD.Copyright]             = fileObj.config.copyright
            zeroth[piexif.ImageIFD.ImageDescription]      = fileObj.config.descriptionTemplate
            zeroth[piexif.ImageIFD.Make]                  = util.getExifSafe( fileObj.exif['0th']['271'] )
            zeroth[piexif.ImageIFD.Model]                 = util.getExifSafe( fileObj.exif['0th']['272'] )
            zeroth[piexif.ImageIFD.Software]              = "ImageMagick"
            zeroth[piexif.ImageIFD.DateTime]              = util.getExifSafe( fileObj.exif['0th']['306'] )
            exif[piexif.ExifIFD.ExposureTime]             = util.getExifSafe( fileObj.exif.Exif['33434'] )
            exif[piexif.ExifIFD.ExposureProgram]          = util.getExifSafe( fileObj.exif.Exif['34850'] )
            exif[piexif.ExifIFD.ISOSpeed]                 = util.getExifSafe( fileObj.exif.Exif['34855'] )
            exif[piexif.ExifIFD.SensitivityType]          = util.getExifSafe( fileObj.exif.Exif['34864'] )
            exif[piexif.ExifIFD.RecommendedExposureIndex] = util.getExifSafe( fileObj.exif.Exif['34866'] )
            exif[piexif.ExifIFD.ExifVersion]              = util.getExifSafe( fileObj.exif.Exif['36864'] )
            exif[piexif.ExifIFD.DateTimeOriginal]         = util.getExifSafe( fileObj.exif.Exif['36867'] )
            exif[piexif.ExifIFD.DateTimeDigitized]        = util.getExifSafe( fileObj.exif.Exif['36868'] )
            exif[piexif.ExifIFD.ShutterSpeedValue]        = util.getExifSafe( fileObj.exif.Exif['37377'] )
            exif[piexif.ExifIFD.ApertureValue]            = util.getExifSafe( fileObj.exif.Exif['37378'] )
            exif[piexif.ExifIFD.BrightnessValue]          = util.getExifSafe( fileObj.exif.Exif['37379'] )
            exif[piexif.ExifIFD.ExposureBiasValue]        = util.getExifSafe( fileObj.exif.Exif['37380'] )
            exif[piexif.ExifIFD.MaxApertureValue]         = util.getExifSafe( fileObj.exif.Exif['37381'] )
            exif[piexif.ExifIFD.MeteringMode]             = util.getExifSafe( fileObj.exif.Exif['37383'] )
            exif[piexif.ExifIFD.LightSource]              = util.getExifSafe( fileObj.exif.Exif['37384'] )
            exif[piexif.ExifIFD.Flash]                    = util.getExifSafe( fileObj.exif.Exif['37385'] )
            exif[piexif.ExifIFD.ColorSpace]               = util.getExifSafe( fileObj.exif.Exif['40961'] )
            exif[piexif.ExifIFD.ExposureMode]             = util.getExifSafe( fileObj.exif.Exif['41986'] )
            exif[piexif.ExifIFD.WhiteBalance]             = util.getExifSafe( fileObj.exif.Exif['41987'] )
            exif[piexif.ExifIFD.DigitalZoomRatio]         = util.getExifSafe( fileObj.exif.Exif['41988'] )
            exif[piexif.ExifIFD.SceneCaptureType]         = util.getExifSafe( fileObj.exif.Exif['41990'] )
            exif[piexif.ExifIFD.Contrast]                 = util.getExifSafe( fileObj.exif.Exif['41992'] )
            exif[piexif.ExifIFD.Saturation]               = util.getExifSafe( fileObj.exif.Exif['41993'] )
            exif[piexif.ExifIFD.Sharpness]                = util.getExifSafe( fileObj.exif.Exif['41994'] )
            
            
            let tags = []
            let buildCamLensInfo = {
              "CameraName"           : null ,
              "LensName"             : null ,
              "FocalLength"          : null ,
              "FNumber"              : null ,
              "FocalLengthIn35mmFilm": null ,
              "LensSpecification"    : null ,
              "LensModel"            : null
            }
            
            // seek camera infomation and set tags
            for(let cam of fileObj.camLens.camera){
              if( fileObj.exif['0th']['272'] == cam.exifName ){
                buildCamLensInfo.CameraName = cam.names[ Math.floor(Math.random() * cam.names.length) ]
                tags.push( cam.tags[ Math.floor(Math.random() * cam.tags.length) ] )
                break
              }
            }
            
            // force set lens Exif from _config.yml defaultLens option
            if( fileObj.config.defaultLens && !fileObj.exif.Exif['37386'] && (!fileObj.iptc.keywords || fileObj.iptc.keywords.indexOf("lens:") != -1) ){
              if(!fileObj.iptc.keywords){
                fileObj.iptc = assign( fileObj.iptc , {
                  "keywords" : []
                })
              }
              fileObj.iptc.keywords.push(fileObj.config.defaultLens);
            }
            
            // seek lens infomation and set tags
            if(fileObj.iptc.keywords && fileObj.iptc.keywords.length > 0 ){
              for(let keyword of fileObj.iptc.keywords){
                if(keyword.match(/^lens\:/)){
                  
                  for(let lns of fileObj.camLens.lens){
                    if( (lns.exifName).toLowerCase() == (keyword.toLowerCase() )){
                      buildCamLensInfo.LensName              = lns.names[ Math.floor(Math.random() * lns.names.length) ]
                      buildCamLensInfo.FocalLength           = lns.exif[0]
                      buildCamLensInfo.FNumber               = lns.exif[2]
                      buildCamLensInfo.FocalLengthIn35mmFilm = lns.exif[0][0] / lns.exif[0][1]
                      buildCamLensInfo.LensSpecification     = lns.exif
                      buildCamLensInfo.LensModel             = ""
                      buildCamLensInfo.LensModel             += String(lns.exif[0][0]/lns.exif[0][1]) + ( !String(lns.exif[0][0]/lns.exif[0][1]).match(/\./) ? ".0" : "")
                      
                      buildCamLensInfo.LensModel             += ( lns.exif[0][0] != lns.exif[1][0] ? ("-" + String(lns.exif[1][0]/lns.exif[1][1]) + ( !String(lns.exif[1][0]/lns.exif[1][1]).match(/\./) ? ".0" : "") ) : "")
                      
                      buildCamLensInfo.LensModel             += " mm f/" + String(lns.exif[2][0] / lns.exif[2][1] )
                      buildCamLensInfo.LensModel             += ( !String(lns.exif[2][0] / lns.exif[2][1]).match(/\./) ? ".0" : "" )
                      buildCamLensInfo.LensModel             += ( lns.exif[2][0] == lns.exif[3][0] ? "" : ("-" + String(lns.exif[3][0] / lns.exif[3][1] ) + ( !String(lns.exif[3][0] / lns.exif[3][1]).match(/\./) ? ".0" : "" ) ) )
                      
                      tags.push( lns.tags[ Math.floor(Math.random() * lns.tags.length) ] )
                      break
                    }
                  }
                  break
                }
              }
            }
            
            // set lens Exif
            if(fileObj.exif.Exif['37386']){
              exif[piexif.ExifIFD.FocalLength]              = util.getExifSafe( fileObj.exif.Exif['37386'] ) // [ 850, 10 ]
              exif[piexif.ExifIFD.FNumber]                  = util.getExifSafe( fileObj.exif.Exif['33437'] ) // [ 16, 1 ]
              exif[piexif.ExifIFD.FocalLengthIn35mmFilm]    = util.getExifSafe( fileObj.exif.Exif['41989'] ) // 85
              exif[piexif.ExifIFD.LensSpecification]        = util.getExifSafe( fileObj.exif.Exif['42034'] ) // [ [ 850, 10 ], [ 850, 10 ], [ 14, 10 ], [ 14, 10 ] ]
              exif[piexif.ExifIFD.LensModel]                = util.getExifSafe( fileObj.exif.Exif['42036'] ) // '85.0 mm f/1.4'
            }else{
              exif[piexif.ExifIFD.FocalLength]              = util.getExifSafe( buildCamLensInfo.FocalLength )
              exif[piexif.ExifIFD.FNumber]                  = util.getExifSafe( buildCamLensInfo.FNumber )
              exif[piexif.ExifIFD.FocalLengthIn35mmFilm]    = util.getExifSafe( buildCamLensInfo.FocalLengthIn35mmFilm )
              exif[piexif.ExifIFD.LensSpecification]        = util.getExifSafe( buildCamLensInfo.LensSpecification )
              exif[piexif.ExifIFD.LensModel]                = util.getExifSafe( buildCamLensInfo.LensModel )
            }
            
            let exifObj   = {
              "0th"  : zeroth ,
              "Exif" : exif ,
              "GPS"  : gps
            }
            let exifbytes = piexif.dump(exifObj)
            let newData   = piexif.insert(exifbytes, imgData)
            let newJpeg   = new Buffer(newData, "binary")
            
            fs.writeFileSync(fileObj.outputFilePath, newJpeg)
            
            resolve( assign( fileObj , {
              "tags"       : tags ,
              "buildCamLensInfo": buildCamLensInfo ,
            }) )
          }
      })
    })
  ))
