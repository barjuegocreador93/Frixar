"use strict";



var app=frixar('app');

app.Using(['examplePackage.myService','Router.$router']);

app.Config('$router').Route('/home',{
  template:'<h1>{{header}}</h1><p>{{explain}}</p><div fx-c="otherController">{{otherData}}</div>',
  controller:'secondController'
});

app.Config('myService').MethodAdd(20);
