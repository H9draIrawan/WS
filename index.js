const express = require("express");
const app = express();
const router = require("./src/router/router");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("port", 3000);

app.use("/api", router);

app.listen(app.get("port"), () => {
  console.log("listening on port", app.get("port"));
});
