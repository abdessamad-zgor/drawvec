import express from "express"
import cors from "cors"
import path from "path"
import { cwd } from "process"

let app = express()

app.use(cors())
app.use(express.json())
app.use('/static', express.static('public'))

app.use('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(cwd(), "views") })
})

app.listen(5345, () => {
  console.log("Server is listening at port " + 5345);
})

