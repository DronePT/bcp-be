const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const cors = require('cors')

const BCParser = require('./parser')

const PORT = process.env.PORT || 1337
const UPLOAD_PATH = path.join(__dirname, './uploads/')

const app = express()
const upload = multer({ dest: UPLOAD_PATH })

app.use(cors())

app.post(
    '/',
    upload.single('file'),
    async (req, res) => {
        // get uploaded file path
        const { path } = req.file

        // parase file to JSON
        const data = await BCParser(path)

        // remove uploaded file
        fs.unlink(path, _ => _)

        // respond de request
        res.json(data)
    }
)

app.listen(PORT, _ => console.log(`listening on port ${PORT}`))