export class UsersUpdateDto{
    usersId:string;
    fullName: string;
    email: string;
    role: string
   
/**
 * 
 * @param usersId
 * @param fullName 
 * @param email 
 * @param role
 
 */
    constructor(
        usersId:string,
        fullName: string,
        email: string,
        role:string,
        
    )
     {
        this.usersId = usersId;
        this.fullName = fullName;
        this.email = email;
        this.role = role
      

    }


}