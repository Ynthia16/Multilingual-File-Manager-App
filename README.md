# Multi-User File Manager Application
## Project Overview
This project is a backend file manager application built with Node.js, Express.js, MongoDB, Redis, and Jest. It provides a system where multiple users can manage files in a collaborative workspace. Users can create, read, update, and delete files while managing their accounts securely. The application also supports multilingual functionality and handles asynchronous tasks efficiently using Redis.

## Technologies Used
Node.js: Backend runtime environment.
Express.js: Framework for building RESTful APIs.
MongoDB: NoSQL database for storing user data, file metadata, and other entities.
Redis: For queuing tasks like file uploads asynchronously.
bcrypt: Used for password hashing.
JWT: For user authentication and session management.
i18next: Internationalization support for multiple languages.
Multer: Middleware for handling file uploads.
Jest: Testing framework for unit and integration tests.
Swagger: For API testing and documentation.

## Features Implemented
### 1. User Management
Registration and Login: Users can securely register with their email and password. Passwords are hashed using bcrypt.
JWT Authentication: Upon login, users receive a JWT token to authenticate their requests.
### 2. File Management
File CRUD Operations: Users can upload, view, update, and delete files from their directories. The file metadata (e.g., filename, upload date) is stored in the MongoDB database.
File Upload: Used Multer to handle file uploads, allowing users to send files through POST requests.
### 3. Multilingual Support (i18n)
The application supports multiple languages through the integration of the i18next library. Users can select their preferred language, and the UI will change accordingly.
### 4. Asynchronous Task Management
Redis Queuing: Redis is utilized to queue tasks like file uploads and other time-consuming processes. We’ve implemented task handling for asynchronous operations, ensuring better scalability and performance.
### 5. Unit Testing
Jest: Comprehensive tests have been written to verify core functionalities such as user registration, login, file management, and Redis queue handling.
Test Coverage: The test suite includes both unit and integration tests to ensure all components of the application are working as expected.

## Project Setup
## Prerequisites
Node.js: Ensure Node.js and npm are installed.
MongoDB: Local or cloud MongoDB instance.
Redis: Local or cloud Redis server.
### Install Dependencies
Clone the repository and install the required dependencies:

``` git clone https://github.com/Ynthia16/Multilingual-File-Manager-App.git ```
``` cd file-manager ```
``` npm install ```

### Environment Configuration
Create a .env file in the root directory with the following environment variables:

``` MONGO_URI=mongodb://localhost:27017/file-manager```
```JWT_SECRET=your-jwt-secret```
```PORT=5000```
```REDIS_URL=redis://localhost:6379```

### Running the Application
Start the server with:
``` npm start ```

The server will run on http://localhost:5000.

### Running Tests
Run unit tests with Jest:
``` npm test ```
## API Endpoints
### 1. User Authentication

POST /api/users/register: Register a new use

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

POST /api/users/login: Log in a user and receive a JWT token.

{
  "email": "user@example.com",
  "password": "securepassword"
}

### 2. File Management
POST /api/users/upload-profile-image: Upload a file.

GET /api/users/files: Get file details by ID.
GET /api/users/files/{fileId}: Get all files.
DELETE /api/users/files/:id: Delete a file by ID.

## Testing
The project uses Jest for testing core functionalities. It includes tests for:

User Authentication: Verifies correct registration, login, and JWT token generation.
File Management: Ensures that file uploads and CRUD operations work as expected.
Redis Queuing: Tests asynchronous task handling with Redis.

To run the tests:


``` npm test```

## Challenges Faced
#### Asynchronous Task Handling with Redis: 
One of the key challenges was implementing the queuing system with Redis. Initially, managing the queuing of file uploads and background tasks asynchronously proved tricky. Handling large file uploads and ensuring tasks are queued and processed correctly without causing delays in other operations required fine-tuning. Redis helped manage these tasks efficiently, but understanding how to properly configure the queue with Bull and ensure tasks were processed in the correct order took time and careful testing.

#### i18n Integration:
 Setting up multilingual support using i18next was another challenge. We had to ensure that language preferences were correctly stored and applied for each user. Configuring the translation files for different languages and making sure the UI reflected the correct translations in real-time was a bit complex, but ultimately, the setup provided a smooth user experience across different languages.

#### File Upload Management:
 Handling file uploads with Multer while maintaining proper metadata in the database was challenging at first. Managing the size and types of files, along with ensuring a clean, organized structure for file storage, required careful attention. We also had to handle errors and edge cases like file size limits, file type restrictions, and concurrent file uploads, which were tricky to implement initially.

#### Queueing System:
 Another challenge in queueing was dealing with task completion and failure scenarios. For instance, if a task failed, we needed to ensure it was properly retried or logged. The asynchronous nature of the tasks also made it harder to track progress and ensure task completion in a way that wouldn't block or interrupt other processes.

## Future Improvements
File Versioning: Adding a versioning system to track changes made to files.
Search Functionality: Implement a search feature to find files by name or category.
Cloud Storage: Integrating with a cloud storage provider such as AWS S3 or Google Cloud Storage for better file management and scalability.