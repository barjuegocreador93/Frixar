/**
 *script:
 **name: Frixar-Router
 **version : 0.0.3
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

  },
  OnReady:function (base) {

    if(window.onhashchange)
     window.onhashchange = function() {
        router_change_view(base);
    };
    else {
      $(window).on('hashchange', function(){
        router_change_view(base);
      });
    }
    router_change_view(base);
  },
  Config:function (base) {
    if(!base.Routes)base.Routes={};
    return{
      Route: function(name,config){
        var AppName = base.$vars.CurrentConfigApp.Name;
        if(!base.Routes[name] &&
          typeof config.controller=='string' &&
          typeof config.template =='string')
        {
           base.Routes[name]={
            url:name,
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


function router_change_view(base)
{
  if(base.Routes)
  {
    for(var v in base.Routes)
    {

      if( $('[fxr="'+base.Routes[v].AppName+'"]').has('fx-v') )
      {
        base.Routes[v].target = $('[fxr="'+base.Routes[v].AppName+'"] fx-v');
        base.Routes[v].controller = base.$methods.FindByNameAndType(base.Routes[v].cntrl,'controller');
        if(base.Routes[v].controller)
        {
          //template for controller:
          base.Routes[v].enabler={
              template:base.Routes[v].temp,
              target:base.Routes[v].target,
              enable:false
          };
            base.Routes[v].enabler.index=base.Routes[v].controller.AddTemplate(base.Routes[v].enabler);
            base.Routes[v].enabler.controller=base.Routes[v].controller;
        }
      }
    }
    var actualRute = window.location.hash.replace('#','');
    if(base.Routes[actualRute])
    {

      if(base.LastTemplateOn)
      {
        base.LastTemplateOn.enable = false;
        base.LastTemplateOn.controller.Call();
      }
      base.LastTemplateOn = base.Routes[actualRute].enabler;
      base.LastTemplateOn.enable = true;
      base.LastTemplateOn.controller.Call();
    }else {
      if(base.LastTemplateOn)
      {
        base.LastTemplateOn.enable = false;
        base.LastTemplateOn.controller.Call();
      }

    }

  }
}
