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
  if(base.Routes)
  {

  }
}

function OnReady(base) {
console.log(window.location);
  if(base.Routes)
  {
    for(var v in)
    {

    }
  }

}

//charge app data
function Config(base)
{
  if(!base.Routes)base.Routes = {};

  var config={}
  //config = {templateUrl,template,jQtarget,controller}
  config.Route=function(name,config)
  {
    var AppName = base.$vars.CurrentConfigApp.Name;
    if(!base.Routes[name] && typeof config.controller=='string' && typeof config.template =='string')
      {
        base.Routes[name]={};
        base.Routes[name]={
          using:'fx-v',
          cntrl:config.controller,
          temp:config.template,
          AppName:AppName
        };
      }
    return config;
  }

  return config;
}

//Class Service
router.Service(ServiceName,[],Define,After,OnReady,Config);
