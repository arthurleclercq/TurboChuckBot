const Discord = require('discord.js');
const client = new Discord.Client();
const {token } = require('./config.json');
const axios = require ("axios");
const { fdatasync } = require('fs');

prefix ="%";


function erreur(err,message){
    console.log(err);
    message.channel.send("Une erreur a eu lieu pendant la requête");
};

function printJoke(response,message){
    if (response.data.type ==="success"){
        message.channel.send(response.data.value.joke);
    }else{
        message.channel.send("Erreur : requête incorrecte");
    }
    
};

function printValue(response,message){
    if (response.data.type ==="success"){
        message.channel.send(response.data.value);
    }else{
        message.channel.send("Erreur : requête incorrecte");
    }
    
};


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on('message', message => {
    if (message.content.startsWith(prefix)){
        msg=message.content.slice(prefix.length)
        switch(msg) {
            case "joke":
                console.log(`joke`)
                axios.get("http://api.icndb.com/jokes/random?escape=javascript")
                    .then(response => printJoke(response,message))
                    .catch(err => erreur(err,message))
                break
            case "ping":
                console.log(`ping`)
                let ping = Date.now() - message.createdTimestamp;
                message.channel.send(`Pong ! ${ping} ms`);
                break
            case "jokeCount":
                console.log(`jokeCount`)
                axios.get("http://api.icndb.com/jokes/count?escape=javascript")
                    .then(response => printValue(response,message))
                    .catch(err => erreur(err,message))
                break
            case "jokeCategories":                
                console.log(`jokeCategories`)
                axios.get("http://api.icndb.com/categories?escape=javascript")
                    .then(response => printValue(response,message))
                    .catch(err => erreur(err,message))
                break

            default:
                if (msg.startsWith("joke [")){
                    msg=msg.split(" ")[1];
                    if (isNaN(msg.slice(1,-1))){
                        console.log(`joke, categories : ${msg}`)
                        axios.get(`http://api.icndb.com/jokes/random?limitTo=${msg}?escape=javascript`)
                            .then(response => printJoke(response,message))
                            .catch(err => erreur(err,message))}
                    else{                        
                        msg=msg.slice(1,-1);
                        console.log(`joke, id : ${msg}`)
                        axios.get(`http://api.icndb.com/jokes/${msg}?escape=javascript`)
                            .then(response => printJoke(response,message))
                            .catch(err => erreur(err,message))
                        }
                }else if (msg.startsWith("prefix ")){
                    msg=msg.split(" ")[1];
                    if (msg.length>1){
                        message.channel.send("Erreur : le préfixe doit être de longueur 1");
                    }else {
                        prefix=msg;
                        message.channel.send(`Nouveau préfixe : ${msg}`);
                    }
                }
                break
        } 
    }
});



client.login(token);