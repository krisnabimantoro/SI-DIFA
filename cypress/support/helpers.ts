/**
 * Get hashed cookie name using Cypress task
 * Returns a Chainable that resolves to the hashed name
 */
export const getHashedCookieName = (
  name: string,
): Cypress.Chainable<string> => {
  const appKey = Cypress.env('APP_KEY') || 'defaultKey';
  return cy.task<string>('hashCookieName', { name, appKey });
};

/**
 * Get access token cookie (hashed)
 * Use this directly in tests instead of pre-computing
 */
export const getAccessTokenCookie = () => {
  const appKey = Cypress.env('APP_KEY') || 'defaultKey';
  return cy
    .task<string>('hashCookieName', { name: 'jwt_access', appKey })
    .then((hashedName) => {
      cy.log('Looking for access token cookie:', hashedName);
      return cy.getCookie(hashedName);
    });
};

/**
 * Get refresh token cookie (hashed)
 * Use this directly in tests instead of pre-computing
 */
export const getRefreshTokenCookie = () => {
  const appKey = Cypress.env('APP_KEY') || 'defaultKey';
  return cy
    .task<string>('hashCookieName', { name: 'jwt_refresh', appKey })
    .then((hashedName) => {
      cy.log('Looking for refresh token cookie:', hashedName);
      return cy.getCookie(hashedName);
    });
};
