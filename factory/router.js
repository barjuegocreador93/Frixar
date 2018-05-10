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
    if(!base.IsReady)
    {
      base.IsReady=true;
      router_enablers(base);
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
    }

  },
  Config:function (base) {
    if(!base.Routes)base.Routes={};
    return{
      Route: function(name,config){
        if(!base.Routes[name] &&
          typeof config.controller=='string' &&
          typeof config.template =='string')
        {
           base.Routes[name]={
            url:name,
            using:'fx-v',
            cntrl:config.controller,
            temp:config.template,
            AppName:base.$vars.CurrentConfigApp.Name
          };
        }
         return this;
      }
    };
  }
});


function router_enablers(base) {
  if(base.Routes)
  {
    for(var v in base.Routes)
    {

      if( $('[fxr="'+base.Routes[v].AppName+'"]').has('fx-v') && base.Routes[v].using == 'fx-v')
      {
        var controller = base.$methods.FindByNameAndType(base.Routes[v].cntrl,'controller');
        if(controller)
        {
          //template for controller:
          base.Routes[v].enabler={
              template:base.Routes[v].temp,
              target:$('[fxr="'+base.Routes[v].AppName+'"] fx-v'),
              enable:false
          };
            base.Routes[v].enabler.using = 'fx-v';
            controller.AddTemplate(base.Routes[v].enabler);
            base.Routes[v].enabler.controller= controller;
        }else console.error('Controller: '+base.Routes[v].cntrl+' not exist for '+base.Routes[v].AppName+' in the route '+v);
      }
    }
  }
}


function router_change_view(base)
{
  if(base.Routes){

    var actualRute = window.location.hash.replace('#','');
    if(base.Routes[actualRute])
    {
      if(base.updater)
      {
        var updt = base.updater;
        updt.LastTemplateOn.enable = false;
        update_enabler_target(updt.LastTemplateOn);
      }
      base.updater={};
      var last = base.updater.LastTemplateOn = base.Routes[actualRute].enabler;
      last.enable = true;
      last.AppName = base.Routes[actualRute].AppName;
      update_enabler_target(last);
    }else {
      if(base.updater)
      {
        base.updater.LastTemplateOn.enable = false;
        update_enabler_target(base.updater.LastTemplateOn);
      }

    }

  }
}




function update_enabler_target(enabler)
{
  if(enabler.using == 'fx-v')
  {
    enabler.target = $('[fxr="'+enabler.AppName+'"] fx-v');    
    enabler.controller.Call();
  }
}
