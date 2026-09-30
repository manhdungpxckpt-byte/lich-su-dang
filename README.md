# ★ Ôn Thi Trắc Nghiệm Lịch Sử Đảng

Website ôn tập trắc nghiệm **Lịch sử Đảng Cộng sản Việt Nam** với ngân hàng **539 câu hỏi** có đáp án & giải thích chi tiết, bám sát Giáo trình LSĐ (2021) và cập nhật đến **Đại hội XIV (1/2026)**.

## ✨ Tính năng

| Chế độ | Mô tả |
|---|---|
| 📝 Luyện tập | Chọn chương + số câu, xem đáp án & giải thích ngay từng câu |
| ⏱️ Thi thử | Đề ngẫu nhiên 15–50 câu, bấm giờ, chấm điểm thang 10, xem lại chi tiết |
| ♾️ Cày vô hạn | Câu hỏi nối tiếp không bao giờ hết, giữ chuỗi streak 🔥 |
| 📌 Ôn câu sai | Tự động lưu câu làm sai + ghim ⭐ câu khó để ôn riêng |
| 🔎 Tra cứu | Tìm kiếm toàn bộ ngân hàng theo từ khóa |
| 📊 Tiến độ | Lưu localStorage: số câu đã làm, tỷ lệ đúng, kỷ lục, chuỗi ngày ôn tập |

- 6 chương: 1930–1945 → 1945–1954 → 1954–1975 → 1975–1986 → 1986–2006 → 2006–nay
- Đảo đáp án ngẫu nhiên, responsive mobile, chế độ sáng/tối
- ⌨️ Phím tắt đầy đủ: `A–D` trả lời, `→/Enter` qua câu, `S` ghim, `J/K` chuyển câu thi, `Ctrl+Enter` nộp bài, `Alt+1–6` chuyển tab, `/` tra cứu, `?` xem bảng phím tắt
- 100% tĩnh (HTML/CSS/JS thuần) — không cần backend, chạy được offline

## 🚀 Chạy thử

```bash
# Cách 1: mở trực tiếp
open index.html   # hoặc double-click file

# Cách 2: chạy server
python3 -m http.server 8000
# vào http://localhost:8000
```

## 📁 Cấu trúc

```
├── index.html          # Giao diện chính (SPA)
├── css/style.css       # Giao diện đỏ–vàng, responsive, dark mode
└── js/
    ├── data-c1.js      # Chương 1: Đảng ra đời & giành chính quyền (101 câu)
    ├── data-c2.js      # Chương 2: Kháng chiến chống Pháp (85 câu)
    ├── data-c3.js      # Chương 3: Kháng chiến chống Mỹ (84 câu)
    ├── data-c4.js      # Chương 4: Xây dựng CNXH & đổi mới (97 câu)
    ├── data-c5.js      # Chương 5: Đổi mới & CNH–HĐH (82 câu)
    ├── data-c6.js      # Chương 6: Hội nhập sâu, Đại hội XI–XIV (90 câu)
    └── app.js          # Logic luyện tập, thi thử, vô hạn, thống kê
```

## 📚 Nguồn câu hỏi

Tổng hợp & đối chiếu từ: Giáo trình Lịch sử Đảng CSVN (NXB CTQG, 2021) • các bộ đề 270–730 câu lưu hành sinh viên • đề thi các trường (NEU, UEH, HUST, HVTC…) • tư liệu cập nhật Đại hội XIII–XIV, sáp nhập tỉnh thành 2025.
