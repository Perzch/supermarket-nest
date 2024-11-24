import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import jwtConfig from 'src/config/jwt.config';

/**
 * 访问令牌守卫类，用于保护需要授权的路由。
 * 
 * @class AccessTokenGuard
 * @implements {CanActivate}
 * 
 * @constructor
 * @param {Reflector} reflector - 反射器，用于获取路由的元数据。
 * @param {JwtService} jwtService - JWT服务，用于验证和解码JWT令牌。
 * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - JWT配置，用于验证JWT令牌的配置。
 * 
 * @method canActivate
 * @async
 * @param {ExecutionContext} context - 执行上下文，包含当前请求的信息。
 * @returns {Promise<boolean>} - 返回一个布尔值，表示请求是否被授权。
 * 
 * @throws {UnauthorizedException} - 如果令牌无效或不存在，则抛出未经授权的异常。
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // 如果方法被标记为公共,则直接通过 @Public()
    const isPublic = this.reflector.get('isPublic', context.getHandler())
    if(isPublic) {
      return true
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');
    if(!token) {
      new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration)
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException()
    }
    return true
  }
}
