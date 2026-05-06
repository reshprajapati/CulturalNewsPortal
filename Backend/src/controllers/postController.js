const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create a new post (Admin only)
exports.createPost = async (req, res) => {
  try {
    // Check if user is admin
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create posts' });
    }

    const { title, content, category } = req.body;

    const post = new Post({
      title,
      content,
      category,
      author: req.userId,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await post.save();
    await post.populate('author', 'name email');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all posts sorted by category (SIMPLEST ALGORITHM: sort by category)
exports.getAllPosts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = { status: 'published' };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Simple sorting algorithm: Sort by category, then by date
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('comments')
      .sort({ category: 1, createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name email' }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, req.body);
    post.updatedAt = Date.now();
    await post.save();

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.userId)) {
      post.likes.push(req.userId);
      await post.save();
    }

    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text, rating } = req.body;

    const comment = new Comment({
      text,
      rating,
      author: req.userId,
      post: req.params.id
    });

    await comment.save();
    await comment.populate('author', 'name email');

    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
