const DataBase = require('better-sqlite3');

const users = new DataBase('./src/data/users.db');
const servers = new DataBase('./src/data/server.db');
const logs = new DataBase('./src/data/logs.db');

users.prepare(`
    CREATE TABLE IF NOT EXISTS users(
        userId TEXT PRIMARY KEY,
        userName TEXT,
        displayName TEXT
    )    
`).run();

servers.prepare(`
    CREATE TABLE IF NOT EXISTS servers(
        serverId TEXT PRIMARY KEY,
        serverName TEXT
    )
`).run();

logs.prepare(`
    CREATE TABLE IF NOT EXISTS logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        event TEXT,
        start TEXT,
        end TEXT 
    )
`).run();

function addLog(userId, event, start, end)
{
    logs.prepare(`
        INSERT INTO logs(
            userId,
            event,
            start,
            end
        )
        VALUES(?, ?, ?, ?)
    `).run(
        userId,
        event,
        start,
        end
    );
}

function addUser(userId, userName, displayName)
{
    users.prepare(`
        INSERT INTO users(
            userId,
            userName,
            displayName
        )
        VALUES(?, ?, ?)
        ON CONFLICT(userId) DO UPDATE SET
            userName = excluded.userName,
            displayName = excluded.displayName
        WHERE userName != excluded.userName OR displayName != excluded.displayName
    `).run(
        userId,
        userName,
        displayName
    );
}

function addServer(serverId, serverName)
{
    servers.prepare(`
        INSERT INTO servers(
            serverId,
            serverName
        )
        VALUES(?, ?)
        ON CONFLICT(serverId) DO UPDATE SET
            serverName = excluded.serverName
        WHERE serverName != excluded.serverName
    `).run(
        serverId,
        serverName
    );
}

module.exports = {
    users,
    servers,
    logs,
    addUser,
    addServer,
    addLog
};