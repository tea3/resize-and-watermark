"use strict";

const assign     = require('object-assign')
const ColorThief = require('color-thief')
const Clr        = require('color')
const path       = require('path')
const util       = require('./util.js')


// get color
module.exports.getColor= (inObj) =>
  inObj.reduce( (promise, value) =>
    promise.then( (editedArray) =>
      parallel(value).then( (editedElement) => {
        editedArray.push(editedElement);
        return editedArray;
      })
    )
  , Promise.resolve([]))


let parallel = (inObj) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      if( fileObj.config.watermarkColor && fileObj.config.watermarkColor == "auto" ){
        let quality = (fileObj.config.colorTiefQuality || 50)
        let ct   = new ColorThief()
        let gpd  = ct.getColor( fileObj.path , quality )
        let gp   = ct.getPalette( fileObj.path , 32 , quality )
        let ac   = []
        let gp16 = []
        let hueWeight        = 1.0
        let saturationWeight = 1.0
        let lightnessWeight  = 4.0
        
        if(fileObj.config.watermarkColorSelectionWeight && fileObj.config.watermarkColorSelectionWeight.length == 3){
          hueWeight        = fileObj.config.watermarkColorSelectionWeight[0]
          saturationWeight = fileObj.config.watermarkColorSelectionWeight[1]
          lightnessWeight  = fileObj.config.watermarkColorSelectionWeight[2]
        }
        
        if( gpd && gp && gp.length >= 2){
          
          gp = [gpd].concat( gp )
          gp = [fileObj.watermarkAreaColorAvg].concat( gp )
          
          let cl0 = Clr.rgb(gp[0][0], gp[0][1], gp[0][2]).hsl().array()
          
          for(let gpl of gp ){
            // r,g,bの16進数変換
            let r = parseInt(gpl[0]).toString(16)
            let g = parseInt(gpl[1]).toString(16)
            let b = parseInt(gpl[2]).toString(16)
            
            let c16 = ( r.length != 2 ? "0" : "" ) + r + ( g.length != 2 ? "0" : "" ) + g + ( b.length != 2 ? "0" : "" ) + b
            let cl = Clr.rgb(gpl[0], gpl[1], gpl[2]).hsl().array()
            
            // 色相差 (0-180°)
            let dHue = cl0[0] - cl[0]
            dHue -= Math.floor(dHue / 360.0) * 360.0
            if( dHue > 180 ) dHue -= 360.0;
            dHue = Math.abs(dHue)
            
            // 色相・彩度・明度の差
            let dC = Math.pow( Math.pow( ( dHue / 180 * 100 ) , 2) * hueWeight + Math.pow( (cl0[1] - cl[1]) , 2) * saturationWeight + Math.pow( (cl0[2] - cl[2]) , 2) * lightnessWeight , 0.5 )
            
            // let dC = ( dHue / 180 * 100 )  * hueWeight +  (cl0[1] - cl[1]) * saturationWeight + (cl0[2] - cl[2]) * lightnessWeight
            
            gp16.push({
              color   : c16 ,
              dC      : dC
            })
          }
          
          gp16.sort( (a,b) => (b.dC - a.dC) )
          
          util.progressLog( path.basename(fileObj.path) , "Get Color" )
          resolve( assign( fileObj , {
            "color" : gp16
          }) )
        }
        else reject( new Error( "[./lib/getColor.js] Couldn't get colors." ) )
      }
      else resolve( assign( fileObj , {
            "color" : []
          }) )
    })
  ))