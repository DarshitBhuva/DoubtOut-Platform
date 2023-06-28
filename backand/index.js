const connectToMongo = require('./db');
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const cors = require('cors');
connectToMongo();
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello DoutbtOut')
})

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/question", require("./routes/questions"));
app.use("/api/answer", require("./routes/answers"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/tag", require("./routes/tags"));

app.post("/api/send-email", async (req, res) => {
    try {
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'coderdarshit2002@gmail.com', // Replace with your Gmail address
                pass: 'nalufwbqqvpxsiyu' // Replace with your Gmail password or app password
            }
        });

        const filePath = path.join(__dirname, 'mailtemplate.html');
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        
        const info = await transporter.sendMail({
            from: 'spport@doubtoutgmail.com',
            to: 'pavangadhiya06@gmail.com',
            subject: 'Hello From DoutOut ✔',
            text: 'Hello world?',
            html: fileContent
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {

        console.log(error.message);
        res.status(500).json({ message: 'Failed to send email' });
    }
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

}


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})