# 🚀 World-Cart Mobile App - Backend API Specification

## 📌 Overview
This document outlines the API requirements for the **World-Cart Mobile App**. The backend will be developed using **.NET (ASP.NET Core)**. 

### 🛠 Technical Requirements
- **Framework**: .NET 8.0 / ASP.NET Core Web API
- **Database**: SQL Server (recommended)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: SMTP (Gmail) or SendGrid for account verification

---

## 🔐 1. Authentication & User Management

### 1.1 User Registration (Signup)
`POST /api/auth/register`
- **Purpose**: Creates a new user account and triggers a verification email.
- **Request Body**:
  ```json
  {
    "firstName": "String",
    "lastName": "String",
    "email": "String (unique)",
    "phone": "String (with country code, e.g., +923001234567)",
    "password": "String (min 8 chars)",
    "country": "String"
  }
  ```
- **Response**: `201 Created`
- **Action**: Backend must generate a unique verification token and send an email via Gmail API/SMTP.

### 1.2 Verify Email (Activation)
`POST /api/auth/verify-email`
- **Purpose**: Verifies the user's account using the token/code sent to their Gmail.
- **Request Body**:
  ```json
  {
    "email": "String",
    "token": "String"
  }
  ```
- **Response**: `200 OK` (Account activated successfully)
- **Note**: The user's account status must change from `Pending` to `Active`. Users cannot log in unless the account is `Active`.
6.  **Account Status Flow**:
    *   **Registration**: Status = `Pending`.
    *   **Login Attempt (Pending)**: Return `403 Forbidden` with `{ "message": "Please verify your email first" }`.
    *   **Verification**: Status = `Active`.
    *   **Login Attempt (Active)**: Successful login, return JWT token.

### 1.3 Resend Verification Email
`POST /api/auth/resend-verification`
- **Purpose**: Triggers the Gmail API again if the user didn't receive the first email.
- **Request Body**: `{ "email": "String" }`

### 1.4 Login (Post-Activation)
`POST /api/auth/login`
- **Purpose**: Authenticates the user and returns a JWT token.
- **Note**: Backend must reject login attempts if the account is not yet verified.
- **Request Body**:
  ```json
  {
    "email": "String",
    "password": "String"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "user": {
        "id": "Int/GUID",
        "firstName": "String",
        "lastName": "String",
        "email": "String",
        "isVerified": Boolean
    }
  }
  ```

### 1.4 Forgot Password
`POST /api/auth/forgot-password`
- **Purpose**: Sends a password reset link to the user's Gmail.

### 1.5 Deep Linking & Mobile Actions
- **Gmail Deep Link**: The Mobile App will use `googlegmail:///` (Android) and `message://` (iOS) to allow users to jump directly to their email client from the verification screen.
- **Verification URL**: The email sent to the user should contain a clear button with a link to the verification endpoint.

---

## 📦 2. Product Management

### 2.1 Get Categories
`GET /api/categories`
- **Purpose**: Fetch all product categories.
- **Response**: List of category objects (id, name, image, icon).

### 2.2 Get Products
`GET /api/products`
- **Purpose**: Fetch products with optional filtering.
- **Query Params**: `categoryId`, `search`, `sortBy`, `page`, `pageSize`.
- **Response**: List of product summaries.

### 2.3 Get Product Detail
`GET /api/products/{id}`
- **Purpose**: Fetch full details of a single product.
- **Response**: Full product object including descriptions, multiple images, reviews, etc.

---

## 🛒 3. Orders & Cart

### 3.1 Place Order
`POST /api/orders`
- **Purpose**: Save a new order after checkout.
- **Request Body**:
  ```json
  {
    "items": [
      { "productId": "Int", "quantity": "Int", "price": "Decimal" }
    ],
    "shippingAddress": {
      "fullName": "String",
      "address": "String",
      "city": "String",
      "zipCode": "String",
      "phone": "String"
    },
    "paymentMethod": "String",
    "totalAmount": "Decimal"
  }
  ```

### 3.2 Get My Orders
`GET /api/orders`
- **Purpose**: List of all orders for the logged-in user.

### 3.3 Order Tracking
`GET /api/orders/{id}/track`
- **Purpose**: Real-time status of the order (Pending, Shipped, Delivered).

---

## 👤 4. User Profile & Account Settings

### 4.1 Get Profile
`GET /api/profile`
- **Purpose**: Fetch current user information including profile picture URL.

### 4.2 Update Profile
`PUT /api/profile`
- **Purpose**: Update user's personal details (First Name, Last Name, Phone, Country).

### 4.3 Profile Picture Management
- **Upload/Change**: `POST /api/profile/image` (Multipart/form-data)
- **Remove**: `DELETE /api/profile/image` (Resets to default avatar)

### 4.4 Change Password
`POST /api/auth/change-password`
- **Request Body**: `{ "oldPassword": "String", "newPassword": "String" }`

---

## 📍 5. Address & Payment Management

### 5.1 Address Book
- `GET /api/addresses`: Get all saved addresses.
- `POST /api/addresses`: Add new address.
- `PUT /api/addresses/{id}`: Edit existing address.
- `DELETE /api/addresses/{id}`: Remove address.

### 5.2 Payment Methods
- `GET /api/payments`: Get saved payment methods (Cards/Wallets).
- `POST /api/payments`: Save a new payment method/token.
- `DELETE /api/payments/{id}`: Remove payment method.

---

## ⭐️ 6. Advanced Features

### 5.1 Wishlist / Favorites
- `GET /api/wishlist`: Get user's saved items.
- `POST /api/wishlist`: Add item to wishlist.
- `DELETE /api/wishlist/{productId}`: Remove item.

### 5.2 Product Reviews & Ratings
- `GET /api/products/{id}/reviews`: Get all reviews for a product.
- `POST /api/products/{id}/reviews`: Add a new review (Rating 1-5, Comment).

### 5.3 Push Notifications
- `POST /api/notifications/register-token`: Register the device's FCM/Expo token for push notifications (Order updates, Promos).

### 5.4 Cart Synchronization
- `GET /api/cart`: Get the persisted cart for the user.
- `POST /api/cart`: Sync the local cart with the backend database.

---

## 🛠 7. Admin & Seller Management

### 6.1 Seller Applications
- `GET /api/admin/applications`: List all pending seller registration requests.
- `POST /api/admin/applications/{id}/approve`: Approve a seller and generate credentials.
- `POST /api/admin/applications/{id}/reject`: Reject a seller application.

### 6.2 Inventory Management (For Sellers)
- `POST /api/seller/products`: Add a new product to the marketplace.
- `PUT /api/seller/products/{id}`: Edit product details/stock.
- `DELETE /api/seller/products/{id}`: Remove a product.

### 6.3 Analytics
- `GET /api/admin/stats`: Get total users, total orders, and revenue stats for the dashboard.

---

## ⚠️ Important Implementation Notes

1.  **Hardcoded Features (Frontend Control)**:
    *   **Banners**: The Home Screen banners and promotional slides will be managed directly in the Mobile App code for performance and high-end animations.
    *   **Discover Section**: The discovery layout and its static logic will remain hardcoded in React Native.
    *   **Settings Pages**: UI-heavy settings screens will use hardcoded content where applicable.

2.  **Gmail Verification Flow**:
    *   When a user signs up, their `status` in the DB should be `Inactive`.
    *   The .Net backend should use `FluentEmail` or standard `SmtpClient` to send a professional HTML email.
    *   The user cannot Login or Place Orders until `isVerified` is `true`.

3.  **Security**:
    *   Passwords must be hashed using **BCrypt** or **Argon2** (never store plain text).
    *   All protected endpoints must require the `Authorization: Bearer <token>` header.

4.  **Error Handling & Empty States**:
    *   **Empty Arrays**: If a user has no Orders, Wishlist, or Addresses, the API should return an empty array `[]` with a `200 OK` status. This allows the Frontend to trigger the "3D Popup/Empty State" UI.
    *   **Consistent Errors**: Return messages like `{ "message": "Email already exists" }` for clear UI feedback.

5.  **Data Integrity**:
    *   All user profile data (Name, Email, Phone, Address) must be stored exactly as provided by the user in the SQL Database for professional record-keeping.
