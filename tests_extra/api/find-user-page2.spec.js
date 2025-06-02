const { test, expect } = require('@playwright/test');

test('find user in page 2', async ({ request }) => {
  // Test with this email - change as needed
  const testEmail = 'tobias.funke@reqres.in';
  
  // Get second page directly
  const response = await request.get('https://reqres.in/api/users?page=2');
  const data = await response.json();
  const user = data.data.find(u => u.email === testEmail);
  
  // Print results
  console.log('\n📄 Checking page 2...');
  if (user) {
    console.log('✅ User found!');
    console.log('--------------');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.first_name} ${user.last_name}`);
    console.log(`Email: ${user.email}`);
  } else {
    console.log(`❌ User with email ${testEmail} not found on page 2`);
  }
  
  // Simple assertion
  expect(user).toBeTruthy();
});
