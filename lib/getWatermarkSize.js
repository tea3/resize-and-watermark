"use strict";

const assign  = require('object-assign')
const Promise = require('bluebird')
const path    = require('path')
const sizeOf  = require('image-size')

// read cameraLens.json
module.exports.getWatermarkSize = ( inObj ) =>
  	new Promise( ( resolve , reject ) => {
	    sizeOf( path.resolve( inObj.config.watermark ) , (err, dimensions) => {
	      if ( err ) reject( new Error(err) )
	      else {
	      	resolve( assign( inObj , {
				"watermarkSize" : {
					"width" : dimensions.width ,
					"height": dimensions.height
				}
	      	}) )
	      }
	    })
  	})
