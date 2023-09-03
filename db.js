const mongoose = require("mongoose");
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.Database_url);
  console.log("Database connected sucessfully")
}
 

main().catch((err) => console.log(err));