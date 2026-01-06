const { handler } = require('./dist/shortenUrl');
const testEvent = require('./test-event.json');

// Simulate Lambda execution
handler(testEvent)
  .then(response => {
    console.log('\n✅ SUCCESS! Lambda Response:');
    console.log('Status Code:', response.statusCode);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('Body:', response.body);
    
    // Parse and display the body nicely
    const body = JSON.parse(response.body);
    console.log('\n📊 Parsed Response:');
    console.log('Short Code:', body.shortCode);
    console.log('Long URL:', body.longUrl);
  })
  .catch(error => {
    console.error('\n❌ ERROR:', error);
  });