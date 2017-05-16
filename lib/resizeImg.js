"use strict";

const util    = require('./util.js')
const path    = require('path')
const exec    = require('child_process').exec


// resize & sharpen & watermark
module.exports.resizeImg = ( inObj ) =>
  Promise.all( inObj.map( (fileObj) =>
    new Promise( ( resolve , reject ) => {
      
      let commandArr
      commandArr = [
          'convert' ,
          '-size' ,                                                     // 生成画像サイズ
          fileObj.resizedPx.width + 'x' + fileObj.resizedPx.height ,
          'canvas:#ffffff' ,                                            // 背景カラー
          '\\(' ,
            '-auto-orient' ,                                            // Exifに基づく画像の回転
            '-strip'                                                    // Exifの削除
      ]
      
      if( fileObj.subDirName != util.originName() )commandArr = commandArr.concat([
            '-resize' ,                                                 // リサイズ
            fileObj.resizedPxLongSide + 'x' ,                           // リサイズ長辺(px)
            '-unsharp' ,                                                // シャープ
            '0x1.00+0.75+0.008'                                         // シャープ推奨値は'0x0.75+0.75+0.008'
      ])
      
      commandArr = commandArr.concat([
            '"' + fileObj.path + '"' ,
          '\\)' ,
          '-gravity' ,                                                  // リサイズ画像の配置位置
          'Center' ,
          '-composite' ,
      ])
      
      if( fileObj.enabledWatermark ) commandArr = commandArr.concat([
          '\\(' ,
            '"' + fileObj.config.watermark + '"'                     // 合成する下のウォーターマーク画像のパス
      ])
      
      if( fileObj.enabledWatermark && fileObj.config.watermarkColor ) commandArr = commandArr.concat([
                '\\(' ,
                  '-clone' ,                                               // 画像を生成
                  '0' ,
                  '-fill' ,                                                // 引数のカラーで塗りつぶし
                  '"#' + ( (fileObj.config.watermarkColor && fileObj.config.watermarkColor != "auto" && fileObj.config.watermarkColor.match(/^[0-9a-fA-F]+/) ) ? fileObj.config.watermarkColor : fileObj.color[0].color ) + '"' ,
                  '-draw' ,
                  '"color 0,0 reset"' ,
                '\\)',
                '-compose' ,
                'atop' ,                                                   // カラーオーバーレイ
                '-composite' ,
      ])
      
      if( fileObj.enabledWatermark ) commandArr = commandArr.concat([
          '\\)' ,
          '-gravity' ,                                                 // 合成する下の画像の配置位置
          fileObj.watermarkPosition.position ,
          '-geometry' ,                                                // 合成する下の画像の微調整
          fileObj.resizedWaterMarkSize.width + 'x' + fileObj.resizedWaterMarkSize.height + '+' + String( fileObj.watermarkPosition.x == 0 ? 0 : fileObj.watermarkMarginPx  ) + '+' + String( fileObj.watermarkPosition.y == 0 ? 0 : fileObj.watermarkMarginPx ) ,
          '-composite'
      ])
      
      commandArr = commandArr.concat([
          '-depth' ,                                                   // 出力するファイルの色深度(bit数)
          '8' ,
          '-quality' ,                                                 // JPEG品質
          fileObj.config.quality ,
          '"' + fileObj.outputFilePath + '"'                           // 出力ファイルパス
        ])
      
      util.progressLog( path.basename(fileObj.path) , "ImgResizing" )
      exec( commandArr.join(" ") , (err, stdout, stderr) => {
        if (err) reject( new Error(err) )
        else {
          util.progressLog( "" , "" )
          console.log(' -> \u001b[36m' + path.basename(fileObj.outputFilePath) + '\u001b[0m ( ' + (!fileObj.resizedPxLongSide ? "origin" : fileObj.resizedPxLongSide + "px" ) + " )" + (!fileObj.enabledWatermark ? " (No watermark)" : "") )
          resolve( fileObj )
        }
      })
      
    })
  ))



// // resize & sharpen & watermark
// module.exports.resizeImg =  (inObj) =>
//   inObj.reduce( (promise, value) =>
//     promise.then( (editedArray) =>
//       resizeCmd(value).then( (editedElement) => {
//         editedArray.push(editedElement);
//         return editedArray;
//       })
//     )
//   , Promise.resolve([]))


// let resizeCmd = (fileObj) =>
//   new Promise( (resolve, reject) => {
//       let commandArr
//       commandArr = [
//           'convert' ,
//           '-size' ,                                                     // 生成画像サイズ
//           fileObj.resizedPx.width + 'x' + fileObj.resizedPx.height ,
//           'canvas:#ffffff' ,                                            // 背景カラー
//           '\\(' ,
//             '-auto-orient' ,                                            // Exifに基づく画像の回転
//             '-strip'                                                    // Exifの削除
//       ]
      
//       if( fileObj.subDirName != util.originName() )commandArr = commandArr.concat([
//             '-resize' ,                                                 // リサイズ
//             fileObj.resizedPxLongSide + 'x' ,                           // リサイズ長辺(px)
//             '-unsharp' ,                                                // シャープ
//             '0x1.00+0.75+0.008'                                         // シャープ推奨値は'0x0.75+0.75+0.008'
//       ])
      
//       commandArr = commandArr.concat([
//             '"' + fileObj.path + '"' ,
//           '\\)' ,
//           '-gravity' ,                                                  // リサイズ画像の配置位置
//           'Center' ,
//           '-composite' ,
//       ])
      
//       if( fileObj.enabledWatermark ) commandArr = commandArr.concat([
//           '\\(' ,
//             '"' + fileObj.config.watermark + '"'                     // 合成する下のウォーターマーク画像のパス
//       ])
      
//       if( fileObj.enabledWatermark && fileObj.config.watermarkColor ) commandArr = commandArr.concat([
//                 '\\(' ,
//                   '-clone' ,                                               // 画像を生成
//                   '0' ,
//                   '-fill' ,                                                // 引数のカラーで塗りつぶし
//                   '"#' + ( (fileObj.config.watermarkColor && fileObj.config.watermarkColor != "auto" && fileObj.config.watermarkColor.match(/^[0-9a-fA-F]+/) ) ? fileObj.config.watermarkColor : fileObj.color[0].color ) + '"' ,
//                   '-draw' ,
//                   '"color 0,0 reset"' ,
//                 '\\)',
//                 '-compose' ,
//                 'atop' ,                                                   // カラーオーバーレイ
//                 '-composite' ,
//       ])
      
//       if( fileObj.enabledWatermark ) commandArr = commandArr.concat([
//           '\\)' ,
//           '-gravity' ,                                                 // 合成する下の画像の配置位置
//           fileObj.watermarkPosition.position ,
//           '-geometry' ,                                                // 合成する下の画像の微調整
//           fileObj.resizedWaterMarkSize.width + 'x' + fileObj.resizedWaterMarkSize.height + '+' + String( fileObj.watermarkPosition.x == 0 ? 0 : fileObj.watermarkMarginPx  ) + '+' + String( fileObj.watermarkPosition.y == 0 ? 0 : fileObj.watermarkMarginPx ) ,
//           '-composite'
//       ])
      
//       commandArr = commandArr.concat([
//           '-depth' ,                                                   // 出力するファイルの色深度(bit数)
//           '8' ,
//           '-quality' ,                                                 // JPEG品質
//           fileObj.config.quality ,
//           '"' + fileObj.outputFilePath + '"'                           // 出力ファイルパス
//         ])
      
//       setTimeout( () => {
//         util.progressLog( path.basename(fileObj.path) , "ImgResizing" )
//         exec( commandArr.join(" ") , (err, stdout, stderr) => {
//           if (err) reject( new Error(err) )
//           else {
//             util.progressLog( "" , "" )
//             console.log(' -> \u001b[36m' + path.basename(fileObj.outputFilePath) + '\u001b[0m ( ' + (!fileObj.resizedPxLongSide ? "origin" : fileObj.resizedPxLongSide + "px" ) + " )" + (!fileObj.enabledWatermark ? " (No watermark)" : "") )
//             resolve( fileObj )
//           }
//         })
//       }, 5000);
      
      
//     })