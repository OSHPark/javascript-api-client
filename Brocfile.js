var dotenv = require('dotenv');
dotenv.load();

var filterCoffeeScript = require('broccoli-coffee');
var concatFilter       = require('broccoli-concat');
var mergeTrees         = require('broccoli-merge-trees');
var selectFilter       = require('broccoli-select');
var env                = require('broccoli-env').getEnv();
var replace            = require('broccoli-replace');
var compileModules     = require('broccoli-es6-module-transpiler');
var useStrictRemover   = require('broccoli-use-strict-remover');

// Compile all CoffeeScript in lib
lib = filterCoffeeScript('lib', {
  bare: true
});

lib = mergeTrees([lib, 'node_modules/rsvp/lib']);

// Transpile es6 modules into a bundle.
lib = compileModules(lib, {
  moduleName: true,
  formatter: 'bundle',
  output: '/oshpark.js'
});

// Remove "use strict" from lib files.
lib = useStrictRemover(lib);

// Replace patterns in Spec files.
spec = replace('spec', {
  files: [ '**/*.coffee' ],
  patterns: [
    {
      match: 'EMAIL',
      replacement: process.env.EMAIL
    },
    {
      match: 'PASSWORD',
      replacement: process.env.PASSWORD
    },
    {
      match: 'API_SECRET',
      replacement: process.env.API_SECRET
    },
    {
      match: 'API_URL',
      replacement: process.env.API_URL
    },
    {
      match: 'FIXTURE_URL',
      replacement: process.env.FIXTURE_URL
    }
  ]
});

// Compile coffeescript specs into javascript.
spec = filterCoffeeScript(spec);

// Concatenate specs.
spec = concatFilter(spec, {
  inputFiles: ['**/*.js'],
  outputFile: '/spec.js'
});

// Get the spec HTML file.
specHtml = selectFilter('spec', {
  acceptFiles: ['spec.html'],
  outputDir: '/'
});
spec = mergeTrees([spec, specHtml]);

// Development dependencies
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

devTrees = [mocha, chai, chaiAsPromised, sinon, sinonChai];
dev = mergeTrees(devTrees);

// Dependencies
jsSha = selectFilter('bower_components/jssha/src', {
  acceptFiles: ['sha256.js'],
  outputDir: '/'
});

jquery = selectFilter('bower_components/jquery/dist', {
  acceptFiles: ['jquery.js'],
  outputDir: '/'
});

rsvp = selectFilter('bower_components/rsvp', {
  acceptFiles: ['rsvp.js'],
  outputDir: '/'
});

vendorTrees = [jquery, rsvp, jsSha];
vendor = concatFilter(mergeTrees(vendorTrees), {
  inputFiles: ['**/*.js'],
  outputFile: '/vendor.js',
  wrapInEval: false
});

allTrees = [lib, spec, dev, vendor];

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

  exported = mergeTrees([lib, min, zip], {overwrite: true});
}

module.exports = exported;
