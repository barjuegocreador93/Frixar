/**
 *script:
 **name: Frixar-Router
 **version : 0.0.1
 *scripters:
 **id:1
 **name: Camilo Barbosa
 **email: cab331@hotmail.com
 **about: A js script to control the views at moderns webs.

 Depends: jQuery, Mustache

 **/


"use strict";

var router = frixarFactory('Router').File('router');

router.Service('$r',[],Define,After,OnReady,Config);

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
  if(!base.Routes)base.Routes = [];

  var config={}
  //config = {templateUrl,template,target,controller}
  config.Route=function(name,config)
  {
    base.Routes.push({name:name,config:config});
    return config;
  }



  return config;
}
