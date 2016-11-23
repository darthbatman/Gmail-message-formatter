var fs = require('fs');
var Mbox = require('node-mbox');

var mbox    = new Mbox('Chat44.mbox', { /* options */ });

var chats = [];

var me = "darthanakin44@gmail.com";
var counter = 0;
mbox.on('message', function(msg) {
	var skipMessage = false;

	var chatIndex = -1;

	var message = {};

	var chatName = "";

	var chatID = msg.split("X-GM-THRID: ")[1].split("\n")[0];

	if (msg.split('From: ')[1].split("\n")[0].indexOf(me) != -1){
		if (msg.indexOf('To: ') != -1){
			chatName = msg.split('To: ')[1].split("\n")[0];
		}
		else {
			chatName = msg.split('From: ')[1].split("\n")[0];
		}
	}
	else {
		chatName = msg.split('From: ')[1].split("\n")[0];
	}

	for (var i = 0; i < chats.length; i++){
		if (chatID == chats[i].id || chatName.replace(/\s/g,'').split("/")[0] == chats[i].name){
			chatIndex = i;
			break;
		}
		// if (chats[i].name == chatName || (chats[i].with == chatName && chats[i].with.toString().indexOf(me) == -1)){
		// 	console.log((chats[i].with == chatName && chats[i].with != me));
		// 	if (chats[i].with){
		// 		console.log(chats[i].with.toString() + "&&");
		// 	}
		// 	else {
		// 		console.log("undefined");
		// 	}
		// 	console.log(chatName.toString() + "&&");
		// 	console.log(me + "&&")
		// 	chatIndex = i;
		// 	break;
		// }
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
		message.time = msg.split('From ')[1].substring(msg.split('From ')[1].indexOf(" ") + 1).split("\n")[0];
		message.from = msg.split('From: ')[1].split("\n")[0];
		message.to = "";
		if (msg.indexOf('To: ') != -1){
			message.to = msg.split('To: ')[2].split("\n")[0];
			if (message.from.indexOf(me) != -1){
				chats.push({ name: message.to.replace(/\s/g,'').split("/")[0], messages: [] });
			}
			else {
				chats.push({ name: message.from.replace(/\s/g,'').split("/")[0], messages: [] });
			}
		}
		else {
			if (message.from.indexOf(me) != -1){
				skipMessage = true;
			}
			else {
				chats.push({ name: message.from.replace(/\s/g,'').split("/")[0], messages: [] });
			}
		}
		message.message = msg.split("\r\n\r")[1].replace("\n", "");
		if (!skipMessage){
			chats[chats.length - 1].id = msg.split("X-GM-THRID: ")[1].split("\n")[0];
			chats[chats.length - 1].messages.push(message);
		}
		else {
			console.log(msg);
		}
	}

	for (var i = 0; i < chats.length; i++){
		fs.writeFileSync(chats[i].name + ".html", "<!DOCTYPE html><html><body>");
		for (var j = 0; j < chats[i].messages.length; j++){
			fs.appendFileSync(chats[i].name + ".html", "<p>" + chats[i].messages[j].time + "</p><strong>" + chats[i].messages[j].from + "</strong><p>" + chats[i].messages[j].message + "</p>");
		}
		fs.appendFileSync(chats[i].name + ".html", "</body></html>");
	}

});
 
mbox.on('error', function(err) {
  console.log('got an error', err);
});
 
mbox.on('end', function() {
  console.log('done reading mbox file');
});