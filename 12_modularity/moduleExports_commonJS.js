const connectDB = dbName => {
  console.log(
    `Connected to Database: ${dbName}, This function is imported from "module.js" file`,
  );
};

module.exports = {
  connect: connectDB, //rename
};
