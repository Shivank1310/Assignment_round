# Deployment Guide

This project is set up to be deployed as a monolithic application (Backend + Frontend served together).

## Prerequisites

1.  **MongoDB Atlas**: You need a cloud MongoDB database (e.g., MongoDB Atlas). Get the connection string (URI).
2.  **GitHub**: Push this code to a GitHub repository.

## Deployment Options

### Option 1: Render.com (Recommended)

1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  Render will automatically detect `package.json` in the root.
4.  **Build Command**: `npm install`
5.  **Start Command**: `npm start`
6.  **Environment Variables**:
    *   Add `MONGODB_URI`: Your MongoDB connection string.
    *   Add `NODE_ENV`: `production`

### Option 2: Heroku

1.  Create a new app on Heroku.
2.  Connect your GitHub repository.
3.  Set Environment Variables in Settings -> Config Vars (`MONGODB_URI`).
4.  Deploy the branch.
5.  Heroku will automatically run `npm start`.

### Option 3: Railway

1.  New Project -> Deploy from GitHub.
2.  Add variables (`MONGODB_URI`).
3.  Railway will detect `npm start`.

## Local Development

To run the project locally:

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file in `backend/` (or root) with:
    ```
    MONGODB_URI=mongodb://localhost:27017/flipr-db
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:5000`.
    The admin panel is at `http://localhost:5000/admin`.

## Project Structure

*   `backend/`: Contains the Express server and API logic.
*   `frontend/`: Contains the public landing page.
*   `admin/`: Contains the admin dashboard.
*   `package.json`: Root configuration for deployment.
