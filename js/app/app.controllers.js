"use strict";

var app = frixar('app');

app.Controller('appController',['myService','$router'],function($fv,myService,$router){
  $fv.title = 'My App';
  $fv.fNav = [{url:'#/home',text:'Home'},{url:'#',text:'other'}];


});

app.Controller('secondController',function($fv){
  $fv.header = 'Hello World';
  $fv.explain = 'Router Is Runing!';
});
