

# FoodFlow

FoodFlow is a **pickup-only** food marketplace connecting local culinary creators (sellers) with customers.

## How it works

1. **Drops**: Creators schedule "Drops" - specific times and locations where food will be available for pickup. They set a menu, prices, and a maximum order limit.
2. **Booking**: Customers browse Drops, add items to their cart, and book an order before the drop's cutoff time. 
3. **Cash at Pickup**: All orders are Pay at Pickup (Cash at Pickup). Customers arrive at the designated location at the scheduled time and pay the creator directly in cash.
4. **Social Reels**: Creators can upload TikTok-style short videos (Reels) to showcase their dishes and engage with customers. Customers can discover new creators through the Reels feed.
5. **Seller Analytics**: Creators have access to a dashboard tracking their revenue, popular items, fill rates, and customer retention metrics.

## Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast bundling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for server state and caching
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Java 21**
- **Spring Boot 3.2.5**
- **Spring Security** (JWT authentication)
- **Spring Data JPA**
- **MySQL 8** (Database)
- **Flyway** (Database migrations)
- **Maven** (Build tool)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java (JDK 21)
- MySQL (v8+)

### Environment Setup

#### Backend
Create an `application-secret.properties` file in `backend/src/main/resources/` with the following variables (or provide them via your environment):
```properties
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_base64_encoded_jwt_secret_key_min_256_bits
```

#### Frontend
Create a `.env.local` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8080
```

### Running via Docker (Recommended)

1. **Configure Environment Variables**:
   Create a `.env` file in the root directory (where `docker-compose.yml` is located) with the required secrets:
   ```env
   DB_NAME=food_flow
   DB_USERNAME=foodflow_user
   DB_PASSWORD=your_secure_db_password
   MYSQL_ROOT_PASSWORD=your_secure_root_password
   JWT_SECRET=your_base64_encoded_jwt_secret_key_min_256_bits
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. **Start the Stack**:
   Run the following command from the root of the repository:
   ```bash
   docker compose up -d
   ```
   *This will build the frontend and backend images, start the MySQL database, automatically run database migrations on boot, and start the frontend React application on port `3000` and the backend API on port `8080`.*

3. **Access the Application**:
   - Web App: `http://localhost:3000`
   - API: `http://localhost:8080/api`

4. **Stop the Stack**:
   ```bash
   docker compose down
   ```
   *To wipe the database volume entirely (clean slate), run `docker compose down -v`.*

### Running Locally (Without Docker)

1. **Database**: Create a MySQL database named `food_flow`.
2. **Backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *Flyway will automatically run migrations and seed test data on startup.*
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Development Guidelines
- **No Online Payments**: The system is strictly cash-only. Do not introduce Stripe, Razorpay, or generic "payment providers".
- **No Delivery**: The system is strictly pickup-only. Do not introduce riders, delivery fees, or tracking maps.
- **Data Fetching**: Use React Query for all API requests. Do not use generic `useEffect` fetching.
- **State Management**: Use Zustand only for global client state (like the shopping cart).

## Features
- Role-based access control (Customer, Seller, Admin)
- Creator Verification (Tiered levels for trust)
- Real-time cart management
- Responsive, mobile-first UI
- Advanced seller analytics dashboard
............