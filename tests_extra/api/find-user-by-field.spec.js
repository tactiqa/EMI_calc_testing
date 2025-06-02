const { test, expect } = require('@playwright/test');

// Function to find user by any field in page 2
async function findUserByField(request, field, value) {
  const response = await request.get('https://reqres.in/api/users?page=2');
  const data = await response.json();
  return data.data.find(user => user[field] === value);
}

test('find user by field in page 2', async ({ request }) => {
  // Example 1: Find by last name
  const lastName = 'Ferguson';
  let user = await findUserByField(request, 'last_name', lastName);
  console.log(`\nSearching for user with last name "${lastName}":`);
  printUser(user);
  
  // Example 2: Find by ID
  const userId = 9;
  user = await findUserByField(request, 'id', userId);
  console.log(`\nSearching for user with ID ${userId}:`);
  printUser(user);
  
  // Example 3: Find by first name
  const firstName = 'Tobias';
  user = await findUserByField(request, 'first_name', firstName);
  console.log(`\nSearching for user with first name "${firstName}":`);
  printUser(user);
  
  // At least one user should be found
  expect(user).toBeTruthy();
});

// Helper function to print user details
function printUser(user) {
  if (user) {
    console.log('✅ User found!');
    console.log('--------------');
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.first_name} ${user.last_name}`);
    console.log(`Email: ${user.email}`);
  } else {
    console.log('❌ User not found');
  }
}
