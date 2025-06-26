<h1 align="center"> 📱 ClassyCase </h1>

### *A Modern Fullstack E-Commerce Platform for Custom Phone Cases*


## 🛠 Overview

**ClassyCase** is a sleek, full-featured e-commerce web app that allows users to design and purchase **custom phone cases**. Built with the latest **Next.js 15 App Router**, **PostgreSQL**, and **TypeScript**, the platform offers smooth UX, intuitive case configuration, secure payment, and admin oversight — all wrapped in a modern, mobile-first UI.



## 🚀 Features

* ✅ **Complete E-Commerce Flow** (Configure → Pay → Thank You)
* ✅ **Beautiful, Conversion-Focused Landing Page**
* ✅ **Admin Only Dashboard for Order & Product Management**
* ✅ **Drag-and-Drop File Uploads via UploadThing**
* ✅ **Live Phone Case Configurator with Preview**
* ✅ **Kinde Authentication & Session Management**
* ✅ **Stripe Payments Integration**
* ✅ **Transactional Emails (Order Confirmation) via React Email & Nodemailer**
* ✅ **Type-Safe Validation with Zod**
* ✅ **100% TypeScript**
* ✅ **Clean, Responsive, Accessible UI (shadcn/ui + Tailwind)**



## 💻 Tech Stack

| Technology       | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| **Next.js 15**   | React framework with App Router for SSR, routing, and fullstack features |
| **TypeScript**   | Static typing for safety, refactors, and DX                              |
| **Tailwind CSS** | Utility-first CSS framework for building sleek UIs fast                  |
| **PostgreSQL**   | Robust relational database for structured, scalable data                 |
| **Prisma**       | Type-safe ORM for PostgreSQL, with migration and query ease              |
| **Kinde Auth**   | Plug-and-play authentication and user management                         |
| **shadcn/ui**    | Accessible and customizable component library for modern UIs             |
| **Zod**          | TypeScript-first schema validation for API routes and forms              |
| **UploadThing**  | Simple file uploads with drag-and-drop, integrated into Next.js          |
| **Stripe**       | Powerful and secure payment gateway integration                          |
| **React Email**  | Build responsive transactional emails in React                           |
| **Nodemailer**   | Node.js module to send email confirmations with server-side logic        |


## **📦 Getting Started**

To get a copy of the project up and running on your local machine for development, follow one of the options below.

### **Prerequisites**

* **Node.js**: Version 18.x or later.  
* **npm**: Comes with Node.js.  
* **Git**: For cloning the repository. 
* **Accounts & API Keys**:
  - ✅ [Kinde Auth](https://kinde.com/) account and application setup (client ID, secret,redirect URIs etc)
  - ✅ [UploadThing](https://uploadthing.com/) project with API keys
  - ✅ [Stripe](https://dashboard.stripe.com/) account with secret key and webhook secret 
* **For Option 1 (With Docker Compose):**  
  * **Docker Desktop**: Download from [Docker's official website](https://www.docker.com/products/docker-desktop/).

### **Option 1: With Docker Compose (Recommended)**

This sets up a consistent development environment, including a local PostgreSQL database.

1. **Clone the repository:**  
   ``` bash
   git clone https://github.com/your-username/classycase.git # Replace with your actual repo URL  
   cd classycase
   ```

2. **Create your local environment file:**  
   ``` bash
   cp .env.example .env
   ```

   **Open the new .env file** and fill in required values (API keys, secrets for Kinde, UploadThing, Stripe, etc.). DATABASE\_URL for the local PostgreSQL is automatically set in docker-compose.yml.  
3. **Start the Docker Compose services:** 
   ``` bash 
   docker-compose up --build
    ```
   * \--build forces image rebuild (first time/Dockerfile changes). Use docker-compose up \-d for detached mode.  
4. **Run Prisma Migrations:** 
   Once the Docker services are running and your database container is up, you need to apply your database schema migrations to create the necessary tables.  
   ``` bash
   docker-compose exec nextjs npx prisma migrate dev --name init
   ```
   This command runs npx prisma migrate dev \--name init *inside* the nextjs container, ensuring it uses the correct database connection defined in docker-compose.yml to create your schema.  
5. **Access your application:** 
    ``` bash
    http://localhost:3000  
    ```
6. **Stopping services:** 
   ``` bash 
   docker-compose down # Stops containers, keeps DB data  
   docker-compose down --volumes # Stops containers, removes DB data
   ```

### **Option 2: Without Docker (Traditional npm run dev)**

This option requires manual management of Node.js, PostgreSQL, and other dependencies on your local machine.

1. **Clone the repository:**  
    ``` bash
    git clone https://github.com/your-username/classycase.git # Replace with your actual repo URL  
    cd classycase
    ```

2. **Install Node.js dependencies:** 
   ``` bash 
   npm install
   ```

3. **Database Setup:**  
   * **Using a Hosted Service (e.g., Neon, Supabase, PlanetScale):**  
     * Sign up for a database service and obtain your connection string.  
   * **Using a Local PostgreSQL (Manually):**  
     * Install PostgreSQL on your machine.  
     * Create a database and a user with permissions.  
     * Ensure your PostgreSQL server is running.  
4. **Create your local environment file:**  
   ``` bash
   cp .env.example .env
   ```

   **Open the new .env file** and fill in all required values, including your DATABASE\_URL (from your hosted service or local PostgreSQL).  
5. **Run Prisma migrations:**  
   You need to apply your database schema migrations to create the necessary tables.  
   ``` bash
   npx prisma migrate dev --name init
   ```

6. **Start the development server:**  
   ```bash
   npm run dev
   ```

7. **Access your application:** 
    ``` bash
    http://localhost:3000  
    ```

## 📷 Screenshots

### 🚀 Landing Page  
![Landing Page](https://github.com/user-attachments/assets/9544ad92-1082-4a64-b213-d9edad6378b4)

### 🖼️ Upload Image 
![Upload mage Page](https://github.com/user-attachments/assets/6225ed0c-f3ec-4ec1-8839-94154fa666d2)

### 🎨 Preview of Case Configuration
![Configuration Preview](https://github.com/user-attachments/assets/8bb914e0-6d4e-435f-bb39-9fcdd1458bcf)

### 🛠️ Admin Dashboard  
![Admin Dashboard](https://github.com/user-attachments/assets/77e8a6cb-0454-4c11-9097-973055a9a72a)

### ✅ Thank You Page  
![Thankyou](https://github.com/user-attachments/assets/00118fc1-2cde-49b8-90d5-a823fe47a045)



## 📜 License

All rights reserved ©ClassyCase - Abheeshta P
This project is not open-source and should not be reused or redistributed without explicit permission.

