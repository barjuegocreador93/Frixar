/**
 *script:
 **name: Frixar-Router
 **version : 0.0.1
 *scripters:
 **id:1
 **name: Camilo Barbosa
 **email: cab331@hotmail.com
 **about: A js script to control the views at moderns webs.

 Depends: jQuery, Frixar >= 0.1.6

 **/



var ServiceName = '$router';
"use strict";

var router = frixarFactory('Router').File(ServiceName);



function Define () {
  var r={};
  r.travel=travel;
  return r;

  function travel(url) {
    window.location ='#'+url;
  }
}

function After(base) {

}

function OnReady(base) {
  console.log(base);
}

function Config(base)
{
  if(!base.Routes)base.Routes = {};

  var config={}
  //config = {templateUrl,template,target,controller}
  config.Route=function(name,config)
  {
    var AppName = base.$vars.CurrentConfigApp.Name;
    if(!base.Routes[name] && config.controller)
      {
        base.Routes[name]={};
        base.Routes[name];
      }
    return config;
  }

  return config;
}

//Class Service
router.Service(ServiceName,[],Define,After,OnReady,Config);
