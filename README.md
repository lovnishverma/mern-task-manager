# MERN Task Manager

A simple to-do application built using the **MERN stack**—MongoDB, Express.js, React, and Node.js. Learn full-stack development with basic functionality to **Add**, **View**, **Update**, and **Delete** tasks.

---

## 📂 What’s Inside?

- **Backend** (`backend/`): REST API using Node.js, Express.js, and MongoDB to manage tasks.
- **Frontend** (`frontend/`): React app (via Vite) that lets you interact with tasks in a modern UI.
- **Tailwind CSS** already integrated for quick and clean styling.

---

## 🚀 Setup Guide (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/lovnishverma/mern-task-manager.git
cd mern-task-manager

```

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

## ☁️ Deployment Guide (Render)

Deploy your app for free using Render. You will create two separate services: one for the backend and one for the frontend.

### Step 1: Deploy the Backend (Web Service)

1. Log in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
* **Name:** `mern-task-backend` (or similar)
* **Root Directory:** `backend`
* **Environment:** Node
* **Build Command:** `npm install`
* **Start Command:** `node server.js`


5. Scroll down to **Environment Variables** and add:
* `MONGO_URI`: Your MongoDB connection string.
* `PORT`: `10000` (Render's default port).


6. Click **Create Web Service**.
7. **Copy the URL** provided by Render (e.g., `https://your-backend.onrender.com`). You will need this for the frontend.

### Step 2: Deploy the Frontend (Static Site)

1. Go back to the Render Dashboard.
2. Click **New +** and select **Static Site**.
3. Connect the same GitHub repository.
4. Configure the service:
* **Name:** `mern-task-frontend`
* **Root Directory:** `frontend`
* **Build Command:** `npm install && npm run build`
* **Publish Directory:** `dist`


5. **Environment Variables:**
* Add a variable named `VITE_API_URL`.
* Set the value to your **Backend URL** from Step 1 (add `/api` at the end if your API routes require it, e.g., `https://your-backend.onrender.com/api`).


6. **Rewrite Rules:**
* To ensure React Router works correctly, go to the **Redirects/Rewrites** tab.
* Add a new rule:
* **Source:** `/*`
* **Destination:** `/index.html`
* **Action:** Rewrite

**Optional:**

You can deploy the frontend to **GitHub Pages** too. It is free and works very well for React (Vite) applications.

However, since your backend is on Render, you will still need to point your frontend to that Render backend URL.

### **Steps to Deploy Frontend to GitHub Pages**

#### **1. Install `gh-pages**`

In your **frontend** directory, install the deployment tool:

```bash
cd frontend
npm install gh-pages --save-dev

```

#### **2. Update `frontend/vite.config.js**`

You need to set the `base` path in Vite so it knows where the files are being served from on GitHub Pages.

Open `frontend/vite.config.js` and add the `base` property:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/mern-task-manager/", // REPLACE "mern-task-manager" with your exact repo name
})

```

#### **3. Update `frontend/package.json**`

Add the `homepage` field and the deployment scripts.

Open `frontend/package.json` and add these lines:

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "homepage": "https://<your-github-username>.github.io/mern-task-manager", 
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist" 
  },
  ...
}

```

* **Replace** `<your-github-username>` with your actual GitHub username.
* **Replace** `mern-task-manager` with your repository name.

#### **4. Deploy!**

Run this command from the `frontend` folder:

```bash
npm run deploy

```

This command will:

1. Build your app (create the `dist` folder).
2. Push that folder to a special branch called `gh-pages` on your GitHub repository.

#### **5. Configure GitHub Settings**

1. Go to your repository on GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Source**, ensure it is set to `Deploy from a branch`.
4. Under **Branch**, select `gh-pages` and folder `/(root)`.
5. Click **Save**.

Your frontend will be live at the URL shown in the settings (e.g., `https://lovnishverma.github.io/mern-task-manager/`).

### **Crucial Reminder: Backend Connection**

Since your frontend is now on GitHub Pages, but your backend is still on Render:

1. **Environment Variable:** Ensure your `.env` file (or hardcoded `api.js`) points to your **Render Backend URL**, not localhost.
```javascript
// frontend/src/api.js
const API = axios.create({ baseURL: "https://your-backend-service.onrender.com/api" });

```


2. **CORS:** If you get a connection error, you might need to update your Backend `server.js` to allow requests from your new GitHub Pages URL:
```javascript
// backend/server.js
app.use(cors({
  origin: ["https://lovnishverma.github.io", "http://localhost:5173"] 
}));



7. Click **Create Static Site**.

---

## 💡 Why It’s Helpful for Beginners

* Clear separation of **frontend** and **backend** code.
* Learn how React interacts with a **REST API**.
* Explore essential web development skills: routing, CRUD, state management, styling.
* Lightweight and easy to run—no heavy setup required.

---

## 🛠 Tips if It Doesn’t Work

* **Backend First:** Make sure the backend is running before using the frontend.
* **Connection Issues:** If tasks don’t load:
* **Locally:** Ensure the `api.js` in `frontend/src` points to `http://localhost:5000` (or your LAN IP).
* **On Render:** Ensure you added the `VITE_API_URL` environment variable correctly.


* **Windows Users:** If you see line-ending warnings from Git (`LF will be replaced by CRLF`), that’s normal and safe to ignore.

---

## Happy Coding!

Build, break, fix, and learn—this app is your sandbox to explore full-stack development with MERN. Feel free to tweak it, experiment, and make it your own!
