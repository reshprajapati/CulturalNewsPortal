# Culture News Portal - 8th Semester Project

A full-stack MERN application for sharing culture news posts and festivals with categorization and search functionality.

## Features

✨ **Core Features:**
- User authentication (Register/Login)
- Create and publish culture posts
- Festival and event management
- Search and filter by category
- Comments and ratings on posts
- Like posts functionality
- View count tracking
- Admin dashboard capabilities

🎭 **Content Categories:**
- Dance
- Music
- Art
- Food
- Literature
- Heritage
- Sports

🎉 **Festival Types:**
- Religious
- Seasonal
- National
- Regional
- Cultural
- Social

## Technology Stack

**Backend:**
- Node.js + Express.js
- MongoDB (NoSQL Database)
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- CSS3 for styling

## Project Structure

```
newsportal/
├── Backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   └── server.js        # Main server file
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API service calls
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main app component
│   │   └── index.js         # React entry point
│   ├── public/
│   └── package.json
```

## Installation & Setup

### Backend Setup

1. Navigate to Backend folder:
```bash
cd Backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
MONGO_URI=mongodb://localhost:27017/culture-news-portal
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

3. Make sure MongoDB is running locally or update MONGO_URI with your connection string

4. Start the backend:
```bash
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to Frontend folder:
```bash
cd Frontend
npm install
```

2. Start the frontend:
```bash
npm start
```

Frontend will open on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)

### Posts
- `GET /api/posts` - Get all posts (supports category & search filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (requires authentication)
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Add comment with rating

### Festivals
- `GET /api/festivals` - Get all festivals (sorted by category & type)
- `GET /api/festivals/by-category` - Get festivals grouped by category
- `GET /api/festivals/:id` - Get single festival
- `POST /api/festivals` - Create festival (requires authentication)
- `PUT /api/festivals/:id` - Update festival
- `DELETE /api/festivals/:id` - Delete festival

## Algorithm Used

**Simplest Sorting Algorithm: Category-Based Sorting**

The portal uses a simple multi-level sorting approach:

1. **Posts**: Sorted by `category` (A-Z), then by `createdAt` (newest first)
2. **Festivals**: Sorted by `category` (A-Z), then by `festivalType`, then by `startDate`

This approach:
- ✅ Easy to understand and maintain
- ✅ Efficient with MongoDB indexes
- ✅ Provides organized content grouping
- ✅ Improves user experience through categorization

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  profileImage: String,
  createdAt: Date
}
```

### Post
```javascript
{
  title: String,
  content: String,
  author: ObjectId (ref: User),
  category: String,
  views: Number,
  likes: [ObjectId],
  comments: [ObjectId],
  status: String (draft/published),
  createdAt: Date
}
```

### Festival
```javascript
{
  name: String,
  description: String,
  festivalType: String,
  location: String,
  startDate: Date,
  endDate: Date,
  category: String,
  traditions: [String],
  views: Number,
  createdAt: Date
}
```

### Comment
```javascript
{
  text: String,
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  rating: Number (1-5),
  createdAt: Date
}
```

## Usage Guide

### For Users

1. **Register/Login**: Create an account to post and contribute
2. **Browse Posts**: View all culture posts filtered by category
3. **Create Post**: Write and publish your own culture post
4. **View Festivals**: Explore upcoming festivals and events
5. **Add Festival**: Create a new festival entry with details
6. **Interact**: Like posts and add comments with ratings

### For Admin

- Approve/reject posts
- Manage festivals
- User management
- Content moderation

## Future Enhancements

- Image upload for posts and festivals
- Email notifications
- Social sharing features
- Advanced search and filters
- User following system
- Recommendation engine
- Mobile app development

## License

This project is created for educational purposes as an 8th semester project.

---

**Created by:** [Your Name]
**Course:** [Course Name]
**Institution:** [Institution Name]
**Date:** May 2026
