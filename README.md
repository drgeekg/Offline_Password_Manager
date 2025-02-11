# Locally Implemented Password Manager

## PRODUCT UNDER DEVELOPMENT

## Abstract
The Locally Implemented Password Manager is an offline password management system built using the MERN stack (MongoDB, Express.js, React, Node.js). Unlike cloud-based solutions, it ensures credentials are stored locally, offering enhanced security, privacy, and offline access.

## Key Features
- **AES-256 Encryption** for secure password storage
- **Master Password Authentication** for secure access
- **Search & Categorization** for efficient management
- **Local Backup & Restore** to prevent data loss
- **Password Generator** for strong, random passwords
- **Optional Autofill** (Browser Extension)

## Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/drgeekg/Offline_Password_Manager.git
cd Offline_Password_Manager
```
### 2️⃣ Install Dependencies
Ensure you have Node.js (version 20.x) installed. Then, run:
```sh
npm install
```
### 3️⃣ Initialize the Database
```sh
npm run db:push
```
### 4️⃣ Start the Development Server
```sh
npm run dev
```
The app will run at http://localhost:5000.


#
#

# One-Click Startup Script for Locally Implemented Password Manager

## Purpose

This batch script allows users to start the **Locally Implemented Password Manager** in **one click**. It automatically navigates to the cloned project directory, starts the development server, and opens the application in a web browser.

## Setup Instructions

1. **Find Your Project Directory**  
   After cloning the repository, note the folder path where you extracted it. Example paths:   
   - `C:\Users\YourName\Documents\Offline_Password_Manager`   
   - `D:\Projects\SecureVault`

2. **Create the Script**  
   Copy the following code and paste it into a new file named **`runDevServer.bat`**:

   ```bat
   @echo off
   REM Change to the project directory (UPDATE THIS PATH)
   cd /d "C:\Path\To\Your\Project\Offline_Password_Manager"

   REM Start the development server in a new command prompt window
   start "Dev Server" cmd /k "npm run dev"

   REM Wait a few seconds for the server to initialize
   timeout /t 5 /nobreak >nul

   REM Open the application in the default browser
   start http://localhost:5000

   echo.
   echo The application is running. You can access it at http://localhost:5000
   pause
   ```

3. **Update the Directory Path**
Replace `C:\Path\To\Your\Project\Offline_Password_Manager` with your actual project folder path.

4. **Run the Script**
Double-click `runDevServer.bat` to start the server and open the app automatically.

## What This Script Does
* Navigates to your project folder.
* Starts the development server in a new terminal window.
* Waits for 5 seconds (adjust if needed).
* Opens `http://localhost:5000` in your default browser.
## Enjoy a seamless startup experience!