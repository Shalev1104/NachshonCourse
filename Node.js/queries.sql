CREATE DATABASE Db;

CREATE TABLE Users(
    id int PRIMARY KEY IDENTITY,
    userName varchar(32) not null UNIQUE,
    name varchar(50) not null,
    password varchar(200) not null,
    role varchar(16) not null
);