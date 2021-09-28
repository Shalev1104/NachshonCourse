import { Model } from "./sql";

export class Post {
    constructor(private _userId : number, private _type : string, private _title : string, private _description : string)
    {

    }
    static async create(post : Post) : Promise<boolean>
    {
        const date = new Date(Date.now());
        const formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
        return await Model.insert("POSTS", [post._userId, await post.getTypeId(), formattedDate, post._title, post._description]);
    }
    async getTypeId() : Promise<number>
    {
        return (await Model.runQuery(`SELECT id FROM PostType where PostType.type='${this._type}'`)).recordset[0].id;
    }
    static async getAllPosts()
    {
        return ((await Model.runQuery(`
        SELECT po.id,
            po.title,
            CASE WHEN po.description IS NULL THEN '' ELSE po.description END AS description,
            CONVERT(varchar, po.pDate, 104) AS pDate,
            pt.type,
            us.userName,
            SUM(CASE WHEN vt.isLike = 1 THEN 1 ELSE 0 END) AS upvotes,
            SUM(CASE WHEN vt.isLike = 0 THEN 1 ELSE 0 END) AS downvotes
FROM Posts po
     INNER JOIN PostType pt ON po.typeId = pt.id
     INNER JOIN Users us ON po.userId = us.id
     LEFT OUTER JOIN Votes vt ON vt.postId = po.id
GROUP BY po.id,
         po.pDate,
         po.title,
         CASE WHEN po.description IS NULL THEN '' ELSE po.description END,
         pt.type,
         us.userName;
         `)).recordsets[0]);
    }
    static async getPostsBySearch(search : string)
    {
        return (await Model.runQuery(`
        SELECT po.id,
            po.title,
            CASE WHEN po.description IS NULL THEN '' ELSE po.description END AS description,
            CONVERT(varchar, po.pDate, 104) AS pDate,
            pt.type,
            us.userName,
            SUM(CASE WHEN vt.isLike = 1 THEN 1 ELSE 0 END) AS upvotes,
            SUM(CASE WHEN vt.isLike = 0 THEN 1 ELSE 0 END) AS downvotes
FROM Posts po
     INNER JOIN PostType pt ON po.typeId = pt.id
     INNER JOIN Users us ON po.userId = us.id
     LEFT OUTER JOIN Votes vt ON vt.postId = po.id
WHERE title like '%${search}%' OR description like '%${search}%'

GROUP BY po.id,
         po.pDate,
         po.title,
         CASE WHEN po.description IS NULL THEN '' ELSE po.description END,
         pt.type,
         us.userName;
         `)).recordsets[0];// problem here. need to add votes and format date;
    }
    get title()
    {
        return this._title;
    }
    get description()
    {
        return this._description;
    }
    get userId()
    {
        return this._userId;
    }
}

module.exports = { Post }