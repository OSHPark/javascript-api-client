var filterCoffeeScript = require('broccoli-coffee');
var concatFilter       = require('broccoli-concat');
var mergeTrees         = require('broccoli-merge-trees');
var selectFilter       = require('broccoli-select');
var env                = require('broccoli-env').getEnv();

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

chaiAsPromised = selectFilter('bower_components/chai-as-promised/lib', {
  acceptFiles: ['chai-as-promised.js'],
  outputDir: '/'
});

sinon = concatFilter('bower_components/sinon', {
  inputFiles: ['index.js'],
  outputFile: '/sinon.js'
});

sinonChai = selectFilter('bower_components/sinon-chai/lib', {
  acceptFiles: ['sinon-chai.js'],
  outputDir: '/'
});

vendorTrees = [jquery, rsvp, mocha, chai, chaiAsPromised, sinon, sinonChai];

allTrees = [lib, spec].concat(vendorTrees);

var exported;
if (env == 'development') {
  exported = mergeTrees(allTrees);
}
else {
  var uglify     = require('broccoli-uglify-js');
  var moveFile   = require('broccoli-file-mover');
  var gzipFilter = require('broccoli-gzip');

  var min = moveFile(uglify(lib), {
    srcFile: 'oshpark.js',
    destFile: 'oshpark.min.js'
  });

  var zip = gzipFilter(min, {
    extensions: ['js']
  });

  exported = mergeTrees([lib, min, zip]);
}

module.exports = exported;
