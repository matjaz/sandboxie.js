
if (typeof module != 'undefined' && module.exports) {
    // we are running from jasmine-node
    sandboxie = require('../..');
}

describe('sandboxie', function() {

    it('should create sandboxed function from source code', function() {
        var fn = sandboxie('return 1+1');
        expect(fn).toEqual(jasmine.any(Function));
    });

    it('should create sandboxed function from function', function() {
        var fn = sandboxie(function() { return 1+1; });
        expect(fn).toEqual(jasmine.any(Function));
    });

    describe('sandboxed simple function', function() {
        var fn;

        beforeEach(function() {
            fn = sandboxie('return a+b');
        });

        it('should eval function', function(){
            expect(fn({a:1,b:2})).toBe(3);
        });
    });

    describe('sandboxed function accessing globals', function() {
        var fn;

        beforeEach(function() {
            fn = sandboxie('return [this, arguments, typeof window, typeof require, typeof process, a+b]');
        });

        it('should eval function', function(){
            expect(fn({a:1,b:2})).toEqual([{}, {}, 'undefined', 'undefined', 'undefined', 3]);
        });

        it('should eval function with custom context', function(){
            var ctx = {
                process : 3
            };
            var ret = fn({a:1, b:2}, ctx);
            expect(ret).toEqual([ctx, {}, 'undefined', 'undefined', 'undefined', 3]);
            expect(ret[0]).toBe(ctx);
        });
    });

    describe('sandboxed function with access to globals', function() {
        
        var fn, origGlobal;

        beforeEach(function() {
            fn = sandboxie('return [this, varName, a+b]', ['varName']);
            origGlobal = sandboxie.global;
            sandboxie.global = {varName : 'test'};
        });

        afterEach(function() {
            sandboxie.global = origGlobal;
        });

        it('should eval function', function(){
            expect(fn({a:1,b:2})).toEqual([{}, 'test', 3]);
        });
    });

    describe('sandboxed function accessing arguments properties', function() {

        it('should throw error with arguments.caller', function() {
            expect(sandboxie('arguments.caller')).toThrow();
        });

        it('should throw error with arguments.callee', function() {
            expect(sandboxie('arguments.callee')).toThrow();
        });

    });
});
