# ClassyCase

### Modern Full-Stack E-Commerce Platform for Custom Phone Cases

ClassyCase is an end-to-end e-commerce platform that allows customers to design, customize, preview, and purchase high-quality custom phone cases. Built with Next.js 15 App Router, PostgreSQL, Prisma ORM, and TypeScript, the platform delivers an intuitive user experience with enterprise-grade security, live configuration previews, secure payment processing, and administrative controls.



## Features

- **Custom Artwork Upload**: Drag-and-drop or select photos with instant upload progress and automatic image dimension processing.
- **Interactive Case Customizer**: Freely position, resize, and rotate custom artwork directly over realistic phone mockups.
- **Model, Material & Finish Options**: Support for iPhone models and the Samsung Galaxy S25, with choices between silicone or polycarbonate, smooth or textured finishes, and distinct case colors.
- **Live Design Preview**: Real-time 3D-style phone case preview with celebratory animations and dynamic price breakdowns.
- **Fast & Secure Checkout**: Integrated Stripe payment flow supporting major credit cards, mobile wallets, and international shipping addresses.
- **Order Confirmation & Email Receipts**: Post-purchase confirmation page accompanied by automated transactional email receipts.
- **Saved Designs**: Seamless state persistence allowing customers to save their case design and resume checkout after signing in.
- **Admin Management Dashboard**: Built-in operations dashboard to monitor revenue metrics, review recent orders, and update fulfillment statuses.



## Architecture & Security Highlights

- **Server-Side Authorization**: Administrative server actions (e.g., updating order fulfillment status) independently verify caller identity against authorized administrator credentials.
- **Order State Machine**: Enforces strict status transition rules (`awaiting_shipment` -> `shipped` -> `fulfilled`) to prevent invalid lifecycle changes.
- **Configuration & Order Scoping**: Lookups and updates to configurations and orders are scoped strictly to the authenticated user ID.
- **Webhook Idempotency**: Stripe webhook handlers track paid status to prevent redundant order processing, duplicate address creation, and repeated confirmation emails on retry events.
- **Strict Input Validation**: All server action arguments, parameters, and database queries are validated with Zod schemas.



## Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes, and Server Actions |
| **Language** | TypeScript | End-to-end type safety |
| **Styling** | Tailwind CSS & shadcn/ui | Component design system and responsive UI |
| **Database** | PostgreSQL | Relational data persistence |
| **ORM** | Prisma | Schema modeling, migrations, and type-safe query building |
| **Authentication** | Kinde Auth | Session management, OAuth, and authentication guards |
| **Payments** | Stripe | Hosted checkout sessions, customer billing, and webhooks |
| **File Storage** | UploadThing & Sharp | Image upload infrastructure and image processing |
| **Email Delivery** | React Email & Nodemailer | Templating and transactional email dispatch |
| **Validation** | Zod | Runtime schema validation |



## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SERVER_URL` | Application base URL (e.g., `http://localhost:3000`) |
| `DATABASE_URL` | PostgreSQL connection string (Neon, Supabase, or local) |
| `KINDE_CLIENT_ID` | Kinde application client identifier |
| `KINDE_CLIENT_SECRET` | Kinde application client secret |
| `KINDE_ISSUER_URL` | Kinde authentication domain URL |
| `KINDE_SITE_URL` | Application site URL |
| `KINDE_POST_LOGOUT_REDIRECT_URL` | Redirect destination after logout |
| `KINDE_POST_LOGIN_REDIRECT_URL` | Redirect destination after login (`/auth-callback`) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Administrator email address for dashboard access |
| `UPLOADTHING_TOKEN` | API token for UploadThing file service |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `EMAIL_PASSWORD` | App-specific password for transactional email SMTP |



## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL database instance (local or hosted, e.g., Neon)

### Option 1: Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abheeshta-P/ClassyCase.git
   cd ClassyCase
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in the required credentials in `.env`.

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.



### Option 2: Docker Compose

1. **Start the application and database containers:**
   ```bash
   docker-compose up --build
   ```

2. **Apply migrations inside the container:**
   ```bash
   docker-compose exec nextjs npx prisma migrate dev
   ```

3. **Stop containers:**
   ```bash
   docker-compose down
   ```



## Database Management

- **Apply schema changes in development:**
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```
- **Apply pending migrations in production:**
  ```bash
  npx prisma migrate deploy
  ```
- **Regenerate Prisma Client:**
  ```bash
  npx prisma generate
  ```
- **Inspect database with Prisma Studio:**
  ```bash
  npx prisma studio
  ```



## Production Deployment

When deploying to platforms such as Vercel or Railway:

1. Configure all required environment variables in your hosting dashboard.
2. The build script automatically executes migration deployment before compiling the application:
   ```json
   "build": "prisma migrate deploy && next build"
   ```
3. Set your Stripe webhook endpoint to:
   ```
   https://your-domain.com/api/webhooks
   ```
   Configure the webhook to listen for the `checkout.session.completed` event.



## Application Previews

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/9544ad92-1082-4a64-b213-d9edad6378b4)

### Artwork Upload
![Upload Image Page](https://github.com/user-attachments/assets/6225ed0c-f3ec-4ec1-8839-94154fa666d2)

### Configuration Preview
![Configuration Preview](https://github.com/user-attachments/assets/8bb914e0-6d4e-435f-bb39-9fcdd1458bcf)

### Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/77e8a6cb-0454-4c11-9097-973055a9a72a)

### Order Confirmation
![Thank You Page](https://github.com/user-attachments/assets/00118fc1-2cde-49b8-90d5-a823fe47a045)





> All rights reserved &copy; ClassyCase - Abheeshta P.  
