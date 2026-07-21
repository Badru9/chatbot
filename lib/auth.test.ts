import test from 'node:test';
import assert from 'node:assert';
import { LoginSchema } from './schemas/auth.js';

test('LoginSchema validates valid inputs correctly', () => {
  const result = LoginSchema.safeParse({
    email: 'admin@mb.ai',
    password: 'password123',
  });
  assert.strictEqual(result.success, true);
});

test('LoginSchema rejects invalid email', () => {
  const result = LoginSchema.safeParse({
    email: 'not-an-email',
    password: 'password123',
  });
  assert.strictEqual(result.success, false);
});
