/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with email and password
     * @example cy.login('user@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;

    /**
     * Custom command to login as verified Kader
     * @example cy.loginAsKader()
     */
    loginAsKader(): Chainable<void>;

    /**
     * Custom command to login as Admin
     * @example cy.loginAsAdmin()
     */
    loginAsAdmin(): Chainable<void>;

    /**
     * Custom command to clear test data
     * @example cy.clearTestData()
     */
    clearTestData(): Chainable<void>;

    /**
     * Custom command to wait for API response with expected status
     * @example cy.waitForApiResponse('@loginRequest', 200)
     */
    waitForApiResponse(alias: string, expectedStatus?: number): Chainable<void>;
  }
}
