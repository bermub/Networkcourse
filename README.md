# ITTHIPHON Academic Portfolio

เว็บไซต์ส่วนตัวเผยแพร่ผลงานวิชาการและระบบจัดการผู้เรียน รายวิชา 31909-2005 การออกแบบและการจัดการเครือข่ายในองค์กร

## การใช้งาน

```powershell
npm install
npm run build
npm start
```

เปิดเว็บที่ `http://localhost:3000`

สำหรับพัฒนา frontend แยกด้วย Vite:

```powershell
npm run dev
```

## โครงสร้างระบบ

- `src/main.jsx` React application: หน้าบ้าน, login/register, เกม, LMS, dashboard และหลังบ้าน
- `src/styles.css` Tailwind/CSS สำหรับธีม cyber learning และ responsive UI
- `server.js` Express API, SQLite schema, seed data, auth, uploads, reports และ static hosting จาก `dist`
- `data/lms-seed.json` ข้อมูลตั้งต้นรายวิชา หน่วยเรียน และข้อสอบ
- `database.sqlite` ฐานข้อมูลที่สร้างอัตโนมัติเมื่อรันระบบ
- `public/assets` รูปภาพและสื่อประกอบที่ถูกเสิร์ฟผ่าน `/assets`
- `dist` production build จาก `npm run build`

## ความสามารถหลัก

- แสดงประวัติครูและช่องทางติดต่อจากเว็บไซต์เดิม
- เผยแพร่ผลงานวิชาการ/กิจกรรม
- ระบบ login/register สำหรับผู้เรียน พร้อม role `student`, `teacher`, `admin`
- เกมฝึกทักษะเครือข่าย เช่น OSI, VLAN, Packet, Cable, IP, Defense และ Enterprise Network
- LMS รายวิชา 31909-2005 จำนวน 15 หน่วย พร้อมลำดับการเรียน บันทึกความก้าวหน้า และแบบทดสอบท้ายบท
- หลังบ้านสำหรับจัดการข่าวกิจกรรม หมวดหมู่ ผู้เรียน เนื้อหาหน่วยเรียน รายงาน LMS และวิเคราะห์ผู้เรียนรายบุคคล
- API health check ที่ `GET /api/health` สำหรับดูสถานะฐานข้อมูลและคำเตือน configuration

## ค่าแนะนำก่อนใช้งานจริง

ตั้งค่า environment variables เหล่านี้ก่อน deploy เพื่อไม่ใช้ค่าเริ่มต้น:

```powershell
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="change-this-password"
$env:ADMIN_TOKEN="change-this-long-random-token"
$env:PASSWORD_SALT="change-this-long-random-salt"
npm start
```
