const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config/config.env' });

// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    // .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    // console.log(con.connection);
    console.log('DB connection successful');
  })
  .catch(err => {
    console.log('Error', err);
  });

// // express environment variables
// console.log(app.get('env'));
// // node js environment variables
// console.log(process.env);

// start server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});
