# BookHaven Admin - Bookstore & User Registry System

BookHaven Admin is a modern, high-performance web application designed to manage a bookstore inventory, register user profiles, and establish book ownership relationships. It consists of a robust Spring Boot backend powered by MongoDB and a gorgeous, self-contained single-page application (SPA) frontend built using Vanilla HTML5, CSS3, and JavaScript featuring a premium glassmorphic dark theme.

---

## 🚀 Key Features

* **Real-time Dashboard Analytics**: Displays live summary counts of total books, registered users, and active book-user associations.
* **Complete Book Catalog**:
  * Paginated, sorted, and live-search filtered books layout.
  * Modals to add and edit book details (Title, Author, Price, ISBN, Published Date).
  * Validations matching API constraints (e.g. unique ISBN, positive prices, dates in past/present).
  * Soft and quick deletions with instant catalog refresh.
* **User Directory**:
  * Paginated overview cards displaying names, emails, and a live counter of books they own.
  * Form modal for registering brand new user profiles.
* **Interactive Book Allocations**:
  * Dropdown selector forms to establish cross-model ownership mapping user profiles directly to specific books (`PUT /api/v1/users/{userId}/books/{bookId}`).
* **Responsive Fluid Design**: Fully responsive interface optimized for desktop, tablet, and mobile views.
* **Swagger API Interface**: Dynamic endpoints interactive UI for quick testing.

---

## 🛠️ Technology Stack

* **Backend**: Spring Boot 3.5.x, Spring MVC, Spring Data MongoDB, Lombok, Hibernate Validator.
* **Database**: MongoDB (Atlas or Local Cluster).
* **Documentation**: Springdoc OpenAPI (Swagger UI).
* **Frontend**: Vanilla HTML5, CSS3 (Custom Variables, Flexbox/Grid, Backdrop Filters, Keyframe Animations), ES6+ JavaScript.

---

## 📁 Directory Structure

```text
bookstore-api/
├── .env                              # Environment variables (MongoDB config)
├── pom.xml                           # Maven dependencies & plugins
├── README.md                         # Project documentation
├── src/
│   ├── main/
│   │   ├── java/com/bookstore/api/
│   │   │   ├── ApiApplication.java   # Spring Boot entry point
│   │   │   ├── config/
│   │   │   │   └── WebConfig.java    # CORS configuration mapping
│   │   │   ├── controller/
│   │   │   │   ├── BookController.java
│   │   │   │   └── UserController.java
│   │   │   ├── model/
│   │   │   │   ├── Book.java
│   │   │   │   └── User.java
│   │   │   ├── dto/                  # Request/Response data transfers
│   │   │   └── service/              # Core business layers
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/               # Frontend Assets (Served automatically)
│   │           ├── index.html        # App Dashboard Structure
│   │           ├── css/
│   │           │   └── styles.css    # Dark Glassmorphism Styling
│   │           └── js/
│   │               └── app.js        # REST client & UI transitions
```

---

## ⚙️ Getting Started

### 1. Prerequisites
* **Java Development Kit (JDK)**: Version 17 or higher.
* **Maven**: (Maven wrapper `mvnw` is included in the project root).
* **MongoDB**: A running local MongoDB database instance or a MongoDB Atlas Cloud Cluster.

### 2. Database Environment Setup
Create a `.env` file in the root directory (or edit the existing one) and configure your MongoDB connection URI:
```properties
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bookstore?retryWrites=true&w=majority
```

### 3. Run the Application
From the project root directory, run the Maven wrapper command in your terminal:
```cmd
# Windows PowerShell / Command Prompt
.\mvnw spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

Once started, the application will boot up at `http://localhost:8080/`.

---

## 🖥️ Accessing the Application

* **Frontend Dashboard UI**: Open your browser and navigate to:
  👉 **[http://localhost:8080/](http://localhost:8080/)**
* **Interactive API Swagger UI**: View and execute raw API calls directly at:
  👉 **[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

---

## 🔌 API Endpoints Summary

### 📖 Books API (`/api/v1/books`)

| Method | Endpoint | Description | Request Body / Params |
|:---|:---|:---|:---|
| **POST** | `/api/v1/books` | Create a new book | `BookRequestDTO` (JSON) |
| **GET** | `/api/v1/books` | Get paginated books | Query params: `page`, `size`, `sortBy`, `title` |
| **GET** | `/api/v1/books/{id}` | Get book details by ID | None |
| **PUT** | `/api/v1/books/{id}` | Update book details | `BookRequestDTO` (JSON) |
| **DELETE** | `/api/v1/books/{id}` | Delete book by ID | None |

#### Book Request JSON DTO Sample:
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 42.50,
  "isbn": "9780132350884",
  "publishedDate": "2008-08-01"
}
```

---

### 👤 Users API (`/api/v1/users`)

| Method | Endpoint | Description | Request Body / Params |
|:---|:---|:---|:---|
| **POST** | `/api/v1/users` | Register a new User | `UserRequestDTO` (JSON) |
| **GET** | `/api/v1/users` | Get paginated users directory | Query params: `page`, `size` |
| **PUT** | `/api/v1/users/{userId}/books/{bookId}` | Link/Associate a book to a user | None |

#### User Request JSON DTO Sample:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

---

## 🔒 Verification & Validations

1. **Backend Validation Exceptions**: The REST endpoints trigger validation checks (`@Valid`) and return descriptive error payloads if inputs fail validation rules. The frontend detects these errors (e.g. `title cannot be blank`, `invalid email format`) and binds them directly to the offending inputs under the form.
2. **CORS Handling**: Cross-Origin Resource Sharing is enabled on all `/api/**` paths allowing third-party tools (like Postman/curl) or separate dev servers to access endpoints without blocking policies.
