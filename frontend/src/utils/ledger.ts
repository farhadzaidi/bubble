import mysqlx from "@mysql/xdevapi";
import { LEDGER_HOST } from "../constants";

export const connectToLedgerDatabase = async () => {
  return await mysqlx.getSession({
    host: LEDGER_HOST,
    port: 33050,
    user: "client_dev",
    password: "client_dev",
    schema: "ledger_dev",
  });
};
