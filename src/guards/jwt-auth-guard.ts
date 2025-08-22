import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { decryptToken } from 'src/lib/decrypt';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies[jwtConstants.accessTokenCookieName]; 
    if (jwt) {
      request.headers.authorization = `Bearer ${jwt}`; // inject ke header agar passport bisa pakai
    }

    return request;
  }
}
