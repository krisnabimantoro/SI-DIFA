/// <reference types="cypress" />

// Custom command for logging in
Cypress.Commands.add('login', (email: string, password: string) => {
  const baseUrl = Cypress.env('API_URL') || 'http://localhost:3005/api/v1';

  cy.session([email, password], () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/auth/login`,
      body: { email, password },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        // Cookies are automatically stored
        cy.log('Login successful');
      }
    });
  });
});

// Custom command for logging in as Kader
Cypress.Commands.add('loginAsKader', () => {
  cy.login('kader.verified@test.com', 'Password123');
});

// Custom command for logging in as Admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@test.com', 'Admin123');
});

// Custom command for clearing test data
Cypress.Commands.add('clearTestData', () => {
  // Add logic to clear test data if needed
  cy.log('Clearing test data');
});

// Custom command to wait for API response
Cypress.Commands.add(
  'waitForApiResponse',
  (alias: string, expectedStatus: number = 200) => {
    cy.wait(alias).then((interception) => {
      expect(interception.response?.statusCode).to.eq(expectedStatus);
    });
  },
);
