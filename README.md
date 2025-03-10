# 🧾 Inventory Management System

## 📌 Project Overview

The **Inventory Management System** is a role-based backend application designed to help organizations manage stock efficiently. It provides secure and structured functionality for tracking products, categories, and stock levels with real-time inventory logs.

Built with scalability and accountability in mind, the system supports two roles:

- **Admin** – full access to users, categories, and inventory
- **Staff** – limited to managing product stock and viewing data

Key features include:

- Product CRUD operations
- Category & subcategory classification
- Automatic inventory logging for stock actions (add, remove, update)
- Role-based access control (RBAC)
- Slug-based and ID-based route access
- Low-stock threshold monitoring

The system is suitable for use in **warehouses, medical stores, retail shops, and internal inventory tracking**.

---

## 🚀 Tech Stack

- **Node.js / Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **RBAC Middleware**
- **RESTful API Design**

---

This API supports inventory tracking, product categorization, and role-based access for **Admin** and **Staff** users.

---

## 👤 Authentication

### `POST /login`

- **Description**: Authenticate user and return JWT token.
- **Access**: Public

---

## 👥 User Management (Admin Only)

### `GET /users`

- Get all users

### `GET /users/:id`

- Get a specific user

### `PUT /users/:id`

- Update user role/details

### `DELETE /users/:id`

- Delete a user

---

## 🙍‍♂️ Profile (Staff & Admin)

### `GET /profile`

- View logged-in user's profile

### `PUT /profile`

- Update logged-in user's profile

---

## 🛒 Product Management (Staff & Admin)

### `POST /products`

- Add a new product

### `GET /products`

- Get all products

### `GET /products/:id`

- Get product by ID

### `GET /products/slug/:slug`

- Get product by slug

### `PUT /products/:id`

- Update product info

### `DELETE /products/:id` _(Admin Only)_

- Delete a product

---

## 📁 Category Management

### Admin Only

#### `POST /categories`

- Create a new category

#### `PUT /categories/:id`

- Update a category

#### `DELETE /categories/:id`

- Delete a category

### Staff & Admin

#### `GET /categories`

- Get all categories

#### `GET /categories/:id`

- Get category by ID

#### `GET /categories/slug/:slug`

- Get category by slug

---

## 🗂️ Subcategory Management

### Admin Only

#### `POST /subcategories`

- Create a subcategory

#### `PUT /subcategories/:id`

- Update a subcategory

#### `DELETE /subcategories/:id`

- Delete a subcategory

### Staff & Admin

#### `GET /subcategories`

- Get all subcategories

#### `GET /subcategories/:id`

- Get subcategory by ID

#### `GET /subcategories/slug/:slug`

- Get subcategory by slug

---

## 📦 Inventory Logs (Staff & Admin)

### `POST /inventory-logs`

- Create inventory log (when product stock is changed)

### `GET /inventory-logs`

- Get all logs (filterable by product, user, date)

### `GET /inventory-logs/:id`

- Get a specific inventory log by ID

---

## 📎 Notes

- All endpoints are protected and require JWT.
- Actions are logged via Inventory Logs when stock is changed.
- Products have a `lowStockThreshold` field to monitor minimum quantity.
- Use pagination and filtering where supported.

---
