import request, { Response } from "supertest";
import { server } from "../jest.setup";
import { database } from "../src/database";
import { RowDataPacket } from "mysql2";
import { createTestSession } from "./utils";

describe("POST /auth/sign-in", () => {
  it("should return an error for invalid username", async () => {
    const response = await request(server)
      .post("/auth/sign-in")
      .set({ "content-type": "application/json" })
      .send({ username: "wrongusername", password: "testpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
  });

  it("should return an error for wrong password", async () => {
    const response = await request(server)
      .post("/auth/sign-in")
      .set({ "content-type": "application/json" })
      .send({ username: "testusername", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
  });

  it("should return create a session and return an auth token", async () => {
    const agent = request.agent(server);
    const response: Response = await agent
      .post("/auth/sign-in")
      .set({ "content-type": "application/json" })
      .send({ username: "testusername", password: "testpassword" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    // Validate session creation and auth token
    const cookies = response.headers["set-cookie"] as unknown as string[]; // Type gymnastics...
    const sessionCookies = cookies.find((cookie) =>
      cookie.startsWith("connect.sid=s%3")
    );
    expect(sessionCookies).toBeDefined();

    // Clean up (sign-out)
    await agent.post("/auth/sign-out").expect(200);
  });
});

describe("POST /sign-up", () => {
  it("should return an error for preexisting username", async () => {
    const agent = request.agent(server);
    const response: Response = await agent
      .post("/auth/sign-up")
      .set({ "content-type": "application/json" })
      .send({ username: "newusername", password: "newpassword" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    // Validate session creation and auth token
    const cookies = response.headers["set-cookie"] as unknown as string[];
    const sessionCookies = cookies.find((cookie) =>
      cookie.startsWith("connect.sid=s%3")
    );
    expect(sessionCookies).toBeDefined();

    // Validate user creation in the database
    const [result] = await database.query<RowDataPacket[]>(
      "SELECT username, password_hash FROM Users WHERE username=?",
      "newusername"
    );
    expect(result.length === 0);
    expect(result[0].username).toBeDefined();
    expect(result[0].password_hash).toBeDefined();

    // Clean up
    await agent.post("/auth/sign-out").expect(200);
    await database.query("DELETE FROM Users where username=?", "newusername");
  });
});

describe("POST /auth/sign-out", () => {
  it("should should destroy the session", async () => {
    // Sign in and create a session
    const [agent, _] = await createTestSession();

    const response: Response = await agent.post("/auth/sign-out");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Sign out successful" });

    // Verify that session cookie has been cleared
    const cookies = response.headers["set-cookie"] as unknown as string[]; // Type gymnastics...
    const sessionCookies = cookies.find((cookie) =>
      cookie.startsWith("connect.sid=s%3")
    );
    expect(sessionCookies).toBeUndefined();
  });
});

describe("POST /auth/get-token", () => {
  it("should return a succesful response with an auth token", async () => {
    const [agent, _] = await createTestSession();

    const response: Response = await agent.post("/auth/get-token");
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
