import { Model } from './sql';
export class Comment {
    private static table = 'Comments'
    constructor(private postId : number, private userId : number, private comment : string)
    {

    }
    async insert() : Promise<boolean>
    {
        return await Model.insert(Comment.table, Object.values(this));
    }
    static async getPostComments(postId : number)
    {
        return (await Model.runQuery(`
        SELECT cm.*,us.userName FROM ${Comment.table} as cm 
        INNER JOIN Users as us on us.id=cm.userId
        where postId=${postId}
        order by cm.id desc`)).recordset;
    }
}