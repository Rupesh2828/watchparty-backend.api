import express from "express";
const app = express();
const PORT = process.env.PORT || 8000;
app.use("/", (req, res) => {
    res.send("Hey its working...");
});
app.listen(PORT, () => {
    console.log(`Server is ruuning in PORT: ${PORT}`);
});
