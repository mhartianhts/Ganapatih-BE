import { Router } from 'express';

import { search } from '../controllers/userController.js';

const router = Router();

/**
 * @openapi
 * /api/users/search:
 *   get:
 *     summary: Search users by username
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Keyword pencarian (case-insensitive).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Daftar pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 */
router.get('/users/search', search);

export default router;

