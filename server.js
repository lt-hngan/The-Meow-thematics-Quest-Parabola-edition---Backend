const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Cho phép tất cả các tên miền truy cập vào server này
app.use(cors()); 
app.use(express.json());

// Tạo API endpoint nhận yêu cầu từ Dashboard
app.post('/api/gemini', async (req, res) => {
    try {
        const { contents, targetModel } = req.body;
        
        // Lấy API Key bí mật từ môi trường (không lộ ra ngoài)
        const apiKey = process.env.GEMINI_API_KEY;
        const model = targetModel || "gemini-1.5-flash";

        // Server đại diện gọi sang Google
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contents })
        });

        const data = await response.json();
        
        // Trả kết quả về lại cho Dashboard
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Lỗi Server:", error);
        res.status(500).json({ error: { message: "Lỗi kết nối từ Backend." } });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
});