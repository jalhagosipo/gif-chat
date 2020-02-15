const SocketIO = require('socket.io');

module.exports = (server) => {
  // 익스프레스 서버를 socket.io와 연결
  // 두번째 인자로 옵션 객체를 넣어 서버에 관한 여러 가지 설정을 할 수 있다.
  // 여기선 클라이언트와 연결할 수 있는 경로를 의미하는 path옵션만 사용했다.
  const io = SocketIO(server, { path: '/socket.io'});

  // connection이벤트는 클라이언트가 접속했을 때 발생
  // 콜백으로 소켓 객체를 제공
  io.on('connection', (socket) => {

    // 응답객체 : socket.request.res
    const req = socket.request; // 요청객체
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // socket.id로 소켓의 주인이 누군지 특정할 수 있다.
    console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });

    socket.on('error', (error) => {
      console.error(error);
    });

    // 사용자가 직접 만든 이벤트
    // 클라이언트에서 reply라는 이벤트명으로 데이터를 보낼 때 서버에서 받는 부분
    // 이벤트명을 사용하는 것이 ws모듈과는 다르다.
    socket.on('reply', (data) => {
      console.log(data);
    });

    const interval = setInterval(() => {
      // 첫번째 인자 : 이벤트 이름
      // 두번째 인자 : 데이터
      // 클라이언트가 이 메시지를 받기 위해서는 news 이벤트 리스너를 만들어두어야 한다.
      socket.emit('news', 'Hello Socket.io');
    }, 3000);
  });
};