
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// Cấu hình CORS để cho phép Frontend truy cập
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://xcar-luxury.web.app', // Thay bằng domain Firebase của bạn
  'https://xcar-luxury.firebaseapp.com'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('Chính sách CORS không cho phép truy cập từ nguồn này.'), false);
    }
    return callback(null, true);
  }
}));

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://406_db_user:123456789%40@huyen.qy41sjs.mongodb.net/XcarDB?retryWrites=true&w=majority&appName=Huyen";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Kết nối thành công tới MongoDB Atlas'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// --- SCHEMAS ---
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  acceleration: String,
  power: String,
  price: { type: Number, required: true },
  description: String,
  imageUrl: String,
  category: { type: String, default: 'Supercar' },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Car = mongoose.model('Car', carSchema);
const User = mongoose.model('User', userSchema);

// --- API ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email này đã được đăng ký!" });

    const isAdmin = email === 'admin@xcar.com';
    const newUser = new User({ firstName, lastName, email, password, phone, isAdmin });
    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
    res.json({ firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập" });
  }
});

app.get('/api/cars', async (req, res) => {
  const cars = await Car.find().sort({ createdAt: -1 });
  res.json(cars);
});

app.post('/api/cars', async (req, res) => {
  const newCar = new Car(req.body);
  await newCar.save();
  res.status(201).json(newCar);
});

app.put('/api/cars/:id', async (req, res) => {
  const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCar);
});

app.delete('/api/cars/:id', async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Port linh hoạt cho môi trường Cloud
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));
