export const debugLog = (...args: unknown[]) => {
  if (process.env.DEBUG_TALENT_SEARCH === '1') {
    // eslint-disable-next-line no-console
    console.log('[talent-search]', ...args);
  }
};
