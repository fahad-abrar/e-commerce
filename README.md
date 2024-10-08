# E-Commerce Platform Backend

This project is a backend for an e-commerce platform where consumers can purchase products and sellers can list and sell their products. It is built using **Node.js**, **Express**, and **MongoDB**, supporting features like user authentication, product management, file uploads, messaging via RabbitMQ, and Redis for caching.

## Features

- **User Authentication**: Secure login and registration using JWT and password hashing (bcrypt).
- **File Uploads**: Handle image and video uploads using **Multer** and store them on **Cloudinary**.
- **Email Notifications**: Notify users via email using **Nodemailer**.
- **Message Queuing**: Implement background jobs and event-driven architecture using **RabbitMQ** with **amqplib**.
- **Caching**: Redis caching using **ioredis**.
- **Scheduled Tasks**: Schedule tasks such as email reminders or report generation using **node-cron**.

## Technologies

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database for storing user and course information
- **Mongoose**: MongoDB ODM
- **Redis**: For caching (ioredis)
- **RabbitMQ**: For message queuing and background tasks
- **Cloudinary**: For storing media files
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **Multer**: For file uploads
- **Nodemailer**: For email notifications
- **node-cron**: Task scheduling
- **cookie-parser**: To handle cookies
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## How to Contribute

Feel free to submit issues or pull requests if you find any bugs or want to enhance the project.

Update the environment variables to match your setup. You can do this by creating a .env file in the root of your project
