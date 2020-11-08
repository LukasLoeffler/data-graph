const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

let conn: any = null;

wss.on('connection', (ws: any) => {
    conn = ws;
    console.log("Connected");
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

