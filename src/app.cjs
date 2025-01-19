const e = require("express");
import("./database/index.js");
const cors = require("cors")
const {resolve} = require("node:path");

const app = e(); // - definindo express no app.

app.use(e.json()); // - config pra usar json.
app.use(cors())

import("./routes.js").then((route) => {
	app.use(route.default); // Assuming routes.js exports a default router
});
app.use("/products-file", e.static(resolve(__dirname, "../", "uploads")));
app.use("/categories-file", e.static(resolve(__dirname, "../", "uploads")));
module.exports = app;
