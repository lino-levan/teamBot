const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const prefix = "!";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if(message.content[0]===prefix){
    let args = message.content.split(" ");
    args[0] = args[0].split(prefix)[1];
    if(!message.author.bot){
      if(args[0]==="join"){
        if(args[1].match(/^\d\d\d\d$/gm)){
          let server = message.guild;
          if(server.roles.cache.find(role => role.name == args[1])!==undefined){
            message.member.roles.add(server.roles.cache.find(role => role.name == args[1]));
          }else{
            let name = args[1];
            server.roles.create({
              data: {
                name: name,
                mentionable: false,
                permissions:0
              }
            }).then((role)=>{
              message.member.roles.add(role);
              let server = message.guild;
              let category = server.channels.cache.find(c => c.name == "Teams" && c.type == "category");
              server.channels.create(name, {type:"text", parent: category,
                permissionOverwrites: [
                  {
                    id: role,
                    allow: ['VIEW_CHANNEL']
                  },
                  {
                    id: server.id,
                    deny: ['VIEW_CHANNEL']
                  }
                ]
              });
              server.channels.create(name, {type:"voice", parent: category,
                permissionOverwrites: [
                  {
                    id: role,
                    allow: ['VIEW_CHANNEL']
                  },
                  {
                    id: server.id,
                    deny: ['VIEW_CHANNEL']
                  }
                ]
              });
            })
          }
        }else{
          message.channel.send("Team name must be a four digit number!")
        }
      }
    }
  }
});

client.login('TOKEN_ID');
