const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
  room: { // 채팅방 아이디
    type: ObjectId,
    required: true,
    ref: 'Room', // Room 스키마와 연결하여 Room 컬렉션의 ObjectId가 들어감
  },
  user: { // 채팅을 한 사람
    type: String,
    required: true,
  },
  chat: String, // 채팅 내역
  gif: String, // GIF 이미지 주소
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', chatSchema);