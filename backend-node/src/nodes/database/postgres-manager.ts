export class DatabaseConnection {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;

    constructor(host: string, port: number, database: string, username: string, password: string) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.user = username;
        this.password = password;
    }
}

let connections: Array<DatabaseConnection> = [
    {host: "localhost", port: 5432, database: "processor", user: "postgres", password: "admin"},

]

export class PostgresManager{
    static getAllConnections() {
        return connections;
    }

    static getDefaultConnection() {
        return connections[0];
    }
}