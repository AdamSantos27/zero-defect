# JPetStore Test Automation

This project contains automated tests for the JPetStore website using Cypress.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

Before running the tests, make sure to:

1. Update the credentials in `cypress/e2e/cartOperations.cy.js`:
```javascript
LoginPage.login('your_username', 'your_password')
```

## Running Tests

### Open Cypress Test Runner
```bash
npx cypress open
```

### Run Tests in Headless Mode
```bash
npx cypress run
```

## Test Structure

- `cypress/pages/`: Contains Page Object classes
  - `LoginPage.js`: Handles login functionality
  - `HomePage.js`: Handles home page operations
  - `ProductPage.js`: Handles product and cart operations

- `cypress/e2e/`: Contains test files
  - `menuAndSearch.cy.js`: Tests for menu validation and search functionality
  - `cartOperations.cy.js`: Tests for cart operations (requires login)

## Test Scenarios

1. Menu Validation
   - Validates presence of all menu categories
   - Checks visibility of each category

2. Search Functionality
   - Tests product search
   - Validates search results

3. Cart Operations
   - Adding products to cart
   - Validating cart contents
   - Handling multiple quantities

## Best Practices Implemented

- Page Object Model pattern
- Reusable components and methods
- Clear test structure and organization
- Proper element selectors
- Error handling
- Test data management 