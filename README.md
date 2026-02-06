# ⚡ React Performance Test: Lazy vs Non-Lazy Initialization

Project demo để đo và so sánh performance giữa lazy initialization và non-lazy initialization trong React `useState`.

## 🎯 Mục đích

So sánh hiệu suất giữa hai cách khởi tạo state trong React:

1. **Non-Lazy**: `useState(expensiveCalculation())`
2. **Lazy**: `useState(() => expensiveCalculation())`

## 🚀 Cài đặt

```bash
# Clone repo
git clone <your-repo-url>
cd react-performance-test

# Cài đặt dependencies
npm install

# Chạy app
npm run dev
```

App sẽ mở tại `http://localhost:5173`

## 📊 Cách sử dụng

1. Click nút **"Bắt đầu Test"** để khởi tạo 2 components
2. Xem kết quả đo thời gian khởi tạo lần đầu
3. Click nút **"Re-render"** trên mỗi component nhiều lần
4. Quan sát sự khác biệt:
   - **Non-Lazy**: Tính toán chạy lại mỗi lần render (chậm hơn)
   - **Lazy**: Tính toán chỉ chạy 1 lần duy nhất (nhanh hơn)

## 🔍 Kết quả mong đợi

- **Lần render đầu tiên**: Cả 2 cách đều gần như bằng nhau
- **Các lần render sau**: 
  - Non-lazy component sẽ chậm hơn đáng kể vì phải chạy `expensiveCalculation()` mỗi lần
  - Lazy component render rất nhanh vì không phải tính toán lại

## 💡 Kết luận

**Lazy initialization hữu ích khi:**
- Giá trị khởi tạo tốn nhiều tài nguyên (tính toán phức tạp, đọc localStorage, parse JSON lớn...)
- Component có thể re-render nhiều lần

**Không cần dùng lazy initialization khi:**
- Giá trị khởi tạo đơn giản (primitive values, object literals nhỏ)
- Performance không phải vấn đề quan trọng

## 🛠️ Tech Stack

- React 18
- Vite
- Performance API

## 📝 License

MIT

---

Made with ❤️ để hiểu rõ hơn về React performance optimization
