const express = require('express');
const amqp = require('amqplib');
const app = express();
const PORT = process.env.PORT || 4002;

let channel, connection;

app.use(express.json());

async function connectQueue() {
    try {
        connection = await amqp.connect({
            protocol: 'amqp',
            hostname: 'localhost',
            port: 5672,
            username: 'myuser',   
            password: 'mypassword' 
        });
        channel = await connection.createChannel();
        await channel.assertQueue('test-queue');

        channel.consume('test-queue', data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        });
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
    }
}

connectQueue().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
});
