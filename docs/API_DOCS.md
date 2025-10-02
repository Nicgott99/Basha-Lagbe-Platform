# Basha Lagbe API Documentation

## Base URL
```
http://localhost:3000/server
```

## Authentication

Most endpoints require authentication via JWT token stored in cookies.

### Headers
```
Content-Type: application/json
Cookie: access_token=<your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "User created successfully. Please verify your email.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### Login User
Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

---

### Google OAuth
Authenticate with Google.

**Endpoint:** `POST /auth/google`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photo": "https://..."
}
```

---

### Logout
Clear authentication token.

**Endpoint:** `POST /auth/signout`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

### Forgot Password
Request password reset email.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

---

### Reset Password
Reset user password with token.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123!"
}
```

---

## 👤 User Endpoints

### Get User Profile
Get authenticated user's profile.

**Endpoint:** `GET /user/profile`

**Authentication:** Required

**Success Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "avatar": "https://...",
  "role": "user",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

### Update User
Update user information.

**Endpoint:** `PUT /user/update/:id`

**Authentication:** Required

**Request Body:**
```json
{
  "username": "johnupdated",
  "email": "johnupdated@example.com",
  "avatar": "https://...",
  "password": "NewPassword123!" // Optional
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johnupdated",
    "email": "johnupdated@example.com"
  }
}
```

---

### Delete User
Delete user account.

**Endpoint:** `DELETE /user/delete/:id`

**Authentication:** Required

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Get User Listings
Get all listings for a specific user.

**Endpoint:** `GET /user/listings/:id`

**Authentication:** Required

**Success Response:** `200 OK`
```json
{
  "success": true,
  "listings": [
    {
      "id": "listing_id",
      "name": "Beautiful 2BHK Apartment",
      "description": "...",
      "price": 25000,
      "images": ["url1", "url2"],
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🏠 Listing Endpoints

### Get All Listings
Retrieve all property listings with optional pagination.

**Endpoint:** `GET /listing`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sort` (optional): Sort field (default: createdAt)
- `order` (optional): Sort order (asc/desc, default: desc)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "listings": [
    {
      "id": "listing_id",
      "name": "Beautiful 2BHK Apartment",
      "description": "Spacious apartment in prime location",
      "address": "123 Main St, Dhaka",
      "regularPrice": 30000,
      "discountPrice": 25000,
      "bedrooms": 2,
      "bathrooms": 2,
      "furnished": true,
      "parking": true,
      "type": "rent",
      "offer": true,
      "imageUrls": ["url1", "url2", "url3"],
      "userRef": "user_id",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalListings": 50
  }
}
```

---

### Get Single Listing
Get detailed information about a specific listing.

**Endpoint:** `GET /listing/:id`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "listing": {
    "id": "listing_id",
    "name": "Beautiful 2BHK Apartment",
    "description": "Spacious apartment in prime location",
    "address": "123 Main St, Dhaka",
    "regularPrice": 30000,
    "discountPrice": 25000,
    "bedrooms": 2,
    "bathrooms": 2,
    "furnished": true,
    "parking": true,
    "type": "rent",
    "offer": true,
    "imageUrls": ["url1", "url2", "url3"],
    "userRef": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "https://..."
    },
    "reviews": [...],
    "averageRating": 4.5,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Create Listing
Create a new property listing.

**Endpoint:** `POST /listing/create`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Beautiful 2BHK Apartment",
  "description": "Spacious apartment in prime location",
  "address": "123 Main St, Dhaka",
  "regularPrice": 30000,
  "discountPrice": 25000,
  "bedrooms": 2,
  "bathrooms": 2,
  "furnished": true,
  "parking": true,
  "type": "rent",
  "offer": true,
  "imageUrls": ["url1", "url2", "url3"]
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Listing created successfully",
  "listing": {
    "id": "new_listing_id",
    "name": "Beautiful 2BHK Apartment",
    ...
  }
}
```

---

### Update Listing
Update an existing listing.

**Endpoint:** `PUT /listing/update/:id`

**Authentication:** Required (must be owner)

**Request Body:** Same as create listing

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Listing updated successfully",
  "listing": {...}
}
```

---

### Delete Listing
Delete a listing.

**Endpoint:** `DELETE /listing/delete/:id`

**Authentication:** Required (must be owner or admin)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

---

### Search Listings
Search listings with advanced filters.

**Endpoint:** `GET /listing/search`

**Query Parameters:**
- `searchTerm` (optional): Search in name and description
- `type` (optional): "rent" or "sale"
- `parking` (optional): true/false
- `furnished` (optional): true/false
- `offer` (optional): true/false
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `bedrooms` (optional): Number of bedrooms
- `bathrooms` (optional): Number of bathrooms
- `sort` (optional): Sort field
- `order` (optional): asc/desc
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:** `GET /listing/search?type=rent&bedrooms=2&minPrice=20000&maxPrice=30000`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "listings": [...],
  "pagination": {...}
}
```

---

## ⭐ Review Endpoints

### Get Listing Reviews
Get all reviews for a specific listing.

**Endpoint:** `GET /review/listing/:listingId`

**Success Response:** `200 OK`
```json
{
  "success": true,
  "reviews": [
    {
      "id": "review_id",
      "rating": 5,
      "comment": "Great place to live!",
      "user": {
        "id": "user_id",
        "username": "johndoe",
        "avatar": "https://..."
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 10
}
```

---

### Create Review
Create a review for a listing.

**Endpoint:** `POST /review/create`

**Authentication:** Required

**Request Body:**
```json
{
  "listingId": "listing_id",
  "rating": 5,
  "comment": "Great place to live!"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "id": "review_id",
    "rating": 5,
    "comment": "Great place to live!",
    ...
  }
}
```

---

### Update Review
Update an existing review.

**Endpoint:** `PUT /review/update/:id`

**Authentication:** Required (must be review author)

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review text"
}
```

---

### Delete Review
Delete a review.

**Endpoint:** `DELETE /review/delete/:id`

**Authentication:** Required (must be author or admin)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 👨‍💼 Admin Endpoints

### Get All Users
Get list of all users (Admin only).

**Endpoint:** `GET /admin/users`

**Authentication:** Required (Admin only)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Platform Statistics
Get platform analytics and statistics.

**Endpoint:** `GET /admin/stats`

**Authentication:** Required (Admin only)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1000,
    "totalListings": 500,
    "totalReviews": 250,
    "activeListings": 450,
    "newUsersThisMonth": 50,
    "newListingsThisMonth": 30
  }
}
```

---

### Update User Role
Update a user's role.

**Endpoint:** `PUT /admin/user/:id`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "role": "admin" // or "user"
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP address
- Exceeded limits return `429 Too Many Requests`

---

## Pagination

Endpoints that return lists support pagination:
- Default page size: 10 items
- Maximum page size: 100 items
- Use `page` and `limit` query parameters

Example: `GET /listing?page=2&limit=20`

---

## File Uploads

File uploads use multipart/form-data:
- Maximum file size: 5MB per image
- Supported formats: JPG, PNG, WEBP
- Maximum 6 images per listing

---

For more information or support, please contact the development team.
