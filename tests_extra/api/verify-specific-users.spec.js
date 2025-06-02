const { test, expect } = require('@playwright/test');

// Test data array with users to verify
const usersToVerify = [
  {
    id: 11,
    email: 'george.edwards@reqres.in',
    first_name: 'George',
    last_name: 'Edwards',
    testName: 'George Edwards (ID: 11)'
  },
  {
    id: 9,
    email: 'tobias.funke@reqres.in',
    first_name: 'Tobias',
    last_name: 'Funke',
    testName: 'Tobias Funke (ID: 9)'
  }
];

test.describe('Specific Users API Verification', () => {
  // Create a test for each user in the array
  for (const user of usersToVerify) {
    test(`should find user ${user.testName} in the API response`, async ({ request }) => {
      console.log(`\nVerifying user: ${user.first_name} ${user.last_name} (ID: ${user.id})`);
      
      // Make GET request to the users endpoint
      const response = await request.get('https://reqres.in/api/users?page=2', {
        headers: {
          'Authorization': 'Bearer reqres-free-v1'
        }
      });

      // Verify status code is 200
      expect(response.status()).toBe(200);

      // Get the response body
      const responseBody = await response.json();
      
      // Find the user in the response
      const foundUser = responseBody.data.find(u => u.id === user.id);
      
      // Verify the user exists
      expect(foundUser, `User with id ${user.id} not found in response`).toBeTruthy();
      
      // Verify user details
      expect(foundUser, 'User details do not match expected values').toMatchObject({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      });
      
      console.log(`✅ Successfully verified user: ${user.first_name} ${user.last_name}`);
    });
  }
});
