# 🏍 Bike Rental Reservation System Backend

Welcome to the Bike Rental Reservation System backend! This project provides a seamless bike rental service for both tourists and locals in the vibrant coastal town of Cox's Bazar, famous for its long Inani beach. Users can easily rent bikes online, making it convenient to explore the beautiful town.

## 🌟 Key Features

- **TypeScript Integration**: Ensures type safety and enhances code quality.
- **User-friendly bike exploration and booking**: Easily browse and rent bikes.
- **Secure JWT-based authentication and authorization**: Robust security for user data.
- **Scalable and efficient back-end architecture**: Designed for performance and scalability.

## 🛠️ Technology Stack

- **Programming Language**: TypeScript
- **Web Framework**: Express.js
- **ODM & Validation Library**: Zod, Mongoose for MongoDB
- **Authentication & Authorization**: JWT (Json Web Token)

## 🌐 API Endpoints

### User Routes

- **Sign Up**: `/api/auth/signup` (POST)
- **User Login**: `/api/auth/login` (POST)
- **Get Profile**: `/api/users/me` (GET)
- **Update Profile**: `/api/users/me` (PUT)

### Bike Routes

- **Create Bike (Admin Only)**: `/api/bikes` (POST)
- **Get All Bikes**: `/api/bikes` (GET)
- **Update Bike (Admin Only)**: `/api/bikes/:id` (PUT)
- **Delete Bike (Admin Only)**: `/api/bikes/:id` (DELETE)

### Rental Routes

- **Create Rental**: `/api/rentals` (POST)
- **Return Bike (Admin Only)**: `/api/rentals/:id/return` (PUT)
- **Get All Rentals for User (My rentals)**: `/api/rentals` (GET)

## Installation & Setup 🛠️

1. Clone the repository:
    ```sh
    https://github.com/junayednoman/Bike-Rental-Reservation-System-Backend.git
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

4. Start the development server:
    ```sh
    npm run start:dev
    ```
