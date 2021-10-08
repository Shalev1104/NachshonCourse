
import { User } from './User';
import { Model } from './sql';
export class Admin extends User{
    constructor(_userName: string, _password: string){
        super(_userName, _password);
    }
    async getAllUsers()
    {
        return await (await Model.runQuery(`SELECT * FROM ${User.table};`)).recordset[0];
    }
}