require('../src/post_handler');

describe('foo', function() {
    it('should pass', function() {
        expect(returns_true()).toBe(true);
    });

    it('should also pass', function() {
        expect(returns_false()).toBe(false);
    })
});
