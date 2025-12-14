# Cypress E2E Test Summary

## 🎯 Test Summary

Total E2E tests: **26 test cases** across 3 feature modules

### ✅ Test Coverage by Feature

| Feature             | Test Cases | Status   |
| ------------------- | ---------- | -------- |
| **Login**           | 8 tests    | ✅ Ready |
| **Register Kader**  | 10 tests   | ✅ Ready |
| **Jadwal Posyandu** | 8 tests    | ✅ Ready |

---

## 📋 Detailed Test Cases

### 1. Login Feature (8 tests)

| Test ID      | Description                               | Priority |
| ------------ | ----------------------------------------- | -------- |
| TC-LOGIN-001 | Login sukses dengan redirect ke Dashboard | HIGH     |
| TC-LOGIN-002 | Reject login untuk akun unverified        | HIGH     |
| TC-LOGIN-003 | Reject login untuk akun declined          | HIGH     |
| TC-LOGIN-004 | Reject login dengan password salah        | HIGH     |
| TC-LOGIN-005 | Validasi format email di frontend         | MEDIUM   |
| TC-LOGIN-006 | Reject login dengan email tidak terdaftar | HIGH     |
| TC-LOGIN-007 | Verifikasi JWT tokens di cookies          | HIGH     |
| TC-LOGIN-008 | Rate limiting pada login API              | MEDIUM   |

### 2. Register Kader Feature (10 tests)

| Test ID         | Description                            | Priority |
| --------------- | -------------------------------------- | -------- |
| TC-REGISTER-001 | Validasi mandatory fields kosong       | HIGH     |
| TC-REGISTER-002 | Reject password lemah                  | HIGH     |
| TC-REGISTER-003 | Reject konfirmasi password tidak cocok | HIGH     |
| TC-REGISTER-004 | Validasi format email (Frontend)       | MEDIUM   |
| TC-REGISTER-005 | Validasi email unik (Backend)          | HIGH     |
| TC-REGISTER-006 | Validasi format phone (Frontend)       | MEDIUM   |
| TC-REGISTER-007 | Validasi phone unik (Backend)          | HIGH     |
| TC-REGISTER-008 | Email notifikasi terkirim              | MEDIUM   |
| TC-REGISTER-009 | Password terenkripsi di DB             | HIGH     |
| TC-REGISTER-010 | Rate limiting pada register API        | MEDIUM   |

### 3. Jadwal Posyandu Feature (8 tests)

| Test ID       | Description                         | Priority |
| ------------- | ----------------------------------- | -------- |
| TC-JADWAL-001 | Validasi mandatory fields kosong    | HIGH     |
| TC-JADWAL-002 | Field lokasi support alamat panjang | MEDIUM   |
| TC-JADWAL-003 | Pemilihan tanggal valid             | HIGH     |
| TC-JADWAL-004 | Reject file upload > 5MB            | MEDIUM   |
| TC-JADWAL-005 | Auto-create presensi IBK            | HIGH     |
| TC-JADWAL-006 | Read/Display jadwal                 | HIGH     |
| TC-JADWAL-007 | Update jadwal data                  | HIGH     |
| TC-JADWAL-008 | Delete jadwal                       | HIGH     |

---

## 🚀 Quick Start

```bash
# Open Cypress Test Runner
pnpm cypress:open

# Run all tests (headless)
pnpm cypress:run

# Run auth tests only
pnpm cypress:auth

# Run jadwal tests only
pnpm cypress:jadwal
```

---

## 📊 Test Execution Matrix

| Browser  | OS                | Status       |
| -------- | ----------------- | ------------ |
| Chrome   | Linux/Mac/Windows | ✅ Supported |
| Firefox  | Linux/Mac/Windows | ✅ Supported |
| Edge     | Windows           | ✅ Supported |
| Electron | All               | ✅ Default   |

---

## 🔧 Pre-requisites

### Required Test Users in Database

```sql
-- Verified Kader
INSERT INTO users (email, password, role, verification, name, no_telp)
VALUES ('kader.verified@test.com', '$hashed_Password123', 'kader', 'approved', 'Kader Verified', '081234567890');

-- Unverified Kader
INSERT INTO users (email, password, role, verification, name, no_telp)
VALUES ('kader.unverified@test.com', '$hashed_Password123', 'kader', 'unverified', 'Kader Unverified', '081234567891');

-- Declined Kader
INSERT INTO users (email, password, role, verification, name, no_telp)
VALUES ('kader.declined@test.com', '$hashed_Password123', 'kader', 'declined', 'Kader Declined', '081234567892');
```

### Environment Setup

1. Backend API running: `http://localhost:3001`
2. Frontend running: `http://localhost:3000`
3. Database seeded with test users
4. SMTP configured for email tests

---

## 📝 Test Data

Test fixtures: `cypress/fixtures/test-data.json`

```json
{
  "users": {
    /* Test users */
  },
  "jadwal": {
    /* Test schedules */
  },
  "validation": {
    /* Invalid test data */
  }
}
```

---

## 🐛 Known Issues

- Rate limiting tests may require actual delay between requests
- Email verification requires actual SMTP setup
- File upload tests need proper multipart/form-data handling

---

## 📈 Future Improvements

- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Integrate with CI/CD pipeline
- [ ] Add test coverage reporting
- [ ] Add accessibility testing

---

## 📞 Contact

For questions or issues with E2E tests, contact the QA team.
