import express, { Application, Request, Response } from "express";


const app:Application = express()

const PORT = process.env.PORT || 8000

app.use("/", (req:Request, res:Response) => {
       res.send("Hey its working...")

})

app.listen(PORT, () => {
    console.log(`Server is runing in PORT: ${PORT}`);
    
})