const { test, expect } = require('@playwright/test');
const expectedUsers = require('../../fixtures/users-response.json');

console.log('Starting API tests for users response verification...');
console.log(`Will verify ${expectedUsers.data.length} expected users`);

test.describe('Users verification API Tests', () => {
  test('GET /users should return 200 OK', async ({ request }) => {
    console.log('\nSending request: GET /users\n');

    // Make GET request to the users endpoint
    const response = await request.get('https://reqres.in/api/users?page=2', {
      headers: {
        'Authorization': 'Bearer reqres-free-v1'
      }
    });

    // Verify status code is 200
    const status = response.status();
    console.log(`Response status: ${status}\n`);
    expect(status).toBe(200);

    // Verify response contains expected users data
    const responseBody = await response.json();
    console.log(`Found ${responseBody.data.length} users in the response\n`);
    
    console.log('\nVerifying expected users:');
    expectedUsers.data.forEach(expectedUser => {
      const foundUser = responseBody.data.find(user => user.id === expectedUser.id);
      expect(foundUser, `User with id ${expectedUser.id} not found in response`).toBeTruthy();
      
      // Check all properties at once
      const { id, email, first_name, last_name } = expectedUser;

      const userMatch = foundUser && 
        foundUser.id === id && 
        foundUser.email === email &&
        foundUser.first_name === first_name &&
        foundUser.last_name === last_name;
      
      const status = userMatch ? '✓' : '✗';
      console.log(`\n${status} User ${id}: ${first_name} ${last_name} (${email})`);
      
      if (foundUser) {
        expect(foundUser).toMatchObject({
          id,
          email,
          first_name,
          last_name
        });
      }
    });
    
    console.log('\n✅ All user verifications completed successfully!');
  });
});
