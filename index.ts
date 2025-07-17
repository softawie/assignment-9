import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
const port = 3000;
bootstrap(app, express);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
