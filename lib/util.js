"use strict";

const readline = require("readline")
const ORIGIN   = 'origin'

module.exports.getExifSafe = (inVar) => {
  if(!inVar)return undefined;
  if(inVar)return inVar;
}

module.exports.originName = (inVar) => {
  return ORIGIN;
}


// get resized size
module.exports.getResizeSize = ( inWidth , inHeight , inLongSide ) => {
  if( inWidth == inHeight ){
    return { width : inLongSide , height: inLongSide };
  }else if( inWidth > inHeight ){
    return { width : inLongSide , height: Math.floor(inLongSide * inHeight / inWidth) }
  }else if( inWidth < inHeight ){
    return { width : Math.floor(inLongSide * inWidth / inHeight ) , height: inLongSide }
  }
}

// get long side size
module.exports.getLongSideSize = ( inWidth , inHeight ) => {
  if( inWidth == inHeight ){
    return inWidth;
  }else if( inWidth > inHeight ){
    return inWidth;
  }else if( inWidth < inHeight ){
    return inHeight;
  }
}


module.exports.progressLog = (mes , processName) => {
  let col     = process.stdout.columns
  let message = `[${processName}]: ${mes}`
  let repLen  = col - charcount(message) -1
  const empty = " ".repeat(repLen)
  message = `${message + empty}\r`
  process.stdout.write(message);
}

let charcount = (inStr) => {
  let len = 0;
  let str = escape(inStr);
  for (let i=0; i<str.length; i++,len++) {
    if ( str.charAt(i) == "%" ) {
      if ( str.charAt(++i) == "u" ) {
        i += 3;
        len++;
      }
      i++;
    }
  }
  return len;
}


// 配列を2次元配列に変換
module.exports.parallelize = ( inArr ) =>
  new Promise( ( resolve , reject ) => {
    let num = 4
    if(inArr && inArr[0].config && inArr[0].config.parallelLimit)num = inArr[0].config.parallelLimit
    let retArr = []
      if( !inArr ){
        reject( new Error( '[util.js] The array data is invalid.' ) )
      }else{
        for( let arr of inArr.entries() ){
          if( arr[0] % num == 0 )retArr.push([])
          retArr[ retArr.length -1 ].push( arr[1] )
        }
        resolve(retArr)
      }
    })


// 2次元配列を1次元配列に変換
module.exports.serialize = ( inArr ) =>
  new Promise( ( resolve , reject ) => {
    let retArr = []
      if( !inArr ){
        reject( new Error( '[util.js] The array data is invalid.' ) )
      }else{
        for( let arr2 of inArr ){
          for( let arr1 of arr2){
            retArr.push( arr1 )
          }
        }
        resolve(retArr)
      }
    })


// Confirm whether array elements are included
module.exports.isContainElm = ( inElm , inSearchArr ) => {
  if( !inSearchArr || inSearchArr.length == 0 )return false
  for( let i of inSearchArr) {
    if( String(i) == String(inElm) ) {
      return true
      break
    }
  }
  return false
}


// distinguish same px
module.exports.distinguish = ( inResizePixArr ) => {
  let retArr = []
  for( let rp of inResizePixArr){
    let pushElm = String(rp) + ( retArr.indexOf(String(rp)) != -1 ? "w" : "" )
    retArr.push( pushElm )
  }
  return retArr
}

module.exports.unDistinguish = ( inResizePix ) => {
  return Number(String(inResizePix).replace(/[a-zA-Z]$/,""))
}

module.exports.subDirName = ( inResizePix , isEnabledWatermark ) => {
  return (Number(inResizePix) != 0 ? String(inResizePix) + "px" : ORIGIN ) + ( isEnabledWatermark ? " watermark" : "" )
}
