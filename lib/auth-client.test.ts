import test from 'node:test';
import assert from 'node:assert';
import { authClient } from './auth-client.js';

test('Auth client should be configured correctly', () => {
  assert.ok(authClient);
  assert.strictEqual(typeof authClient.signIn, 'function');
  assert.strictEqual(typeof authClient.signOut, 'function');
});
