type color = {
    red : number,
    green : number,
    blue : number
}

type todo = {
    id : number,
    title : string,
    description? : string,
    color : color,
    status : string,
    expirationDate : Date
}

export default todo;