const NodeCache = require('node-cache');

// StdTTL = 0 means infinite by default (unless set per key)
// checkperiod = 600 (check for expired keys every 10 minutes)
const cache = new NodeCache({
    stdTTL: 0,
    checkperiod: 600
});

console.log('NodeCache initialized.');

module.exports = cache;
