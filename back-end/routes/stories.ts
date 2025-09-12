import express, { Request, Response } from 'express';
import pool from '../database/db';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        s.id,
        s."previewImageUrl",
        s."createdAt",
        COALESCE(
          json_agg(
            json_build_object(
              'id', si.id,
              'storyId', si."storyId",
              'sourceUrl', si."sourceUrl",
              'createdAt', si."createdAt"
            )
            ORDER BY si.id
          ) FILTER (WHERE si.id IS NOT NULL),
          '[]'
        ) AS items
      FROM "Story" s
      LEFT JOIN "StoryItem" si ON si."storyId" = s.id
      GROUP BY s.id
      ORDER BY s.id;
    `);

    res.json(rows);
  } catch (e) {
    console.error('Failed to fetch stories:', e);
    res.status(500).json({ message: 'Failed to fetch stories' });
  }
});

export default router;