"use strict";

var app = frixar('app');

app.Controller('appController',['myService','$router'],function($fv,myService,$router){
  $fv.title = 'My App';
  $fv.fNav = [{url:'#',text:'wow'},{url:'#',text:'other'}];


});

app.Controller('secondController',function($fv){
  $fv.$On('myEvent',function(){

  });
});
