# SI-DIFA (Sistem Informasi Difabel)

Backend API untuk Sistem Informasi Difabel, dibangun menggunakan NestJS, Prisma ORM, dan PostgreSQL.

## 📋 Deskripsi

SI-DIFA adalah sistem informasi yang dirancang untuk mengelola data dan aktivitas terkait Ibu dan Anak (IBK), posyandu, kader, dan layanan psikolog. Sistem ini menyediakan fitur manajemen presensi, jadwal kegiatan, monitoring, dan informasi edukasi.

## 🚀 Tech Stack

- **Framework**: NestJS v11
- **Database**: PostgreSQL
- **ORM**: Prisma v6.11
- **Authentication**: JWT (Passport)
- **Validation**: Class Validator
- **Security**: CSRF Protection, Bcrypt
- **Package Manager**: PNPM
- **File Upload**: Multer
- **Email**: Nodemailer

## 📦 Prerequisites

Pastikan Anda telah menginstall:

- Node.js (v18 atau lebih tinggi)
- PNPM (v8 atau lebih tinggi)
- PostgreSQL (v14 atau lebih tinggi)

## ⚙️ Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd SI-DIFA
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables**

Buat file `.env` di root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/si_difa?schema=public"

# JWT Secret
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Server
PORT=3001
NODE_ENV=development

# CSRF
CSRF_SECRET=your-csrf-secret-here

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
```

4. **Setup database**

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# (Optional) Seed database
pnpm prisma db seed
```

## 🏃 Running the Application

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod

# Debug mode
pnpm start:debug
```

Server akan berjalan di `http://localhost:3001`

API Base URL: `http://localhost:3001/api/v1`

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 📚 API Documentation

### Base URL

```
Production: https://sidifa.my.id/api/v1
Development: http://localhost:3001/api/v1
```

### Authentication Endpoints

#### Register

```http
POST /api/v1/auth/signup/kader
POST /api/v1/auth/signup/psikolog
Content-Type: application/json

{
  "nama": "string",
  "email": "string",
  "password": "string",
  "no_telp": "string"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
```

#### Logout

```http
POST /api/v1/auth/logout
```

### Admin Endpoints

#### Verifikasi User

```http
PATCH /api/v1/admin/verification
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "verification": "approved|rejected"
}
```

#### List Users

```http
GET /api/v1/admin/list-user?page=1&limit=10&orderBy=asc
Authorization: Bearer <token>
```

### Kader Endpoints

#### Register Kader Posyandu

```http
POST /api/v1/kader/register-kader-posyandu
Authorization: Bearer <token>
```

#### Informasi Edukasi Kader

```http
GET /api/v1/kader/informasi-edukasi-kader?page=1&limit=10
GET /api/v1/kader/informasi-edukasi-kader/detail/:id
```

#### Jadwal Posyandu

```http
POST /api/v1/kader/jadwal-posyandu
GET /api/v1/kader/jadwal-posyandu/:posyanduId?page=1&limit=10
GET /api/v1/kader/jadwal-posyandu/detail/:id
PATCH /api/v1/kader/jadwal-posyandu/update/:id
DELETE /api/v1/kader/jadwal-posyandu/delete/:id
Authorization: Bearer <token>
```

#### Presensi IBK

```http
POST /api/v1/kader/presensi-ibk
GET /api/v1/kader/presensi-ibk/:jadwalId?page=1&limit=10
GET /api/v1/kader/presensi-ibk/detail/:id
GET /api/v1/kader/presensi-ibk/ibk-not-registered/:jadwalId/posyandu/:posyanduId
PATCH /api/v1/kader/presensi-ibk/update/:id
PATCH /api/v1/kader/presensi-ibk/bulk-update/:jadwalId
DELETE /api/v1/kader/presensi-ibk/delete/:id
Authorization: Bearer <token>
```

#### Profile Kader

```http
GET /api/v1/kader/profile/detail
Authorization: Bearer <token>
```

#### Presensi Kader

```http
POST /api/v1/kader/presensi-kader
GET /api/v1/kader/presensi-kader/:jadwalId?page=1&limit=10
GET /api/v1/kader/presensi-kader/detail/:id
PATCH /api/v1/kader/presensi-kader/update/:id
DELETE /api/v1/kader/presensi-kader/delete/:id
Authorization: Bearer <token>
```

#### Monitoring IBK

```http
POST /api/v1/kader/monitoring-ibk
GET /api/v1/kader/monitoring-ibk?page=1&limit=10
GET /api/v1/kader/monitoring-ibk/detail/:id
PATCH /api/v1/kader/monitoring-ibk/update/:id
DELETE /api/v1/kader/monitoring-ibk/delete/:id
Authorization: Bearer <token>
```

#### Pendataan IBK

```http
POST /api/v1/kader/pendataan-ibk
GET /api/v1/kader/pendataan-ibk?page=1&limit=10
GET /api/v1/kader/pendataan-ibk/detail/:id
PATCH /api/v1/kader/pendataan-ibk/update/:id
DELETE /api/v1/kader/pendataan-ibk/delete/:id
Authorization: Bearer <token>
```

#### Lowongan Kader

```http
GET /api/v1/kader/lowongan-kader?page=1&limit=10
GET /api/v1/kader/lowongan-kader/detail/:id
Authorization: Bearer <token>
```

#### Posyandu Kader

```http
GET /api/v1/kader/posyandu-kader/:kaderId
Authorization: Bearer <token>
```

### Query Parameters (Umum)

- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10)
- `orderBy`: Urutan sorting (asc/desc)
- `search`: Pencarian data

## 📁 Struktur Database

### Main Tables

- `users` - Data pengguna sistem
- `users_kader` - Data kader posyandu
- `users_psikolog` - Data psikolog
- `posyandu` - Data posyandu
- `jadwal_posyandu` - Jadwal kegiatan posyandu
- `ibk` - Data Ibu dan Anak (IBK)
- `presensi_kader` - Presensi kader
- `presensi_ibk` - Presensi IBK
- `monitoring_ibk` - Data monitoring IBK
- `informasi_edukasi` - Informasi & edukasi
- `lowongan` - Lowongan pekerjaan

## 🔐 Security

- JWT Authentication dengan Access & Refresh Token
- CSRF Protection
- Password Hashing dengan Bcrypt
- Role-based Access Control (RBAC)
- HTTP Only Cookies
- CORS Configuration
- Request Throttling

## 📝 Database Commands

```bash
# Generate Prisma Client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database
pnpm prisma migrate reset

# Open Prisma Studio
pnpm prisma studio

# Seed database
pnpm prisma db seed
```

## 🛠️ Development Tools

```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Build project
pnpm build
```

## 📂 Project Structure

```
SI-DIFA/
├── prisma/
│   ├── migrations/        # Database migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seeder
├── src/
│   ├── admin/            # Admin module
│   ├── auth/             # Authentication module
│   ├── kader/            # Kader module
│   │   ├── informasi-edukasi-kader/
│   │   ├── jadwal-posyandu/
│   │   ├── presensi-ibk/
│   │   ├── presensi-kader/
│   │   ├── monitoring-ibk/
│   │   ├── pendataan-ibk/
│   │   ├── lowongan-kader/
│   │   └── profile/
│   ├── dto/              # Data Transfer Objects
│   ├── guards/           # Auth guards
│   ├── middleware/       # Custom middleware
│   ├── strategys/        # Passport strategies
│   └── main.ts          # Application entry point
├── uploads/             # Uploaded files
└── test/               # Test files
```

## 🌐 Deployment

Aplikasi ini di-deploy di:

- Production: https://sidifa.my.id
- CORS: Configured untuk production domain

## 📄 License

UNLICENSED - Private Project

## 👥 Roles & Permissions

- **Admin**: Verifikasi user, manajemen sistem
- **Kader**: Manajemen posyandu, presensi, monitoring IBK
- **Psikolog**: Konsultasi dan layanan psikologi
- **IBK**: Akses informasi dan jadwal

## 📞 Support

Untuk pertanyaan dan dukungan, silakan hubungi tim development

# e2e tests

$ yarn run test:e2e

# test coverage

$ yarn run test:cov

````

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
````

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
