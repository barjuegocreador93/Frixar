
# Frixar
**Frixar** is an early `js` framework that uses [Mustache](https://mustache.github.io/) to control `html` as a template.

* [Controller](#controllers)
* [fv](#fv)
* [Service](#services)
* [frixarFactory](#factory-service)
* [Base types](#base-types)
* [Router](#router)
* [On Dev](#on-dev)
* [New](#new)

## Simple App Example:
- On `js`
```javascript
    frixar('myApp').Controller('myController',function($fv){
	    fv.Web_Name =  'My Super Web!';
	    fv.fNav = [{url:'/home',text:'Home'},{url:'/login',text:'Login'}];
    });
```

- On `Html`
```html
  ...
   <header fxr='myApp' fx-c="myContreller">
      <h3>{{title}}</h3>
      <nav>
        {{#fNav}}
        <a href="{{url}}">{{text}}</a>
        {{/fNav}}
      </nav>
   </header>
   ...
```

-	Compiled `html`:

```html
<h3>My Super Web!</h3>
<nav>
 <a href="#">Home</a>
 <a href="#">Login</a>
</nav>
```

- Browser!

  ### My Super Web!
	[Home](#)		[Login](#)


## Install
* Install via `bower`:
```sh
  $ bower install --save frixar
```

* via source in `Html`:
```html
  <script src="/frixar.js" charset="utf-8"></script>
```

## Controllers
The controllers has the control of a template. You can call service inside de controller if they were called by frixar.

> The principal service is `$fv`,  *Controller first argument function* is `$fv`.

- ### Calling other services:

```javascript
  frixar('myApp').Controller('ScondController',['service1','service2',...],
  function($fv,service1,service2){
  		//your code
  });
```


- ### $fv
Is  a controller service, every controller created have a `$fv`.

- ### Events
We can communicate a controllers with others controllers throw  `$fv`.
  - #### Locals
	We can emit a event inside a controller or what ever has in the declaration zone of `$fv` using `$fv.$Emit('name event',data1,data2,...);` to take the data of the emitter we can use `$fv.$On('name evnet',function(data1,data2){});`.          

  - #### Globals  
  We can emit a event inside a controller or what ever has in the declaration zone of `$fv` using `$fv.$global.$Emit('name event',data1,data2,...);` to take the data of the emitter we can use `$fv.$global.$On('name evnet',function(data1,data2){}); `. The principal diference with `local events` is when you has two apps declarates with `frixar` they can go to the other controllers aswell we takes `frixar('app',['app2']);` in the first frixar app call.
  ```js
  frixar('App1').Controller('SecondController',
		function($fv){
  			$fv.$global.$On('myEvent',function(data){
                    //code here
              });
		});

    frixar('App2').Controller('appController',
		function($fv){
  			$fv.$global.$Emit('myEvent',25);
		});
  ```


- ## Services
Services are a components that we be able to use throw Controllers. We can make to types of service, one can solve a specific problem, factory Service must be solve a global problems.

  - ### Local Service
  We can use it, for a create a connection with a API using `jQuery ajax` for the moment. Like a `Controllers` we can call a others services inside this.

  ```javascript
    frixar('app').Service('User_service',[],function(){
          var srv = {};
            srv.GetUser=function(user_id,success,error){
              $.get({url:'api/users/',data:{id:user_id},success:success,error:error});
            };
          return srv;
        });                                      
        frixar('app').Controller('userController',['User_service'],
        function($fv,User_service){
          $('#user_select').click(function(){
              User_service.getUser($(this),val(),function(data){
                $fv.User=data;
                //jQuery has problem charge us $fv we can force
                //with $apply()
                $fv.$apply();
                });
          });
    });
  ```

Service can call a controllers `$fv` like `['$fv.app.appController','$fv.app2.app2Controller',...]` because they are services too.

- ## Factory Service
We can create a Class of service more powerful and with more control that locals services.
This services has `4 methods` that cover a sectors of frixar app

  - ### Define
  Is service function who is called in controller.  
  ```javascript
      var ServiceDepends = ['Service1','Service2',...]
      function Define(Service1,Service2,...)
      {
        //code here
      }
  ```
  Remember, they can return data.

  - ### OnReady
  Is called when all frixars are reading.
  ```javascript
      function OnReady(base)
      {
        //code here
      }
  ```
  - ### After
  Is called when all controllers finish if is was depends of controllers.
  ```javascript
      function After(base)
      {
        //code here
      }
  ```
  * ### Config
  Will call when `frixar('app').Config('serviceName')` was call.'
  ```javascript
      function Config(base)
      {
        var config={};
        config.FirstMethod = function(){
          //code here
        }
        return config;
      }
  ```
  ```javascript
      var service=frixarFactory('packageName').File('ServiceName');
      //Class new service
      service.Service('ServiceName',ServiceDepends,Define,OnReady,After,Config);
      //create a app
      var app=frixar('app');
      ...
      //Create a instance of service inside an app:
      app.Using('packageName.ServiceName');
      app.Config('ServiceName').FirstMethod();
      ...
  ```
	> ## Other Ways to create a `factoryService`:
	* [Babel example](https://github.com/barjuegocreador93/Frixar/blob/master/factory/babel/example.js)


### Versions
#### Version 0.1.5:
Inside de methods: `After`, `OnReady` and `Config` the first argument named `base` has a object: `$methods`.

* ## base Types
  * ### `type`
    is string that can be:  

    * `app`:all frixar apps,  
    * `factoryService`: all FactoryServices
    * `controller`: all controllers

  * ### `result`
    Is array that get all results with object and their public attributes.

    * `app: {Name,EmiterOnReady}` `Name` is sitring, `EmiterOnReady` is a method

    * `factoryService: {Name,extension}` `extension` is the base.

    * `controller:{Name,AddTemplate,Call}`

		* `AddTemplate(template)` is a method with argument object `template:{template:textHtml,target:jQuert object,enable:boolean}` returns null.

		* `Call()` is to ReCall de `Define Method` of the contreller.


  * ## base.$methods
    * ### FindAllByType([`type`](#type),[`result`](#result))
      find all in a `frixar app` objects by type and get public attributes.
      ```javascript
      var controllers = [];        
      base.$methods.FindAllByType('controller',controllers);
      ```
    * ### FindAllByNameAndType(`name`,[`type`](#type)) returns `object`
      find all in a `frixar app` objects by name and type and get public attributes.
      ```javascript
          var controllers = [];        
          base.$methods.FindAllByNameAndType('controller',controllers);
      ```

    * ### EmiterOnReady() returns `null`
      reload `OnReady` in all components of `frixar app`. Becarfull using inside of OnReady method `you will make a bucle`:
      ```javascript
      OnReady:function(base){
        ...
          if(!base.IsReady)
          {
            base.IsReady = true;
            base.$methods.EmiterOnReady();
          }
          ...
        }
      ```

  #### version 0.1.6:
  Inside de methods: `After`, `OnReady` and `Config` the first argument named `base` has a object: `$vars`.

    * ## base.$vars
      * ### CurrentConfigApp
        A object that contains a public attributes of current frixar app that using Config with us service.

  #### version 0.1.9:
    * ## base.$config
      We can call an other service Config
      ```javascript
          base.$config('$ajax').rjson({url:'get json path',success:function(json){
            ...
          }});
      ```  

- # Router

  Will be a factoryService that will control the templates and controllers as a   route url in the browser like: `#/home`.

  ```html
      <script src="/factory/router.js" charset="utf-8"></script>
  ```
  On `app.js`
  ```javascript
      var app = frixar('app');
      app.Using('Router.$router');
  ```

  * ## Router-Config
    * ### Route
    We can create a view that has a template and a controller when `fxr app` in Html
    has a `<fx-v></fx-v>`
    ```javascript        
        app.Config('$router').Route('/home',{
          template : '<h1>{{header}}<h1><p>{{explain}}</p>',
          controller:'mainController'
        });
    ```
    The first argument of `Route` is the name of the `frixar app route`, the second argument is a object with a `template` and `controller`.
    ```html
      ...
        <nav>
          <a href="#/home" >Home</a>
        </nav>
        <section fxr="app">
          <fx-v></fx-v>
        </section>
      ...
    ```    
    Other `Route template` aplication is that we can put other `fxr` or `fx-c` attributes inside theirs with like this:
    ```javascript
      app.Config('$router').Route('/app',
        {
          template:"<section fxr='app2'><div fx-c='otherController'>{{other_data}}</div></section>",
          controler:'appController'
        });      
    ```

    - ###### New
      - ### templateUrl
      We can create a `template.fxt` file to show a template in a `<fx-v>` when route has active. We gonna needed to run us app in a `server` or `localhosts tools`!!:
      ```javascript
        app.Config('$router').Route('/contacts',
          {
            templateUrl:"./templates/contactsView.fxt",
            controler:'contactsController'
          });      
      ```
    - ##### On dev
      * ### Route Three
      We will allowed to make a view insde parent view with `/Cars/Mazda`

        * index.html    
          * `<fx-v>`
            * /route-root
            * controller
            * template
              * `<fx-v>`
                * /childs
                * controller
                * template
                  * ...

      * ### Route $vars
       We will allowed to create vars with `/Costumers/{costumer_id}` and take the data with `$router` service difine at controller
       ```javascript
          app.Controller('CostumersController',['$router'],function ($fv,$router) {
            var costumer_id = $router.$vars['costumer_id'];
          });
       ```
