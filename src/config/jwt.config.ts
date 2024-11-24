import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
    return {
        secret: 'supermarket_jwt_key_melody',
        signOptions: { expiresIn: '10h' }
    }
})