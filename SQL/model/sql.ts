
import sql from 'mssql';
export abstract class Model {
    static async runQuery(query : string)
    {
        const path = await sql.connect(require('./config'));
        return await path.request().query(query);
    }
}
module.exports = {
    Model
}