"use strict";

const Promise = require('bluebird')
const im      = require('imagemagick')
const util    = require('./util.js');
const path    = require('path')

// resize & sharpen & watermark
module.exports.resizeImg = ( inObj ) =>
  new Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let commandArr
      if(fileObj.subDirName == util.originName() ){
        commandArr = [
          // '-resize' ,                               // リサイズ
          // fileObj.resizedPx.width + "x" + fileObj.resizedPx.height ,    // リサイズサイズ
          '-auto-orient' ,                          // Exifに基づく画像の回転
          '-strip' ,                                // Exifの削除
          // '-unsharp' ,                              // シャープ
          // '0.5x1.0+0.75+0.008' ,                    // シャープ推奨値は'0x0.75+0.75+0.008'
          '-quality' ,                              // 圧縮率
          fileObj.config.quality
        ]
      }else{
        commandArr = [
          '-resize' ,                               // リサイズ
          fileObj.resizedPxLongSide + "x" ,         // リサイズサイズ
          '-auto-orient' ,                          // Exifに基づく画像の回転
          '-strip' ,                                // Exifの削除
          '-unsharp' ,                              // シャープ
          '0.5x1.0+0.75+0.008' ,                    // シャープ推奨値は'0x0.75+0.75+0.008'
          '-quality' ,                              // 圧縮率
          fileObj.config.quality
        ]
      }
      
      if( fileObj.enabledWatermark ){
        commandArr = commandArr.concat([
          '-composite' ,                            // 画像の合成
          fileObj.path,                             // 合成する上の画像
          fileObj.config.watermark ,                // 合成する下の画像のパス
          '-gravity' ,                              // 合成する下の画像の配置位置
          fileObj.watermarkPosition.position ,
          '-geometry' ,                             // 合成する下の画像の微調整
          fileObj.resizedWaterMarkSize.width + 'x' + fileObj.resizedWaterMarkSize.height + '+' + String( fileObj.watermarkMarginPx * fileObj.watermarkPosition.x ) + '+' + String(fileObj.watermarkMarginPx * fileObj.watermarkPosition.y ) ,
          '-compose' ,                              // 合成の描画モード
          'over' ,
          '-depth',                                 // 出力するファイルの色深度(bit数)
          '8' ,
          fileObj.outputFilePath                    // 出力ファイル名
        ])
      }else{
        commandArr = commandArr.concat([
          fileObj.path,                             // 合成する上の画像
          '-depth',                                 // 出力するファイルの色深度(bit数)
          '8' ,
          fileObj.outputFilePath                    // 出力ファイル名
        ])
      }
      
      
      im.convert( commandArr , (err, stdout, stderr) => {
        if (err) reject( new Error(err) )
        else {
          console.log(' -> \u001b[36m' + path.basename(fileObj.outputFilePath) + '\u001b[0m -> ' + util.getLongSideSize(fileObj.resizedPx.width , fileObj.resizedPx.height) + "px" + (!fileObj.enabledWatermark ? " (No watermark)" : "") )
          resolve( fileObj )
        }
      })
      
    })
  ))
