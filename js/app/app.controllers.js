

var app = frixar('app');

app.Controller('appController',['myService','$r'],function(fv,myService,$r){
  fv.title = 'My App';
  fv.fNav = [{url:'#',text:'wow'},{url:'#',text:'other'}];
  $r.travel('/locale');
});
