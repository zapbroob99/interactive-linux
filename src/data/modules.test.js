import test from 'node:test';
import assert from 'node:assert/strict';
import { modules } from './modules.js';

const supportedCheckTypes = new Set(['input', 'output', 'cwd']);

test('published modules stay in book order', () => {
  assert.deepEqual(
    modules.map(module => module.title),
    [
      'Chapter 1 - What Is The Shell?',
      'Chapter 2 - Navigation',
    ]
  );
});

test('all lesson modules declare their book section', () => {
  const lessons = modules.flatMap(module => module.items);
  assert.ok(lessons.length > 0);
  assert.equal(lessons.every(lesson => Boolean(lesson.bookSection)), true);
});

test('all tasks have unique ids and supported validators', () => {
  const tasks = modules.flatMap(module => module.items).flatMap(lesson => lesson.tasks);
  const taskIds = tasks.map(task => task.id);

  assert.equal(new Set(taskIds).size, taskIds.length);
  assert.equal(tasks.every(task => supportedCheckTypes.has(task.checkType)), true);
});

test('cwd tasks declare targetCwd and command/output tasks declare trigger', () => {
  const tasks = modules.flatMap(module => module.items).flatMap(lesson => lesson.tasks);

  assert.equal(tasks.every(task => task.checkType !== 'cwd' || Boolean(task.targetCwd)), true);
  assert.equal(tasks.every(task => task.checkType === 'cwd' || Boolean(task.trigger)), true);
});
