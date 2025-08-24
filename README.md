# 📚 Library Management API

A sleek and modern **Library Management System** crafted with **Express**, **TypeScript**, and **MongoDB (Mongoose)**. Effortlessly manage books, track borrowing records, and generate insightful summaries of borrowed books.

---

## ✨ Key Features
- **Full CRUD** for managing books with ease
- **Borrowing System** with smart availability checks
- **Borrowed Books Summary** using powerful MongoDB aggregation
- **Advanced Querying** with filtering, sorting, and pagination
- **Mongoose-Powered** instance methods for book availability
- **Middleware Magic** for seamless borrow creation workflows

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB with Mongoose
- **API Testing:** Postman

---

## 📖 Data Models

### 📕 Book Model
| Field       | Type   | Validation/Description                                      |
|-------------|--------|------------------------------------------------------------|
| `title`     | String | Required                                                   |
| `author`    | String | Required                                                   |
| `genre`     | String | Required, one of: `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY` |
| `isbn`      | String | Required, unique                                           |
| `description` | String | Optional                                                 |
| `copies`    | Number | Required, non-negative                                     |
| `available` | Boolean | Defaults to `true`, auto-updated based on `copies`        |
| `createdAt` | Date   | Auto-generated                                            |
| `updatedAt` | Date   | Auto-generated                                            |

- **Instance Method:** `updateAvailability()` dynamically updates the `available` field based on `copies`.
- **Pre-save Middleware:** Ensures `available` is set to `true` if `copies > 0`.

### 📝 Borrow Model
| Field       | Type     | Validation/Description                              |
|-------------|----------|----------------------------------------------------|
| `book`      | ObjectId | Required, references a `Book`                      |
| `quantity`  | Number   | Required, positive integer                         |
| `dueDate`   | Date     | Required                                           |
| `createdAt` | Date     | Auto-generated                                    |
| `updatedAt` | Date     | Auto-generated                                    |

- **Post-save Middleware:** Logs borrow creation for tracking.

---

## 🚀 API Endpoints

### 📚 Books Endpoints

#### 1. Create a Book
**`POST /api/books`**

**Request Body:**
```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

#### 2. Get All Books
**`GET /api/books`**

**Query Parameters:**
- `filter`: Filter by genre (e.g., `FANTASY`)
- `sortBy`: Field to sort by (e.g., `createdAt`)
- `sort`: `asc` or `desc`
- `limit`: Number of results (default: `10`)

**Example:** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

**Response:**
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  ]
}
```

#### 3. Get Book by ID
**`GET /api/books/:bookId`**

**Response:**
```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

#### 4. Update Book
**`PUT /api/books/:bookId`**

**Request Body Example:**
```json
{
  "copies": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}
```

#### 5. Delete Book
**`DELETE /api/books/:bookId`**

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

### 📝 Borrow Endpoints

#### 6. Borrow a Book
**`POST /api/borrow`**

**Request Body Example:**
```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Business Logic:**
- Verifies sufficient book copies are available
- Deducts borrowed quantity from book copies
- Updates `available` field if `copies` reaches `0`
- Saves the borrow record

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

#### 7. Borrowed Books Summary
**`GET /api/borrow`**

**Purpose:** Aggregates borrowed books with total quantity per book.

**Response:**
```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## 🌟 here is the video link for api testing
- https://drive.google.com/drive/folders/19uJhQKMeUIiXV9FZ_z5bfn0cTr0NrHOp?usp=sharing