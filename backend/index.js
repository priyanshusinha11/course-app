const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/admin", adminRouter)
app.use("/user", userRouter)

app.get("/", (req, res) => res.json({ message: "this might work" }));



mongoose.connect('mongodb+srv://kirattechnologies:iRbi4XRDdM7JMMkl@cluster0.e95bnsi.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses-el" });

app.listen(3000, () => console.log('Server running on port 3000'));