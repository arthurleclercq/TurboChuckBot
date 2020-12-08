const Discord = require('discord.js');
const client = new Discord.Client();
const {token } = require('./config.json');
const axios = require ("axios");
const { fdatasync } = require('fs');

prefix ="%";


function erreur(err,message){
    console.log(err);
    message.channel.send("Une erreur a eu lieu pendant le GET");
};

function printJoke(response,message){
    if (response.data.type ==="success"){
        message.channel.send(response.data.value.joke);
    }else{
        message.channel.send("Erreur : response data type différent de success");
    }
    
};

function printValue(response,message){
    if (response.data.type ==="success"){
        message.channel.send(response.data.value);
    }else{
        message.channel.send("Erreur : response data type différent de success");
    }
    
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on('message', message => {
    if (message.content.startsWith(prefix)){
        msg=message.content.slice(prefix.length)
        console.log(msg)    
        switch(msg) {
            case "joke":
                axios.get("http://api.icndb.com/jokes/random")
                    .then(response => printJoke(response,message))
                    .catch(err => erreur(err,message))
                break
            case "ping":
                let ping = Date.now() - message.createdTimestamp;
                message.channel.send(`Pong ! ${ping} ms`);
                break
            case "jokeCount":
                axios.get("http://api.icndb.com/jokes/count")
                    .then(response => printValue(response,message))
                    .catch(err => erreur(err,message))
                break
            default:
                break
        } 
    }
});



client.login(token);