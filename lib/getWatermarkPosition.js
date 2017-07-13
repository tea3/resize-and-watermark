"use strict";

const assign  = require('object-assign')

// get Watermark Position
module.exports.getWatermarkPosition = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
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
      if(fileObj.config.defaultWatermarkPosition && fileObj.config.defaultWatermarkPosition.length == 2 ){
        posArrTemp = fileObj.config.defaultWatermarkPosition
        for(let posConf of posArrTemp){
          if( posConf.match( /(^N|^S|^n|^s)/ ) ){
            if( posConf.match( /(^N|^n)/ ) )markPosition.y = -0.5
            if( posConf.match( /(^S|^s)/ ) )markPosition.y = 0.5
          }else if( posConf.match( /(^W|^E|^w|^e)/ ) ){
            if( posConf.match( /(^W|^w)/ ) )markPosition.x = -0.5
            if( posConf.match( /(^E|^e)/ ) )markPosition.x = 0.5
          }else if( posConf.match( /(^M|^m)/ ) ){
            markPosition.y = 0
          }else if( posConf.match( /(^C|^c)/ ) ){
            markPosition.x = 0
          }
        }
      }
      
      if( fileObj.iptc.keywords && fileObj.iptc.keywords.length > 0 ){
        for( let keyword of fileObj.iptc.keywords){
          if( keyword.match(/^pos\:.+\-.+/)){
            let posKey = keyword.replace(/pos\:/,"").split("-");
            if( posKey.length == 2){
              for( let posConf of fileObj.watermarkPositionSetting.position){
                if( posConf.keywords == posKey[0] || posConf.keywords == posKey[1]){
                  if( posConf.tags.match( /(^N|^S|^n|^s)/ ) ){
                    posArrTemp[0] = posConf.tags;
                    if( posConf.tags.match( /(^N|^n)/ ) )markPosition.y = -0.5
                    if( posConf.tags.match( /(^S|^s)/ ) )markPosition.y = 0.5
                      
                  }else if( posConf.tags.match( /(^W|^E|^w|^e)/ ) ){
                    posArrTemp[1] = posConf.tags;
                    if( posConf.tags.match( /(^W|^w)/ ) )markPosition.x = -0.5
                    if( posConf.tags.match( /(^E|^e)/ ) )markPosition.x = 0.5
                    
                  }else if( posConf.keywords.match( /(^M|^m)/ ) ){
                    posArrTemp[0] = ""
                    markPosition.y = 0
                  }else if( posConf.keywords.match( /(^C|^c)/ ) ){
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