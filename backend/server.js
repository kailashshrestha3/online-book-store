const express = require("express");
const app = express();
const cors = require("cors")
const user = require("./routes/user");
const book = require("./routes/book")
const Favorite = require("./routes/favorite")
const Cart = require("./routes/cart")
const Order = require("./routes/order")


require("dotenv").config();
// database connection
require("./config/db");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", Favorite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);



// creating port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})