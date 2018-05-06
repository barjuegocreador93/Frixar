

var app = frixar('app');

app.Controller('appController',['myService'],function(fv,myService){
  fv.title = 'My App';
  fv.List = ['owow','dag'];
  console.log(myService);
});
