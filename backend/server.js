const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/opportunities", require("./routes/opportunities"));
app.use("/api/applications", require("./routes/applications"));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(8000, () => console.log("Server running on port 8000"));
  })
  .catch((err) => console.error(err));




