var utilities = {};

utilities.isNodeContext = function() {
  return (typeof global.window === 'undefined');
}

utilities._init = function() {
  require("../../../src/layerjs.js");
}

utilities._beforeAll = function() {

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.getElementById("wl-obj-css");

  if (!style) {
    style = document.createElement("style");
    style.id = "wl-obj-css";
    head.appendChild(style);
  }

  style.innerHTML = "";

  this.setHtml("");
}

utilities._beforeEachNodeJS = function() {
  var jsdom = require('jsdom');
  document = global.document = jsdom.jsdom("<html><head></head><body></body></html>", {
    url: 'http://localhost'
  });
  window = global.window = document.defaultView;
  $ = document.querySelector;

  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

utilities._beforeEachBrowser = function() {
  document = global.document;
  window = global.window;
  $ = document.querySelector;
}

utilities.beforeEach = function() {
  if (this.isNodeContext()) {
    this._beforeEachNodeJS();
  } else {
    this._beforeEachBrowser();
  }
  this._init();
  this._beforeAll();
}

utilities.afterEach = function() {
  layerJS.repository.clear();
  layerJS.state.tree = {};
  layerJS.router.clearRouters();
  layerJS.router.previousUrl = undefined;

  var sizeObserver = require("../../../src/framework/observer/sizeobserver.js");
  sizeObserver.views = {};

  delete document._ljStateTree;
  delete document._ljStateFrameView;
}

utilities.setHtml = function(html) {
  var container = document.getElementById("testContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "testContainer";
    document.body.appendChild(container);
  }
  container.innerHTML = html;
}

module.exports = utilities;
