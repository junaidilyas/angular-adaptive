module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! angular-adaptive v<%= pkg.version %>: <%= pkg.description %>\n' +
    ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
    ' * Licensed under <%= pkg.license %>\n' +
    ' * <%= pkg.homepage %>' +
    ' */\n\n',
    uglify: {
      nonMinMatchMediaListener: {
        options: {
          banner: '<%= banner %>',
          mangle: false,
          compress: false,
          preserveComments: 'some',
          beautify: {
            beautify: true,
            indent_level: 2
          }
        },
        files: {
          'dest/adaptive.src.js': ['src/matchMedia.js', 'src/matchMedia.addListener.js', 'src/adaptive.js']
        }
      },
      minMatchMediaListener: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'dest/adaptive.min.js': ['src/matchMedia.js', 'src/matchMedia.addListener.js', 'src/adaptive.js']
        }
      }
    },
    jshint: {
      files: ['src/adaptive.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        smarttabs: true,
        node: true,
        strict: false,
        globals: {
          angular: false
        }
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );

  // Default task.
  grunt.registerTask('default', ['jshint', 'uglify']);

};
