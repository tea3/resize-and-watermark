"use strict";

const fs      = require('fs')
const assign  = require('object-assign')


// read cameraLens.json
module.exports.readWatermarkPosition = ( inObj ) =>
  	new Promise( ( resolve , reject ) => {
	    fs.readFile( "./settings/watermarkPosition.json" , ( err , data ) => {
	      	if (err) reject( new Error(err) )
	      	else {
	      		resolve( assign( inObj , {
	        		"watermarkPositionSetting" : JSON.parse(data)
	      		}) )
	  		}
	    })
  	})
