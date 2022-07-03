// to bild map run this 'npm run buildMapConfig'

import path from 'path';
import fs from 'fs';
import url from 'url';
import { parse } from 'svg-parser';

const entry = '../src/assets/world.svg';
const outputFileName = '../src/constants/world.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const filePath = path.join(__dirname, entry);

const file = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});
const parsed = parse(file);
const rootEl = parsed.children[0]
const svgParams = rootEl.properties;

const pathConfig = rootEl.children.reduce((acc, { properties }) => {
  const { d } = properties;
  const name = properties.name || properties.class;

  if (!name) return acc;

  return [
    ...acc,
    { name, d },
  ]
}, [])

const outputFileContent = 
`// **************************************************
// *                                                *
// *  DO NOT CHANGE THIS FILE                       *
// *                                                *
// *  This file is auto generated                   *
// *  To edit config open 'bin/buildMapConfig.mjs'  *
// *                                                *
// **************************************************

export const svgParams = ${JSON.stringify(svgParams)}

export const pathConfig = ${JSON.stringify(pathConfig)}`

fs.writeFileSync(path.join(__dirname, outputFileName), outputFileContent)
