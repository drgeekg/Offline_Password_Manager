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