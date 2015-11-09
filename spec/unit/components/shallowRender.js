'use strict';
const TestUtils = require('react/lib/ReactTestUtils');

module.exports = (component) => {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(component);
  return shallowRenderer.getRenderOutput();
};
