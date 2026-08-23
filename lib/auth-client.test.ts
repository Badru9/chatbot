import test from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
try {
  const resolved = require.resolve('server-only');
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: {},
  } as any;
} catch {}

test('Auth hooks exist and are functions', async () => {
  const { useSession, useLogin, useLogout } = await import('./auth-client.js');
  assert.strictEqual(typeof useSession, 'function');
  assert.strictEqual(typeof useLogin, 'function');
  assert.strictEqual(typeof useLogout, 'function');
});
