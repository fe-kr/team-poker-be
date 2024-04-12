import { OmitType } from '@nestjs/swagger';

import { SignInDto } from './sign-in.dto';

export class SignUpDto extends OmitType(SignInDto, ['roomId']) {}
