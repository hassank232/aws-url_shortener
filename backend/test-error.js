const { handler } = require('./dist/shortenUrl');
const testEvent = require('./test-event-invalid.json');

handler(testEvent)
  .then(response => {
    console.log('\n✅ Error Handling Test:');
    console.log('Status Code:', response.statusCode);
    console.log('Body:', response.body);
  });