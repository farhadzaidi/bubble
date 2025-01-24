
USE bubble_dev;

-- Users

REPLACE INTO Users 
VALUES ("testusername", "$2b$11$bXhcJZFypO3W9z/KG0Kq8OKym8bdKuzwW4iFPqsDMqCae4z.nOcpi");

-- Password = "Testpassword1@"
REPLACE INTO Users
VALUES ("newuser1", "$2b$11$MwC/99B51k0qgS46usZogu4x0c/N7xTPLGGXnUmVSkSyRO2HN0dCu");

REPLACE INTO Users
VALUES ("newuser2", "$2b$11$MwC/99B51k0qgS46usZogu4x0c/N7xTPLGGXnUmVSkSyRO2HN0dCu");

REPLACE INTO Users
VALUES ("newuser3", "$2b$11$MwC/99B51k0qgS46usZogu4x0c/N7xTPLGGXnUmVSkSyRO2HN0dCu");

-- Chats
REPLACE INTO Chats
VALUES ("newuser1:newuser2", "newuser1 and newuser2", "direct");

REPLACE INTO Chats
VALUES ("newuser1:newuser3", "newuser1 and newuser3", "direct");

REPLACE INTO Chats
VALUES ("newuser1:newuser2:newuser3", "newuser1, newuser2, and newuser3", "group");

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
VALUES ("e5042ca4-1395-4c31-af0c-b780ae298174", "newuser1:newuser2", "newuser1", "Hello", "2025-01-23 15:32:42");

REPLACE INTO Messages
VALUES ("e3d7db9d-fed7-4894-ae22-dff9cb2df1f4", "newuser1:newuser2", "newuser2", "Hi", "2025-01-23 15:33:23");

REPLACE INTO Messages
VALUES ("d7ed1091-019c-4703-a497-d1a883d6b47b", "newuser1:newuser2", "newuser1", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate eveniet possimus ipsum totam unde voluptas. Quod ut asperiores tenetur perspiciatis vel, rem natus similique quo totam voluptate, amet reprehenderit expedita?", "2025-01-23 15:36:12");

REPLACE INTO Messages
VALUES ("ddd0231c-45b2-4130-a646-cd930e3ef862", "newuser1:newuser2", "newuser2", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate eveniet possimus ipsum totam unde voluptas. Quod ut asperiores tenetur perspiciatis vel, rem natus similique quo totam voluptate, amet reprehenderit expedita?", "2025-01-23 15:38:21");

-- newuser1, newuser2, and newuser3
REPLACE INTO Messages
VALUES ("3821dad6-7d15-46e1-9639-39c3ed979fd7", "newuser1:newuser2:newuser3", "newuser2", "Lorem ipsum dolor, sit amet consectetur adipisicing elit.", "2025-01-23 15:38:21");

REPLACE INTO Messages
VALUES ("e70b2c05-298d-49d2-b771-a09be5717ca6", "newuser1:newuser2:newuser3", "newuser1", "Lorem ipsum dolor.", "2025-01-23 15:38:54");

REPLACE INTO Messages
VALUES ("aad78f42-ec6d-4ac1-878b-b4886cf4972d", "newuser1:newuser2:newuser3", "newuser1", "Voluptate eveniet possimus ipsum totam unde voluptas.", "2025-01-23 15:39:03");

REPLACE INTO Messages
VALUES ("237c65c4-31d3-45fa-a4d2-8e34326efe0b", "newuser1:newuser2:newuser3", "newuser3", "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate eveniet possimus ipsum totam unde voluptas. Quod ut asperiores tenetur perspiciatis vel, rem natus similique quo totam voluptate, amet reprehenderit expedita?", "2025-01-23 19:26:17");