# Feedback Collection Platform

A modern, full-stack feedback collection solution for businesses to create customizable forms, share public links, and collect structured feedback.
**Admin dashboard** for form management and insights, **public forms** for quick, frictionless feedback submission.

---

## 🚀 Tech Stack

* **Frontend:** React + Vite, Axios, CSS (responsive, mobile-friendly)
* **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication
* **Others:** json2csv (CSV export), nanoid (unique public URLs)

---

## 🎯 Features

### **Admin (Business User)**

* Register/Login with JWT authentication
* Create feedback forms (3–5 questions, text or multiple choice)
* Public shareable link for each form
* View all forms and their responses in a dashboard
* Download responses as CSV
* View summary stats and raw feedback
* Mobile responsive UI

### **Customer/User**

* Access form via public URL (no login required)
* Submit feedback (validations, instant feedback toast)
* See thank you message after submit

## 🏗️ Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/your-username/feedback-collection-platform.git
cd feedback-collection-platform
```

### 2. **Backend Setup**

```sh
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:

```sh
npm run dev
```

or

```sh
node server.js
```

### 3. **Frontend Setup**

```sh
cd ../frontend
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---


## 🔑 How to Get a MongoDB URI

Follow these steps to obtain a MongoDB URI for your application:

1. **Sign Up for MongoDB Atlas**
   Visit [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.

2. **Create a Project and Cluster**

   * After logging in, create a new project.
   * Within the project, create a cluster.
   * The free tier (M0) is sufficient for development purposes.

3. **Create a Database User**

   * Go to the **Database Access** section.
   * Create a new database user and set a password.
   * Note down the username and password—you'll need them for the URI.

4. **Get the Connection URI**

   * Navigate to **Clusters** in the left menu.
   * Click **Connect** > **Connect your application**.
   * Copy the connection string provided. It will look like this:

     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```

5. **Configure Your Environment File**

   * Create a `.env` file in your project root (if it doesn’t exist).
   * Paste the URI into the `.env` file, replacing `<username>`, `<password>`, and `<dbname>` with your actual credentials and database name:

     ```
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```

---


## 🔒 How to Get a JWT Secret Key

Follow these steps to generate a secure JWT secret for your application:

1. **Generate a Secret Key**

   In your terminal, run the following command using the Node.js REPL or any Node-enabled environment:

   ```js
   require('crypto').randomBytes(32).toString('hex')
   ```

   This will generate a secure, random 64-character hexadecimal string.

   > 💡 Alternatively, you can use any long, unpredictable string. Just make sure to keep it **private**.

2. **Configure Your Environment File**

   Add the generated string to your `.env` file like so:

   ```ini
   JWT_SECRET=your_super_long_random_string
   ```

   Replace `your_super_long_random_string` with the actual value you generated.

---

## 📫 API Testing with Postman

Postman was used manually to test and verify all backend API endpoints during development.

### 🧪 What Was Tested

* **Authentication Routes**

  * `POST /api/auth/register` – Register a new admin
  * `POST /api/auth/login` – Admin login and JWT retrieval

* **Form Routes**

  * `POST /api/forms` – Create a new feedback form (Admin)
  * `GET /api/forms/:id` – Fetch a public form
  * `GET /api/forms/admin` – Get all forms created by admin (Protected)

* **Response Routes**

  * `POST /api/responses/:formId` – Submit a form response
  * `GET /api/responses/:formId` – View responses for a form (Admin)

### 🚀 How to Test with Postman

1. Open [Postman](https://www.postman.com/).
2. Manually create requests with the appropriate method, URL, and body.
3. Set **Headers** for protected routes (e.g., `Authorization: Bearer <your_jwt_token>`).
4. Use `http://localhost:5000` as the base URL when running the server locally.
5. Test all functionality including:

   * Registration/Login
   * JWT-based access control
   * Form creation and retrieval
   * Form response submission and viewing

> 💡 You don’t need to import any collection — everything was tested using manually created requests.

---


## 🔒 How JWT Authentication Works in This Project

### 1. **Registration and Login**

* When an admin **registers or logs in** (`/api/auth/register` or `/api/auth/login`), the backend checks credentials and **generates a JWT token** if successful.
* This token encodes the admin's user ID and is signed using your secret key (`JWT_SECRET`).

### 2. **Token Storage**

* The frontend **stores the JWT token in `localStorage`** right after login or registration.

### 3. **Protected API Requests**

* For any admin-only API (such as creating forms, viewing responses, downloading CSV), the frontend **sends the JWT in the `x-auth-token` header** of each request.
* The backend uses authentication middleware to:

  * Check if a token is present
  * Verify that the token is valid and not expired
  * Allow or deny the request based on token validity

### 4. **Logout**

* Logging out is handled by **removing the JWT token from localStorage**.
  This prevents further access to protected routes until the user logs in again.

---

### **Where JWT Is Used**

* **Backend:**

  * `/routes/auth.js`: Generates tokens during login and registration
  * `/middleware/auth.js`: Verifies tokens for all protected admin routes
  * All admin-only routes require this authentication middleware
* **Frontend:**

  * Saves token after successful login/registration
  * Attaches token to protected API requests
  * Uses `PrivateRoute` to block dashboard access if no token

---

**Public forms and feedback submission do NOT require a JWT.**
Only admin actions are protected, keeping the system secure and user-friendly.

---


## 🗂️ API Overview

* `POST /api/auth/register` — Admin registration
* `POST /api/auth/login` — Admin login (returns JWT)
* `POST /api/forms` — Create new feedback form (admin only)
* `GET /api/forms` — List all forms (admin only)
* `GET /api/forms/:publicId` — Get public form by ID
* `POST /api/responses/:publicId` — Submit feedback (public)
* `GET /api/responses/:formId` — View responses (admin only)
* `GET /api/responses/export/:formId` — Export CSV (admin only)

---

## 💡 Approach and Decisions

### **Why This Stack?**

* **MERN-like:** React + Express + MongoDB: Fast iteration, strong open source community, easy scalability.
* **Vite for React:** Ultra-fast dev/build, zero config, great DX.
* **JWT Auth:** Secure, stateless sessions for admins.
* **nanoid:** Ensures public form links are unique and unguessable.
* **json2csv:** Quick CSV export for admin insights.

### **Form/Response Data Modeling**

* **Form:** Title, questions (text or multiple-choice), createdBy, publicId
* **Response:** Tied to form, stores answers as array (questionId + answerText)
* **User:** Only admins register/login (customers do not)

### **UI/UX Approach**

* Clean, mobile-first design
* Toasts and error handling for all actions
* Button and input accessibility (big hit targets, keyboard-friendly)
* Summary cards for admin insight and CSV for export

### **Security**

* Passwords are hashed before saving
* JWT is required for all admin actions (protected routes)
* CORS enabled for local dev, configurable for prod
* MongoDB input is trimmed and length-limited

### **Other Decisions**

* **Edge case validation:** Required fields, minimum/maximum limits, blank form prevention, meaningful error messages everywhere
* **Frontend:** Kept dependencies minimal, all styling in CSS or inline for ease of review.

---

## 🛠️ How to Test

* Register as admin, then login.
* Create new feedback form (add 3–5 questions, mix text/multiple choice).
* Copy public link, open in new tab or incognito, submit feedback.
* Check responses in dashboard: see raw data, summary stats, and CSV download.
* Try all edge cases: blank inputs, max-length, duplicate email, navigating to protected pages without logging in, etc.


---

## 📋 Project Structure

```
feedback-collection-platform/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Form.js
│   │   ├── Response.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── forms.js
│   │   └── responses.js
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminRegister.jsx
│   │   │   ├── CreateForm.jsx
│   │   │   ├── PublicForm.jsx
│   │   │   └── ViewResponses.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```


---



## 👤 Author

Your Name — \[[shashankksoni](https://github.com/shashankksoni)]

---

**Feel free to fork, star, or use as a starter for your next feedback-driven product!**

---

