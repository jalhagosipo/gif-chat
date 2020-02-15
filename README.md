# gif-chat
- 웹소켓 채팅 프로젝트

> 웹소켓
>> 실시간 양방향 데이터 전송을 위한 기술 <br>
>> HTTP와 다르게 WS라는 프로토콜을 사용 <br>
>> 웹소켓 이전 : polling -> 주기적으로 서버에 새로운 업데이트가 없는지 확인하는 요청을 보내, 있다면 새로운 내용을 가져오는 방법 <br>
>> HTML5에 웹소켓 등장! -> 처음에 연결이 이루어지고 나면 계속 연결된 상태로 있어 업데이트가 있는지 요청을 보낼 필요없어짐. 업데이트할 내용이 생겼다면 서버에서 바로 클라이언트에 알려줌. http 프로토콜과 포트를 공유할 수 있으므로 다른 포트에 연결할 필요도 없음.

## v0.1
- ws모듈로 웹소켓 체험하기
- .env에 `COOKIE_SECRET = gifchat` 추가
- socket.js 추가 : 웹소켓로직, 이벤트 기반으로 동작
- `npm i ws`
- 양방향 통신이기 때문에 클라이언트에서도 웹 소켓 코드를 넣었다. (index.pug)
- 서버를 실행하는 순간 서버는 클라이언트에게 3초마다 메시지를 보내고 클라이언트도 서버에게 3초마다 메시지를 보낸다.
- `http://localhost:8005/`에 접속해 console과 노드의 콘솔을 확인하면 된다.
- 브라우저의 네트워크 탭에서도 요청이 반복되는 것이 아니라 http,ws 각각 한번 요청하고 ws로 요청한 부분에 메시지가 누적되는 것을 볼 수 있습니다.

## v0.2
- Socket.IO사용하기
- ws 패키지는 간단하게 웹소켓을 사용하고자 할때 좋다. 서비스가 조금 복잡해지면 Socket.IO를 사용하는 것이 편하다.
- `npm i socket.io`
- 클라이언트에도 Socket.IO 를 사용하기 (index.pug)
    - path옵션이 서버의 path옵션과 일치해야 통신이 가능하다
    - http프로토콜을 사용한다니??? 
    - Socket.io는 먼저 폴링방식으로 서버와 연결한다. 그래서 http프로토콜을 사용한것
    - 폴링 연결 후, 웹 소켓을 사용할 수 있다면 웹 소켓으로 업그레이드한다.
    - 웹소켓을 지원하는 브라우저는 웹 소켓방식으로 사용 가능한 것
    - 처음부터 웹소켓만 사용하고 싶다면 `transports: ['websocket']` 옵션을 주면된다.

