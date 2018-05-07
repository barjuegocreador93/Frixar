"use strict";

/*
  //Frixar example:
  //Calling a Service Class
  frixar('myApp').Using(['examplePackage.myService',...]);

  //Using Config
  frixar('myApp').Config('myService').MethodAdd(50);

*/


var NameService = 'myService';

var examplePackage= frixarFactory('examplePackage').File(NameService);

var DependsFrixarServices = [];

//Arguments changes depends DependsFrixarServices
//Must be return information to Frixar.Controller
function ServiceDefine(){
  console.log('this is define, executed at controllers');
  return 'Factory Example!';
}

//base is a empty object to comunicate with Config or FrixarOnReady Methods
function ServiceAfterRun(base) {
  //can be null or not declarate
  console.log('this is ServiceAfterRun, executed at after controllers or events');
}

//base is a empty object to comunicate with FrixarConfig o ServiceAfterRun
function FrixarOnReady(base) {
  //can be null or not declarate
  console.log('this is FrixarOnReady, executed on three frixar is ready');
}

//must be return information to Frixar.Config. Used like Config(NameService).MyMethod()
//base is a empty object to comunicate with ServiceAfterRun o FrixarOnReady Methods
function FrixarConfig(base) {
  //example:
  if(!base.myNumber)base.myNumber = 100;
  var MyConfig={};
  MyConfig.MethodAdd=function functionName(num) {
    base.myNumber+=num;
  }
  return MyConfig;
}

//Class Service
examplePackage.Service(NameService,DependsFrixarServices,ServiceDefine,ServiceAfterRun,FrixarOnReady, FrixarConfig);
