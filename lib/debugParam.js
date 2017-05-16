"use strict";

// debug resolve parameter
module.exports.debugParam = ( inObj ) =>
  new Promise( ( resolve , reject ) => {
    console.log("---- debug ----");
    console.log(inObj);
    resolve(inObj);
  })
