const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

// 채팅방 목록이 보이는 메인 화면을 랜더링
router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError') });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 채팅방 생성화면을 랜더링
router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

// 채팅방 만들기
router.post('/room', async (req, res, next) => {
  try {
    const room = new Room({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const newRoom = await room.save();

    // socket.js에서 app.set('io',io)로 저장했던 io객체를 가져옴
    const io = req.app.get('io');

    // /room 네임스페이스에 연결한 모든 클라이언트에게 데이터를 보냄
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 채팅방 랜더링 
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      req.flash('roomError', '존재하지 않는 방입니다.');
      return res.redirect('/');
    }
    if (room.password && room.password !== req.query.password) {
      req.flash('roomError', '비밀번호가 틀렸습니다.');
      return res.redirect('/');
    }

    // io.of('/chat').adapter.rooms에 방 목록이 들어있음
    const { rooms } = io.of('/chat').adapter;

    // rooms[req.params.id]를 통해 해당 방의 소켓 목록이 나옴 -> 소켓 수를 세서 참가 인원의 수를 알아낼 수 있음
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      req.flash('roomError', '허용 인원이 초과하였습니다.');
      return res.redirect('/');
    }
    return res.render('chat', {
      room,
      title: room.title,
      chats: [],
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 채팅방 삭제
router.delete('/room/:id', async (req, res, next) => {
  try {
    // 채팅방과 채팅내역 삭제
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');

    // 삭제 후 2초 뒤에 방이 삭제되었음을 알림
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;