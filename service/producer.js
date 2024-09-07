// this part is set up for another back end
// it is not part this back end

import amqp from "amqplib";
import ErrorHandler from "../errorhandler/errHandler.js";

const produceContent = async (messageContent) => {
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

    const messageBuffer = Buffer.from(JSON.stringify(messageContent));

    channel.publish(exchange, routingKey, messageBuffer);
    console.log("Message sent:", messageContent);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error producing RabbitMQ message:", error);
    new ErrorHandler("Failed to produce messages to RabbitMQ", 500);
  }
};

export default produceContent;
