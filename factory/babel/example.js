"use strict";

var file =frixarFactory('babelPackage').File('myBabelService');

//service class
file.Service({
  Name:"myBabelService",
  Depends: [],

  Define: function()  {
    return{
      MyControllerMethod: function () {

      };
    }
  },

  OnReady: function (base) {

  },

  After: function(base) {

  },

  Config: function(base){
    return {
      MyMethod: function () {
        return this;
      },
      MyOtherMethod=function () {

      }
    };
  }

});

export file;
