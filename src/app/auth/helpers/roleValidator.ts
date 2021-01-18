import { User } from "../../shared/models/user.interface";
export class RoleValidator{
    isEncuestador(user: User): boolean{
        return user.role === 'ENCUESTADOR';
    }
    isAdmin(user: User): boolean{
        return user.role === 'ADMIN';
    }
}