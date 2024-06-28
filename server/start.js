// start.js
(async () => {
    try {
      await import('./server.mjs');
      console.log('Server started successfully.');
    } catch (error) {
      console.error('Error starting server:', error);
    }
  })();
  