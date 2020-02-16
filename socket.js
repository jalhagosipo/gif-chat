const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });

  // 라우터에서 io객체를 쓸 수 있게 저장
  // req.app.get('io')로 접근 가능
  app.set('io', io);

  // of를 통해 Socket.io에 네임스페이스를 부여. 기본은 /
  // 같은 네임스페이스끼리만 데이터를 전달
  const room = io.of('/room');
  const chat = io.of('/chat');

  //io.use에 sessionMiddleware장착. 모든 웹 소켓 연결 시마다 실행됨
  io.use((socket, next) => {
    // 요청객체, 응답객체, next함수를 인자로 넣어주면 됨
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  // room에 연결한 클라이언트에게만 데이터를 전달
  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;

    // Socket.IO에는 네임스페이스보다 더 세부적인 개념으로 방(room)이라는 것이 있음
    // 같은 네임스페이스 안에서도 같은 방에 들어 있는 소켓끼리만 데이터를 주고받을 수 있음
    // socket.request.header.referer를 통해 현재 웹 페이지의 URL을 가져올 수 있고, URL에서 방 아이디 부분을 추출
    const { headers: { referer } } = req;
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');

    // 방에 들어감
    socket.join(roomId);

    // socket.to를 통해 특정 방에 데이터를 보낼 수 있음
    // 세션 미들웨어와 Socket.IO와 연결했으므로 웹 소켓에서 세션을 사용할 수 있음
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });


    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);

      // socket.adapter.rooms[roomId]에는 참여중인 소켓 정보가 들어 있음
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if (userCount === 0) {
        axios.delete(`http://localhost:8005/room/${roomId}`)
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};