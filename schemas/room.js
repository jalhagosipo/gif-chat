const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  max: { // 최대 수용 인원
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  owner: { // 방장
    type: String,
    required: true,
  },
  password: String, // required 속성이 없으므로 꼭 넣지 않아도 됨. 설정하면 비밀방, 설정 안하면 공개방
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);