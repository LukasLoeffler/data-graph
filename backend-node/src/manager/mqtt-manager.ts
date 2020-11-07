export class MqttServerConnection {
    id: number;
    name: string;
    url: string;
    username: string;
    password: string;

    constructor(id: number, name: string, url: string, username: string, password: string) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.username = username;
        this.password = password;
    }
}


let list: Array<MqttServerConnection> = [
    {name: "Hive", id: 1, url: "mqtt://broker.hivemq.com", username: "", password: ""},
    {name: "Mosquitto", id: 2, url: "mqtt://test.mosquitto.org", username: "", password: ""},
    {name: "Respond", id: 3, url: "mqtt://82.165.18.31", username: "", password: ""},
]

export class MqttServerManager {
    /**
     * Get all available nodes
     */
    static getAvailableServer(): Array<MqttServerConnection> {
        return list;
    }

    static getServerById(id: number): MqttServerConnection {
        let server= list.find((server: MqttServerConnection) => server.id === id);
        if (!server) throw new Error(`Server ${id} not found.`);
        return server;
    }
}
