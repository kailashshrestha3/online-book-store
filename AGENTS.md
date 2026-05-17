# Online Book Store Development Guide

## Project Overview

This is a **MERN-stack backend** for an online book store e-commerce platform built with:
- **Express.js** (5.2.1) - REST API framework
- **MongoDB** (7.2.0) + **Mongoose** (9.5.0) - Database layer
- **bcryptjs** (3.0.3) - Password security
- **dotenv** - Environment configuration

**Status**: Early-stage development with core user authentication and book catalog infrastructure.

---

## Quick Start

### Prerequisites
- Node.js installed
- MongoDB Atlas account (connection string in `.env`)

### Running the Project

```bash
cd backend
npm install
npm run dev
```

The server starts on `http://localhost:3000` (configurable via `.env` PORT variable).

**Available Commands**:
- `npm run dev` - Development mode with file watching
- `npm test` - Run tests (not yet configured)

---

## Project Structure

```
backend/
├── server.js              # Express app entry point & route registration
├── package.json           # Dependencies & scripts
├── .env                   # Environment variables (PORT, MONGO_URI)
├── config/
│   └── db.js              # MongoDB connection initialization
├── models/                # Mongoose schemas
│   ├── user.js            # User auth, cart, favorites, orders
│   ├── book.js            # Book catalog metadata
│   └── order.js           # Order/purchase tracking
└── routes/                # API endpoint handlers
    └── user.js            # User sign-up, sign-in endpoints
```

---

## Core Development Patterns

### 1. Adding a New Route

1. Create route file in `routes/` (e.g., `routes/book.js`)
2. Export Express router with handler functions
3. Import and register in `server.js`:
   ```javascript
   const bookRoutes = require('./routes/book');
   app.use('/api/v1', bookRoutes);
   ```

### 2. Creating/Modifying Mongoose Models

- **Location**: `models/` directory
- **Pattern**: Define schema with types, validation rules, and timestamps
- **Example constraints**:
  ```javascript
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
  }, { timestamps: true });
  ```
- **Timestamps**: Automatically added to all models (`createdAt`, `updatedAt`)
- **Relations**: Use ObjectId refs with `ref: 'ModelName'` for document relationships

### 3. Validation & Error Handling

- **Input validation**: Always validate before database operations (check required fields, min lengths)
- **Duplicate checking**: Query database for unique constraints (username, email)
- **Response format**: All endpoints return JSON with `message` field:
  ```javascript
  res.status(200).json({ message: "Success", data: {...} });
  res.status(400).json({ message: "Validation failed" });
  ```
- **Error handling**: Use try-catch, return 500 for server errors, 400 for validation errors

### 4. Authentication & Security

- **Password hashing**: Always use bcryptjs (example in `routes/user.js`):
  ```javascript
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  ```
- **Never store plaintext passwords**
- **TODO**: Add JWT middleware for authentication on protected routes

---

## Environment Configuration

### Required `.env` Variables

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

---

## API Endpoints

### User Routes (`/api/v1/user`)

| Method | Endpoint | Status | Purpose |
|--------|----------|--------|---------|
| POST | `/register` | ✅ Complete | User sign-up with validation & password hashing |
| POST | `/login` | ⚠️ Incomplete | User sign-in (incorrect HTTP method in code) |
| GET | `/profile/:id` | ❌ Not started | Get user profile (needs auth middleware) |

**Note**: Sign-in endpoint currently uses GET instead of POST—needs fixing.

### Book Routes (Not Started)

- List books with pagination
- Get book details
- Search books (by title, author, category)

### Order Routes (Not Started)

- Create order from cart
- Get user orders
- Update order status

---

## Known Issues & Development Priorities

### 🔴 Critical Issues

1. **Sign-in endpoint bug**: [routes/user.js line 68](backend/routes/user.js#L68)
   - Uses GET method (should be POST)
   - Logic incomplete (bcrypt comparison missing)
   - Needs JWT token generation

2. **Order model schema error**: [models/order.js](backend/models/order.js)
   - `enum: "Out for delivery, Delivery, Canceled"` should be an array: `["Out for delivery", "Delivery", "Canceled"]`

### ⚠️ Technical Debt

- No authentication middleware for protected routes
- No input sanitization beyond length checks
- Duplicate "bcrypt" in root `package.json` + "bcryptjs" in backend (use only bcryptjs)
- No error logging or monitoring

---

## Common Development Tasks

### Task: Complete Sign-In Endpoint

**File**: [backend/routes/user.js](backend/routes/user.js#L68)

Requirements:
- ✅ Change HTTP method to POST
- ✅ Query user by username or email
- ✅ Compare provided password with stored hash using bcryptjs
- ✅ Generate JWT token on successful auth
- ✅ Return token + user info

### Task: Add Book Management Routes

**Location**: Create `backend/routes/book.js`

Endpoints needed:
- GET `/books` - List all books (with pagination)
- GET `/books/:id` - Get single book details
- GET `/books/search` - Search by title/author
- POST `/books` - Add book (admin only)
- PUT `/books/:id` - Update book
- DELETE `/books/:id` - Delete book

### Task: Implement Order Management

**File**: Create or complete `backend/routes/order.js`

Endpoints needed:
- POST `/orders` - Create new order
- GET `/orders/:userId` - Get user's order history
- GET `/orders/:id` - Get order details
- PUT `/orders/:id/status` - Update order status

---

## Database Connection

**Location**: [backend/config/db.js](backend/config/db.js)

- Automatically called on server startup
- Connects to MongoDB Atlas via `MONGO_URI` in `.env`
- Exits process with error message if connection fails
- Add debug logging by uncommenting Mongoose debugging during development

---

## Testing & Debugging Tips

### Debug Database Connection Issues

1. Verify `.env` file exists and `MONGO_URI` is correct
2. Check MongoDB Atlas network access whitelist (allow your IP)
3. Add this in `config/db.js` for debugging:
   ```javascript
   mongoose.set('debug', true);
   ```

### Test Endpoints Locally

Use Postman or curl:

```bash
# Sign up
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"123456"}'

# Test database connection
curl http://localhost:3000/api/v1/health
```

---

## File Organization Rules

- **Models**: Always in `models/`, one schema per file, singular names (User, Book, Order)
- **Routes**: Always in `routes/`, kebab-case file names, grouped by domain
- **Config**: Database and environment setup in `config/`
- **Entry point**: All routes mounted in `server.js` at `/api/v1` prefix

---

## Next Steps for AI Agents

1. **Fix critical bugs** in sign-in endpoint and order model schema
2. **Add authentication middleware** to protect user endpoints
3. **Implement book routes** (CRUD operations)
4. **Complete order management** (create, retrieve, status updates)
5. **Add validation middleware** for request sanitization
6. **Set up error logging** for production readiness

---

## Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- Project `.env` template in root directory
