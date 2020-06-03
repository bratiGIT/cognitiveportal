/**
  Copyright (c) 2015, 2019, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/

'use strict';

const path = require('path');
const grunt = require('grunt');

console.log("[after_build]: Entering hook");

module.exports = function (configObj) {

  if (configObj.buildType === "release") {
    console.log("[after_build]: Create WAR file for release");
    require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), 'scripts/grunt/config'),
      /* data: {
        appname: path.basename(process.cwd()), //'CognitiveEnterprise',  // same as project directory name, accessible with '<%= appname %>'
        appdir: 'web', // accessible with '<%= appdir %>'
        distdir: 'dist' // accessible with '<%= distdir %>'
      } */
    });

    return new Promise((resolve, reject) => {
      console.log("Running after_build hook.");
      grunt.tasks(['war']);
      resolve();
      console.log("[after_build]: Exiting hook after war generation");
    });
  } else {

    return new Promise((resolve, reject) => {
      console.log("Running after_build hook.");
      resolve();
      console.log("[after_build]: Exiting hook");
    });
  };
};