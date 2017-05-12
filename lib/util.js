"use strict";

const readline = require("readline")

module.exports.getExifSafe = (inVar) => {
  if(!inVar)return undefined;
  if(inVar)return inVar;
}

module.exports.originName = (inVar) => {
  return 'origin';
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
