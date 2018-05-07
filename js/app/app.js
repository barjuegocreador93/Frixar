"use strict";

var app=frixar('app');

app.Using(['examplePackage.myService','Router.$router']);

app.Config('$router').Route('/',{});

app.Config('myService').MethodAdd(20);
