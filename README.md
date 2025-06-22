<h1 align="center"> 📱 ClassyCase </h1>

### *A Modern Fullstack E-Commerce Platform for Custom Phone Cases*


## 🛠 Overview

**ClassyCase** is a sleek, full-featured e-commerce web app that allows users to design and purchase **custom phone cases**. Built with the latest **Next.js 15 App Router**, **PostgreSQL**, and **TypeScript**, the platform offers smooth UX, intuitive case configuration, secure payment, and admin oversight — all wrapped in a modern, mobile-first UI.



## 🚀 Features

* ✅ **Complete E-Commerce Flow** (Configure → Pay → Thank You)
* ✅ **Beautiful, Conversion-Focused Landing Page**
* ✅ **Admin Dashboard for Order & Product Management**
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



## 📦 Getting Started

Follow the steps below to run **ClassyCase** locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/classycase.git
cd classycase


### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file and add the required credentials:

```env
NEXT_PUBLIC_SERVER_URL=
DATABASE_URL=
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=
KINDE_POST_LOGOUT_REDIRECT_URL=
KINDE_POST_LOGIN_REDIRECT_UR=
NEXT_PUBLIC_ADMIN_EMAIL=
UPLOADTHING_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EMAIL_PASSWORD=
```

### 4. Set Up Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the App

```bash
npm run dev
```



## 📷 Screenshots

### 🖼️ Landing Page  
![Landing Page](https://github.com/user-attachments/assets/9544ad92-1082-4a64-b213-d9edad6378b4)


### 🎨 Case Configurator  
![Configurator](https://github.com/user-attachments/assets/8bb914e0-6d4e-435f-bb39-9fcdd1458bcf)


### 🛠️ Admin Dashboard  
![Admin Dashboard](https://github.com/user-attachments/assets/828cdaa7-0d36-4b2f-a4f3-f3c7d9463923)


### ✅ Thank You Page  
![Thankyou](https://github.com/user-attachments/assets/00118fc1-2cde-49b8-90d5-a823fe47a045)



## 📜 License

All rights reserved © \[ClassyCase - Abheeshta P]
This project is not open-source and should not be reused or redistributed without explicit permission.
