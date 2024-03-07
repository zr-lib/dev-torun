#!/usr/bin/env node

const devToRun = require('../src/index.js');

(function () {
  const package = require('../package.json');
  console.log(`[==== ${package.name}@${package.version} ====]\n`);

  devToRun();
})();
