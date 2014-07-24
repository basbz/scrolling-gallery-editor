/*global module:false*/
module.exports = function(grunt) {
  // http://danburzo.ro/grunt/chapters/server/
  var ModRewrite = require('connect-modrewrite');

  function custom_middleware (connect, options) {
    // 1. mod-rewrite behavior
    var rules = [
      '!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif|\\.woff|\\.json$ /' + options.indexFile
    ];

    var middleware = [
      require('./static-api')(),
      ModRewrite(rules)
    ];

    // 2. original middleware behavior
    [].concat(options.base).forEach(function(path) {
      middleware.push(connect.static(path));
    });

    return middleware;
  }


  // Project configuration.
  grunt.initConfig({

    connect: {
      server: {
        options: {
          keepalive: true,
          hostname: '*',
          port: 2020,
          middleware: custom_middleware,
          indexFile: 'server.html'
        }
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'v3_assets/styles',
          src: ['*.scss'],
          dest: 'v3_assets/styles',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      options: {
        report: 'gzip'
      },
      minify: {
        expand: true,
        cwd: 'v3_assets/styles',
        src: ['*.css', '!*.min.css'],
        dest: 'v3_assets/styles',
        ext: '.min.css'
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('server', 'connect');
  grunt.registerTask('compile', ['sass', 'cssmin']);
};
