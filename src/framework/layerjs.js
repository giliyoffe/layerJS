var $ = require('./domhelpers.js');
// this module defines a global namespace for all weblayer objects.
layerJS = {
  select: $.selectView,
  imagePath: "/",
  executeScriptCode : true
};

module.exports = layerJS;
