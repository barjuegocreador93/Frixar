"use strict";

var examplePackage= frixarFactory('examplePackage').File('myService');
//Class Service
examplePackage.Service('myService',[],function(){
  console.log('this is define, executed at controllers');
  return 'Factory Example!';
},function (base) {
  //can be null or not declarate
  console.log('this is After, executed at after controllers or events');
},function (base) {
  //can be null or not declarate
  console.log('this is OnReady, executed on three frixar is ready');
});
