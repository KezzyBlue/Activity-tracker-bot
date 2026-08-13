const {Client, GatewayIntentBits} = require('discord.js');
const {users, addUser, servers, addServer, logs, addLog} = require('./database.js');

require('dotenv').config();


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', async () => {
    for(const guild of client.guilds.cache.values())
    {
        addServer(guild.id, guild.name);
        const members = await guild.members.fetch();
        for(const member of members.values())
        {
            addUser(member.user.id, member.user.username, member.user.displayName);
        }
    }

    const allUser = users.prepare(`
        SELECT * FROM users
    `).all();

    const allServer = servers.prepare(`
        SELECT * FROM servers    
    `).all(); 
}); 

const activities = new Map();

client.on('presenceUpdate', (oldPresence, newPresence) => {

    if(!activities.has(newPresence.userId))
        activities.set(newPresence.userId, new Map());
    
    const userActivities = activities.get(newPresence.userId);
    const currentActivities = new Map();

    for(const activity of newPresence.activities)
        if(activity.name != 'Spotify' && activity.name != 'Custom Status')
            currentActivities.set(activity.name, activity.timestamps.start);

    for(const [name, start] of currentActivities)
        if(!userActivities.has(name))
            userActivities.set(name, start);
    
    for(const [name, start] of userActivities)
        if(!currentActivities.has(name))
        {
            addLog(
                newPresence.userId,
                name,
                (new Date(start)).toISOString(),
                (new Date()).toISOString()
            );
            userActivities.delete(name);
        }
});

client.login(process.env.DISCORD_TOKEN);
