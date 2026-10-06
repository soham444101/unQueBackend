require("dotenv").config();

const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());


app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const verifyToken = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Received webhook ", { mode, verifyToken, challenge });
    console.log("Env Meta verify token", process.env.META_VERIFY_TOKEN , typeof process.env.META_VERIFY_TOKEN);
    if (
        mode === "subscribe" &&
        process.env.META_VERIFY_TOKEN &&
        verifyToken === String(process.env.META_VERIFY_TOKEN)
    ) {
        return res.status(200).send(challenge);
    }

    return res.status(403).send('Forbidden')
});

app.post("/webhook", (req, res) => {
    console.log("Received webhook event:", JSON.stringify(req.body));
    return res.status(200).send("EVENT_RECEIVED");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});