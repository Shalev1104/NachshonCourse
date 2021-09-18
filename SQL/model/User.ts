import { Model } from './sql';
import bcrypt from 'bcrypt';
export class User {
    constructor(protected _userName : string, protected _password : string)
    {
        
    }
    static async isExists(userName : string) : Promise<User|undefined>
    {
        try
        {
            return await (await Model.runQuery(`SELECT * FROM Users WHERE userName='${userName}';`)).recordset[0] as User;
        }
        catch
        {
            return undefined;
        }
    }
    async authenticate() : Promise<boolean>
    {
            this._password = await bcrypt.hash(this._password, await bcrypt.genSalt());
            console.log(await this.getRoleId());
            const newUser = await Model.runQuery(`INSERT INTO Users VALUES('${this._userName}','${this._password}', '${await this.getRoleId()}');`);
            return newUser.rowsAffected[0] > 0;
    }
    async getRoleId() : Promise<number>
    {
        return (await Model.runQuery(`SELECT id FROM Roles where Roles.name='${this.constructor.name}'`)).recordset[0].id;
    }
    static async login(userName : string, password : string) : Promise<User|undefined>
    {
        try
        {
            const user = await User.isExists(userName);
            if(!user)
                return undefined;
            if(!await bcrypt.compare(password, user.password))
                return undefined;
            return user;
        }
        catch
        {
            return undefined;
        }
    }
    async getId() : Promise<number>
    {
        return (await Model.runQuery(`SELECT id FROM Users WHERE userName ='${this.userName}';`)).recordset[0].id;
    }
    get userName(){
        return this._userName;
    }
    get password(){
        return this._password;
    }
}
module.exports = { User };