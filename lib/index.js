(function() {
  'use strict';

  var globalName;
  
  // detect env.
  if (typeof module != 'undefined' && module.exports) {
    // node
    globalName = 'global';
    module.exports = sandbox;
  } else {
    // browser
    globalName = 'window';
    window.sandboxie = sandbox;
  }
  sandbox.globalName = globalName;
  sandbox.global     = (new Function("return " + globalName))();
  var globalProps = (function() {
    var obj   = sandbox.global;
    var props = [];
    var addUnique = function (prop) {
      if (props.indexOf(prop) === -1) {
        props.push(prop);
      }
    };
    do {
        Object.getOwnPropertyNames(obj).forEach(addUnique);
    } while ((obj = Object.getPrototypeOf(obj)));
    return props;
  })();

  function sandbox(code, globalParams) {
    var undef;
    if (typeof code == 'function') {
      code = code.toString();
      code = code.slice(code.indexOf("{") + 1, code.lastIndexOf("}"));
    }
    var fn = new Function("with(arguments[0]){return function(){'use strict';" + code + "}.call(this);}");
    return function(o, ctx) {
      var params = Object.create(null), i, len;
      for (i = 0, len=globalProps.length; i < len; i++) {
        params[globalProps[i]] = undef;
      }
      if (globalParams) {
        for (i=0, len=globalParams.length;i<len;i++) {
          var paramName = globalParams[i];
          params[paramName] = sandbox.global[paramName];
        }
      }
      for (var k in o) {
        params[k] = o[k];
      }
      return fn.call(ctx || Object.create(null), params);
    };
  }
})();
