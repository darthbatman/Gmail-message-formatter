var fs = require('fs');
var Mbox = require('node-mbox');

var mbox    = new Mbox('Chat44.mbox', { /* options */ });

var chats = [];

mbox.on('message', function(msg) {

	var chatIndex = -1;

	var message = {};

	for (var i = 0; i < chats.length; i++){
		if (chats[i].name == msg.split("X-GM-THRID: ")[1].split("\n")[0]){
			chatIndex = i;
			break;
		}
	}

	if (chatIndex != -1){
		message.time = msg.split('From ')[1].substring(msg.split('From ')[1].indexOf(" ") + 1).split("\n")[0];
		message.from = msg.split('From: ')[1].split("\n")[0];
		if (msg.indexOf('To: ') != -1){
			message.to = msg.split('To: ')[1].split("\n")[0];
		}
		message.message = msg.split("\r\n\r")[1].replace("\n", "");
		chats[chatIndex].messages.push(message);
	}
	else {
		chats.push({ name: msg.split("X-GM-THRID: ")[1].split("\n")[0], messages: [] });
		message.time = msg.split('From ')[1].substring(msg.split('From ')[1].indexOf(" ") + 1).split("\n")[0];
		message.from = msg.split('From: ')[1].split("\n")[0];
		if (msg.indexOf('To: ') != -1){
			message.to = msg.split('To: ')[1].split("\n")[0];
		}
		message.message = msg.split("\r\n\r")[1].replace("\n", "");
		chats[chats.length -1].messages.push(message);
	}

	for (var i = 0; i < chats.length; i++){
		fs.writeFileSync(chats[i].name + ".html", "<!DOCTYPE html><html><body>");
		for (var j = 0; j < chats[i].messages.length; j++){
			fs.appendFileSync(chats[i].name + ".html", "<p>" + chats[i].messages[j].time + "</p><strong>" + chats[i].messages[j].from + "</strong><p>" + chats[i].messages[j].message + "</p>");
		}
		fs.appendFileSync(chats[i].name + ".html", "</body></html>");
	}

	//console.log("Chats: \n" + JSON.stringify(chats));

	//console.log(msg.split("X-GM-THRID: ")[1].split("\n")[0]);
  // console.log(msg.split('From ')[1].substring(msg.split('From ')[1].indexOf(" ") + 1).split("\n")[0]);
  // console.log("From: " + msg.split('From: ')[1].split("\n")[0]);
  // if (msg.indexOf('To: ') != -1){
  // 	console.log("To: " + msg.split('To: ')[1].split("\n")[0]);
  // }
  // console.log(msg.split("\r\n\r")[1].replace("\n", ""));
});
 
mbox.on('error', function(err) {
  console.log('got an error', err);
});
 
mbox.on('end', function() {
  console.log('done reading mbox file');
});