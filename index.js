const express = require("express");
const app = express();

express.urlencoded({ extended: true });
express.json();

const router = require("./src/router/router");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("port", 3000);

app.use("/api", router);

app.listen(app.get("port"), () => {
  console.clear();
  console.log("listening on port", app.get("port"));
});
