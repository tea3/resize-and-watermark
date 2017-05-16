"use strict";

const pg      = require('commander');
const ry      = require('./lib/readYml.js')
const ry_p    = require('./lib/readYml-pos.js')
const ry_l    = require('./lib/readYml-lens.js')
const rc      = require('./lib/readCameraLens.js')
const rw      = require('./lib/readWatermarkPosition.js')
const gws     = require('./lib/getWatermarkSize.js')
const fl      = require('./lib/filelist.js')
const ct      = require('./lib/createResizeTask.js')
const ct_p    = require('./lib/createResizeTask-pos.js')
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
const exi     = require('./lib/editXmpAndIPTC.js')
const de      = require('./lib/debugExif.js')
const dp      = require('./lib/debugParam.js')
const gc      = require('./lib/getColor.js')


// process complate
let processComplate = (inObj) => {
  return new Promise( (resolve , reject) => {
    console.log("\u001b[35mcomplete !!\u001b[0m")
    resolve(inObj)
  })
}


// Change watermark postion keyword (IPTC Keyword)
let changeWatermarkPos = (fileName , pos1 , pos2 , files) => {
  
  let envFileList = [];
  if(files && files.length && files.length > 0)
    for( let i = 0; i < files.length; i++)
      envFileList.push(files[i])
  
  ry_p.readConfigYAML( envFileList , pos1 , pos2 , fileName )
    .then( fl.fileList )
    .then( ge.getExif )
    .then( ct_p.createResizeTask )
    .then( exi.editXmpAndIPTC )
    .then( processComplate )
    // .catch( e => { console.error('\u001b[31m' + e + "\u001b[0m") } )
}


// Change lens keyword (IPTC Keyword)
let changeLens = (fileName , lensKeyword , files) => {
  
  let envFileList = [];
  if(files && files.length && files.length > 0)
    for( let i = 0; i < files.length; i++)
      envFileList.push(files[i])
  
  ry_l.readConfigYAML( envFileList , lensKeyword , fileName )
    .then( fl.fileList )
    .then( ge.getExif )
    .then( ct_p.createResizeTask )
    .then( exi.editXmpAndIPTC )
    .then( processComplate )
    // .catch( e => { console.error('\u001b[31m' + e + "\u001b[0m") } )
}


// resize and watermark
let resizeAndWatermark = (files) => {
  
  let envFileList = [];
  if(files && files.length && files.length > 0)
    for( let i = 0; i < files.length; i++)
      envFileList.push(files[i])
  
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
}

pg
  .command('resize [files...]')
  .alias('r')
  .description('resize and watermark watermark postion')
  .action( resizeAndWatermark )
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ resize');
    console.log('    $ r file1 file2 ...');
    console.log();
  });

pg
  .command('position <fileName> <pos1> <pos2> [files...]')
  .alias('p')
  .description('Change watermark postion keyword (IPTC Keyword)')
  .action( changeWatermarkPos )
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ position a.jpg left top');
    console.log('    $ p b.jpg center middle');
    console.log();
  });
  
pg
  .command('lens <fileName> <lensKeyword> [files...]')
  .alias('l')
  .description('Change lens keyword (IPTC Keyword)')
  .action( changeLens )
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log('    $ lens a.jpg laowa105mm');
    console.log('    $ p b.jpg laowa105mm');
    console.log();
  });


pg.parse(process.argv)
pg.usage('[options] <file ...>')