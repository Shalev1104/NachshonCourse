import { Model } from './sql';
import bcrypt from 'bcrypt';
export class User {
    constructor(protected _userName : string, protected _password : string)
    {

    }
    static async isExists(userName : string)
    {
        try
        {
            return await (await Model.runQuery(`SELECT * FROM Users WHERE userName='${userName}';`)).recordset[0];
        }
        catch
        {
            return undefined;
        }
    }
    static async authenticate(user : User) : Promise<boolean>
    {
        user._password = await bcrypt.hash(user._password, await bcrypt.genSalt());
        return await Model.insert("USERS", [user._userName, user._password, await user.getRoleId()]);
    }
    async getRoleId() : Promise<number>
    {
        return (await Model.runQuery(`SELECT id FROM Roles where Roles.name='${this.constructor.name}'`)).recordset[0].id;
    }
    static async login(userName : string, password : string)
    {
        try
        {
            const user = await User.isExists(userName);
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
        return (await User.isExists(this._userName)).id;
    }
    get userName(){
        return this._userName;
    }
    get password(){
        return this._password;
    }
}
module.exports = { User };