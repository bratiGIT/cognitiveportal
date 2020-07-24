/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';

var path = require('path');

module.exports = function(grunt) {
  console.log("Grunt JS started");
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'scripts/grunt/config'),
    data: {
      appname: 'CognitiveEnterprise_Dev',  //path.basename(process.cwd()), // same as project directory name, accessible with '<%= appname %>'
      appdir: 'web',  // accessible with '<%= appdir %>'
      distdir: 'release'  // accessible with '<%= distdir %>'
    }
  });

  grunt.loadNpmTasks("@oracle/grunt-oraclejet");
  //grunt.loadNpmTasks("grunt-war");

  grunt.registerTask("build", "Public task. Calls oraclejet-build to build the oraclejet application. Can be customized with additional build tasks.", function (buildType) {
    grunt.task.run([`oraclejet-build:${buildType}`]);
  });

  grunt.registerTask("serve", "Public task. Calls oraclejet-serve to serve the oraclejet application. Can be customized with additional serve tasks.", function (buildType) {
    grunt.task.run([`oraclejet-serve:${buildType}`]);
  }); 
};

