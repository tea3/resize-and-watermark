"use strict";

const fs      = require('fs')
const assign  = require('object-assign')


// read cameraLens.json
module.exports.readCameraLens = ( inObj ) =>
  	new Promise( ( resolve , reject ) => {
    	fs.readFile( "./settings/cameraLens.json" , ( err , data ) => {
      		if (err) reject( new Error(err) )
      		else {
      			resolve( assign( inObj , {
        			"camLens" : JSON.parse(data)
      			}) )
  			}
    	})
  	})
