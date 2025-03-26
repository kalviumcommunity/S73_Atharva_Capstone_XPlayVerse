import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import router from "./routes/routes.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT

app.get('/', (req,res) => {
    res.send("<h1>Welcome to XPlayVerse!!</h1>")
})

app.use("/api/users",router);

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})