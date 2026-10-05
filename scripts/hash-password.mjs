#!/usr/bin/env node
const bcrypt = require('bcryptjs');
const pw = process.argv[2] || '';
if (!pw) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}
console.log(bcrypt.hashSync(pw, 10));
