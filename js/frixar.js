/* global Mustache */

/**
 script:
 name: Frixar
 version : 0.1.0
 scripters:
 name: Camilo Barbosa
 email: cab331@hotmail.com
 about: A js script to control the views at moderns webs.

 Depends: jQuery, Mustache

 **/

(function (global, $, Mustache, frixar) {
    " user extrict ";
    global.frixar = frixar($, Mustache);

}(this, jQuery, Mustache, function ($, Mustache) {
    " user extrict ";
    var f_fc = new function () {
        $('html').hide();
        this.modules = [];
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



    function f_e(name, type, p, fun) {
        var self = f_b('event.' + type, p, function (base) {});
        p.AddHijo(self);
        self.e = fun;
        self.SetName(name);
    }

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
                f_e('local', self, fun);
            };

            sc.$Emit = function (name) {
                setTimeout(function () {
                    var args = [sc];
                    if (arguments.length > 1)
                    {
                        for (var i = 1; i < arguments.length; i++)
                            args.push(arguments[i]);
                    }
                    var es = [];
                    es = cntrl.FindAllByNameAndType(name, 'event.local', es);
                    es.forEach(function (e) {
                        e.e.apply(this, args);
                        sc.$apply();
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
                    cntrl.Containers.each(function (v) {
                        var temp = {cont: $(this).html(), target: $(this)};
                        Mustache.parse(temp.cont);
                        temp.render = Mustache.render(temp.cont, sc);
                        $(this).empty();
                        temp.target.append(temp.render);
                        $(this).removeAttr('fx-c');
                        cntrl.Templates.push(temp);
                    });
                }
            }

            self.sc = sc;
            return sc;
        }
        ;
        self.Run();
    }

    function f_c(parent) {
        var cntrl = {};
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

    var frixar = function (name, inyect) {
        var fram = {};
        var pprop = {};

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




        return fram;

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
    };

    frixar('$router').Service('$router',[],function () {
        var router={};



        return router;
    });


    return frixar;
}));
