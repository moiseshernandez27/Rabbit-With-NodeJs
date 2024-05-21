const express = require('express');
const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.QUEUE_NAME;

let channel, connection;

app.use(express.json());

app.get('/send-msg', async (req, res) => {
    const data = {
        title: "Clean Code",
        author: "Robert C Martin"
    };

    try {
        await sendData(data);
        console.log("A message is sent to queue");
        res.send("Message Sent");
    } catch (error) {
        console.error("Failed to send message:", error);
        res.status(500).send("Failed to send message");
    }
});

async function connectQueue() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err);
        });
        connection.on("close", () => {
            console.warn("RabbitMQ connection closed. Reconnecting...");
            return setTimeout(connectQueue, 1000);
        });
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME);
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        setTimeout(connectQueue, 1000);
    }
}

async function sendData(data) {
    if (!channel) {
        throw new Error("No channel available");
    }
    try {
        await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.error("Failed to send data to queue:", error);
        throw error;
    }
}

process.on('SIGINT', async () => {
    console.log("Shutting down...");
    if (channel) await channel.close();
    if (connection) await connection.close();
    process.exit(0);
});

connectQueue().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
});
