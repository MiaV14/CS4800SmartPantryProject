# 🥗 Smart Pantry

Smart Pantry is a React Native mobile app built with Expo that helps users track food items, organize them by storage location, and reduce food waste by monitoring expiration dates.

---

## 🚀 Features

### 📦 Item Management (CRUD)
- Add new food items
- Edit existing items
- Delete items (with confirmation)
- Shared state updates across the entire app

### 🧊 Storage Organization
- Organize items by:
  - Fridge - Main
  - Fridge - Freezer
  - Pantry
  - Seasonings
- Dynamic storage screens with item counts

### 🏷️ Category Filtering
- Filter items by category (Produce, Meat, Dairy, etc.)
- Filters dynamically update based on available items

### ⏳ Expiration Tracking
- Automatically calculates item status:
  - ✅ Fresh
  - ⚠️ Expiring soon (≤ 3 days)
  - ❌ Expired
- Visual feedback:
  - Orange → Expiring soon
  - Red → Expired

### 📊 Dashboard Overview
- Total items
- Expiring soon count
- Expired count
- Storage summaries

---

## 🛠️ Tech Stack

- React Native (Expo)
- Expo Router (file-based navigation)
- TypeScript
- React Context (state management)
- Custom UI components

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/MiaV14/CS4800SmartPantryProject.git
cd CS4800SmartPantryProject
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npx expo start
```

---

## 📱 Current Status

- Core CRUD functionality complete
- Expiration system implemented
- UI and navigation fully functional
- Data currently stored in memory (no backend yet)

---

## 🔐 Upcoming Features

- User authentication (login/signup)
- Cloud database (user-specific data)
- Barcode scanning
- Receipt scanning

---

## 🎯 Goal

The goal of Smart Pantry is to help users:
- Stay organized
- Reduce food waste
- Easily track what they have at home

---

## 👩‍💻 Creators

### Hailey Campbell
- 

### Jeannette Ruiz
- Frontend development
- UI/UX design
- Core app architecture (React Native + Expo Router)
- State management and item system

### Mia Vasquez
- Front
