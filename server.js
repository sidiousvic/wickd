import express from "express";
import connectDB from "./config/db";

const app = express();

// Connect database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

//Create endpoints/route handlers
app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/users", require("./routes/api/users").default);
app.use("/api/auth", require("./routes/api/auth").default);
app.use("/api/profile", require("./routes/api/profile").default);
app.use("/api/posts", require("./routes/api/posts").default);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
