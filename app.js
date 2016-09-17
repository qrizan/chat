var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

app.use(express.static(path.join(__dirname, 'public')));

server.listen(process.env.POST || 3000);
console.log('Server running on PORT 3000');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected : %s sockets connected', connections.length);	

	// disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets disconnected', connections.length)		
	});

	// send message
	socket.on('send message', function(data){
		// console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	// new user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
		console.log('userlogin : '+data);
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});
