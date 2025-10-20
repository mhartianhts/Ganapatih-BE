import { Router } from 'express';

import { follow, unfollow } from '../controllers/followController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @openapi
 * /api/follow/{userid}:
 *   post:
 *     summary: Follow user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Follows
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Follow success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: you are now following user 2
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/follow/:userid', authenticate, follow);

/**
 * @openapi
 * /api/follow/{userid}:
 *   delete:
 *     summary: Unfollow user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Follows
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unfollow success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: you unfollowed user 2
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.delete('/follow/:userid', authenticate, unfollow);

export default router;

