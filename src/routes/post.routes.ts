import { Router } from 'express';
import { PostService } from '../services/post.service';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware, hasPermission } from '../middlewares/auth.middleware';
import { createPostSchema, updatePostSchema } from '../schemas/post.schema';
import { AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const postService = new PostService();

router.get('/', async (req, res) => {
  const posts = await postService.findPosts(req.query);
  res.json(posts);
});

router.post('/',
  authMiddleware,
  validate(createPostSchema),
  async (req: AuthRequest, res) => {
    const post = await postService.createPost({
      ...req.body,
      authorId: req.user.userId
    });
    res.json(post);
});

/**
 * PUT /post/{id}
 * @summary Update post
 * @tags Posts
 * @security BearerAuth
 */
router.put('/:id',
  authMiddleware,
  validate(updatePostSchema),
  async (req, res) => {
    const post = await postService.updatePost(parseInt(req.params.id), req.body);
    res.json(post);
});

router.delete('/:id',
  authMiddleware,
  async (req, res) => {
    await postService.deletePost(parseInt(req.params.id));
    res.json({ message: 'Post deleted successfully' });
});

router.get('/:id', async (req, res) => {
  const post = await postService.findPostById(parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});


router.put('/:id/publish',
  authMiddleware,
  async (req, res) => {
    const post = await postService.publishPost(parseInt(req.params.id));
    res.json(post);
});

router.put('/:id/unpublish',
  authMiddleware,
  async (req, res) => {
    const post = await postService.unpublishPost(parseInt(req.params.id));
    res.json(post);
});

export default router;
