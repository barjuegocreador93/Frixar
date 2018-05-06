



frixar('app').Controller('appController',['wow', '$router'],function(fv,wow,r){
  fv.title = 'My App';  
  console.log(r);
}).Service('wow',['$router'],function (r) {
    console.log(r);
  return {saludo:'hola'};
});
