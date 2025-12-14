/// <reference types="cypress" />
import {
  getAccessTokenCookie,
  getRefreshTokenCookie,
} from '../../support/helpers';

describe('Login Feature - Authentication Tests', () => {
  const baseUrl = Cypress.env('API_URL') || 'http://localhost:3001/api/v1';
  const frontendUrl = Cypress.env('FRONTEND_URL') || 'http://localhost:3000';

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    // Visit login page
    cy.visit(`${frontendUrl}/auth/login`);
  });

  /**
   * TC-LOGIN-001: Verifikasi login sukses dan redirect ke Dashboard Kader
   * Requirement: REQ-LOGIN-01
   */
  it('TC-LOGIN-001: Should login successfully and redirect to Kader Dashboard', () => {
    // Test data - User yang sudah terverifikasi
    const validUser = {
      email: 'kader.verified@test.com',
      password: 'Password123',
    };

    // Input credentials
    cy.get('input[name="email"]').type(validUser.email);
    cy.get('input[name="password"]').type(validUser.password);

    // Click login button
    cy.get('button[type="submit"]').click();

    // Verify redirect to kader dashboard
    cy.url({ timeout: 10000 }).should('include', '/kader');

    // Verify user is logged in (check for dashboard elements or navigation)
    cy.contains(/dashboard|posyandu|selamat datang/i, {
      timeout: 10000,
    }).should('be.visible');
  });

  /**
   * TC-LOGIN-002: Verifikasi penolakan login untuk akun belum diverifikasi
   * Requirement: REQ-LOGIN-02
   */
  it('TC-LOGIN-002: Should reject login for unverified account', () => {
    const unverifiedUser = {
      email: 'kader.unverified@test.com',
      password: 'Password123',
    };

    cy.get('input[name="email"]').type(unverifiedUser.email);
    cy.get('input[name="password"]').type(unverifiedUser.password);
    cy.get('button[type="submit"]').click();

    // Verify error message (toast or card)
    cy.contains(
      /akun.*belum.*terverifikasi|menunggu verifikasi|belum dapat digunakan/i,
      { timeout: 10000 },
    ).should('be.visible');

    // Verify user stays on login page
    cy.url().should('include', '/auth/login');

    // Verify no auth cookies
    // cy.getCookie('jwt_access').should('not.exist');
  });

  /**
   * TC-LOGIN-003: Verifikasi penolakan login untuk akun ditolak Admin
   * Requirement: REQ-LOGIN-02
   */
  it('TC-LOGIN-003: Should reject login for declined account', () => {
    const declinedUser = {
      email: 'kader.declined@test.com',
      password: 'Password123',
    };

    cy.get('input[name="email"]').type(declinedUser.email);
    cy.get('input[name="password"]').type(declinedUser.password);
    cy.get('button[type="submit"]').click();

    // Verify error message (card with declined status)
    cy.contains(/pendaftaran ditolak|ditolak oleh admin/i, {
      timeout: 10000,
    }).should('be.visible');

    // Verify user stays on login page
    cy.url().should('include', '/auth/login');
  });

  /**
   * TC-LOGIN-004: Verifikasi penolakan login karena Password Salah
   * Requirement: REQ-LOGIN-03
   */
  it('TC-LOGIN-004: Should reject login with wrong password', () => {
    const validEmail = 'kader.verified@test.com';
    const wrongPassword = 'WrongPassword123';

    cy.get('input[name="email"]').type(validEmail);
    cy.get('input[name="password"]').type(wrongPassword);
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.contains(/email atau password salah|invalid credentials/i).should(
      'be.visible',
    );

    // Verify user stays on login page
    cy.url().should('include', '/auth/login');
  });

  /**
   * TC-LOGIN-005: Verifikasi validasi frontend saat input Email tidak sesuai format
   * Requirement: REQ-LOGIN-04
   */
  it('TC-LOGIN-005: Should validate email format on frontend', () => {
    const invalidEmails = ['123456', 'tes.com', 'test@', '@test.com'];

    invalidEmails.forEach((invalidEmail) => {
      cy.get('input[name="email"]').clear().type(invalidEmail);

      // Try to submit or blur the email field
      cy.get('input[name="email"]').blur();

      // Verify frontend validation error
      cy.contains(/email tidak valid/i, { timeout: 5000 }).should('be.visible');
    });
  });

  /**
   * TC-LOGIN-006: Verifikasi penolakan login karena Email tidak terdaftar
   * Requirement: REQ-LOGIN-05
   */
  it('TC-LOGIN-006: Should reject login with unregistered email', () => {
    const unregisteredEmail = 'anonim@test.com';
    const validPassword = 'Password123';

    cy.get('input[name="email"]').type(unregisteredEmail);
    cy.get('input[name="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    // Verify error message
    cy.contains(/email tidak terdaftar|email atau password salah/i).should(
      'be.visible',
    );

    // Verify user stays on login page
    cy.url().should('include', '/auth/login');
  });

  /**
   * TC-LOGIN-007: Verifikasi Auth Token berhasil digenerate dan tersimpan di cookies
   * Requirement: REQ-LOGIN-06
   */
  it('TC-LOGIN-007: Should generate and store Auth Tokens in cookies', () => {
    const validUser = {
      email: 'kader.verified@test.com',
      password: 'Password123',
    };

    // Intercept login API call
    cy.intercept('POST', `${baseUrl}/auth/login`).as('loginRequest');

    cy.get('input[name="email"]').type(validUser.email);
    cy.get('input[name="password"]').type(validUser.password);
    cy.get('button[type="submit"]').click();

    // Wait for login request
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Debug: Log all cookies
    cy.getCookies().then((cookies) => {
      cy.log(
        'All cookies after login:',
        JSON.stringify(cookies.map((c) => c.name)),
      );
    });

    // Verify access token cookie (using helper that computes hash)
    getAccessTokenCookie()
      .should('exist')
      .then((cookie) => {
        expect(cookie).to.have.property('value');
        expect(cookie?.value).to.have.length.greaterThan(0);
        expect(cookie).to.have.property('httpOnly', true);
      });

    // Verify refresh token cookie (using helper that computes hash)
    getRefreshTokenCookie()
      .should('exist')
      .then((cookie) => {
        expect(cookie).to.have.property('value');
        expect(cookie?.value).to.have.length.greaterThan(0);
        expect(cookie).to.have.property('httpOnly', true);
      });
  });

  /**
   * TC-LOGIN-008: Verifikasi mekanisme Rate Limiting API login
   * Requirement: REQ-LOGIN-07
   */
  it('TC-LOGIN-008: Should enforce rate limiting on login attempts', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'WrongPassword',
    };

    // Intercept login API calls
    cy.intercept('POST', `${baseUrl}/auth/login`).as('loginAttempt');

    // Attempt login 5 times rapidly
    for (let i = 0; i < 15; i++) {
      cy.get('input[name="email"]').clear().type(testUser.email);
      cy.get('input[name="password"]').clear().type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.wait('@loginAttempt');
    }

    // 6th attempt should be rate limited
    cy.get('input[name="email"]').clear().type(testUser.email);
    cy.get('input[name="password"]').clear().type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginAttempt').then((interception) => {
      // Verify rate limit response (HTTP 429)
      expect(interception.response?.statusCode).to.equal(429);
    });

    // Verify rate limit error message
    cy.contains(/terlalu banyak upaya|rate limit|try again/i).should(
      'be.visible',
    );
  });
});
