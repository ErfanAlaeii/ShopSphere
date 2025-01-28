# ShopSphere Backend



## 📌 Overview
ShopSphere is a backend service for an e-commerce platform built with **Node.js**, **Express.js**, and **MongoDB**. It provides RESTful APIs for user authentication, product management, order processing, and payment integration using **Zarinpal**.

## 🚀 Features
- User authentication with **JWT**
- Product and category management
- Shopping cart and checkout system
- Secure payment integration with **Zarinpal**
- Image upload support with **AWS S3**
- Job queue processing using **BullMQ**
- Security enhancements: Rate limiting, CORS handling, and request logging

## 🛠️ Tech Stack
- **Node.js** & **Express.js** - Backend Framework
- **MySQL** - Relational Database
- **Sequelize** - ORM for database management
- **AWS S3** - File storage solution
- **BullMQ** - Queue management for background jobs
- **Zarinpal** - Payment gateway integration
- **Docker** - Containerized deployment

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
 git clone https://github.com/ErfanAlaeii/ShopSphere.git
 cd ShopSphere
```

### 2️⃣ Install Dependencies
```sh
 npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file and configure the following:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=shopsphere
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
ZARINPAL_MERCHANT_ID=your_zarinpal_id
```

### 4️⃣ Run Migrations (If using Sequelize)
```sh
npx sequelize-cli db:migrate
```

### 5️⃣ Start the Server
```sh
 npm run dev
```

Server will run on `http://localhost:5000`

## 🔥 API Endpoints
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/signup`   | Register a new user      |
| POST   | `/api/auth/login`    | User login               |
| GET    | `/api/products`      | Fetch all products       |
| POST   | `/api/orders`        | Create a new order       |
| POST   | `/api/payment`       | Process payment via Zarinpal |

## 🏗️ Deployment
### Docker Setup
To deploy using **Docker**, build and run the container:
```sh
docker build -t shopsphere-backend .
docker run -p 5000:5000 shopsphere-backend
```

## 📜 License
This project is licensed under the **MIT License**.

## 🤝 Contributing
Feel free to fork this repository and submit pull requests!

## 📩 Contact
If you have any questions, reach out via:
- GitHub: [ErfanAlaeii](https://github.com/ErfanAlaeii)
- Email: erfanalaei2001@gmail.com

