CREATE DATABASE TODOS;

CREATE TABLE STATUSES(
    id int PRIMARY KEY IDENTITY,
    type VARCHAR(32) not null
);

CREATE TABLE TODO(
    id int PRIMARY KEY IDENTITY,
    title varchar(32) not null,
    description varchar(max),
    expirationDate date not null,
    statusId int FOREIGN KEY REFERENCES STATUSES(id)
);