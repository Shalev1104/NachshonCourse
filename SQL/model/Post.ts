import { Model } from "./sql";
interface Filters {
    user? : string,
    search? : string,
    type? : string
}
export class Post {
    private static table = 'Posts';
    private static filters = {} as Filters;
    private static order : string;
    constructor(private _userId : number, private _type : string, private _title : string, private _description : string)
    {

    }
    static async create(post : Post) : Promise<boolean>
    {
        const date = new Date(Date.now());
        const formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
        return await Model.insert(Post.table, [post._userId, await post.getTypeId(), formattedDate, post._title, post._description]);
    }
    async getTypeId() : Promise<number>
    {
        return (await Model.runQuery(`SELECT id FROM PostType where PostType.type='${this._type}'`)).recordset[0].id;
    }
    static async getPost(id : number)
    {
        return await this.getPosts(`WHERE po.id=${id}`);
    }
    static async getPosts(where? : string, order? : string)
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
FROM ${Post.table} po
     INNER JOIN PostType pt ON po.typeId = pt.id
     INNER JOIN Users us ON po.userId = us.id
     LEFT OUTER JOIN Votes vt ON vt.postId = po.id
${where ? where : ''}

GROUP BY po.id,
         po.pDate,
         po.title,
         CASE WHEN po.description IS NULL THEN '' ELSE po.description END,
         pt.type,
         us.userName
${order ? order : '' };
         `)).recordsets[0]);
    }
    static async getPostsSetSearch(search : string)
    {
        search == "''" ? delete this.filters.search
        : this.filters.search = `(title like '%${search}%' OR description like '%${search}%')`;
        return await this.getPosts(this.getFilters(), this.order);
    }
    static async getPostsSetUser(user : string)
    {
        this.filters.user = `us.userName = '${user}'`;
        return await this.getPosts(this.getFilters(), this.order);
    }
    static async getPostsSetType(type : string)
    {
        type == "''" ? delete this.filters.type 
        : this.filters.type = `pt.type='${type}'`;
        return await this.getPosts(this.getFilters(), this.order);
    }
    static async getPostsSetOrder(order : string)
    {
        this.order = 'order by ';
        switch(order)
        {
            case 'newest' : 
                this.order += `po.pDate DESC`
                break;
            case 'oldest' :
                this.order += `po.pDate ASC`
                break;
            case 'popular' :
                this.order += `upvotes DESC`
        }
        return await this.getPosts(this.getFilters(), this.order);
    }
    static getFilters() : string
    {
        if(Object.values(this.filters).length > 0)
            return `WHERE ${ Object.values(this.filters).join("AND ") }`;
        return '';
    }
    static reset()
    {
        Object.keys(this.filters).forEach((k => delete this.filters[k]));
        this.order = '';
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