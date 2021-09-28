
import sql from 'mssql';
export abstract class Model {
    static async runQuery(query : string)
    {
        const path = await sql.connect(require('./config'));
        return await path.request().query(query);
    }
    static async insert(table : string, arrValues : any[]) : Promise<boolean>
    {
        arrValues = arrValues.map(i => "'" + i + "'");
        const insert = await this.runQuery(`INSERT INTO ${ table } VALUES(${ arrValues.join() });`);
        return insert.rowsAffected[0] > 0;
    }
    static async update(table : string, where : string, whereData : any, set : string[], setData : any[]) : Promise<boolean>
    {
        const update = await this.runQuery(`UPDATE ${table} SET ${ set.map((val,i) => val + "=" + setData[i]).join() } WHERE ${where}=${whereData};`);
        return update.rowsAffected[0] > 0;
    }
    static async delete(table : string, where : string, whereData : any) : Promise<boolean>
    {
        const remove = await this.runQuery(`DELETE FROM ${table} WHERE ${where}=${whereData};`);
        return remove.rowsAffected[0] > 0;
    }
}
module.exports = {
    Model
}