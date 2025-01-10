import request from "supertest";
import { server } from "../jest.setup";

// Note: TestAgent has any type since its type can't be exported from supertest

// Creates a session and returns the corresponding test agent and auth token
export const createTestSession = async (): Promise<[any, string]> => {
  const agent = request.agent(server);
  const response = await agent
    .post("/auth/sign-in")
    .set({ "content-type": "application/json" })
    .send({ username: "testusername", password: "testpassword" })
    .expect(200);

  return [agent, response.body.token];
};

export const destroyTestSession = async (agent: any): Promise<void> => {
  await agent.post("/auth/sign-out").expect(200);
};
