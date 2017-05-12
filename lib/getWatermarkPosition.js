"use strict";

const assign  = require('object-assign')
const Promise = require('bluebird')

// get Watermark Position
module.exports.getWatermarkPosition = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      /*
      -0.5,-0.5    0,-0.5     0.5,-0.5
      -0.5,0       0,0        0.5,0
      -0.5,0.5     0,0.5      0.5,0.5
      */
      let markPosition = {
        "position": "" ,
        "x": -0.5 ,
        "y": -0.5
      }
      
      let posArrTemp   = [ "South" , "East" ]
      if(fileObj.config.defaultWatermarkPosition && fileObj.config.defaultWatermarkPosition.length == 2 )posArrTemp = fileObj.config.defaultWatermarkPosition
      
      if( fileObj.iptc.keywords && fileObj.iptc.keywords.length > 0 ){
        for( let keyword of fileObj.iptc.keywords){
          if( keyword.match(/^pos\:.+\-.+/)){
            let posKey = keyword.replace(/pos\:/,"").split("-");
            if( posKey.length == 2){
              for( let posConf of fileObj.watermarkPositionSetting.position){
                if( posConf.keywords == posKey[0] || posConf.keywords == posKey[1]){
                  if( posConf.tags.match( /(^N|^S)/ ) ){
                    posArrTemp[0] = posConf.tags;
                    if( posConf.tags.match( /(^N)/ ) )markPosition.y = -0.5
                    if( posConf.tags.match( /(^S)/ ) )markPosition.y = 0.5
                      
                  }else if( posConf.tags.match( /(^W|^E)/ ) ){
                    posArrTemp[1] = posConf.tags;
                    if( posConf.tags.match( /(^W)/ ) )markPosition.x = -0.5
                    if( posConf.tags.match( /(^E)/ ) )markPosition.x = 0.5
                    
                  }else if( posConf.keywords.match( /^m/ ) ){
                    posArrTemp[0] = ""
                    markPosition.y = 0
                  }else if( posConf.keywords.match( /^c/ ) ){
                    posArrTemp[1] = ""
                    markPosition.x = 0
                  }
                }
              }
            }
            break
          }
        }
      }
      
      markPosition.position = ( posArrTemp[0] + posArrTemp[1] != "" ? ( posArrTemp[0] + posArrTemp[1] ) : "Center" )
      
      resolve( assign( fileObj , {
        "watermarkPosition": markPosition
      }) );
      
    })
  ))
