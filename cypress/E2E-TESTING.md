# Cypress E2E Testing - SI-DIFA

Dokumentasi End-to-End Testing untuk Sistem Informasi Difabel dan Anak (SI-DIFA).

## 📋 Test Coverage

### 1. **Authentication Tests**

#### Login Tests (`cypress/e2e/auth/login.cy.ts`)

- ✅ TC-LOGIN-001: Login sukses dan redirect ke Dashboard Kader
- ✅ TC-LOGIN-002: Penolakan login untuk akun belum diverifikasi
- ✅ TC-LOGIN-003: Penolakan login untuk akun ditolak Admin
- ✅ TC-LOGIN-004: Penolakan login karena Password salah
- ✅ TC-LOGIN-005: Validasi format Email di frontend
- ✅ TC-LOGIN-006: Penolakan login karena Email tidak terdaftar
- ✅ TC-LOGIN-007: Verifikasi Auth Token di cookies
- ✅ TC-LOGIN-008: Rate Limiting pada login

#### Register Tests (`cypress/e2e/auth/register.cy.ts`)

- ✅ TC-REGISTER-001: Validasi input wajib (mandatory)
- ✅ TC-REGISTER-002: Penolakan password lemah
- ✅ TC-REGISTER-003: Konfirmasi password tidak cocok
- ✅ TC-REGISTER-004: Validasi format Email (Frontend)
- ✅ TC-REGISTER-005: Keunikan Email (Backend)
- ✅ TC-REGISTER-006: Validasi format No. HP (Frontend)
- ✅ TC-REGISTER-007: Keunikan No. HP (Backend)
- ✅ TC-REGISTER-008: Pengiriman email notifikasi
- ✅ TC-REGISTER-009: Password terenkripsi di database
- ✅ TC-REGISTER-010: Rate Limiting pada registrasi

### 2. **Jadwal Posyandu Tests** (`cypress/e2e/kader/jadwal-posyandu.cy.ts`)

- ✅ TC-JADWAL-001: Validasi field wajib isi
- ✅ TC-JADWAL-002: Field Lokasi menampung alamat lengkap
- ✅ TC-JADWAL-003: Pemilihan tanggal valid
- ✅ TC-JADWAL-004: Penolakan upload file besar (> 5MB)
- ✅ TC-JADWAL-005: Otomatisasi pembuatan Presensi IBK
- ✅ TC-JADWAL-006: Menampilkan data jadwal (Read)
- ✅ TC-JADWAL-007: Update data jadwal
- ✅ TC-JADWAL-008: Delete data jadwal

## 🚀 Setup & Installation

### Prerequisites

```bash
# Node.js v18+
# PNPM
# Backend API running on http://localhost:3001
# Frontend running on http://localhost:3000
```

### 🔐 Environment Configuration

**Important**: The application uses **hashed JWT cookie names** for security. Set the `APP_KEY` environment variable to match your backend:

```bash
export APP_KEY="your-app-key-here"
```

The cookie names are generated using: `sha256(cookieName + APP_KEY).substring(0, 16)`

The helper function in `cypress/support/helpers.ts` automatically generates the correct hashed names for:

- `jwt_access` → hashed cookie name
- `jwt_refresh` → hashed cookie name

### Install Dependencies

```bash
pnpm install
```

## 🧪 Running Tests

### Open Cypress Test Runner (Interactive Mode)

```bash
pnpm cypress:open
```

### Run All Tests (Headless Mode)

```bash
pnpm cypress:run
```

### Run Specific Test Suite

```bash
# Login tests
pnpm cypress:run --spec "cypress/e2e/auth/login.cy.ts"

# Register tests
pnpm cypress:run --spec "cypress/e2e/auth/register.cy.ts"

# Jadwal Posyandu tests
pnpm cypress:run --spec "cypress/e2e/kader/jadwal-posyandu.cy.ts"
```

### Run Tests in Specific Browser

```bash
# Chrome
pnpm cypress:run --browser chrome

# Firefox
pnpm cypress:run --browser firefox

# Edge
pnpm cypress:run --browser edge
```

## ⚙️ Configuration

### Environment Variables

Edit `cypress.config.ts` atau gunakan `cypress.env.json`:

```json
{
  "API_URL": "http://localhost:3001/api/v1",
  "FRONTEND_URL": "http://localhost:3000"
}
```

### Test Data

Pastikan database memiliki user testing berikut:

```javascript
// Verified Kader
{
  email: "kader.verified@test.com",
  password: "Password123",
  role: "kader",
  verification: "approved"
}

// Unverified Kader
{
  email: "kader.unverified@test.com",
  password: "Password123",
  role: "kader",
  verification: "unverified"
}

// Declined Kader
{
  email: "kader.declined@test.com",
  password: "Password123",
  role: "kader",
  verification: "declined"
}
```

## 📁 Project Structure

```
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.cy.ts           # Login test cases
│   │   └── register.cy.ts        # Registration test cases
│   └── kader/
│       └── jadwal-posyandu.cy.ts # Jadwal Posyandu test cases
├── fixtures/
│   └── example.json              # Test data fixtures
├── support/
│   ├── commands.ts               # Custom Cypress commands
│   └── e2e.ts                    # Global configuration
└── cypress.config.ts             # Cypress configuration
```

## 🛠️ Custom Commands

### Login Commands

```typescript
// Login with custom credentials
cy.login('user@example.com', 'password123');

// Login as verified Kader
cy.loginAsKader();

// Login as Admin
cy.loginAsAdmin();
```

### API Commands

```typescript
// Wait for API response with expected status
cy.waitForApiResponse('@loginRequest', 200);
```

## 📊 Test Reports

### Generate HTML Report

```bash
# Install report plugin
pnpm add -D cypress-mochawesome-reporter

# Run tests with report
pnpm cypress:run --reporter cypress-mochawesome-reporter
```

### View Test Results

Report akan tersimpan di: `cypress/reports/html/index.html`

## 🐛 Debugging

### Debug Specific Test

```bash
# Open Cypress and select test file
pnpm cypress:open
```

### Using Cypress Debug Commands

```typescript
cy.debug(); // Pause test and open DevTools
cy.pause(); // Pause test execution
cy.log('message'); // Log custom message
```

### Screenshots & Videos

- Screenshots: `cypress/screenshots/` (on failure)
- Videos: `cypress/videos/` (disabled by default)

## ✅ Best Practices

1. **Data Independence**: Setiap test harus independent
2. **Clean State**: Gunakan `beforeEach` untuk reset state
3. **Explicit Waits**: Gunakan `cy.wait()` untuk API calls
4. **Selectors**: Gunakan `data-testid` attributes untuk selector yang stable
5. **Assertions**: Selalu verify expected results

## 🔧 Troubleshooting

### Test Timeout

Increase timeout di `cypress.config.ts`:

```typescript
defaultCommandTimeout: 15000;
```

### CORS Issues

Pastikan backend mengizinkan CORS dari frontend URL

### Authentication Issues

Clear cookies sebelum test:

```typescript
cy.clearCookies();
cy.clearLocalStorage();
```

## 📝 Adding New Tests

1. Create new test file di folder yang sesuai
2. Import types: `/// <reference types="cypress" />`
3. Follow naming convention: `feature-name.cy.ts`
4. Document test case ID dan requirement
5. Run dan verify test

## 📞 Support

Untuk pertanyaan atau issues terkait E2E testing, silakan hubungi tim QA.
