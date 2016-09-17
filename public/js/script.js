		$(function(){
			var socket = io.connect();
			var $messageForm = $('#messageForm');
			var $message = $('#message');			
			var $chat = $('#chat');
			var $messageArea = $('#messageArea');
			var $userArea = $('#userArea');
			var $userForm = $('#userForm');
			var $users = $('#users');
			var $username = $('#username');
			var $userlogin = $('#userlogin');
			var $onlineuser = $('#onlineuser');

			$messageForm.submit(function(e){
				e.preventDefault();
				socket.emit('send message', $message.val());
				$message.val('');
			});

			socket.on('new message', function(data){
				if ($userlogin.text() == data.user){
					$chat.append('<div class="alert alert-info"><p class="text-right"><i>'+ data.msg +'</i></p></div>');					
				}else{
					$chat.append('<div class="alert alert-warning"><strong>'+data.user+'</strong><i> : '+ data.msg +'</i></div>');	
				}

			});

			$userForm.submit(function(e){
				e.preventDefault();
				$userlogin.text($username.val());
				socket.emit('new user', $username.val(), function(data){
					if(data){
						$userArea.hide();
						$messageArea.show();
					}
				});
				$username.val('');
			});

			socket.on('get users', function(data){
				var html = '';
				for (i = 0;i < data.length; i++){
					html += '<li class="list-group-item">'+data[i]+'</li>'; 
				}
				$onlineuser.val('Online User : '+data.length);
				$users.html(html);
			});

		});