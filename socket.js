const WebSocket = require('ws');

module.exports = (server) => {
    // 익스프레스 서버를 웹 소켓 서버와 연결
  const wss = new WebSocket.Server({ server });

  // connection 이벤트는 클라이언트가 서버와 웹 소켓 연결을 맺을 때 발생
  // 익스프레스 서버와 연결한 후, 웹 소켓 객체(ws)에 이벤트 리스너 세 개(message, error, close)연결
  wss.on('connection', (ws, req) => {
      // 클라이언트의 ip를 알아낸다
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속', ip);

    // 클라이언트로부터 메시지가 왔을 때 발생
    ws.on('message', (message) => {
      console.log(message);
    });

    // 웹 소켓 연결 중 문제가 생겼을 때 발생
    ws.on('error', (error) => {
      console.error(error);
    });

    // 클라이언트와 연결이 끊겼을 때 발생
    ws.on('close', () => {
      console.log('클라이언트 접속 해제', ip);

      // 이 코드가 없다면 메모리 누수가 발생
      clearInterval(ws.interval);
    });

    // 3초마다 연결된 모든 클라이언트에게 메시지를 보내는 부분
    const interval = setInterval(() => {
        // 웹소켓 상태 : OPEN, CONNECTING, CLOSING, CLOSED
      if (ws.readyState === ws.OPEN) {
          // 하나의 클라이언트에게 메시지를 보낸다.
        ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
      }
    }, 3000);
    ws.interval = interval;
  });
};