import chalk from "chalk";
import { ExecutionCounter } from "./exec-info";
import { Loader } from "./loader";

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

let conn: any = null;

wss.on('connection', (ws: any, req: any) => {
    conn = ws;
    let clientId = req.headers['sec-websocket-key'];
    console.log(`New websocket client (${clientId}):  ${chalk.greenBright("connected")}`);
    // Initialize all counts of new client
    ExecutionCounter.initialEmitAllCounts();
    ExecutionCounter.initialExecData();
    ws.on('message', (message: any) =>  {
        console.log('received: %s', message);
    });
});

export class WsManager {
    static sendMessage(message: any) {
        if (conn) conn.send(message);
        else console.log("Connection not open");
    }
}

