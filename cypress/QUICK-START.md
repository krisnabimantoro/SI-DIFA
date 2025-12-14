# 🚀 Quick Start Guide - Cypress E2E Testing

Panduan cepat untuk menjalankan E2E testing di SI-DIFA.

## 📋 Prerequisites

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables

Pastikan file `.env` sudah dikonfigurasi dengan benar:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sidifa_test"
JWT_SECRET_KEY=your-jwt-secret
JWT_REFRESH_SECRET_KEY=your-refresh-secret
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-email-password
```

### 3. Setup Database

```bash
# Run migrations
pnpm prisma migrate deploy

# Generate Prisma Client
pnpm prisma generate

# Seed test users for E2E testing
pnpm seed:e2e
```

Ini akan membuat test users berikut:

- ✅ `kader.verified@test.com` (Password123) - Approved kader
- ✅ `kader.unverified@test.com` (Password123) - Unverified kader
- ✅ `kader.declined@test.com` (Password123) - Declined kader
- ✅ `admin@test.com` (Admin123) - Admin user

---

## 🏃 Running the Application

### Terminal 1: Start Backend API

```bash
pnpm start:dev
```

Backend akan berjalan di: `http://localhost:3001`

### Terminal 2: Start Frontend (if separate)

```bash
# Assuming frontend in separate repository
cd ../si-difa-frontend
npm run dev
```

Frontend akan berjalan di: `http://localhost:3000`

---

## 🧪 Running E2E Tests

### Option 1: Interactive Mode (Recommended for Development)

```bash
# Open Cypress Test Runner
pnpm cypress:open
```

**Steps:**

1. Cypress window akan terbuka
2. Pilih "E2E Testing"
3. Pilih browser (Chrome/Firefox/Edge)
4. Klik test file yang ingin dijalankan:
   - `auth/login.cy.ts`
   - `auth/register.cy.ts`
   - `kader/jadwal-posyandu.cy.ts`

### Option 2: Headless Mode (CI/CD)

```bash
# Run all tests
pnpm cypress:run

# Run specific test suite
pnpm cypress:auth          # Login & Register tests
pnpm cypress:jadwal        # Jadwal Posyandu tests

# Run in specific browser
pnpm cypress:run:chrome
pnpm cypress:run:firefox
```

---

## 📊 Test Results

### During Test Run

- ✅ Passed tests akan ditampilkan dengan warna hijau
- ❌ Failed tests akan ditampilkan dengan warna merah
- Screenshots untuk failed tests: `cypress/screenshots/`
- Videos (jika enabled): `cypress/videos/`

### After Test Run

```bash
# View test results in terminal
# Check for summary at the end of output

# Example output:
# ┌────────────────────────────────────────────────┐
# │ Tests:        26                                │
# │ Passing:      24                                │
# │ Failing:      2                                 │
# │ Pending:      0                                 │
# │ Skipped:      0                                 │
# │ Screenshots:  2                                 │
# │ Video:        true                              │
# │ Duration:     1:23                              │
# └────────────────────────────────────────────────┘
```

---

## 🔍 Debugging Failed Tests

### 1. Check Screenshots

```bash
ls -la cypress/screenshots/
```

### 2. Run Single Test in Interactive Mode

```bash
pnpm cypress:open
# Then select the specific test file
```

### 3. Add Breakpoints

Edit test file dan tambahkan:

```typescript
cy.debug(); // Pause and open DevTools
cy.pause(); // Pause test execution
```

### 4. Check Backend Logs

```bash
# Terminal where backend is running
# Look for error messages or stack traces
```

### 5. Check Browser Console

- Open Cypress Test Runner
- Open Developer Tools (F12)
- Check Console tab for JavaScript errors

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to API"

**Solution:**

```bash
# Make sure backend is running
pnpm start:dev

# Check if port 3001 is accessible
curl http://localhost:3001/api/v1
```

### Issue 2: "User not found / Invalid credentials"

**Solution:**

```bash
# Re-run test user seeder
pnpm seed:e2e

# Verify users in database
pnpm prisma studio
# Navigate to 'users' table
```

### Issue 3: "Timeout waiting for element"

**Solution:**

- Frontend might not be running
- Element selector might have changed
- Check if frontend URL is correct in `cypress.config.ts`

### Issue 4: "Rate limit exceeded"

**Solution:**

```bash
# Wait 1 minute before re-running tests
# Or restart backend to reset rate limiter
```

### Issue 5: "CORS error"

**Solution:**
Edit `src/main.ts` dan pastikan CORS enabled:

```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

---

## 📁 Test File Structure

```
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.cy.ts           # 8 login tests
│   │   └── register.cy.ts        # 10 register tests
│   └── kader/
│       └── jadwal-posyandu.cy.ts # 8 jadwal tests
├── fixtures/
│   ├── example.json
│   └── test-data.json            # Test data
├── support/
│   ├── commands.ts               # Custom commands
│   └── e2e.ts                    # Global config
├── E2E-TESTING.md                # Full documentation
└── TEST-SUMMARY.md               # Test summary
```

---

## ✅ Test Checklist

Before running tests, make sure:

- [ ] Backend is running on port 3001
- [ ] Frontend is running on port 3000 (if separate)
- [ ] Database is migrated and seeded
- [ ] Test users exist in database
- [ ] Environment variables are configured
- [ ] SMTP is configured (for email tests)

---

## 📝 Writing New Tests

### 1. Create New Test File

```bash
# Create in appropriate folder
touch cypress/e2e/kader/new-feature.cy.ts
```

### 2. Basic Test Template

```typescript
/// <reference types="cypress" />

describe('New Feature Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.loginAsKader(); // Use custom command
    cy.visit('/path-to-feature');
  });

  it('should do something', () => {
    // Your test here
    cy.get('button').click();
    cy.contains('Success').should('be.visible');
  });
});
```

### 3. Run Your Test

```bash
pnpm cypress:open
# Select your new test file
```

---

## 🎯 Next Steps

1. ✅ Setup completed - Run first test
2. 📖 Read full documentation: `cypress/E2E-TESTING.md`
3. 📊 Check test summary: `cypress/TEST-SUMMARY.md`
4. 🔧 Customize tests for your needs
5. 🚀 Integrate with CI/CD pipeline

---

## 📞 Need Help?

- Check documentation: `cypress/E2E-TESTING.md`
- Check Cypress docs: https://docs.cypress.io
- Contact QA team for support

---

**Happy Testing! 🎉**
