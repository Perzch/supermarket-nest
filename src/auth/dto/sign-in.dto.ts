import { OmitType, PartialType } from "@nestjs/mapped-types";
import { User } from "src/users/entities/user.entity";

export class SignInDto extends OmitType(User, ['id']){
    
}