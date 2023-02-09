const app = require('./index');
const server = app.listen(5000, () => {
  console.log(`Express is running on port ${server.address().port} http://localhost:5000`);
}); 
