/// <reference types="cypress" />

describe('Helper Functions Test', () => {
  it('should hash cookie names correctly', () => {
    const appKey = Cypress.env('APP_KEY') || 'defaultKey';

    cy.task('hashCookieName', { name: 'jwt_access', appKey }).then((hash) => {
      cy.log('jwt_access hashed to:', hash);
      expect(hash).to.be.a('string');
      expect(hash).to.have.length(16);
    });

    cy.task('hashCookieName', { name: 'jwt_refresh', appKey }).then((hash) => {
      cy.log('jwt_refresh hashed to:', hash);
      expect(hash).to.be.a('string');
      expect(hash).to.have.length(16);
    });
  });
});
