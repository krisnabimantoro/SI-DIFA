/// <reference types="cypress" />

describe('Jadwal Posyandu Feature - Schedule Management Tests', () => {
  const baseUrl = Cypress.env('API_URL') || 'http://localhost:3001/api/v1';
  const frontendUrl = Cypress.env('FRONTEND_URL') || 'http://localhost:3000';

  // Login before each test as authenticated Kader
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    // Login through frontend
    cy.visit(`${frontendUrl}/auth/login`);
    cy.get('input[name="email"]').type('kader.verified@test.com');
    cy.get('input[name="password"]').type('Password123');
    cy.get('button[type="submit"]').click();

    // Wait for login to complete and redirect
    cy.url({ timeout: 10000 }).should('include', '/kader');

    // Visit jadwal posyandu page
    cy.visit(
      `${frontendUrl}/kader/posyandu/4e65b64c-a269-4d76-aefa-3e0580581571/jadwal`,
    );
  });

  /**
   * TC-JADWAL-001: Verifikasi validasi wajib isi (mandatory) saat semua field dikosongkan
   * Requirement: REQ-JADWAL-01
   */
  it('TC-JADWAL-001: Should validate mandatory fields when empty', () => {
    // Click button to open create form
    cy.contains(/tambah jadwal/i).click();

    // Submit form without filling any fields
    cy.get('button[type="submit"]').click();

    // Verify error messages for mandatory fields
    cy.contains(/nama kegiatan wajib diisi/i, { timeout: 5000 }).should(
      'be.visible',
    );
    cy.contains(/jenis kegiatan wajib diisi/i, { timeout: 5000 }).should(
      'be.visible',
    );
    cy.contains(/deskripsi wajib diisi/i, { timeout: 5000 }).should(
      'be.visible',
    );
    cy.contains(/lokasi wajib diisi/i, { timeout: 5000 }).should('be.visible');
    cy.contains(/tanggal wajib diisi/i, { timeout: 5000 }).should('be.visible');
    cy.contains(/waktu mulai wajib diisi/i, { timeout: 5000 }).should(
      'be.visible',
    );
    cy.contains(/waktu selesai wajib diisi/i, { timeout: 5000 }).should(
      'be.visible',
    );

    // Verify form is still open (not submitted)
    cy.get('form').should('be.visible');
  });

  /**
   * TC-JADWAL-002: Verifikasi field Lokasi dapat menampung alamat lengkap
   * Requirement: REQ-JADWAL-02
   */
  it('TC-JADWAL-002: Should accept long detailed address in Location field', () => {
    const longAddress =
      'Balai Desa RT 05/RW 03, Kelurahan Sukamaju, Kecamatan Cilandak, Jakarta Selatan, DKI Jakarta 12345';

    cy.contains(/tambah jadwal/i).click();

    // Fill location with very long address
    cy.get('input[name="lokasi"]').type(longAddress);

    // Verify the full address is accepted
    cy.get('input[name="lokasi"]').should('have.value', longAddress);

    // Fill other required fields
    cy.get('input[name="nama_kegiatan"]').type('Posyandu Balita');
    cy.get('input[name="jenis_kegiatan"]').type('Pemeriksaan Kesehatan');
    cy.get('textarea[name="deskripsi"]').type('Pemeriksaan rutin balita');
    cy.get('input[name="tanggal"]').type('2025-12-15');
    cy.get('input[name="waktu_mulai"]').type('08:00');
    cy.get('input[name="waktu_selesai"]').type('12:00');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify success (no character limit error)
    cy.contains(/berhasil|success/i, { timeout: 10000 }).should('be.visible');
  });

  /**
   * TC-JADWAL-003: Verifikasi pemilihan tanggal valid untuk penjadwalan
   * Requirement: REQ-JADWAL-03
   */
  it('TC-JADWAL-003: Should accept valid future date for scheduling', () => {
    cy.contains(/tambah jadwal/i).click();

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

    // Fill form with valid data
    cy.get('input[name="nama_kegiatan"]').type('Posyandu Lansia');
    cy.get('input[name="jenis_kegiatan"]').type('Pemeriksaan Lansia');
    cy.get('textarea[name="deskripsi"]').type('Kegiatan posyandu lansia');
    cy.get('input[name="lokasi"]').type('Balai RT 02');
    cy.get('input[name="tanggal"]').type(tomorrowFormatted);
    cy.get('input[name="waktu_mulai"]').type('09:00');
    cy.get('input[name="waktu_selesai"]').type('11:00');

    // Intercept API call
    cy.intercept('POST', `${baseUrl}/kader/jadwal-posyandu`).as('createJadwal');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify successful creation
    cy.wait('@createJadwal').its('response.statusCode').should('eq', 200);
    cy.contains(/berhasil|success/i).should('be.visible');
  });

  /**
   * TC-JADWAL-004: Verifikasi penolakan upload file karena ukuran melebihi batas
   * Requirement: REQ-JADWAL-04
   */
  it('TC-JADWAL-004: Should reject file upload exceeding size limit', () => {
    cy.contains(/tambah jadwal/i).click();

    // Fill required fields
    cy.get('input[name="nama_kegiatan"]').type('Posyandu dengan File');
    cy.get('input[name="jenis_kegiatan"]').type('Pemeriksaan');
    cy.get('textarea[name="deskripsi"]').type('Testing file upload');
    cy.get('input[name="lokasi"]').type('Balai Desa');
    cy.get('input[name="tanggal"]').type('2025-12-20');
    cy.get('input[name="waktu_mulai"]').type('08:00');
    cy.get('input[name="waktu_selesai"]').type('12:00');

    // Create a mock large file (simulating 15MB)
    const fileName = 'large-file.pdf';
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.alloc(15 * 1024 * 1024), // 15MB
        fileName: fileName,
        mimeType: 'application/pdf',
      },
      { force: true },
    );

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify error message about file size
    cy.contains(/ukuran file.*melebihi.*5.*mb|file size.*exceed.*5.*mb/i, {
      timeout: 5000,
    }).should('be.visible');
  });

  /**
   * TC-JADWAL-005: Verifikasi otomatisasi pembuatan Presensi dan relasi dengan IBK
   * Requirement: REQ-JADWAL-05
   */
  it('TC-JADWAL-005: Should automatically create attendance records for all registered IBK', () => {
    // First, create a new jadwal
    cy.contains(/tambah jadwal/i).click();

    const jadwalName = `Testing Jadwal ${Date.now()}`;
    cy.get('input[name="nama_kegiatan"]').type(jadwalName);
    cy.get('input[name="jenis_kegiatan"]').type('Pemeriksaan');
    cy.get('textarea[name="deskripsi"]').type('Testing auto attendance');
    cy.get('input[name="lokasi"]').type('Balai Testing');
    cy.get('input[name="tanggal"]').type('2025-12-25');
    cy.get('input[name="waktu_mulai"]').type('08:00');
    cy.get('input[name="waktu_selesai"]').type('12:00');

    cy.intercept('POST', `${baseUrl}/kader/jadwal-posyandu`).as('createJadwal');
    cy.get('button[type="submit"]').click();

    cy.wait('@createJadwal').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      const jadwalId = interception.response?.body.id;

      // Refresh to see the new jadwal in the list
      cy.reload();

      // Navigate to jadwal detail using Detail button
      cy.contains(jadwalName, { timeout: 10000 })
        .parents('tr')
        .find('button.btn-ghost')
        .click();

      // Wait for detail page to load
      cy.url({ timeout: 10000 }).should('include', '/jadwal/');

      // Click on Presensi tab (using the tab link)
      cy.get('a[role="tab"]#tab-presensi, a[href="#tab=presensi"]', {
        timeout: 10000,
      }).click();

      // Verify presensi list is visible and contains IBK records
      cy.get('[data-testid="presensi-list"], .presensi-table, table')
        .should('be.visible')
        .find('tr, .presensi-item')
        .should('have.length.greaterThan', 0);

      // Verify all IBK from the posyandu are listed with attendance status
      cy.contains(/BELUM_HADIR|HADIR/i).should('exist');
    });
  });

  /**
   * TC-JADWAL-006: Verifikasi menampilkan (Read) data jadwal yang sudah dibuat
   * Requirement: REQ-JADWAL-06
   */
  it('TC-JADWAL-006: Should display created schedule in the list', () => {
    // Create a new jadwal first
    cy.contains(/tambah jadwal/i).click();

    const testJadwalName = `Testing Read ${Date.now()}`;
    cy.get('input[name="nama_kegiatan"]').type(testJadwalName);
    cy.get('input[name="jenis_kegiatan"]').type('Pemeriksaan');
    cy.get('textarea[name="deskripsi"]').type('Testing read functionality');
    cy.get('input[name="lokasi"]').type('Balai Testing');
    cy.get('input[name="tanggal"]').type('2025-12-20');
    cy.get('input[name="waktu_mulai"]').type('08:00');
    cy.get('input[name="waktu_selesai"]').type('12:00');

    cy.intercept('POST', `${baseUrl}/kader/jadwal-posyandu`).as('createJadwal');
    cy.get('button[type="submit"]').click();

    // Wait for creation to complete
    cy.wait('@createJadwal').its('response.statusCode').should('eq', 200);
    cy.contains(/berhasil|success/i).should('be.visible');

    // Refresh the page to ensure data is loaded from server
    cy.reload();

    // Verify the jadwal is visible in the list
    cy.contains(testJadwalName, { timeout: 10000 }).should('be.visible');

    // Click Detail button to view details
    cy.contains(testJadwalName).parents('tr').find('button.btn-ghost').click();

    // Wait for detail page to load
    cy.url({ timeout: 10000 }).should('include', '/jadwal/');

    // Verify detail page shows accurate information
    cy.contains(testJadwalName).should('be.visible');
    cy.contains(/tanggal|date/i).should('be.visible');
    cy.contains(/lokasi|location/i).should('be.visible');
  });

  /**
   * TC-JADWAL-007: Verifikasi pembaruan (Update) satu atau lebih data jadwal
   * Requirement: REQ-JADWAL-07
   */
  it('TC-JADWAL-007: Should update schedule data successfully', () => {
    // Create a new jadwal first
    cy.contains(/tambah jadwal/i).click();

    const originalName = `Testing Update ${Date.now()}`;
    cy.get('input[name="nama_kegiatan"]').type(originalName);
    cy.get('input[name="jenis_kegiatan"]').type('Pemeriksaan');
    cy.get('textarea[name="deskripsi"]').type('Testing update functionality');
    cy.get('input[name="lokasi"]').type('Balai Testing');
    cy.get('input[name="tanggal"]').type('2025-12-22');
    cy.get('input[name="waktu_mulai"]').type('08:00');
    cy.get('input[name="waktu_selesai"]').type('12:00');

    cy.intercept('POST', `${baseUrl}/kader/jadwal-posyandu`).as('createJadwal');
    cy.get('button[type="submit"]').click();

    // Wait for creation to complete
    cy.wait('@createJadwal').its('response.statusCode').should('eq', 200);
    cy.contains(/berhasil|success/i).should('be.visible');

    // Refresh the page to ensure data is loaded
    cy.reload();

    // Find the created jadwal and click edit button in table
    cy.contains(originalName, { timeout: 10000 })
      .parents('tr')
      .find('button.btn-primary')
      .click();

    // Update the activity name
    const updatedName = `Updated ${Date.now()}`;
    cy.get('input[name="nama_kegiatan"]').clear().type(updatedName);

    // Intercept update API call
    cy.intercept('PATCH', `${baseUrl}/kader/jadwal-posyandu/update/*`).as(
      'updateJadwal',
    );

    // Click update button
    cy.get('button[type="submit"]').click();

    // Wait for update to complete
    cy.wait('@updateJadwal').its('response.statusCode').should('eq', 200);

    // Verify success message
    cy.contains('Jadwal berhasil diupdate.').should('be.visible');

    // Verify the updated name is displayed in the table
    cy.contains(updatedName).should('be.visible');
  });

  /**
   * TC-JADWAL-008: Verifikasi penghapusan (Delete) data jadwal
   * Requirement: REQ-JADWAL-08
   */
  it('TC-JADWAL-008: Should delete schedule successfully', () => {
    // Create a new jadwal first
    cy.contains(/tambah jadwal/i).click();

    const jadwalToDelete = `Testing Delete ${Date.now()}`;
    cy.get('input[name="nama_kegiatan"]').type(jadwalToDelete);
    cy.get('input[name="jenis_kegiatan"]').type('Pemeriksaan');
    cy.get('textarea[name="deskripsi"]').type('Testing delete functionality');
    cy.get('input[name="lokasi"]').type('Balai Testing');
    cy.get('input[name="tanggal"]').type('2025-12-23');
    cy.get('input[name="waktu_mulai"]').type('08:00');
    cy.get('input[name="waktu_selesai"]').type('12:00');

    cy.intercept('POST', `${baseUrl}/kader/jadwal-posyandu`).as('createJadwal');
    cy.get('button[type="submit"]').click();

    // Wait for creation to complete
    cy.wait('@createJadwal').its('response.statusCode').should('eq', 200);
    cy.contains(/berhasil|success/i).should('be.visible');

    // Refresh the page to ensure data is loaded
    cy.reload();

    // Intercept delete API call
    cy.intercept('DELETE', `${baseUrl}/kader/jadwal-posyandu/delete/*`).as(
      'deleteJadwal',
    );

    // Find the schedule in the list and click delete button in table
    cy.contains(jadwalToDelete, { timeout: 10000 })
      .parents('tr')
      .find('button.btn-error')
      .click();

    // Confirm deletion in browser confirm dialog
    cy.on('window:confirm', (text) => {
      expect(text).to.contains('Yakin ingin menghapus jadwal ini?');
      return true; // Click OK
    });

    // Wait for deletion
    cy.wait('@deleteJadwal').its('response.statusCode').should('eq', 200);

    // Verify success message
    cy.contains('Jadwal berhasil dihapus.').should('be.visible');

    // Verify the schedule is no longer in the list
    cy.contains(jadwalToDelete).should('not.exist');
  });
});
