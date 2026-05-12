# 🥗 Freshli

Freshli is a React Native mobile app built with Expo that helps users manage household food, reduce waste, and simplify meal planning through inventory tracking, expiration awareness, recipe discovery, and grocery list management.

---

## 🚀 Features

### 📦 Item Management (CRUD)
- Add, edit, and delete food items
- Track quantity, category, storage location, and expiration date
- Data persists using Supabase backend

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
- Visual indicators help prioritize food usage
  - Orange → Expiring soon
  - Red → Expired

### 📊 Dashboard Overview
- Total inventory count
- Expiring soon count
- Expired count
- Storage summaries

### 🍽️ Recipe Discovery
- Fetch recipes using the Spoonacular API
- Pantry-based recipe suggestions
- Expiring-item prioritization
- Dietary filtering based on user profile
- Recipe detail view (ingredients, instructions, metadata)

### ⭐ Recipe Saving & Collections
- Save and unsave recipes
- Organize recipes into collections
- Persist saved recipes in database

### 🛒 Grocery List System
- Add, delete, and check off items
- Auto-generated suggestions from expired or consumed items
- Category-based organization

### 📷 Barcode Scanning
- Scan food items using device camera
- Retrieve product data via Open Food Facts API
- Prefill item details for faster entry

### 👤 User Profiles & Personalization
- Authentication using Supabase
- Onboarding flow (diet, intolerances, household size)
- Profile-based recipe filtering

---

## 🛠️ Tech Stack

### Frontend
- React Native (Expo)
- Expo Router (file-based navigation)
- TypeScript
- Custom component-based UI system

### State Management
- React Context:
  - FoodItemsContext
  - GroceryListContext
  - RecipeCollectionsContext
  - AddItemDraftContext

### Backend
- Supabase:
  - Authentication
  - PostgreSQL database
  - Storage (profile images)

### APIs
- Spoonacular API (recipe data)
- Open Food Facts API (barcode lookup)

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

## 📱 Demo Flow

1. Sign up / log in
2. Complete onboarding
3. Add or scan a food item
4. View expiration indicators
5. Browse recipes from pantry
6. Save recipes
7. Manage grocery list

---

## ⚠️ Known Limitations
- Spoonacular API may hit quota limits
- Barcode results depend on Open Food Facts database
- No offline support for API features
- No grocery ordering or payments
- No AI-generated recipes

---

## 🎯 Project Goal

Freshli helps users:
- Reduce food waste
- Stay organized
- Make better meal decisions using what they already have

---

## 👩‍💻 Creators

### Hailey Campbell
- Project Manager
- Led project coordination and ensured completion of all sprint deliverables
- Managed in-class assignments and kept the team aligned with course requirements and deadlines
- Created and maintained all project documentation
- Developed system diagrams and visual documentation (use case diagrams, activity diagrams, ER diagrams)

### Jeannette Ruiz
- UI/UX design in Figma
- Implemented React Native frontend
- Built reusable component system
- Implemented state management using React Context
- Integrated Supabase (auth, database, storage)
- Implemented API integrations (Spoonacular, Open Food Facts)
- Developed core features:
  - User onboarding
  - Inventory system
  - Expiration tracking
  - Recipe discovery
  - Grocery list system

### Mia Vasquez
- Contributed to project discussions during early development stages
