import { Controller } from '@nestjs/common';
import { UserToAttributesService } from './user-to-attributes.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('User Attributes Map')
@Controller('user-to-attributes')
export class UserToAttributesController {
  constructor(private readonly userToAttributesService: UserToAttributesService) {}
}
