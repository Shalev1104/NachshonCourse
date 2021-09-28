import { Model } from "./sql";
import { User } from "./User";

export class Vote {
    private static table  = "Votes";
    constructor(private postId : number, private userId : number, private isLike? : boolean)
    {

    }
    static async isExists(postId : number, userId : number)
    {
        try
        {
            return await (await Model.runQuery(`SELECT id FROM ${Vote.table} WHERE postId ='${postId}' AND userId ='${userId}';`)).recordset[0];
        }
        catch
        {
            return undefined;
        }
    }
    static async getUserVotes(username : string)
    {
        const userId = await (await User.isExists(username)).id;
        return (await Model.runQuery(`SELECT * FROM ${Vote.table} where userId='${userId}';`)).recordset;
    }
    async delete() : Promise<boolean>
    {
        return await Model.delete(Vote.table, "id", await this.getId());
    }
    async insert() : Promise<boolean>
    {
        return await Model.insert(Vote.table, [this.boolToBit(), this.postId, this.userId]);
    }
    async update(isLike : boolean)
    {
        this.isLike = isLike;
        return await Model.update(Vote.table, 'id', await this.getId(), ["isLike"], [this.boolToBit()]);
    }
    async getId() : Promise<number>
    {
        return (await Vote.isExists(this.postId, this.userId)).id;
    }
    boolToBit() : number
    {
        return this.isLike ? 1 : 0;
    }
}
module.exports = { Vote }