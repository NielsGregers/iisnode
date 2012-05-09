/*
Node config syntax special cases
*/

var iisnodeassert = require("iisnodeassert")
    , assert = require('assert')
    , path = require('path')
    , fs = require('fs');

var existsSync = fs.existsSync || path.existsSync;
var nodeConfig = path.resolve(__dirname, '../www/126_node_config_syntax/node.config');

var isNodeConfigError = function (body) {
    assert.ok(-1 !== body.indexOf('unable to read the configuration file node.config'), 'The response body is a node.config dev error');
};

var deleteConfig = function (next) {

    if (existsSync(nodeConfig)) {
        fs.unlinkSync(nodeConfig);
    }

    if (next)
        next();
};

iisnodeassert.sequence([
    deleteConfig,
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?empty", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, "Hello, world 1"),
    deleteConfig,

    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?noKey1", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, isNodeConfigError),
    deleteConfig,

    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?noKey2", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, isNodeConfigError),
    deleteConfig,

    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?emptyValue1", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, "Hello, world 1"),
    deleteConfig,

    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?emptyValue2", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, "Hello, world 1"),
    deleteConfig,

    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?unrecognizedKey", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, "Hello, world 1"),
    deleteConfig,

    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?invalidBool", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, isNodeConfigError),
    deleteConfig,

    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js?emptyLine", 200, "node.config updated"),
    iisnodeassert.get(10000, "/126_node_config_syntax/hello.js", 200, "Hello, world 1"),
    deleteConfig
]);