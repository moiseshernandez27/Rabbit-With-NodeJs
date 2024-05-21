# RabbitMQ with Node.js

## Prerequisites
Before running the application, ensure you have the following installed:

- Node.js
- Docker

## Installation
1. Clone this repository:

2. Navigate to the project directory:

    ```bash
    cd rabbitmq-nodejs
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a .env file in the root directory and configure the following environment variables:

    ```ini
    PORT=4001
    RABBITMQ_URL=amqp://myuser:mypassword@localhost:5672
    QUEUE_NAME=test-queue
    ```

    Replace myuser and mypassword with your RabbitMQ username and password, and test-queue with the name of your queue.

## Running the Application
1. Start RabbitMQ using Docker:

    ```bash
    docker run -d --hostname rabbit --name rabbit-server -p 15672:15672 -p 5672:5672 rabbitmq:3.11.11-management
    ```

2. Run the Node.js application:

    ```bash
    node index.js
    ```

3. Access the /send-msg endpoint in your browser or use a tool like Postman to send messages to the queue.

## Testing
To test the application, you can send a message to the queue by accessing the /send-msg endpoint. Check the console logs for messages confirming that the message was sent to the queue.
