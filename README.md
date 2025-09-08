# MERN Task Manager

A simple to-do application built using the **MERN stack**—MongoDB, Express.js, React, and Node.js. Learn full-stack development with basic functionality to **Add**, **View**, **Update**, and **Delete** tasks.

---

##  What’s Inside?

- **Backend** (`backend/`): REST API using Node.js, Express.js, and MongoDB to manage tasks.
- **Frontend** (`frontend/`): React app (via Vite) that lets you interact with tasks in a modern UI.
- **Tailwind CSS** already integrated for quick and clean styling.

---

##  Setup Guide (for Beginners)

### 1. Clone the repository
```bash
git clone https://github.com/lovnishverma/mern-task-manager.git
cd mern-task-manager
````

### 2. Setup the Backend (API server)

```bash
cd backend
npm install
```

* Create a `.env` file with your MongoDB connection string:

  ```env
  MONGO_URI=your_mongodb_connection_string
  ```
* Start the backend server:

  ```bash
  node server.js
  ```
* It should run on `http://localhost:5000`.

### 3. Setup the Frontend (User interface)

In a new terminal:

```bash
cd ../frontend
npm install
npm run dev -- --host
```

* This starts the app at `http://localhost:5173`.
* Use `--host` so it works even on other devices on the same network.

### 4. Use the App

* Open the app in your browser.
* Add tasks in the input field.
* Click on a task to mark it complete (strikethrough).
* Use the delete option to remove a task.

---

## Why It’s Helpful for Beginners

* Clear separation of **frontend** and **backend** code.
* Learn how React interacts with a **REST API**.
* Explore essential web development skills: routing, CRUD, state management, styling.
* Lightweight and easy to run—no heavy setup required.

---

## Tips if It Doesn’t Work

* Make sure the backend is running before using the frontend.
* If tasks don’t load:

  * Ensure the `api.js` in `frontend/src` points to `http://localhost:5000` (or your LAN IP if using another device).
* If you're on Windows and see line-ending warnings from Git (`LF will be replaced by CRLF`), that’s normal and safe to ignore.

---

## Happy Coding!

Build, break, fix, and learn—this app is your sandbox to explore full-stack development with MERN. Feel free to tweak it, experiment, and make it your own!

---

