import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import dotenv from "dotenv";
import { socketController } from "./controller/socketController.js";
import { getLeadData } from "./utils/fbGraph.js";

dotenv.config({
    path: './.env'
});
const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

server.listen(process.env.PORT, () => {
    console.log(`Socket Server is running on port ${process.env.PORT}`);
});

server.on('error', (error) => {
    console.error("Server error:", error);
    process.exit(1);
});
socketController(io);

app.get("/privacy", (req, res) => {
    return res.sendFile(path.join(__dirname, "..", "public", "privacy.html"));
});
app.get("/deletion-instructions", (req, res) => {
    return res.sendFile(path.join(__dirname, "..", "public", "deletionInstruction.html"));
});

app.get("/webhook", (req, res) => {
    console.log("Received webhook req.query", req.query);
    console.log("Received webhook req.body", JSON.stringify(req.body));
    const mode = req.query["hub.mode"];
    const verifyToken = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Received webhook ", { mode, verifyToken, challenge });
    console.log("Env Meta verify token", process.env.META_VERIFY_TOKEN, typeof process.env.META_VERIFY_TOKEN);
    if (
        mode === "subscribe" &&
        process.env.META_VERIFY_TOKEN &&
        verifyToken === String(process.env.META_VERIFY_TOKEN)
    ) {
        return res.status(200).send(challenge);
    }

    return res.status(403).send('Forbidden')
});

app.post("/webhook", async (req, res) => {
    console.log("Received webhook event:", JSON.stringify(req.body));
    const jsonBody = req.body;
    console.log("Received webhook event: ", jsonBody.entry[0].changes[0].value);

    const data = jsonBody.entry[0].changes[0].value;

    //    let pageId = data.page_id;
    //    let formId = data.form_id;
    const leadgenId = data.leadgen_id;
    console.log("Received webhook event: leadgenId", leadgenId);

    const frontendData = await getLeadData(leadgenId);

    console.log("Received webhook event: frontendData", frontendData);
    if (!frontendData) {
        console.error("No frontend data we get");
        // alert we creat in log that leadId not working
        return;
    }
    // save in db
    // send this data to throught websocket 
    console.log("Emitting new_lead event to frontend through WebSocket");
    io.emit("new_lead", frontendData);
    ```
    {
    "entry":[
    {
    "id":"1346917295174244",
    "time":1791545188,
    "changes":
    [
    {
    "value":
    {
    "created_time":1791545185,
    "leadgen_id":"1118962753891509",
    "page_id":"1346917295174244",
    "form_id":"1439403894782786"
    },
    "field":"leadgen"}
    ]
    }
    ]
    ,
    "object":"page"
    }
    ```

    return res.status(200).send("EVENT_RECEIVED");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});