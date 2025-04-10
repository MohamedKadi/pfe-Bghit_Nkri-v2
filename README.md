# Rental Housing Platform API

A Node.js backend API for a rental housing platform that enables users to list properties, search for rentals, leave reviews, and manage their accounts. The platform includes an administrative system for content moderation and user management.

## Features

- **User Authentication**
  - Registration and login with JWT-based authentication
  - Password reset functionality
  - Email verification system
  - Profile management (update profile picture, name, email, password)

- **Property Listings**
  - Create, read, update property listings
  - Support for various property details (bedrooms, bathrooms, amenities, etc.)
  - Image upload with Cloudinary integration
  - Filtering and search functionality

- **Admin Dashboard**
  - Content moderation system for property listings
  - User management capabilities
  - Role-based access control

- **Reviews System**
  - Allow users to review properties
  - Rating system with comments

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer** - Email service

## Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd rental-housing-platform
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3334
   DATABASE_URL=<your-mongodb-connection-string>
   SECRET_KEY=<your-jwt-secret-key>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

4. Start the server
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `GET /api/v1/auth/reset-password` - Reset password with token
- `POST /api/v1/auth/update-email` - Request email change
- `GET /api/v1/auth/emailVerification` - Verify email with token
- `POST /api/v1/auth/updatePassword` - Update password
- `PUT /api/v1/auth/update-profile` - Update profile details
- `GET /api/v1/auth/checkAuth` - Check authentication status

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `DELETE /api/v1/users/:id` - Delete user

### Posts (Property Listings)

- `GET /api/v1/posts` - Get all published posts with optional filters
- `POST /api/v1/posts` - Create a new post
- `GET /api/v1/posts/:id` - Get post by ID
- `PATCH /api/v1/posts/:id` - Update post
- `GET /api/v1/posts/user/:id` - Get all posts by a specific user

### Admin

- `GET /api/v1/admin/posts` - Get all pending posts
- `POST /api/v1/admin/status-post/:id` - Change post status
- `POST /api/v1/admin/status-user/:id` - Change user status

## Data Models

### User

- name
- email
- password
- phoneNumber
- isVerified
- profilePic
- dateCreated
- status (active/banned)
- role (user/admin)
- posts (references to Post)

### Post

- title
- description
- location
- price
- imageUrls
- availability
- house_type (villa/apartment)
- maxPersons
- bedrooms
- bathrooms
- furnished
- amenities
- status (draft/published/archived/pending_approval/rejected)
- contact_info
- dateCreated
- createdBy (reference to User)
- Reviews (references to Review)

### Review

- rating (1-5)
- comment
- dateCreated
- userId (reference to User)

## Error Handling

The API includes a centralized error handling system that formats errors consistently and handles common issues like:
- Validation errors
- Duplicate emails
- Authentication failures
- Not found errors

## Security Measures

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Email verification
- Input validation
