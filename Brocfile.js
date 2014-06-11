var filterCoffeeScript = require('broccoli-coffee');
var concatFilter       = require('broccoli-concat');
var mergeTrees         = require('broccoli-merge-trees');
var selectFilter       = require('broccoli-select');

lib = filterCoffeeScript('lib');
lib = concatFilter(lib, {
  inputFiles: ['**/*.js'],
  outputFile: '/oshpark.js'
});

spec = filterCoffeeScript('spec');
spec = concatFilter(spec, {
  inputFiles: ['**/*.js'],
  outputFile: '/spec.js'
});
spec_html = selectFilter('spec', {
  acceptFiles: ['spec.html'],
  outputDir: '/'
});
spec = mergeTrees([spec, spec_html]);

jquery = selectFilter('bower_components/jquery', {
  acceptFiles: ['jquery.js'],
  outputDir: '/'
});

rsvp = selectFilter('bower_components/rsvp', {
  acceptFiles: ['rsvp.js'],
  outputDir: '/'
});

mocha = selectFilter('bower_components/mocha', {
  acceptFiles: ['mocha.js', 'mocha.css'],
  outputDir: '/'
});

chai = selectFilter('bower_components/chai', {
  acceptFiles: ['chai.js'],
  outputDir: '/'
});

chai_as_promised = selectFilter('bower_components/chai-as-promised/lib', {
  acceptFiles: ['chai-as-promised.js'],
  outputDir: '/'
});

vendorTrees = [jquery, rsvp, mocha, chai, chai_as_promised];

allTrees = [lib, spec].concat(vendorTrees);

module.exports = mergeTrees(allTrees);
