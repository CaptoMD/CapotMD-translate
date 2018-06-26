/*
 * Copyright (c) 2018 CaptoMD
 */

const util = require('util');
const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const YAML = require('js-yaml');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

async function readRequest(rootPath, fileName, { verbose = true } = {}) {
  if (Array.isArray(fileName)) {
    const requests = await Promise.all(fileName.map(f => readRequest(rootPath, f, { verbose })));
    return Object.assign({}, ...requests);
  }
  if (path.extname(fileName) === '.yml') {
    const file = path.resolve(rootPath, fileName);
    const fileContent = await readFile(file, 'utf8');
    const data = YAML.load(fileContent);
    if (verbose) {
      console.log(chalk`Reading Request: {cyan ${fileName}}`);
    }
    return data;
  } else {
    return {};
  }
}

async function readRequests(rootPath, { verbose = true } = {}) {
  if (verbose) {
    console.log(chalk`Reading: {bgCyan.black ${rootPath}}`);
  }
  const files = await readdir(path.resolve(rootPath), 'utf8');
  const requests = await readRequest(rootPath, files);
  if (verbose) {
    console.log(chalk`Extracted {bold ${Object.keys(requests).length}} Requests`);
  }
  return requests;
}

module.exports = readRequests;