const http = require('http');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const PORT = process.env.PORT || 5500;
const array = [];
const saltSize = 32;
const sql = require('mssql');
const config = require('./dbconfig');
require('dotenv/config');

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    function middlewareAuthorize()
    {
            return new Promise((resolve,reject) =>
            {
                try
                {
                    const bearer_token = req.headers.authorization;
                    const token = bearer_token.split(" ")[1];
                    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) =>
                    {
                        if(err) 
                        {
                            res.statusCode = 403; 
                            reject('invalid token') 
                        }
                        else
                        {
                            res.statusCode = 200;
                            resolve(user);
                        }
                    });
                }
                catch(err)
                {
                    reject('Login failed : Access Denied');
                    res.statusCode = 401;
                }
            })
    }
    function middlewareAdmin(user)
    {
        return user.role === "ADMINISTRATOR";
    }
    switch (req.url)
    {
        case '/' :
            if(req.method === 'GET')
            {
                let msg;
                const date = new Date();
                const now = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        
                middlewareAuthorize().then(user => {
                    msg = 'Hello ' + user.userName + ' today is ' + now;
                }).catch(() => {
                    msg = 'Hello Guest today is ' + now;
                }).finally(() => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'plain/text');
                    res.end(msg);
                });
            }
            break;
        case '/echo' : 
        try
        {
            let data = '';
            req.on('data', chunk => {
                data += chunk.toString();
            });
            req.on('end', () => {
                res.setHeader('Content-Type', 'plain/text');
                res.statusCode = 200;
                res.end("the message is " + JSON.parse(data).msg);
            });
        }
        catch(err)
        {
            res.statusCode = 400;
            console.log(err);
            res.end();
        }
            break;
        case '/users' :

            if(req.method === 'GET') 
            {
                try
                {
                    middlewareAdmin(await middlewareAuthorize());
                    try
                    {
                        const users = (await runQuery("SELECT * FROM Users;")).recordset;
                        res.statusCode = 200;
                        res.write(JSON.stringify(users));                        
                    }
                    catch(dbErr)
                    {
                        res.statusCode = 500;
                        console.log(dbErr);
                    }
                }
                catch(err)
                {
                    res.statusCode = 401;
                    console.log(err);
                }
                finally
                {
                    res.end();
                }
            }

            else if(req.method === 'POST')
            {
                let data = '';
                req.on('data', chunk => {
                    data += chunk.toString();
                });
                req.on('end', async () => {
                    try
                    {
                        const user = {
                            userName : JSON.parse(data).userName,
                            password : JSON.parse(data).password,
                            name     : JSON.parse(data).name,
                            role     : JSON.parse(data).password === process.env.ADMIN_SECRET ? "ADMINISTRATOR" : "NORMAL"
                        }
                        user.password = await hashPassword(user.password);
                        return await new Promise((resolve, reject) => {
                            jwt.sign(user, process.env.TOKEN_SECRET, (err, token) => 
                            {
                                if(err)
                                {
                                    reject(err);
                                }
                                else
                                {
                                    resolve(token);
                                }
                            });
                        }).then(async token => {
                            await runQuery(`INSERT INTO Users VALUES('${user.userName}','${user.name}','${user.password}','${user.role}');`);
                            console.log('user added successfully');
                            res.setHeader('Content-Type', 'text/plain');
                            res.statusCode = 201;
                            res.write(token);
                        }).catch(err => {
                            res.statusCode = 403;
                            console.log(err.message);
                        });
                    }
                    catch(err)
                    {
                        res.statusCode = 400;
                        console.log(err.message);
                    }
                    finally
                    {
                        res.end();
                    }
                });
            }
            else if(req.method === 'PUT')
            {
                middlewareAuthorize().then((user) =>
                {
                    let data = '';
                    req.on('data', chunk => {
                        data += chunk.toString();
                    });
                    req.on('end',async () => {
                        try
                        {
                            const parsedData = JSON.parse(data).name;
                            await runQuery(`UPDATE Users SET name ='${parsedData}' WHERE ID =${user.ID};`)
                            console.log("successfully changed");
                            res.statusCode = 204;
                            res.end();
                        }
                        catch (e) {
                            res.statusCode = 400;
                            console.error(e.message);
                            res.end();
                        }
                    });
                }).catch((err) =>
                {
                    console.log(err);
                    res.statusCode = 401;
                    res.end();
                });
            }
            break;
        case urlInclude(req.url, "/users/") :
            if(req.method === 'GET')
            {
                try
                {
                    middlewareAdmin(await middlewareAuthorize()); //לשנות כאן כדי שייתן סטאטוס לכל מצב
                    let user, id;
                    try
                    {
                        id = req.url.split("/")[2];
                        user = (await runQuery(`SELECT * FROM Users WHERE ID =${id};`)).recordset;
                    }
                    catch(dbErr)
                    {
                        res.statusCode = 500;
                        console.log(err);
                    }

                    if(user.length === 0)
                    {
                        res.statusCode = 404;
                        console.log('user Id not exists');
                        res.end();
                    }
                    else
                    {
                        res.end(JSON.stringify(user));   
                    }
                }
                catch(err)
                {
                    res.statusCode = 403;
                    console.log(err);
                }
            }
            break;
        case '/login' :
            if(req.method === 'POST')
            {
                let data = '';
                req.on('data', chunk => {
                    data += chunk.toString();
                });
                req.on('end', async () => {
                    try
                    {
                        const userName = JSON.parse(data).userName;
                        const password = JSON.parse(data).password;
                        const user = ((await runQuery(`SELECT * FROM Users WHERE userName ='${userName}'`)).recordsets[0][0]);
                        if(user === undefined)
                        {
                            res.statusCode = 400;
                            console.log('undefined user');
                            res.end();
                        }
                        else
                        {
                            await verify(password, user.password).then(() => 
                            {
                                const accessToken = jwt.sign(user, process.env.TOKEN_SECRET);
                                res.statusCode = 200;
                                console.log('login success');
                                console.log('ho ho ' + user.userName);
                                res.end(JSON.stringify({ authentication : true, token : accessToken }));
                            }).catch(err => 
                            {
                                res.statusCode = 401;
                                console.log('login failed ' +  err);
                                res.end(JSON.stringify({ authentication : false, token : null }));
                            });
                        }
                    }
                    catch(err)
                    {
                        res.statusCode = 400;
                        console.log(err.message);
                        res.end();
                    }
                });
            }
            break;
        case '/array' :
            if(req.method === 'GET')
            {
                res.statusCode = 200;
                res.end(JSON.stringify(array));
            }
            else if(req.method === 'POST')
            {
                middlewareAuthorize().then(user => {
                    if(middlewareAdmin(user)) 
                    {
                        let rawData = '';
                        req.on('data', (chunk) => { rawData += chunk; });
                        req.on('end', () => {
                            try 
                            {
                                res.statusCode = 201;
                                const parsedData = JSON.parse(rawData).value;
                                if(parsedData)
                                {
                                    array.push(parsedData);
                                    res.end();
                                }
                                else
                                    throw new Error('syntax error');
                            }
                            catch (e) 
                            {
                                res.statusCode = 400;
                                console.error(e.message);
                                res.end();
                            }
                        });
                    }
                    else
                    {
                        res.statusCode = 403;
                        res.end();
                    }
            }).catch(err => {
                res.statusCode = 401;
                console.log(err);
                res.end();
            });

            }
            else if(req.method === 'DELETE')
            {
                middlewareAuthorize().then(user => {
                    if(middlewareAdmin(user))
                    {
                        if(array.length > 0)
                        {
                            res.statusCode = 204;
                            array.pop();
                            res.end();
                        }
                        else
                        {
                            res.statusCode = 404;
                            console.log('empty array');
                            res.end();
                        }
                    }
                    else
                    {
                        res.statusCode = 403;
                        res.end();
                    }
                }).catch(err => {
                    res.statusCode = 401;
                    console.log(err);
                    res.end();
                });
            }
            break;
        case urlInclude(req.url, "/array/") :
            if(req.method === 'PUT')
            {
                middlewareAuthorize().then(user => {
                    if(middlewareAdmin(user))
                    {
                        let rawData = '';
                        req.on('data', (chunk) => { rawData += chunk; });
                        req.on('end', () => {
                            try {
                            res.statusCode = 200;
                            const parsedData = JSON.parse(rawData).value;
                            if(parsedData)
                            {
                                const index = req.url.split('/')[2];
                                if(array.includes(array[index - 1]))
                                {
                                    array[index - 1] = parsedData;
                                    res.end(JSON.stringify(JSON.parse(rawData)));
                                }
                                else
                                {
                                    res.statusCode = 404;
                                    console.log('undefined index');
                                    res.end();
                                }
                            }
                            else
                            {
                                throw new Error('syntax error');
                            }
                            } catch (e) {
                            res.statusCode = 400;
                            console.error(e.message);
                            res.end();
                            }
                        });   
                    }
                    else
                    {
                        res.statusCode = 403;
                        res.end();
                    }
                }).catch(err => {
                    res.statusCode = 401;
                    console.log(err);
                    res.end();
                });
            }
            else if(req.method === 'DELETE')
            {
                middlewareAuthorize().then(user => {
                    if(middlewareAdmin(user))
                    {
                        const index = req.url.split('/')[2];
                        if(array.length >= index)
                        {
                            res.statusCode = 204;
                            array.splice(index - 1, 1);
                            res.end();
                        }
                        else
                        {
                            res.statusCode = 404;
                            console.log('empty array');
                            res.end();
                        }
                    }
                    else
                    {
                        res.statusCode = 403;
                        res.end();
                    }
                }).catch(err => {
                    res.statusCode = 401;
                    console.log(err);
                    res.end();
                });
            }
            break;
        default:
            res.statusCode = 404;
            res.end();
    }
});
function urlInclude(url, text)
{
    if(url.includes(text))
        return url;
    return undefined;
}
async function hashPassword(password)
{
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(saltSize / 2).toString("hex");

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + derivedKey.toString('hex'));
        });
    });
}
async function verify(reqPassword, userPassword) {
    return new Promise((resolve, reject) => {
        const salt = userPassword.substring(0, saltSize);
        const key  = userPassword.substring(saltSize);
        crypto.scrypt(reqPassword, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            (key === derivedKey.toString('hex') ? resolve() : reject('server error'));
        });
    });
}
function addAdmin(uName)
{
    return new Promise((resolve,reject) => {
        const adminReq = http.request(
            {
                method : 'POST',
                port : PORT,
                path : '/users',
                headers: { 'Content-Type' : 'application/json' }
                
            },() => resolve())
        
            adminReq.on('error', function (err)
            {
                console.log("ServerError, unable to create admin");
                reject(err)
            });
        
            adminReq.end(JSON.stringify({ userName : uName, password : process.env.ADMIN_SECRET, name : "admin"}));  
    });
};
server.listen(PORT, 'localhost', () => {
    console.log('listening on port : ' + PORT);
});
const admins = async () =>
{
    await Promise.all([addAdmin("A_D!M1_nN"), addAdmin("aDmi@N")]);
}
async function runQuery(query)
{
    const path = await sql.connect(config);
    return await path.request().query(query);
}
admins();