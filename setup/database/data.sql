
USE bubble_dev;

-- Users

REPLACE INTO Users 
VALUES ("testuser", "testpassword");

-- Password = "Testpassword1@"
REPLACE INTO Users
VALUES ("newuser", "$2b$11$MwC/99B51k0qgS46usZogu4x0c/N7xTPLGGXnUmVSkSyRO2HN0dCu");

REPLACE INTO Users
VALUES ("newuser2", "$2b$11$MwC/99B51k0qgS46usZogu4x0c/N7xTPLGGXnUmVSkSyRO2HN0dCu");

REPLACE INTO Users
VALUES ("newuser3", "$2b$11$MwC/99B51k0qgS46usZogu4x0c/N7xTPLGGXnUmVSkSyRO2HN0dCu");

-- Chats
REPLACE INTO Chats
VALUES ("newuser1:newuser2", "direct");

REPLACE INTO Chats
VALUES ("newuser1:newuser3", "direct");

REPLACE INTO Chats
VALUES ("newuser1:newuser2:newuser3", "group");

-- UserChats (junction)
REPLACE INTO UserChats
VALUES ("newuser1", "newuser1:newuser2");

REPLACE INTO UserChats
VALUES ("newuser2", "newuser1:newuser2");

REPLACE INTO UserChats
VALUES ("newuser1", "newuser1:newuser3");

REPLACE INTO UserChats
VALUES ("newuser3", "newuser1:newuser3");

REPLACE INTO UserChats
VALUES ("newuser1", "newuser1:newuser2:newuser3");

REPLACE INTO UserChats
VALUES ("newuser2", "newuser1:newuser2:newuser3");

REPLACE INTO UserChats
VALUES ("newuser3", "newuser1:newuser2:newuser3");

-- Messages

-- newuser1 and newuser2
REPLACE INTO Messages
VALUES ("e5042ca4-1395-4c31-af0c-b780ae298174", "newuser1:newuser2", "newuser1", "Hello");

REPLACE INTO Messages
VALUES ("e3d7db9d-fed7-4894-ae22-dff9cb2df1f4", "newuser1:newuser2", "newuser2", "Hi");

REPLACE INTO Messages
VALUES ("d7ed1091-019c-4703-a497-d1a883d6b47b", "newuser1:newuser2", "newuser1", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate eveniet possimus ipsum totam unde voluptas. Quod ut asperiores tenetur perspiciatis vel, rem natus similique quo totam voluptate, amet reprehenderit expedita?");

REPLACE INTO Messages
VALUES ("ddd0231c-45b2-4130-a646-cd930e3ef862", "newuser1:newuser2", "newuser2", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate eveniet possimus ipsum totam unde voluptas. Quod ut asperiores tenetur perspiciatis vel, rem natus similique quo totam voluptate, amet reprehenderit expedita?");

-- newuser1 and newuser3
