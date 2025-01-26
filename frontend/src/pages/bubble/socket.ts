import { io } from "socket.io-client";
import { SERVER_URL } from "../../constants";

export const createSocketConnection = () => {
  const socket = io(SERVER_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    // TODO
  });

  return socket;
};
