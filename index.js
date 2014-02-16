"use strict";

var path          = require('path');
var Syntax        = require('esprima-fb').Syntax;
var utils         = require('jstransform/src/utils');
var jstransform   = require('jstransform');
var requireAssets = require('require-assets');

var NAME = 'requireAssets';

/**
 * Create a new visitor to replace requireAssets(..) calls
 *
 * @public
 *
 * @param {String} filename
 * @param {AssetRegistry} registry
 * @param {Object} handlers
 */
function createVisitor(filename, registry) {
  registry = registry || requireAssets.currentRegistry();

  var basedir = path.dirname(filename);

  var visitor = function visitRequireAssets(traverse, node, p, state) {

    var id = node.arguments[0].value;
    var result = registry.requireAssets(id, basedir);

    utils.catchup(node.range[0], state);
    utils.append(JSON.stringify(result), state);

    utils.move(node.range[1], state);
  };

  visitor.test = function(node, p, state) {
    return (
      node.type === Syntax.CallExpression &&
      node.callee.type === Syntax.Identifier &&
      node.callee.name === NAME &&
      node.arguments[0] &&
      node.arguments[0].type === Syntax.Literal
    );
  };

  return visitor;
}

function transform(src, filename, registry) {
  var visitor = createVisitor(filename, registry);
  return jstransform.transform([visitor], src).code;
}

module.exports = transform;
module.exports.transform = transform;
module.exports.createVisitor = createVisitor
