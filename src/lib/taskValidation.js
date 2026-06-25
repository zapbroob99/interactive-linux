export const DEFAULT_HOME = '/root';

export const createDirectoryState = (cwd = DEFAULT_HOME, previousCwd = DEFAULT_HOME) => ({
  cwd,
  previousCwd,
});

export const normalizePath = (path, basePath = DEFAULT_HOME, homePath = DEFAULT_HOME) => {
  const rawPath = path?.trim() || homePath;
  const expandedPath = rawPath === '~'
    ? homePath
    : rawPath.startsWith('~/')
      ? `${homePath}/${rawPath.slice(2)}`
      : rawPath;
  const absolutePath = expandedPath.startsWith('/')
    ? expandedPath
    : `${basePath.replace(/\/$/, '')}/${expandedPath}`;

  const parts = [];
  absolutePath.split('/').forEach(part => {
    if (!part || part === '.') return;
    if (part === '..') parts.pop();
    else parts.push(part);
  });

  return parts.length ? `/${parts.join('/')}` : '/';
};

export const commandFailed = (cleanScreen = '') => {
  const recentOutput = cleanScreen.slice(-300).toLowerCase();
  return recentOutput.includes("can't cd")
    || recentOutput.includes('no such file')
    || recentOutput.includes('not a directory');
};

export const applyCommandToDirectoryState = (cmd, state = createDirectoryState(), cleanScreen = '') => {
  const trimmed = cmd.trim();
  const cdMatch = trimmed.match(/^cd(?:\s+(.+))?$/);
  if (!cdMatch || commandFailed(cleanScreen)) return state;

  const rawTarget = cdMatch[1]?.trim();
  const nextCwd = rawTarget === '-'
    ? state.previousCwd
    : normalizePath(rawTarget || '~', state.cwd);

  return {
    cwd: nextCwd,
    previousCwd: state.cwd,
  };
};

export const isTaskComplete = (task, context) => {
  const submitted = context.submittedCommand?.toLowerCase().trim() || '';
  const trigger = task.trigger?.toLowerCase().trim() || '';
  const cleanScreen = context.cleanScreen?.toLowerCase() || '';

  if (task.checkType === 'input') return submitted === trigger;
  if (task.checkType === 'output') return cleanScreen.includes(trigger);
  if (task.checkType === 'cwd') return context.cwd === task.targetCwd;

  return false;
};
