"use strict";

const Promise = require('bluebird')
const ry      = require('./lib/readYml.js')
const rc      = require('./lib/readCameraLens.js')
const rw      = require('./lib/readWatermarkPosition.js')
const gws     = require('./lib/getWatermarkSize.js')
const fl      = require('./lib/filelist.js')
const ct      = require('./lib/createResizeTask.js')
const rm      = require('./lib/removeFile.js')
const gis     = require('./lib/getImgSize.js')
const ge      = require('./lib/getExif.js')
const gwp     = require('./lib/getWatermarkPosition.js')
const gwac    = require('./lib/getWatermarkAreaColor.js')
const mop     = require('./lib/makeOutputDir.js')
const cwp     = require('./lib/culcSizeAndWatermarkPosition.js')
const rim     = require('./lib/resizeImg.js')
const we      = require('./lib/writeExif.js')
const wxi     = require('./lib/writeXmpAndIPTC.js')
const de      = require('./lib/debugExif.js')
const dp      = require('./lib/debugParam.js')
const gc      = require('./lib/getColor.js')

// get argv
// (ex.) node index.js file1 file2 ...
let envFileList = [];
if(process.argv && process.argv.length && process.argv.length >= 2)
  for( let i = 2; i < process.argv.length; i++)
    envFileList.push(process.argv[i])

// process complate
let processComplate = (inObj) => {
  return new Promise( (resolve , reject) => {
    console.log("\u001b[35mcomplete !!\u001b[0m")
    resolve(inObj)
  })
}

ry.readConfigYAML( envFileList )
  .then( rc.readCameraLens )
  .then( rw.readWatermarkPosition )
  .then( gws.getWatermarkSize )
  .then( fl.fileList )
  .then( gis.getImgSize )
  .then( ge.getExif )
  .then( gwp.getWatermarkPosition )
  .then( gwac.getWMAreaColor )
  .then( gc.getColor )
  .then( ct.createResizeTask )
  .then( mop.makeOutputDir )
  .then( cwp.culcSizeAndWatermarkPosition )
  .then( rm.removeFile )
  .then( rim.resizeImg )
  .then( we.writeExif )
  .then( wxi.writeXmpAndIPTC )
  // // .then( de.debugExif )
  // // .then( dp.debugParam )
  .then( processComplate )
  .catch( e => { console.error('\u001b[31m' + e + "\u001b[0m") } )