import { Hono } from "hono";
import type { Env } from './core-utils';
import { TransactionEntity } from "./entities";
import { ok, bad } from './core-utils';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
const transactionSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['income', 'expense']),
    category: z.string().min(1, 'Category is required'),
    date: z.string().datetime('Invalid date format'),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // TRANSACTIONS
  app.get('/api/transactions', async (c) => {
    const cursor = c.req.query('cursor');
    const page = await TransactionEntity.list(c.env, cursor);
    // Sort by date descending
    page.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return ok(c, page);
  });
  app.post(
    '/api/transactions',
    zValidator('json', transactionSchema),
    async (c) => {
      const newTransactionData = c.req.valid('json');
      const transaction = {
        ...newTransactionData,
        id: `txn_${crypto.randomUUID()}`,
      };
      const created = await TransactionEntity.create(c.env, transaction);
      return ok(c, created);
    }
  );
}