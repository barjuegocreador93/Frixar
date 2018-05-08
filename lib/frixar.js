/* global Mustache */

/**
 *script:
 **name: Frixar
 **version : 0.1.6
 *scripters:
 **id:1
 **name: Camilo Barbosa
 **email: cab331@hotmail.com
 **about: A js script to control the views at moderns webs.

 Depends: jQuery, Mustache

 **/

(function (global, $, Mustache, frixar) {
    "use strict";
    var frixar = frixar($, Mustache);

    global.frixar = frixar.framework;
    global.frixarFactory = frixar.packageFactory;


}(this, jQuery, Mustache, function ($, Mustache) {
    "use strict";
    var frixar = function (name, inyect) {
        var fram = {};
        var pprop = {};
        var psing={};
        var self = f_b('module', null, function (base) {
            if (pprop.$inyect)
                pprop.$inyect.forEach(function (d) {
                    var data = f_fc.FindModelOrCreate(d);

                    if (data !== null) {
                        self.AddHijo(data);
                    }
                });

        });
        self.SetName(name);

        //PUBLIC attrs
        var publicattrs = {
          app:{type:'module',attrs:['Name','EmiterOnReady']},
          factoryService:{type:'extension',attrs:['Name','extension']},
          controller:{type:'cntrl',attrs:['Name']}
        };

        var d = f_fc.FindModelOrCreate(name, self);

        if (d !== null) {
            self = d;
            pprop.$copy = true;
        } else
        {
            pprop.$copy = false;
        }

        pprop.$inyect = inyect;

        if (!pprop.$copy)
        {
            setTimeout(function () {

                self.Run();

                self.EmiterOnReady();
                setTimeout(function () {
                    f_fc.Onfetch();
                }, 5);

            }, f_fc.ChargeTime);
        }
        fram.Service = Service;
        fram.Controller = Controller;
        fram.Debug = Debug;
        fram.Using = Using;
        fram.Config = Config;

        return fram;

        function Config(extension)
        {
          var data=self.FindByNameAndType(extension,'extension');
          if(data)
          {
            if(data.Config){
              data.extension.$vars.CurrentConfigApp={Name:self.Name};
              return data.Config(data.extension);
            }
            console.error('extension '+extension+' no has config!');
          }else
            console.error('extension not exit');
        }

        function Debug() {
            self.Debug();
        }

        function Service(name, inyects, fun) {
            var service = f_s('',self, function (base) {
                base.maker.Inyection(base,base.maker.FinderService);
            });
            service.Service(name, inyects, fun);
            return fram;
        }

        function Controller(name) {
            var cntrl = f_c(self);

            if (arguments.length === 3)
            {
                arguments[1].splice(0, 0, '$fv');
                cntrl.Fun(arguments[2], arguments[1]).SetName(name);
            } else
            if (arguments.length == 2)
            {
                var inyect = ['$fv'];
                if (arguments[1].$inyect)
                    inyect = arguments[1].$inyect;
                cntrl.Fun(arguments[1], inyect).SetName(name);
            }
            return fram;
        }

        function Using(packagesName) {
          function str_(namestr)
          {
            namestr = namestr.replace(' ','_').replace('$','*');
            var spname = namestr.split('.');
            psing.cursor = f_fc.packages;
            for(var i in spname)
            {
              if(psing.cursor[spname[i]])
                  psing.cursor=psing.cursor[spname[i]];
              else {
                console.error('Package not exist yet!');
                return;
              }
            }

            if(psing.cursor.$type=='srv')
            {
                var args = ['extension',self,psing.cursor.$data.init];
                var srv = psing.cursor.$data.class.apply(this,args);
                srv.extension = {};
                srv.extension.$methods={};
                srv.extension.$vars = {};
                srv.extension.$vars.CurrentConfigApp = null;

                srv.extension.$methods.FindAllByType=function(type,result){
                  if(publicattrs[type])
                  srv.Root().ForAll(function(v,r){
                    if(v.HasType(publicattrs[type].type))
                      {
                        var ob= {};
                        for (var p of publicattrs[type].attrs)
                        {
                          ob[p] = v[p];
                        }
                        r.push(ob);
                      }
                  },result);
                  else console.error(type+' Not exist! ');
                }

                srv.extension.$methods.FindByNameAndType=function (name,type) {
                  var val = null;
                  if(publicattrs[type])
                  srv.Root().ForAll(function (v) {

                        if(v.HasType(publicattrs[type].type)&& v.Name == name)
                        {
                          var ob= {};
                          for (var p of publicattrs[type].attrs)
                          {
                            ob[p] = v[p];
                          }
                          val = ob;
                          return -1;
                        }
                  });
                  else console.error(type+' Not exist! ');
                  return val;
                }

                srv.$data = {};
                srv.Config = psing.cursor.$data.Config;
                srv.$data.OnReady = psing.cursor.$data.OnReady;
                srv.$data.After = psing.cursor.$data.After;
                srv.OnReady = function(){
                  srv.$data.OnReady(srv.extension);
                }
                srv.After = function () {
                  srv.$data.After(srv.extension);
                }
                srv.Service(psing.cursor.$data.name,psing.cursor.$data.inyect,psing.cursor.$data.fun);
            }

            return fram;
          }
          if(typeof arguments[0] == 'string')
          {
            return str_(arguments[0]);
          }
          if(Array.isArray(arguments[0]))
          {
              for(var i in arguments[0])
              {
                str_(arguments[0][i]);
              }
              return fram;
          }
          console.error('error in using arguments!');

        }
    };
    //Object logic
    var f_fc = new function () {
        $('html').hide();
        this.modules = [];
        this.packages = {};
        this.fetch = false;
        this.ChargeTime = 0;
        this.EventsTime = 5;
        this.FirstContact = false;
        var k = this;
        this.FindModelOrCreate = function (name, model) {
            var tfn = arguments.length;
            var val = null;
            var self = this;
            var existe = false;

            for(var v in k.modules)
            {
                if (k.modules[v].Name === name)
                {
                    existe = true;
                    val = k.modules[v];
                    break;
                }
            }

            if (!existe && tfn > 1)
            {
                this.modules.push(model);
                return null;
            }

            return val;
        };
        this.Onfetch = function ()
        {
            var self = this;
            this.fetch = true;
            this.modules.forEach(function (v) {
                if (!v.IsReady)
                    self.fetch = false;
            });
            if (this.fetch)
                $('html').show();
        };
    };

    //frixarFactory
    function frixarPackage(name) {
      var pg = {};
      var prop = {dir:{},cursor:null,typer:{
        srv:{class:f_s,name:'',init:null,After:null,OnReady:null,fun:null,inyect:[]}
      }};
      var typer = {};
      var service ={};
      pg.File  = $File;
      typer.Service = Service;

      function validations(name){
        name= name.replace(' ','_').replace('$','*');
      }(name);
      var spname = name.split('.');
      if(!f_fc.packages[spname[0]] )
      {
          prop.cursor = f_fc.packages;
          for(var v in spname)
          {
          if(!prop.cursor[spname[v]])
              prop.cursor=prop.cursor[spname[v]]={$type:'folder'};
          else {
            prop.cursor=prop.cursor[spname[v]];
            prop.cursor=prop.cursor[spname[v]]={$type:'folder'};
          }
          }
          return pg;
      }
      console.error('Package allready exist!');

      function $File(name) {
        name= name.replace(' ','_').replace('$','*');
        validations(name);
        if(!prop.cursor[spname[v]])
          prop.cursor=prop.cursor[name]={$type:'file'};
        else {
          prop.cursor=prop.cursor[spname[v]];
          prop.cursor=prop.cursor[spname[v]]={$type:'file'};
        }

        return typer;
      }

      function Service(name,inyect,define,After,OnReady,Config) {
        prop.cursor.$type='srv';
        prop.cursor.$data = prop.typer.srv;
        if(typeof name == 'string')prop.cursor.$data.name = name;
        if(typeof inyect == 'array')prop.cursor.$data.inyect = inyect;
        if(typeof After == 'function')prop.cursor.$data.fun = define;
        else prop.cursor.$data.fun = function () {};
        if(typeof After == 'function')prop.cursor.$data.After = After;
        else prop.cursor.$data.After = function () {};
        if(typeof OnReady == 'function')prop.cursor.$data.OnReady = OnReady;
        else prop.cursor.$data.OnReady = function () {};

        if(typeof Config == 'function')prop.cursor.$data.Config = Config;
        else prop.cursor.$data.Config = null;

        prop.cursor.$data.init = function(base){
          base.maker.Inyection(base,base.maker.FinderService);
        };

      }



    }

    //frixar object base
    function f_b(type, parent, fun) {
        var base = {IsReady: false};
        var self = {$name: '', $type: 'base.' + type, $padre: parent, $hijos: [], base: base, $index: -1};
        base.Run = function () {
            fun(base);
            base.Hijos().forEach(function (v) {
                v.Run();
            });
        };
        base.Type = function () {
            return self.$type;
        };
        base.SetName = function (name) {
            self.$name = name;
            base.Name = name;
        };
        base.OnReady = function () {};

        base.FindUpFirstByType = function (type) {
            var result = null;
            base.Hijos().forEach(function (v) {
                if (v.HasType(type))
                    result = v;
            });
            if (result === null)
                result = base.Padre();
                if (result !== null)
                    result=result.FindUpFirstByType(type);

            return result;
        };

        base.ForAll=function(fun,args)
        {
          if(fun(base,args) == -1)return;
          base.Hijos().forEach(function(v){
            v.ForAll(fun,args);
          });
        }


        base.EmiterOnReady = function () {
            if (!base.IsReady)
            {
                base.OnReady();
                base.IsReady = true;
            }


            base.Hijos().forEach(function (v) {
                v.EmiterOnReady();
            });
        };
        base.FindAllByNameAndType = function (name, type, result){
            if (base.Name === name && base.HasType(type))
                result.push(base);
            base.Hijos().forEach(function (v) {
                v.FindAllByNameAndType(name, type, result);
            });
            return result;
        };
        base.HasType = function (type2) {
            return self.$type.includes(type2);
        };
        base.Hijos = function () {
            return self.$hijos;
        };
        base.Padre = function (val) {
            if (arguments.length == 0)
                return self.$padre;
            else {
                self.$padre = val;
            }
        }
        base.Root = function () {
            if (base.Padre() != null)
                return base.Padre().Root();
            return base;
        };
        base.AddHijo = function (hijo) {
            self.$hijos.push(hijo);
            hijo.Padre(base);
            hijo.SetIndex(self.$hijos.length - 1);
        };
        base.SetIndex = function (index) {
            self.$index = index;
        };
        base.Delete = function () {
            if (base.Padre())
                base.Padre().Hijos().splice(self.$index, 1);
            self.$padre = null, self = base = null
        };
        base.Debug = function () {
            console.log(base);
        };

        base .FindByType= function (type) {
            var value = null;
            self.$hijos.forEach(function (v) {

                if (v.HasType('base'))
                {
                    if (v.HasType(type))
                    {
                        value = v;
                        return;
                    }

                    var data = v.FindByType(type);
                    if (data !== null)
                    {
                        value = data;
                        return;
                    }
                }
            });
            return value;
        };

        base.FindByName = function (name) {
            var value = null;
            self.$hijos.forEach(function (v) {

                if (v.HasType('base'))
                {
                    if (v.Name == name)
                    {
                        value = v;
                        return;
                    }

                    var data = v.FindByName(name);
                    if (data != null)
                    {
                        value = data;
                        return;
                    }
                }
            });
            return value;
        };
        base.FindByNameAndType = function (name, type) {
            var value = null;
            self.$hijos.forEach(function (v) {
                if (v.Name === name && v.HasType(type))
                {
                    value = v;
                    return;
                }

                var data = v.FindByNameAndType(name, type);
                if (data !== null)
                {
                    value = data;
                    return;
                }


            });
            return value;
        };
        return base;
    }

    //frixar inyector
    function f_i(fun, padre, finder) {
        var inyect = f_b('inject', padre, function (base) {
            var result = [];
            fun.$inyect.forEach(function (v) {
                var data = finder(v);
                if (data !== null)
                {
                    if (!data.HasType('cntrl') && data.HasType('service'))
                        result.push(data);
                    else
                        console.error(" you can't call a Controller");
                } else {
                    console.error('Service: "' + v + '"' + " wasn't created! ");
                }
            });
            fun.$inyectResult = result;
        });

        return inyect;
      }

    //frixar service
    function f_s(type, md, fun) {

        var self = f_b('service.' + type, md, function (base) {
            fun(base);
        });
        md.AddHijo(self);

        var maker = {};
        self.maker = maker;

        maker.Inyection = function (base, finder) {
            var inyect = f_i(base.fun, base, function (name) {
                return finder(base, name);
            });
            inyect.Run();
        };

        maker.FinderService = function (base, name) {
            var root = base.Root();
            return root.FindByNameAndType(name, 'service');
        };

        self.fun = function () {};
        self.fun.$inyect = [];

        maker.defaultFunCall = function () {
            self.fun.$inyectResultObj = [];
            self.fun.$inyectResult.forEach(function (v, ind) {

                if (typeof v === "object" && typeof v.HasType === "function")
                {
                    if (typeof v.fun.Call === 'function')
                        self.fun.$inyectResult[ind] = v.fun.Call();
                        self.fun.$inyectResultObj.push(v);
                } else
                    console.error('problem-in-inyection ' + ind +' of ' + self.Name);
            });

            var data=self.fun.apply(this, self.fun.$inyectResult);

            self.fun.$inyectResultObj.forEach(function (v) {
               v.After();
            });

            return data;

        };

        self.fun.Call = self.maker.defaultFunCall;



        self.Service = function (name, inyects, fun) {
            self.SetName(name);
            self.fun = fun;
            self.fun.$inyect = inyects;
            self.fun.Call = self.maker.defaultFunCall;
        };

        self.After= function () {

        };

        return self;
    }
    //frixar event
    function f_e(name, type, p, fun) {
        var self = f_b('event.' + type, p, function (base) {});
        p.AddHijo(self);
        self.e = fun;
        self.SetName(name);
    }

    //frixar view
    function f_v(cntrl) {
        var self = f_s('view', cntrl, function (base) {
            base.fun = fun;
            base.sc = fun();
            base.fun.Call = function () {
                return base.sc;
            };
        });
        self.SetName('$fv.' + cntrl.Padre().Name + '.' + cntrl.Name);

        self.After = function ()
        {
            self.sc.$apply();
        };

        //$fv
        function fun() {
            var scope = {};
            var sc = {};

            sc.$global = {};

            sc.$global.$On = function (name, fun) {
                f_e(name, 'global', self, fun);
            };

            sc.$global.$Emit = function (name) {
                var argsl = arguments.length;
                var fargs = arguments;
                setTimeout(function () {

                    var args = [];
                    if (argsl > 1)
                    {
                        for (var i = 1; i < argsl; i++)
                            args.push(fargs[i]);
                    }
                    var es = [];
                    es = cntrl.Root().FindAllByNameAndType(name, 'event.global', es);
                    es.forEach(function (e) {
                        args.splice(0, 0, e.Padre().sc);
                        e.e.apply(this, args);
                        e.Padre().sc.$apply();
                    });


                }, f_fc.EventsTime);
            };

            sc.$On = function (name, fun)
            {
                f_e(name, 'local', self, fun);
            };

            sc.$Emit = function (name) {
                setTimeout(function () {
                    var args = [];
                    if (arguments.length > 1)
                    {
                        for (var i = 1; i < arguments.length; i++)
                            args.push(arguments[i]);
                    }
                    var es = [];
                    es = cntrl.FindAllByNameAndType(name, 'event.local', es);
                    es.forEach(function (e) {
                        e.e.apply(this, args);
                        e.Padre().sc.$apply();
                    });

                }, f_fc.EventsTime);

            };

            sc.$apply = function ()
            {
                if (cntrl.Templates)
                    cntrl.Templates.forEach(function (v) {
                        v.target.empty();
                        v.render = Mustache.render(v.cont, sc);
                        v.target.append(v.render);
                    });
                else {
                    cntrl.Templates = [];
                    cntrl.Recharge = true;
                }

                if(cntrl.Recharge)
                {
                  cntrl.Containers.each(function (v) {
                      var temp = {cont: $(this).html(), target: $(this)};
                      Mustache.parse(temp.cont);
                      temp.render = Mustache.render(temp.cont, sc);
                      $(this).empty();
                      temp.target.append(temp.render);
                      $(this).removeAttr('fx-c');
                      cntrl.Templates.push(temp);
                  });
                  cntrl.Recharge = false;
                }
            }

            self.sc = sc;
            return sc;
        }
        ;
        self.Run();
    }

    //frixar controller
    function f_c(parent) {
        var cntrl = {};
        var psing={};
        var pprop = {};
        var self = f_s('cntrl', parent, function (base) {
            base.Fv = f_v(base);
            base.fun = pprop.$cfun;
            base.maker.Inyection(base, function (base, name) {
                if (name.includes('$fv')) {
                    if (name == '$fv')
                        return base.FindByNameAndType('$fv.' + base.Padre().Name + '.' + base.Name, 'view');
                    return null;
                }
                var root = base.Root();
                return root.FindByNameAndType(name, 'service');
            });

        });

        self.OnReady = function () {
            $(document).ready(function () {
                if ($('[fxr="' + parent.Name + '"]').has('[fx-c="' + self.Name + '"]').length === 1 ||
                        $('[fxr="' + parent.Name + '"][fxr="' + parent.Name + '"]').length === 1)
                {

                    self.Containers = $('[fx-c="' + self.Name + '"]');
                    self.Recharge = true;
                    self.Call();
                }
            });
        };



        cntrl.Fun = function (fun, inyects) {
            pprop.$cfun = fun;
            pprop.$cfun.$inyect = inyects;
            pprop.$cfun.Call = self.maker.defaultFunCall;
            return cntrl;
        };
        cntrl.SetName = function (name) {
            self.SetName(name);
        };

        self.Call = function () {
            self.fun.Call();

        };
        return cntrl;
    }






    return {framework:frixar , packageFactory:frixarPackage};
}));
