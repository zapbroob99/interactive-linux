import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCommandToDirectoryState,
  createDirectoryState,
  isTaskComplete,
  normalizePath,
} from './taskValidation.js';

test('normalizePath resolves absolute, relative, parent, current, and home paths', () => {
  assert.equal(normalizePath('/usr/bin', '/'), '/usr/bin');
  assert.equal(normalizePath('../usr', '/sys'), '/usr');
  assert.equal(normalizePath('./bin', '/usr'), '/usr/bin');
  assert.equal(normalizePath('..', '/usr/bin'), '/usr');
  assert.equal(normalizePath('~', '/var/log'), '/root');
  assert.equal(normalizePath('~/chapter2-filenames', '/var/log'), '/root/chapter2-filenames');
  assert.equal(normalizePath('../../..', '/usr/bin'), '/');
});

test('applyCommandToDirectoryState tracks cd targets without caring about exact command text', () => {
  let state = createDirectoryState('/');
  state = applyCommandToDirectoryState('cd /usr', state);
  assert.deepEqual(state, { cwd: '/usr', previousCwd: '/' });

  state = applyCommandToDirectoryState('cd ./bin', state);
  assert.deepEqual(state, { cwd: '/usr/bin', previousCwd: '/usr' });

  state = applyCommandToDirectoryState('cd ..', state);
  assert.deepEqual(state, { cwd: '/usr', previousCwd: '/usr/bin' });
});

test('applyCommandToDirectoryState accepts equivalent navigation paths', () => {
  const fromSys = createDirectoryState('/sys');
  assert.equal(applyCommandToDirectoryState('cd ../usr', fromSys).cwd, '/usr');

  const fromRoot = createDirectoryState('/');
  assert.equal(applyCommandToDirectoryState('cd ./usr', fromRoot).cwd, '/usr');
});

test('applyCommandToDirectoryState supports cd, cd ~, and cd -', () => {
  let state = createDirectoryState('/var/log', '/usr/bin');
  state = applyCommandToDirectoryState('cd', state);
  assert.deepEqual(state, { cwd: '/root', previousCwd: '/var/log' });

  state = applyCommandToDirectoryState('cd -', state);
  assert.deepEqual(state, { cwd: '/var/log', previousCwd: '/root' });

  state = applyCommandToDirectoryState('cd ~', state);
  assert.deepEqual(state, { cwd: '/root', previousCwd: '/var/log' });
});

test('applyCommandToDirectoryState does not change cwd when cd fails', () => {
  const state = createDirectoryState('/usr', '/');
  const nextState = applyCommandToDirectoryState('cd missing', state, 'cd: missing: No such file or directory');
  assert.equal(nextState, state);
});

test('isTaskComplete supports input, output, and cwd checks', () => {
  assert.equal(
    isTaskComplete(
      { checkType: 'input', trigger: 'pwd' },
      { submittedCommand: ' PWD ', cleanScreen: '', cwd: '/usr' }
    ),
    true
  );

  assert.equal(
    isTaskComplete(
      { checkType: 'output', trigger: 'command not found' },
      { submittedCommand: 'hello', cleanScreen: 'hello: command not found', cwd: '/root' }
    ),
    true
  );

  assert.equal(
    isTaskComplete(
      { checkType: 'cwd', targetCwd: '/usr' },
      { submittedCommand: 'cd ../usr', cleanScreen: '', cwd: '/usr' }
    ),
    true
  );

  assert.equal(
    isTaskComplete(
      { checkType: 'cwd', targetCwd: '/usr' },
      { submittedCommand: 'cd /var', cleanScreen: '', cwd: '/var' }
    ),
    false
  );
});
