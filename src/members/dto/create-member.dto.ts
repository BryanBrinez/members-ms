import { IsEnum, IsString } from "class-validator";

export enum Role {
    ADMIN = "ADMIN",
    MIEMBRO = "MIEMBRO",
}

export class CreateMemberDto {
    @IsString()
    public userId: string; // ID del usuario

    @IsString()
    public projectsId: string; // ID del proyecto

    @IsEnum(Role)
    public role: Role; // Rol del miembro en el proyecto
}
