# FitnessTracker Backend Server

This is the proper Node.js + Express backend built to handle Authentication for the FitnessTracker mobile app using MongoDB.

## Features Included
- **MongoDB Integration:** Built using Mongoose ORM.
- **Secure Authentication:** Passwords are mathematically hashed via `bcryptjs`.
- **JWT Protection:** State management is securely handled via Bearer Tokens using `jsonwebtoken`.
- **Global Error Handling:** All errors (like 404s, invalid passwords, existing users) are gracefully handled and sent to the client cleanly.

## Prerequisites
To run this backend, you MUST have a MongoDB Database available.
You can either:
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and run it locally.
2. Create a free cloud cluster using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
B
## Setup & Integration Guide

### 1. Configure the Environment (`.env`)
You must create a `.env` file in this `backend/` directory to securely store your MongoDB URI.

Create a file named `.env` and add the following contents:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=super_secret_jwt_key_please_change_me
# If using Local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/fitnesstracker
# If using MongoDB Atlas, replace with your connection string:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/fitnesstracker?retryWrites=true&w=majority
```

### 2. Run the Server
Once your `.env` is configured and your `MONGO_URI` is pointing to a valid database:

1. Open a terminal in the `backend/` directory.
2. Run `node server.js` (or use `nodemon` if you have it installed).

You should see:
```bash
MongoDB Connected: 127.0.0.1
Server running in development mode on port 5000
```

### 3. App Integration
The React Native app is already configured (in `src/api/client.ts`) to point to `http://10.0.2.2:5000` (which resolves to `localhost` from the Android emulator).
If you are running the app on a physical device, you need to change the `baseURL` in the `client.ts` file to your computer's local IP address (e.g., `http://192.168.1.x:5000`).
