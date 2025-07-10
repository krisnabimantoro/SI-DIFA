import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { decryptToken } from 'src/lib/decrypt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['jwt']; // 👈 Ambil dari cookie

    const decryptJwt = decryptToken(jwt); // Dekripsi token jika diperlukan
    if (decryptJwt) {
      request.headers.authorization = `Bearer ${decryptJwt}`; // inject ke header agar passport bisa pakai
    }

    return request;
  }
}
