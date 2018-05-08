/**
 *script:
 **name: Frixar-Router
 **version : 0.0.2
 *scripters:
 **id:1
 **name: Camilo Barbosa
 **email: cab331@hotmail.com
 **about: A js script to control the views at moderns webs.

 Depends: jQuery, Frixar >= 0.1.6

 **/
"use strict";

var ServiceName = '$router';
var router = frixarFactory('Router').File(ServiceName);

//Class Service
router.Service({
  Name:ServiceName,
  Depends:[],

  Define:function () {
    return{
      travel:function (url) {
        window.location ='#'+url;
      }
    };
  },
  After:function (base) {
    if(base.Routes)
    {

    }
  },
  OnReady:function (base) {

  },
  Config:function (base) {
    if(!base.Routes)base.Routes=[];
    return{
      Route: function(name,config){
        var AppName = base.$vars.CurrentConfigApp.Name;
        if(!base.Routes[name] &&
          typeof config.controller=='string' &&
          typeof config.template =='string')
        {
          base.Routes[name]={};
          base.Routes[name]={
            using:'fx-v',
            cntrl:config.controller,
            temp:config.template,
            AppName:AppName
          };
        }
        return this;
      }
    };
  }
});
