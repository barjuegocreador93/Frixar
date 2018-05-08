
# Frixar
> frixar is a early js framework that using [`Mustache`]() to control the html as template.

* ##### [`Controller`](#controllers)
* ##### [`fv`](#fv)
* ##### [`Service`](#services)
* ##### [`frixarFactory`](#factory-service)
* ##### [`base types`](#base-types)
* ##### [`Router`](#router)
* ##### [`On Dev`](#on-dev)

- ## Simple App Example:
  > - On js
  ```javascript
	    frixar('myApp').Controller('myController',function($fv){
  	    fv.Web_Name =  'My Super Web!';
  	    fv.fNav = [{url:'/home',text:'Home'},{url:'/login',text:'Login'}];
	    });
  ```
	>- On Html
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
	>-	result:				
	### My Super Web!
	[Home](#)		[Login](#)


 - ## Controllers
	> The controllers has the control of a template. You can call service inside de controller if they were called by frixar. The principal service is `$fv`,  ` Controller first argument function`  is `$fv`.

	- ### Calling other services:

		```javascript
			frixar('myApp').Controller('ScondController',['service1','service2',...],
			function($fv,service1,service2){
    			//your code
			});
    ```

- ### $fv
    > Is  a controller service, every controller created have a `$fv`.
    - ### Events
          We can comunicate a controllers with others controllers throw  `$fv`.
      - #### Locals
		      We can emit a event inside a controller or what ever has in the declaraction zone of `$fv` using `$fv.$Emit('name event',data1,data2,...);` to take the data of the emiter we can use `$fv.$On('name evnet',function(data1,data2){});`.          
      - #### Globals  
          We can emit a event inside a controller or what ever has in the declaraction zone of `$fv` using `$fv.$global.$Emit('name event',data1,data2,...);` to take the data of the emiter we can use `$fv.$global.$On('name evnet',function(data1,data2){}); `. The principal diference with `local events` is when you has two apps declarates with `frixar` they can go to the other controllers aswell we takes `frixar('app',['app2']);` in the first frixar app call.
          ```javascript
        			frixar('myApp').Controller('ScondController',
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
    > Services are a components that we be able to use throw Controllers
    we can make to types of service, one can solve a specificate problem, factory Service must be solve a globals problems.

	 - ### Local Service
      > We can use it, for a create a connection with a API using `jQuery ajax` for the moment. Like a `Controllers` we can call a others serices inside this.

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


  > Service can call a controllers `$fv` like `['$fv.app.appController','$fv.app2.app2Controller',...]` couse they are services too.

- ## Factory Service
> We can create a Class of service more powerfulls and with more control that locals services.
This services has `4 methods` that cover a sectors of frixar app
  * ### Define
  > Is service function who is calling in controller.
  ```javascript
      var ServiceDepends = ['Service1','Service2',...]
      function Define(Service1,Service2,...)
      {
        //code here
      }
  ```
  Remember, they can return data.
  * ### OnReady
  > Is calling when all frixars is reading.
  ```javascript
      function OnRady(base)
      {
        //code here
      }
  ```
  * ### After
  > Is calling when all controllers finish if is was depends of controllers.
  ```javascript
      function After(base)
      {
        //code here
      }
  ```
  * ### Config
  > Will call when `frixar('app').Config('serviceName')` was call.'
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
      //Create a instance of service insede a app:
      app.Using('packageName.ServiceName');
      app.Config('ServiceName').FirstMethod();
      ...
    ```

  > #### version 0.1.5:
  Inside de methods: `After`, `OnReady` and `Config` the first argument named `base` has a object: `$methods`.

  * ## base Types
    * ### `type`
      >is string that can be:  
      * `app`:all frixar apps,  
      * `factoryService`: all FactoryServices
      * `controller`: all controllers
    * ### `result`
      > Is array that get all results with object and their public attributes.
      * `app: {Name,EmiterOnReady}` `Name` is sitring, `EmiterOnReady` is a method
      * `factoryService: {Name,extension}` `extension` is the base.
      * `controller:{Name,AddTemplate}`
        * `AddTemplate(template)` is a method with argument object `template:{template:textHtml,target:jQuert object,enable:boolean}` returns null.


  * ## base.$methods
    * ### FindAllByType([`type`](#type),[`result`](#result))
      >find all in a `frixar app` objects by type and get public attributes.
      ```javascript
      var controllers = [];        
      base.$methods.FindAllByType('controller',controllers);
      ```
    * ### FindAllByNameAndType(`name`,[`type`](#type)) returns `object`
      >find all in a `frixar app` objects by name and type and get public attributes.
      ```javascript
          var controllers = [];        
          base.$methods.FindAllByNameAndType('controller',controllers);
      ```

  > #### version 0.1.6:
  Inside de methods: `After`, `OnReady` and `Config` the first argument named `base` has a object: `$vars`.

    * ## base.$vars
      * ### CurrentConfigApp
        >A object that contains a public attributes of current frixar app that using Config with us service.


- # Router
  - ###### ON DEV
  > Will be a factoryService that will control the templates and controllers as a   route url in the browser like: `#/home`.
  ```javascript
      var app = frixar('app');
      app.Using('Router.$router');
  ```

  * ## Router-Config
    * ### Route
    > We can create a view that has a template and a controller when `fxr app` in Html
    has a `<fx-v></fx-v>`
    ```javascript        
        app.Config('$router').Route('/home',{
          template = '<h1>{{header}}<h1><p>{{explain}}</p>',
          controller:'mainController'
        });
    ```
    >The first argument of `Route` is the name of the `frixar app route`, the second argument is a object with a `template` and `controller`.
    ```html
      ...
        <nav>
          <fx-l class="myclass" id="myid" href="/home">MyLink</fx-l>
        </nav>
        <section fxr="app">
          <fx-v></fx-v>
        </section>
      ...
    ```
