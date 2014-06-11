module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-broccoli');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },
    broccoli: {
      dist: {
        dest: 'dist',
        env:  'production'
      },
      spec: {
        dest: 'public',
        env:  'development'
      }
    },
    mocha: {
      specs: {
        src: 'public/spec.html',
      }
    },
    clean: ['public']
  });

  grunt.registerTask('test', ['bower:install', 'broccoli:spec:build', 'mocha:specs', 'clean']);
  grunt.registerTask('build', ['test', 'broccoli:dist:build']);
  grunt.registerTask('default', ['build']);
};
