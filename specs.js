var assert    = require('assert');
var transform = require('./index');

describe('require-assets-jstransform', function() {

  it('works', function() {
    assert.equal(
      transform('1 + requireAssets("./index.js");'),
      '1 + "/assets/index.js";');
  });
});
