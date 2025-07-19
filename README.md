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


## ⚠️ Known Limitations / Future Improvements

* No password reset flow (for demo simplicity)
* No “edit form” feature for admins (could be added)
* No user email validation (admin registration is open)
* Add pagination for responses if needed for large scale
* Unit tests and e2e tests can be added for robustness


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

Your Name — \[shashankksoni]

---

**Feel free to fork, star, or use as a starter for your next feedback-driven product!**

---

