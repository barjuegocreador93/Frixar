/**
 *script:
 **name: Frixar-Router
 **version : 0.0.4
 *scripters:
 **id:1
 **name: Camilo Barbosa
 **email: cab331@hotmail.com
 **about: A js script to control the views at moderns webs.

 Depends: jQuery, Frixar >= 0.1.8

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
        if(!base.Routes[name])
        {
          if(typeof config.controller=='string' &&
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
          if(typeof config.controller=='string' &&
          typeof config.templateUrl =='string')
          {
            base.Routes[name]={
             url:name,
             using:'fx-v',
             cntrl:config.controller,
             tempUrl:config.templateUrl,
             AppName:base.$vars.CurrentConfigApp.Name
           };
          }
        }
        return this;
      }
    };
  }
});

function templater(route)
{
  //template for controller:
  route.enabler={
      template:route.temp,
      target:$('[fxr="'+route.AppName+'"] fx-v'),
      enable:false
  };
    route.enabler.using = 'fx-v';
    route.controller.AddTemplate(route.enabler);
    route.enabler.controller= route.controller;
}


function router_enablers(base) {
  if(base.Routes)
  {
    for(var v in base.Routes)
    {

      if( $('[fxr="'+base.Routes[v].AppName+'"]').has('fx-v') && base.Routes[v].using == 'fx-v')
      {
        base.Routes[v].IsReady = false;
        base.Routes[v].controller = base.$methods.FindByNameAndType(base.Routes[v].cntrl,'controller');
        if(base.Routes[v].controller)
        {

          if(typeof base.Routes[v].tempUrl == 'string')
          {
            //using frixar http_service
            var http = base.$config('$ajax');
            $(document).ready(function(){
              http.get({url:base.Routes[v].tempUrl,success:function(data) {
                base.Routes[v].temp=data;
                templater(base.Routes[v]);
                base.Routes[v].enabler.templateUrl=base.Routes[v].tempUrl;
                base.Routes[v].enabler.ajax = base.$config('$ajax');
                base.Routes[v].IsReady = true;
                router_change_view(base);
              }});
            });

          }
          if(typeof base.Routes[v].temp == 'string')
          {
            base.Routes[v].IsReady = true;
            templater(base.Routes[v]);
          }


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
      if(base.Routes[actualRute].IsReady){
        base.updater={};
        var last = base.updater.LastTemplateOn = base.Routes[actualRute].enabler;
        last.enable = true;
        last.AppName = base.Routes[actualRute].AppName;
        update_enabler_target(last);
      }
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
    if(typeof enabler.templateUrl == 'string' && typeof enabler.ajax == 'object')
    {
      if(enabler.enable)
        enabler.ajax.get({url:enabler.templateUrl,success:function (data) {
        enabler.template = data;
        enabler.controller.Call();
      }});
    }else enabler.controller.Call();
  }
}
