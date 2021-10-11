-- CREATE DATABASE REDDIT;

-- CREATE TABLE Roles(
--     id int PRIMARY KEY IDENTITY, 
--     type varchar(20) not null, --basic/administrator
--     name VARCHAR(20) not null --user/admin
-- );

-- CREATE TABLE Users(
--     id int PRIMARY KEY IDENTITY,
--     userName varchar(32) not null UNIQUE,
--     password varchar(200) not null,
--     roleId int not null FOREIGN KEY REFERENCES Roles(id)
-- );
-- CREATE TABLE PostType(
--     id int PRIMARY KEY IDENTITY,
--     type VARCHAR(32) not NULL
-- )
-- CREATE TABLE Posts(
--     id int PRIMARY KEY IDENTITY,
--     userId int not null FOREIGN KEY REFERENCES Users(id),
--     typeId int not NULL FOREIGN KEY REFERENCES PostType(id),
-- 	pDate date not null,
--     title varchar(32) not null,
--     description text
-- );

-- CREATE TABLE Comments(
--     id int PRIMARY KEY IDENTITY,
--     postId int not null FOREIGN KEY REFERENCES POSTS(id),
--     userId int not null FOREIGN KEY REFERENCES Users(id),
--     comment text not null
-- );

-- CREATE TABLE Votes(
--     id int PRIMARY KEY IDENTITY,
--     isLike BIT not null,
--     postId int not null FOREIGN KEY REFERENCES POSTS(id),
--     userId int not null FOREIGN KEY REFERENCES Users(id)
-- );

-- INSERT INTO Roles VALUES('BASIC','USER');
-- INSERT INTO Roles VALUES('ADMINISTRATOR','ADMIN');
-- INSERT INTO Roles VALUES('MODERATE','MODERATOR');
-- INSERT INTO Roles VALUES('MANAGER','OWNER');

-- INSERT INTO PostType VALUES('Discussion');
-- INSERT INTO PostType VALUES('Question');
-- INSERT INTO PostType VALUES('Information');
-- INSERT INTO PostType VALUES('Entertainment');
-- INSERT INTO PostType VALUES('NoType');
