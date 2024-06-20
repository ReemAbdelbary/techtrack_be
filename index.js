const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("uncaught exception ... shuting down..💥");
  console.log(err.name, err.message);
  process.exit(1);
});

let port;
const app = require("./app");

// to schedule the RC
//require("./scheduledTask");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB is connected \n");
  });
app.listen(port, () => {
  console.log(`server is running at ${port} \n`);
});
