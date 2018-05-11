"use strict";

var app = frixar('app');

app.Controller('appController',['myService','$router'],function($fv,myService,$router){
  $fv.title = 'My App';
  $fv.fNav = [{url:'#/home',text:'Home'},{url:'#/TemplateUrl',text:'Temp'},{url:'#',text:'other'},{url:'#',text:'other'},{url:'#',text:'other'}];


});

app.Controller('secondController',function($fv){
  $fv.header = 'Hello World';
  $fv.explain = 'Router Is Runing!';
});


app.Controller('otherController',function ($fv) {
  $fv.otherData = 'Other data!';
});


app.Controller('tempview',function($fv){
  $fv.form={
    content:[{type:'text',name:'data',value:''},
    {type:'submit',name:'',value:'Take Data'}
    ]
  }
});
