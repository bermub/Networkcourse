# AGENT.md

คู่มือสำหรับผู้ช่วยพัฒนาโปรเจกต์ Smart Network Learning Platform

## ภาพรวมระบบ

โปรเจกต์นี้เป็นเว็บ React/Vite + Express + SQLite สำหรับแฟ้มสะสมผลงานครู, LMS รายวิชา 31909-2005, เกมฝึกสมรรถนะเครือข่าย 15 หน่วย, dashboard ผู้เรียน และหลังบ้านผู้ดูแล

ไฟล์หลัก:

- `src/main.jsx` แอป React ทั้งหน้าบ้าน ผู้เรียน เกม LMS และหลังบ้าน
- `src/styles.css` CSS/Tailwind layer, command center UI, animation, responsive
- `server.js` Express API, SQLite schema/seed, auth, upload, reports, static hosting
- `data/lms-seed.json` ข้อมูลรายวิชา หน่วยเรียน และข้อสอบตั้งต้น
- `database.sqlite` ฐานข้อมูล runtime ห้ามเขียนทับตอน deploy
- `dist` production build จาก `npm run build`
- `public/assets` รูปภาพประกอบและสื่อกิจกรรม

## คำสั่งสำคัญ

```powershell
npm install
npm run build
npm start
```

พัฒนา frontend:

```powershell
npm run dev
```

ตรวจ syntax server:

```powershell
node -c server.js
```

ตรวจ health เมื่อรัน server:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

## ข้อควรระวัง

- อย่าลบหรือเขียนทับ `database.sqlite` หากไม่ได้รับคำสั่งชัดเจน
- อย่า deploy `node_modules` ถ้าไม่จำเป็น
- ก่อนแก้ UI ให้ดู pattern ใน `src/main.jsx` และ `src/styles.css` ก่อน
- หลังแก้ frontend ต้องรัน `npm run build`
- หลังแก้ API ต้องรัน `node -c server.js`
- ห้ามพิมพ์รหัสผ่านหรือ secret ลงในเอกสาร/commit/log

## สถานะล่าสุดของระบบ

- เกม active ครบ 15 หน่วย
- LMS ทุกหน่วยมี `game.status = available`
- หน้าบ้าน/หลังบ้านมี command center dashboard
- มีตัวการ์ตูนบอทวิ่งแสดงสถานะกิจกรรมใน `AnimatedLearningMap`
- API `/api/game-data` ควรส่ง `games = 15` และ `units = 15`

## Deploy Server

Production server ใช้:

- path: `/opt/smart-network-learning`
- service: `smart-network-learning.service`
- port ภายใน: `3000`
- nginx reverse proxy ไป `127.0.0.1:3000`

ก่อน deploy ให้ backup:

```bash
ts=$(date +%Y%m%d-%H%M%S)
mkdir -p /root/backups
tar -czf /root/backups/smart-network-learning-$ts.tar.gz \
  -C /opt/smart-network-learning \
  --exclude=node_modules \
  --exclude=database.sqlite \
  --exclude=public/uploads \
  .
```

ไฟล์ที่ deploy ปกติ:

- `server.js`
- `dist`
- `src` เฉพาะเพื่อเก็บ source ล่าสุดบนเครื่อง

หลัง deploy:

```bash
chown -R www-data:www-data /opt/smart-network-learning/server.js /opt/smart-network-learning/dist /opt/smart-network-learning/src
systemctl restart smart-network-learning.service
systemctl status smart-network-learning.service --no-pager -l
curl -fsS http://127.0.0.1:3000/api/health
```

## Security

ควรตั้งค่า environment ใน systemd service ให้ครบก่อนใช้งานจริง:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_TOKEN`
- `PASSWORD_SALT`

ถ้า `/api/health` ขึ้น `needs-configuration` แปลว่ายังมีค่า default ที่ควรเปลี่ยน

## แนวทางแก้ UI

- รักษาโทน command center/cyber learning
- ใช้ภาพจริงจาก `public/assets` เป็นพื้นหลัง/กิจกรรม
- animation ควรใช้ CSS เป็นหลัก และต้องไม่บังการอ่านเนื้อหา
- หน้าผู้เรียนต้องเห็นสถานะเรียน บทเรียน เกม แบบทดสอบ และ activity log
- หลังบ้านต้องเห็น learner progress, game activity, LMS reports และคำเตือน config

