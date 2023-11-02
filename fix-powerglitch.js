const { readFileSync, writeFileSync } = require('fs');

const powerglitch = readFileSync('./node_modules/react-powerglitch/package.json', 'utf-8');
const powerglitchParsed = JSON.parse(powerglitch);
powerglitchParsed.exports['.'].types = './types/lib/index.d.ts';

writeFileSync('./node_modules/react-powerglitch/package.json', JSON.stringify(powerglitchParsed, null, 2), 'utf-8');
