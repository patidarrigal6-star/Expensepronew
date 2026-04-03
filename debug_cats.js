import fs from 'fs';
const content = fs.readFileSync('c:/Users/FARMKART/Desktop/Expenses/src/utils/categories.js', 'utf8');
console.log(JSON.stringify(content));
