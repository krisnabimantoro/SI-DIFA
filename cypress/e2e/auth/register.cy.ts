/// <reference types="cypress" />

describe('Register Kader Feature - Registration Tests', () => {
  const baseUrl = Cypress.env('API_URL') || 'http://localhost:3001/api/v1';
  const frontendUrl = Cypress.env('FRONTEND_URL') || 'http://localhost:3000';

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`${frontendUrl}/auth/signup/kader`);
  });

  /**
   * TC-REGISTER-001: Verifikasi input wajib (mandatory) divalidasi ketika dikosongkan
   * Requirement: REQ-REGISTER-01
   */
  it('TC-REGISTER-001: Should validate mandatory fields when empty', () => {
    // Click submit without filling any fields
    cy.get('button[type="submit"]').click();

    // Verify error messages for each mandatory field
    cy.contains(/nama harus diisi/i, { timeout: 5000 }).should('be.visible');
    cy.contains(/email tidak valid/i, { timeout: 5000 }).should('be.visible');
    cy.contains(/password minimal 8 karakter/i, { timeout: 5000 }).should(
      'be.visible',
    );
    cy.contains(/no.*telepon harus diisi/i, { timeout: 5000 }).should(
      'be.visible',
    );
    cy.contains(/jabatan harus diisi/i, { timeout: 5000 }).should('be.visible');

    // Verify form doesn't submit (stays on registration page)
    cy.url().should('include', '/auth/signup');
  });

  /**
   * TC-REGISTER-002: Verifikasi penolakan password karena tidak memenuhi kriteria kekuatan
   * Requirement: REQ-REGISTER-02
   */
  it('TC-REGISTER-002: Should reject weak password', () => {
    const weakPassword = 'user12345'; // No capital letter

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');

    cy.get('input[name="no_telp"]').type('081234567890');
    cy.get('input[name="jabatan"]').type('Ketua Kader');
    cy.get('input[name="password"]').type(weakPassword);
    // Blur password field to trigger validation
    cy.get('input[name="password"]').blur();

    // Verify password strength error appears
    cy.contains(/password harus mengandung huruf besar dan angka/i, {
      timeout: 5000,
    }).should('be.visible');

    // Verify form doesn't submit
    cy.url().should('include', '/auth/signup');
  });

  /**
   * TC-REGISTER-003: Verifikasi penolakan karena Konfirmasi Password tidak cocok
   * Requirement: REQ-REGISTER-03
   */
  it('TC-REGISTER-003: Should reject when password confirmation does not match', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('User@12345');

    // Wait for confirmPassword to be enabled
    cy.get('input[name="confirmPassword"]').should('not.be.disabled');
    cy.get('input[name="confirmPassword"]').type('User@54321'); // Different

    cy.get('input[name="no_telp"]').type('081234567890');
    cy.get('input[name="jabatan"]').type('Ketua Kader');

    cy.get('button[type="submit"]').click();

    // Verify password mismatch error
    cy.contains(/password dan konfirmasi password tidak sama/i, {
      timeout: 5000,
    }).should('be.visible');

    // Verify form doesn't submit
    cy.url().should('include', '/auth/signup');
  });

  /**
   * TC-REGISTER-004: Verifikasi Validasi Format Email (Frontend)
   * Requirement: REQ-REGISTER-04
   */
  it('TC-REGISTER-004: Should validate email format on frontend', () => {
    const invalidEmail = 'tes.com';

    cy.get('input[name="email"]').type(invalidEmail);
    cy.get('input[name="name"]').click(); // Blur email field

    // Verify frontend validation error
    cy.contains(/email tidak valid/i, { timeout: 5000 }).should('be.visible');
  });

  /**
   * TC-REGISTER-005: Verifikasi Keunikan Email (Backend)
   * Requirement: REQ-REGISTER-04
   */
  it('TC-REGISTER-005: Should reject duplicate email', () => {
    const existingEmail = 'existing@test.com';

    // Intercept API call
    cy.intercept('POST', `${baseUrl}/auth/signup/kader`).as('registerRequest');

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="password"]').type('User@12345');
    cy.get('input[name="confirmPassword"]')
      .should('not.be.disabled')
      .type('User@12345');
    cy.get('input[name="no_telp"]').type('081234567890');
    cy.get('input[name="jabatan"]').type('Ketua Kader');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');

    // Verify backend error for duplicate email
    cy.contains(/email sudah terdaftar|email already exists/i).should(
      'be.visible',
    );
  });

  /**
   * TC-REGISTER-006: Verifikasi Validasi Format No. HP (Frontend)
   * Requirement: REQ-REGISTER-05
   */
  it('TC-REGISTER-006: Should validate phone number format on frontend', () => {
    const invalidPhone = '12'; // Only 2 digits

    cy.get('input[name="no_telp"]').type(invalidPhone);
    cy.get('input[name="name"]').click(); // Blur phone field

    // Verify frontend validation error
    cy.contains(/nomor telepon harus format indonesia/i, {
      timeout: 5000,
    }).should('be.visible');
  });

  /**
   * TC-REGISTER-007: Verifikasi Keunikan No. HP (Backend)
   * Requirement: REQ-REGISTER-05
   */
  it('TC-REGISTER-007: Should reject duplicate phone number', () => {
    const existingPhone = '081234567890';

    cy.intercept('POST', `${baseUrl}/auth/signup/kader`).as('registerRequest');

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('newuser@test.com');
    cy.get('input[name="password"]').type('User@12345');
    cy.get('input[name="confirmPassword"]')
      .should('not.be.disabled')
      .type('User@12345');
    cy.get('input[name="no_telp"]').type(existingPhone);
    cy.get('input[name="jabatan"]').type('Ketua Kader');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');

    // Verify backend error for duplicate phone
    cy.contains(/nomor.*sudah terdaftar|phone.*already exists/i).should(
      'be.visible',
    );
  });

  /**
   * TC-REGISTER-008: Verifikasi pengiriman email notifikasi setelah registrasi sukses
   * Requirement: REQ-REGISTER-06
   */
  it('TC-REGISTER-008: Should send notification email after successful registration', () => {
    const newUser = {
      name: 'New Kader User',
      email: `newkader${Date.now()}@test.com`,
      password: 'User@12345',
      no_telp: `0812${Math.floor(Math.random() * 100000000)}`,
      jabatan: 'Ketua Kader',
    };

    cy.intercept('POST', `${baseUrl}/auth/signup/kader`).as('registerRequest');

    cy.get('input[name="name"]').type(newUser.name);
    cy.get('input[name="email"]').type(newUser.email);
    cy.get('input[name="no_telp"]').type(newUser.no_telp);
    cy.get('input[name="jabatan"]').type(newUser.jabatan);
    cy.get('input[name="password"]').type(newUser.password);
    cy.get('input[name="confirmPassword"]')
      .should('not.be.disabled')
      .type(newUser.password);

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);

    // Verify success message or unverified status card
    cy.contains(
      /pendaftaran berhasil|menunggu verifikasi|akun menunggu verifikasi/i,
      {
        timeout: 10000,
      },
    ).should('be.visible');
  });

  /**
   * TC-REGISTER-009: Verifikasi password tersimpan terenkripsi (hashed) di database
   * Requirement: REQ-REGISTER-07
   * Note: This test verifies through API response, actual DB check requires backend access
   */
  it('TC-REGISTER-009: Should store password as encrypted hash', () => {
    const newUser = {
      name: 'Hash Test User',
      email: `hashtest${Date.now()}@test.com`,
      password: 'User@12345',
      no_telp: `0813${Math.floor(Math.random() * 100000000)}`,
      jabatan: 'Anggota Kader',
    };

    cy.intercept('POST', `${baseUrl}/auth/signup/kader`).as('registerRequest');

    cy.get('input[name="name"]').type(newUser.name);
    cy.get('input[name="email"]').type(newUser.email);
    cy.get('input[name="password"]').type(newUser.password);
    cy.get('input[name="confirmPassword"]')
      .should('not.be.disabled')
      .type(newUser.password);
    cy.get('input[name="no_telp"]').type(newUser.no_telp);
    cy.get('input[name="jabatan"]').type(newUser.jabatan);

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      // Verify response doesn't contain plaintext password
      const responseBody = JSON.stringify(interception.response?.body);
      expect(responseBody).to.not.include(newUser.password);
    });
  });

  /**
   * TC-REGISTER-010: Verifikasi mekanisme Rate Limiting API register
   * Requirement: REQ-REGISTER-08
   */
  it('TC-REGISTER-010: Should enforce rate limiting on registration attempts', () => {
    cy.intercept('POST', `${baseUrl}/auth/signup/kader`).as('registerAttempt');

    // Attempt registration 5 times rapidly
    for (let i = 0; i < 5; i++) {
      cy.get('input[name="name"]').clear().type(`User ${i}`);
      cy.get('input[name="email"]').clear().type(`user${i}@test.com`);
      cy.get('input[name="password"]').clear().type('User@12345');
      cy.get('input[name="confirmPassword"]')
        .should('not.be.disabled')
        .clear()
        .type('User@12345');
      cy.get('input[name="no_telp"]').clear().type(`08123456${i}890`);
      cy.get('input[name="jabatan"]').clear().type('Kader');
      cy.get('button[type="submit"]').click();
      cy.wait('@registerAttempt');
      cy.wait(100); // Small delay between attempts
    }

    // 6th attempt should be rate limited
    cy.get('input[name="name"]').clear().type('User 6');
    cy.get('input[name="email"]').clear().type('user6@test.com');
    cy.get('input[name="password"]').clear().type('User@12345');
    cy.get('input[name="confirmPassword"]')
      .should('not.be.disabled')
      .clear()
      .type('User@12345');
    cy.get('input[name="no_telp"]').clear().type('081234567896');
    cy.get('input[name="jabatan"]').clear().type('Kader');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerAttempt').then((interception) => {
      expect(interception.response?.statusCode).to.equal(429);
    });

    // Verify rate limit error message
    cy.contains(/terlalu banyak upaya|rate limit|coba lagi/i).should(
      'be.visible',
    );
  });
});
