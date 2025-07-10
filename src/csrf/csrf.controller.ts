// src/controllers/csrf.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express'; // pastikan ini di-export dari tempat kamu declare
import { generateCsrfToken } from 'src/middleware/csrf';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = generateCsrfToken(req, res);

    return res.json({ csrfToken }); // kirim ke frontend
  }
}
