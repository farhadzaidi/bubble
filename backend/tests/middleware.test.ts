import request, { Response } from "supertest";
import { server } from "../jest.setup";
import { createTestSession, destroyTestSession } from "./utils";

describe("requireSession middleware", () => {
  it("should return an error for an invalid session", async () => {
    const response = await request(server).get("/main/ping-with-session");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid or expired session" });
  });

  it("should return a successful response for valid session", async () => {
    // Hit the sign in endpoint to create a session
    const [agent, _] = await createTestSession();

    const response: Response = await agent.get("/main/ping-with-session");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "pong" });

    // Hit the sign out endpoint to destroy the session
    await destroyTestSession(agent);
  });
});

describe("requireAuthToken middleware", () => {
  it("should return an error for missing auth header", async () => {
    const response = await request(server).get("/main/ping-with-token");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing or malformed auth header",
    });
  });

  it("should return an error for malformed auth header", async () => {
    const response = await request(server)
      .get("/main/ping-with-token")
      .set({ Authorization: "invalid auth header" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing or malformed auth header",
    });
  });

  it("should return an error for invalid auth token", async () => {
    const response = await request(server)
      .get("/main/ping-with-token")
      .set({ Authorization: "Bearer invalid_auth_token" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Invalid or expired auth token",
    });
  });

  it("should return a successful response for valid auth token", async () => {
    const [agent, token] = await createTestSession();

    const response = await request(server)
      .get("/main/ping-with-token")
      .set({ Authorization: `Bearer ${token}` });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "pong" });

    await destroyTestSession(agent);
  });
});

describe("verifyUser middleware", () => {
  it("should return an error for missing username in query", async () => {
    const response = await request(server).get("/main/ping-with-username");
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "Missing or invalid username in query",
    });
  });

  it("should return an error for invalid username is query ", async () => {
    const [agent, _] = await createTestSession();

    const response: Response = await agent
      .get("/main/ping-with-username")
      .query({ username: "wrongusername" });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "Missing or invalid username in query",
    });

    await destroyTestSession(agent);
  });

  it("should return a successful response for valid username in query", async () => {
    const [agent, _] = await createTestSession();

    const response: Response = await agent
      .get("/main/ping-with-username")
      .query({ username: "testusername" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "pong" });

    await destroyTestSession(agent);
  });
});

describe("rejectIfSession middleware", () => {
  it("should return an error for ongoing session", async () => {
    const [agent, _] = await createTestSession();

    const response: Response = await agent.get("/main/ping-without-session");
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: "Cannot access this endpoint with an ongoing session",
    });

    await destroyTestSession(agent);
  });

  it("should return a successful response for unauthenticated user", async () => {
    const response = await request(server).get("/main/ping-without-session");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "pong" });
  });
});
