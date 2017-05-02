module.exports.getExifSafe = function(inVar){
  if(!inVar)return undefined;
  if(inVar)return inVar;
}

module.exports.originName = function(inVar){
  return 'origin';
}


// get resized size
module.exports.getResizeSize = function( inWidth , inHeight , inLongSide ){
  if( inWidth == inHeight ){
    return { width : inLongSide , height: inLongSide };
  }else if( inWidth > inHeight ){
    return { width : inLongSide , height: Math.floor(inLongSide * inHeight / inWidth) }
  }else if( inWidth < inHeight ){
    return { width : Math.floor(inLongSide * inWidth / inHeight ) , height: inLongSide }
  }
}

// get long side size
module.exports.getLongSideSize = function( inWidth , inHeight ){
  if( inWidth == inHeight ){
    return inWidth;
  }else if( inWidth > inHeight ){
    return inWidth;
  }else if( inWidth < inHeight ){
    return inHeight;
  }
}
