import { OmitType, PartialType } from "@nestjs/mapped-types";
import { User } from "src/users/entities/user.entity";

export class SignUpDto extends OmitType(User, ['id']) {

}