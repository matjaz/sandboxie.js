sandboxie.js - simple JavaScript sanboxing
==========================================

This library prevents the code accessing global variables and arguments.

Install
=======

Bower
-----

    bower install sandboxie

npm
---

    npm install sandboxie

Example
=======

`sandboxie-node.js`

```javascript
var sandboxie = require('sandboxie');

function fn() {
  alert(this, global, arguments, msg);
  return process&&process.title;
}
var args = {
  msg   : 'The answer',
  alert : function(m) {
    console.log.apply(console, arguments);
  }
};

var fn1  = sandboxie(fn);
var fn2  = sandboxie(fn, ['process']);

// only alert and msg variables are accesible
console.log(fn1(args));
// {} undefined {} 'The answer'
// undefined

// same as above + function context is args
console.log(fn1(args, args));
// { msg: 'The answer', alert: [Function] } undefined {} 'The answer'
// undefined

// fn2 has access to process global variable
console.log(fn2(args));
// {} undefined {} 'The answer'
// node
```


Please note, sandboxie does not prevent infinite loops etc.

Development
===========

    git clone
    npm install
    # edit
    npm test
