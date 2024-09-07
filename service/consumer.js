import amqp from "amqplib";
import ErrorHandler from "../errorhandler/errHandler.js";

const consumeContent = async () => {
  try {
    const url = process.env.RABBIT_URL;
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    const exchange = "exchange";
    const queue = "review";
    const routingKey = "routing_key";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: false });
    await channel.bindQueue(queue, exchange, routingKey);

    console.log("Waiting for messages...");

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log("Received message:", messageContent);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error consuming RabbitMQ message:", error);
    new ErrorHandler("Failed to consume messages from RabbitMQ", 500);
  }
};

export default consumeContent;
