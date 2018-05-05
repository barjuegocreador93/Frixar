/**
script:
        name: Frixar
        version : 0.0.1
        scripters:
                name: Camilo Barbosa
                email: cab331@hotmail.com
        about: A js script to control the views at moderns webs.

        Depends: jQuery, Mustache

**/

(function(global,$,Mustache,frixar){
  " user extrict ";
  global.frixar = frixar($,Mustache);

}(this,jQuery,Mustache,function ($,Mustache) {
 " user extrict ";
function f_b(type,parent,fun) {
    var base =  {IsReady:false};
    var self = {$name:'',$type:'base.'+type,$padre:parent,$hijos:[],base:base,$index:-1};
    base.Run = function () {
      fun(base);
      base.Hijos().forEach(function(v){
        v.Run();
      });
    };
    base.Type = function () {return self.$type};
    base.SetName=function(name){self.$name=name;base.Name=name;};
    base.OnReady = function () {};

    base.FindUpFirstByType=function(type){
      var result = null;
      base.Hijos().forEach(function (v) {
        if(v.HasType(type))
          result = v;
      });
      if(result==null)return base.Padre();
      return result;
    };


    base.EmiterOnReady = function () {
      if(!base.IsReady)
      {
          base.OnReady();
          base.IsReady=true;
      }


      base.Hijos().forEach(function(v){
        v.EmiterOnReady();
      });
    };
    base.FindAllByNameAndType=function(name,type,result)
    {
      if(base.Name==name && base.HasType(type))
        result.push(base);
      base.Hijos().forEach(function (v) {
        v.FindAllByNameAndType(name,type,result);
      });
      return result;
    }
    base.HasType=function(type2){return self.$type.includes(type2);};
    base.Hijos = function(){return self.$hijos;};
    base.Padre = function(val){if(arguments.length==0)return self.$padre;else{self.$padre=val;}}
    base.Root =function() {if(base.Padre()!=null)return base.Padre().Root();return base;};
    base.AddHijo=function(hijo){self.$hijos.push(hijo);hijo.Padre(base);hijo.SetIndex(self.$hijos.length-1);};
    base.SetIndex=function(index){self.$index=index;};
    base.Delete=function(){if(base.Padre())base.Padre().Hijos().splice(self.$index,1);self.$padre = null, self=base=null};
    base.Debug=function(){
      console.log(base);
    };
    base.FindByName=function(name,){
      var value = null;
      self.$hijos.forEach(function(v){

        if (v.HasType('base'))
        {
          if(v.Name == name)
            {value = v;return;}

           data=v.FindByName(name);
          if(data!=null)
          {value = data;return;}
        }
      });
      return value;
    };
    base.FindByNameAndType=function(name,type){
    var value = null;
    self.$hijos.forEach(function(v){
        if(v.Name == name && v.HasType(type))
        {
          value = v;
          return;
        }

        data=v.FindByNameAndType(name,type);
        if(data!=null)
        {
          value = data;
          return;
        }


    });
    return value;
    };
    return base;
  }

var f_fc = new function(){
  $('html').hide();
  this.modules=[];
  this.fetch=false;
  this.ChargeTime = 0;
  this.EventsTime = 5;
  this.FirstContact = false;
  var k=this;
  this.FindModelOrCreate=function(name,model){
    var tfn = arguments.length;
    var val = null;
    var self = this;
    k.modules.forEach(function (v) {
        if (v.Name != name)
        {
          if(tfn>1)
          {
            k.modules.push(model);
            self.ChargeTime += 10;
          }

        }else {
             val=v;
        }
    });
    if(this.modules.length==0)this.modules.push(model);
    return val;
  };
  this.Onfetch=function()
  {
    var self = this;
    this.fetch = true;
    this.modules.forEach(function (v) {
      if(!v.IsReady)self.fetch=false;
    });
    if(this.fetch )$('html').show();
  };
};

function f_e(name,type,p,fun) {
  var self=f_b('event.'+type,p,function(base){});
  p.AddHijo(self);
  self.e = fun;
  self.SetName(name);
}

function f_v(cntrl) {
  var view ={view:fun};
  var self = f_b('service.view',cntrl,function (base) {
    base.sc=view.view();
  });
  cntrl.AddHijo(self);
  self.SetName('$fv.'+cntrl.Padre().Name+'.'+cntrl.Name);

  self.After=function()
  {
    self.sc.$apply();
  };

  function fun(){
    var scope={};
    var sc = {};

    sc.$global = {};

    sc.$global.$On = function (name,fun) {
      f_e(name,'global',self,fun);
    };

    sc.$global.$Emit=function (name) {
      var argsl = arguments.length;
      var fargs = arguments;
      setTimeout(function () {

        var args = [];
        if(argsl>1)
        {
          for(var i=1;i<argsl;i++)
            args.push(fargs[i]);
        }
        var es = [];
        es=cntrl.Root().FindAllByNameAndType(name,'event.global',es);
        es.forEach(function(e){
          args.splice(0, 0, e.Padre().sc);
          e.e.apply(this,args);
          e.Padre().sc.$apply();
        });


      },f_fc.EventsTime);
    };

    sc.$On = function(name,fun)
    {
      f_e('local',self,fun);
    };

    sc.$Emit=function (name) {
      setTimeout(function () {
        var args = [sc];
        if(arguments.length>1)
        {
          for(var i=1;i<arguments.length;i++)
            args.push(arguments[i]);
        }
        var es = [];
        es=cntrl.FindAllByNameAndType(name,'event.local',es);
        es.forEach(function(e){
          e.e.apply(this,args);
          sc.$apply();
        });

      },f_fc.EventsTime);

    };

    sc.$apply=function()
    {
      if(cntrl.Templates)
      cntrl.Templates.forEach(function(v){
        v.target.empty();
        v.render = Mustache.render(v.cont,sc);
        v.target.append(v.render);
      });
      else {
        cntrl.Templates=[];
        cntrl.Containers.each(function(v){
          var temp = {cont:$(this).html(),target:$(this)};
          Mustache.parse(temp.cont);
          temp.render = Mustache.render(temp.cont,sc);
          $(this).empty();
          temp.target.append(temp.render);
          $(this).removeAttr('fx-c');
          cntrl.Templates.push(temp);
        });
      }
    }

    self.sc = sc;
    return sc;
  };
  fun.$inyect = [];
  return self;
}

function f_i(fun,padre,finder){
  var inyect = f_b('inject',padre,function (base) {
    var result=[];
    fun.$inyect.forEach(function(v){
      var data=finder(v)
      console.log(v);
      if(data!=null)
      {
          if(base.Padre().HasType('service')&& data.HasType('view'))data=data.sc;
          result.push(data);
      }

      else {
        console.error('Service: "'+v+'"'+" wasn't created! ");
      }
    });
    fun.$inyectResult = result;
  });

  return inyect;
}

function finder_services(name,base){

}

function f_c(parent){
  var cntrl={};
  var pprop = {};
  var self = f_b('cntrl',parent,function (base) {
    base.Fv = f_v(base);
    base.Fv.Run();
    var inyect = f_i(pprop.$cfun,base,function(name){
      if (name.includes('$fv')){
        if(name=='$fv')
          return base.FindByNameAndType('$fv.'+base.Padre().Name+'.'+base.Name,'service.view');
        return null;
      }else {
        if (name.includes('$router')){
          if(name=='$router')
            return base.Padre().FindByNameAndType('$router.'+base.Padre().Name,'router');
          return null;
        }
      }

      var root=base.Root();
      return root.FindByNameAndType(name,'service');
    });
    base.AddHijo(inyect);
    inyect.Run();

  });

  self.OnReady = function () {
    $(document).ready(function(){
      if($('[fxr="'+parent.Name+'"]').has('[fx-c="'+self.Name+'"]').length==1 ||
         $('[fxr="'+parent.Name+'"][fxr="'+parent.Name+'"]').length==1)
        {

          self.Containers = $('[fx-c="'+self.Name+'"]');
          self.Call();
        }
    });
  };

  parent.AddHijo(self);

  cntrl.Fun=function(fun,inyects){pprop.$cfun=fun;pprop.$cfun.$inyect=inyects;return cntrl;};
  cntrl.SetName=function(name){self.SetName(name);};

  self.Call=function () {
    var args = [];
    pprop.$cfun.$inyectResult.forEach(function (v) {

      if(v.HasType('view'))
      {
        args.push(v.sc);
      }else
      args.push(v.fun.apply(this,v.fun.$inyectResult));
    });
    pprop.$cfun.apply(this,args);
    pprop.$cfun.$inyectResult.forEach(function (v) {
      v.After();
    });
  };
  return cntrl;
}

function f_s(md,type){

   var maker = {};
   var prop = {};
   var self = f_b('service.'+type,md,function (base) {
       var inyect = f_i(maker.service.fun,self,function (name) {
         var root=self.Root();
         return root.FindByNameAndType(name,'service');
       });
       inyect.Run();

   });
   maker.service = self;

   


   self.After=function(){};
   md.AddHijo(maker.service);

   maker.Service=function (name,inyects,fun) {
     maker.service.SetName(name);
     maker.service.fun = fun;
     maker.service.fun.$inyect = inyects;
   };

   return maker;
}

function f_r(md){
  var router = {};
  var self = f_s(md,'router').service;{
    self.SetName('$router.'+md.Name)
    self.fun = function () {
      var rs ={}
      rs.Location=function(surl)
      {

      }
      return rs;
    };
    self.fun.$inyect=[];
  }

  self.After =function () {

  };

  return router;
}

var frixar = function(name,inyect){
  var fram = {};
  var pprop = {};
  var self = f_b('module',null,function (base) {
    if(pprop.$inyect)
    pprop.$inyect.forEach(function (d) {
        var data = f_fc.FindModelOrCreate(d);
        if(data!=null) {self.AddHijo(data);}
    });

  });

  self.SetName(name);
  var d=f_fc.FindModelOrCreate(name,self);
  if(d!=null){self = d;pprop.$copy=true;}
  else pprop.$copy=false;
  pprop.$inyect=inyect;

  if(!pprop.$copy)
  {
    setTimeout(function(){
      self.Run();
      self.EmiterOnReady();
      setTimeout(function(){f_fc.Onfetch();},5);

    }, f_fc.ChargeTime);
  }
  fram.Service = Service;
  fram.Controller = Controller;

  if(!f_fc.FirstContact)
  {
    pprop.router = f_r(self);
    f_fc.FirstContact=true;
  }


  return fram;


  function Service(name,inyects,fun) {
    var service = f_s(self,'');
    service.Service(name,inyects,fun);
    return fram;
  }

  function Controller (name){
    var cntrl = f_c(self);
    if(arguments.length==3)
    {
      arguments[1].splice(0,0,'$fv');
      cntrl.Fun(arguments[2],arguments[1]).SetName(name);
    }else
    if(arguments.length==2)
    {
      var inyect = ['$fv'];
      if(arguments[1].$inyect)inyect=arguments[1].$inyect;
      cntrl.Fun(arguments[1],inyect).SetName(name);
    }
    return fram;
  }
}


return frixar;
}));
