

frixar("app").Controller('appController',['wow'],function(fv,wow){
  fv.title = 'My App';
}).Service('wow',['$fv.app.appController','$router.app'],function (fvc,r) {
  console.log(r);
});
