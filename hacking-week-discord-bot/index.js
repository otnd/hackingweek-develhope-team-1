const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILDS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "GUILD_PRESENCES", "GUILD_SCHEDULED_EVENTS", "GUILD_VOICE_STATES", "GUILD_VOICE_STATES", "GUILD_WEBHOOKS"] });
const { token } = require('./config.json');

client.on('message', async msg => {
    //comando /articles
    if (msg.content == '/articles') {
        let response = await fetch('https://api.spaceflightnewsapi.net/v3/articles')
        let data = await response.json()
        let articlesId = [];
        data.forEach(item => articlesId.push(`ID: ${item.id} - Title: ${item.title}  `))
        //risposta
        let answer = '';
        //dispone in colonna i risultati
        articlesId.forEach(articleId => {
            answer += articleId + '\n';
        })
        msg.reply(answer)
    }
    //comando /articles/authors
    if (msg.content == '/articles/authors') {
        let response = await fetch('https://api.spaceflightnewsapi.net/v3/articles')
        let data = await response.json()
        let articlesId = [];
        data.forEach(item => articlesId.push(`Author: ${item.newsSite}`))

        let answer = '';

        articlesId.forEach(articleId => {
            answer += articleId + '\n';
        })
        msg.reply(answer)
    }
    //comando /articles/${id}
    else {
        let response = await fetch('https://api.spaceflightnewsapi.net/v3/articles')
        let data = await response.json()
        let articlesId = [];

        data.forEach(item => articlesId.push(`${item.id}`))
        
        articlesId.forEach(id => {
            if (msg.content == `/articles/${id}`) {
                let newArr = data.filter(article => article.id == id);
                msg.reply(newArr[0].summary)
            }
        })
    }
})


client.login(token);