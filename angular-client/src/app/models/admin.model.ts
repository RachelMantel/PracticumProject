export class Admin{
    constructor(
      public password: string,
      public UserNameOrEmail?:string,
      public adminSecretCode?: string,
      public name?: string,
      public email?: string,
       ){
     }
}