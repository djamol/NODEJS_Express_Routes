require('dotenv').config();

const url = process.env.MONGO_URI
console.log("URL : "+url);
require('dotenv').config();

// 👇️ if you use ES6 you only need this line to import
// // import 'dotenv/config'
//
 console.log(process.env.DB_USER); // 👉️ "james_doe"
 console.log(process.env.ENV); // 👉️ "dev"
 console.log(process.env.DB_PORT); // 👉️ "1234"
