const http = require('http');
const fileSystem = require('fs');
const jwt = require('jsonwebtoken');
const authMap = require('./mapPaths');
const crypto = require('crypto');
const PORT = process.env.PORT || 5500;
const users = [];
const saltSize = 32;
require('dotenv/config');

const server = http.createServer((req, res) => {
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
        return new Promise((resolve, reject) => {
            user.role === "ADMINISTRATOR" ? resolve() : reject('denied Access'); //returns reject because no value of role
        });
    }
    switch (req.url)
    {
        case '/' : 
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
            })
            break;
        case '/users' :

            if(req.method === 'GET') 
            {
                middlewareAuthorize().then(user => {
                    middlewareAdmin(user).then(() => {
                        res.statusCode = 200;
                        res.write(JSON.stringify(users));
                    }).catch((message) => {
                        res.statusCode = 403;
                        console.log(message);
                    });
                }).catch(err => {
                    res.statusCode = 401;
                    console.log(err);
                }).finally(() => {
                    res.end();
                });
            }

            else if(req.method === 'POST') // sign up || register
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
                        const exists = users.find(found => found.userName === user.userName);
                        if(exists !== undefined)
                        {
                            res.statusCode = 409;
                            console.log('user already exists');
                        }
                        else
                        {
                            user.password = await hashPassword(user.password);
                            return await new Promise((resolve, reject) => {
                                jwt.sign({user : user}, process.env.TOKEN_SECRET, (err, token) => 
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
                            }).then(token => {
                                res.setHeader('Content-Type', 'text/plain');
                                res.write(token);
                                users.push(user);
                                res.statusCode = 201;
                                console.log('user added successfully');
                            }).catch(err => {
                                res.statusCode = 403;
                                console.log(err.message);
                            });
                        }
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
                        const user = users.find(user => user.userName === userName);
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
            else if(req.method === 'GET')
            {
                res.statusCode = 405;
                console.log('verb incorrect');
                res.end();
            }
            break;
        case '/protected' :
            if(req.method === 'GET')
            {
                middlewareAuthorize().then((user) =>
                {
                    console.log('user ' + user.userName);
                }).catch((err) =>
                {
                    console.log(err);
                }).finally(() => {
                    res.end();
                });
            }
            break;
        default:
            res.statusCode = 404;
            res.end();
    }
});
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
    await addAdmin("A_D!M1_nN");
    await addAdmin("aDmi@N");
}
admins();