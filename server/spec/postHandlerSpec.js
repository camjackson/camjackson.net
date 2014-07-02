require('../src/postHandler');

describe('foo', function() {
    it('should pass', function() {
        expect(returnsTrue()).toBe(true);
    });

    it('should also pass', function() {
        expect(returnsFalse()).toBe(false);
    })
});
