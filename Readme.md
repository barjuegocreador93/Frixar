
# Frixar
> frixar is a early js framework that using [`Mustache`]() to control the html as template.

 - ## Simple App Example:
    >- On js:
	>
	    frixar('myApp').Controller('myController',function($fv){
	    fv.Web_Name =  'My Super Web!';
	    fv.fNav = [{url:'/home',text:'Home'},{url:'/login',text:'Login'}];
	    });

	>- On Html

	>
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
	>-	result:				
	### My Super Web!
	[Home](#)		[Login](#)


 - ## Controllers
	> The controllers has the control of a template. You can call service intside de controller if they were called by frixar. The principal service is `$fv`,  ` Controller first argument function`  is `$fv`.

	- ### Calling other services:

		>
			frixar('myApp').Controller('ScondController',['service1','service2',...],
			function($fv,service1,service2){
			//your code
			});

    - ### $fv

    > Is  a controller service, every controller created have a `$fv`.

      - ### Events
          > We can comunicate a controllers with others controllers throw  `$fv`.

         - #### Locals

		      > We can emit a event inside a controller or what ever has in the declaraction zone of `$fv` using `$fv.$Emit('name event',data1,data2,...);` to take the data of the emiter we can use `$fv.$On('name evnet',function(data1,data2){}); `

        - #### Globals  
          > We can emit a event inside a controller or what ever has in the declaraction zone of `$fv` using `$fv.$global.$Emit('name event',data1,data2,...);` to take the data of the emiter we can use `$fv.$global.$On('name evnet',function(data1,data2){}); `. The principal diference with `local events` is when you has two apps declarates with `frixar` they can go to the other controllers aswell we takes `frixar('app',['app2']);` in the first frixar app call.


 - ## Services
    > Services are a components that we be able to use throw Controllers
    we can make to types of service, one can solve a specificate problem, factory Service must be solve a globals problems.

	 - ### Local Service
      > We can use it, for a create a connection with a API using `jQuery ajax` for the moment. Like a `Controllers` we can call a others serices inside this.

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
    > Service can call a controllers `$fv` like `['$fv.app.appController','$fv.app2.app2Controller',...]` cause they be services too.

  - ### Factory Service
  > We can create a Class of service more powerfulls and with more control that locals services.
  This services has 4 methods that cover a sectors of

* #### Define
> Is service function who is calling in controller.
Remember, they can return data.
* #### OnReady
> Is calling when all frixars is reading.
* #### After
> Is calling when all controllers finish.
* #### Config
> Will call when 'frixar('app').Config('serviceName') was call.'


      var
      service=frixarFactory('packageName').File('ServiceName');
      //Class new service
      service.Service(Name,Depends,Define,OnReady,After,Config);
      //create a app
      var app=frixar('app');
      ...
      //Create a instance of service insede a app:
      app.Using('packageName.ServiceName');
      ...

  - # Router | FactoryService
