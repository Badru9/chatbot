import test from 'node:test';
import assert from 'node:assert';
import { useSession, useLogin, useLogout } from './auth-client.js';

test('Auth hooks exist and are functions', () => {
  assert.strictEqual(typeof useSession, 'function');
  assert.strictEqual(typeof useLogin, 'function');
  assert.strictEqual(typeof useLogout, 'function');
});
