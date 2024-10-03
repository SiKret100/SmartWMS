export default class UserDto{
    email;
    userName;
    password;
    managerId;
    
    constructor(data){
        this.email = data.email;
        this.userName = data.userName;
        this.password = data.password;
        this.managerId = data.managerId === undefined ? null : data.managerId;
    }
}