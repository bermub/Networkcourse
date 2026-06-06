# DESIGN.md

## ภาพรวมโครงการ

เว็บนี้เป็นระบบ `Academic Portfolio` และระบบติดตามผู้เรียนของครู สำหรับเผยแพร่ประวัติ ผลงานวิชาการ ข่าวกิจกรรม รายวิชา 31909-2005 และข้อมูลความก้าวหน้าของผู้เรียนในหน้าเดียว โดยใช้แนวคิดเว็บที่ดูทันสมัย สว่าง อ่านง่าย และเน้นภาพจริงของกิจกรรม/ผลงาน

ระบบทำงานเป็นเว็บแอปแบบเรียบง่าย:

- Frontend: HTML, CSS, JavaScript ใน `public/`
- Backend: Express ใน `server.js`
- Database: SQLite ผ่าน `better-sqlite3`
- Static assets: รูปภาพใน `public/assets/`

## เป้าหมายการออกแบบ

1. แสดงตัวตนครูและผลงานให้ชัดเจนตั้งแต่หน้าจอแรก
2. รวมข้อมูลสำคัญไว้ในหน้าเดียว เพื่อเลื่อนดูได้ต่อเนื่อง
3. ใช้ภาพจริงและข้อมูลจริงเป็นจุดนำสายตา
4. ให้ครูเพิ่มผลงานและข้อมูลผู้เรียนได้ผ่านส่วน `Admin`
5. ใช้งานง่ายบนหน้าจอ desktop และ mobile
6. ใช้โครงสร้างที่แก้ไขต่อได้ง่าย โดยไม่ต้องเพิ่ม framework

## ผู้ใช้หลัก

- ครูเจ้าของผลงาน: เพิ่ม/ปรับปรุงผลงานและข้อมูลผู้เรียน
- ผู้ประเมินหรือผู้บริหาร: ดูประวัติ ผลงาน รายวิชา และหลักฐานกิจกรรม
- ผู้เรียน: ดูภาพรวมรายวิชาและข้อมูลความก้าวหน้า
- บุคคลทั่วไป: เข้าชม portfolio และข่าวกิจกรรม

## โครงสร้างหน้าจอ

### 1. Header / Navigation

ไฟล์หลัก: `public/index.html`

ส่วนหัวเป็น sticky navigation มี brand mark และลิงก์ไปยัง section สำคัญ:

- Profile
- Portfolio
- Activity
- Course
- Learners
- Admin

เป้าหมายคือให้ผู้ใช้กระโดดไปยังข้อมูลที่ต้องการได้ทันที โดยยังคงเห็นตัวตนของเว็บผ่านชื่อ `ITTHIPHON SUKTERM`

### 2. Hero

Hero ใช้ภาพกิจกรรมเป็นพื้นหลัง มีชื่อเจ้าของผลงานเด่นมาก และมีปุ่มไปยังรายวิชา/ผลงาน จุดนี้ทำหน้าที่เป็น first impression และบอกว่าเว็บนี้เกี่ยวข้องกับงานวิชาการ เทคโนโลยี และระบบติดตามผล

องค์ประกอบสำคัญ:

- ชื่อภาษาอังกฤษ
- ข้อความสรุปภารกิจ
- CTA ไปยัง `Course` และ `Portfolio`
- panel แสดงรายวิชา 31909-2005
- รูปภาพประกอบกิจกรรม

### 3. Profile

แสดงข้อมูลครู:

- ชื่อ
- รูปประจำตัว
- mission
- tags/highlights
- ตำแหน่ง หน่วยงาน อีเมล โทรศัพท์ ที่อยู่

ข้อมูลมาจาก API `/api/site` และ render ด้วย `renderProfile()` ใน `public/app.js`

### 4. Academic Works

แสดงผลงานวิชาการเป็น card grid โดยเรียงผลงานเด่นก่อน ผลงานสามารถเพิ่มได้จากฟอร์มหลังบ้าน

ข้อมูลอยู่ใน table `posts`

คุณสมบัติ:

- title
- category
- summary
- content
- image_url
- source_url
- featured

### 5. Activity News

แสดงข่าวกิจกรรมโดยเน้นรูปภาพและคำอธิบายกิจกรรม ใช้ modal preview เมื่อกดดูภาพ

ข้อมูลอยู่ใน table `activity_news`

### 6. Course

แสดงข้อมูลรายวิชา 31909-2005 ได้แก่:

- จำนวนหน่วยการเรียนรู้
- จำนวนแผน/ใบงาน
- ชั่วโมงรวม
- สมรรถนะ/มาตรฐานที่เกี่ยวข้อง

ข้อมูลมาจาก tables:

- `course_units`
- `lesson_plans`

### 7. Learner Management

แสดงตารางข้อมูลผู้เรียนและความก้าวหน้า:

- รหัสผู้เรียน
- ชื่อ
- กลุ่ม
- progress
- score
- status

ข้อมูลมาจาก `/api/learners`

### 8. Admin

หลังบ้านอยู่ในหน้าเดียวกับเว็บหลัก แบ่งเป็น 2 ฟอร์ม:

- เพิ่มผู้เรียน
- เพิ่มผลงาน

ฟอร์มส่งข้อมูลผ่าน `fetch()` ไปยัง API:

- `POST /api/learners`
- `POST /api/posts`

## สถาปัตยกรรมระบบ

```text
Browser
  |
  | GET /
  v
Express server
  |
  | serves static files
  v
public/index.html + styles.css + app.js
  |
  | fetch JSON
  v
Express API
  |
  | read/write
  v
SQLite database.sqlite
```

## Backend Design

ไฟล์หลัก: `server.js`

หน้าที่หลัก:

- สร้าง Express app
- เปิดใช้ JSON body parser
- serve static files จาก `public/`
- สร้าง SQLite tables เมื่อเริ่มระบบ
- seed ข้อมูลเริ่มต้น
- ให้บริการ API สำหรับหน้าเว็บ

### API

| Method | Path | หน้าที่ |
| --- | --- | --- |
| `GET` | `/api/site` | ดึงข้อมูล profile, posts, activity news, course units, lesson plans |
| `GET` | `/api/learners` | ดึงรายชื่อผู้เรียนทั้งหมด |
| `POST` | `/api/learners` | เพิ่มข้อมูลผู้เรียน |
| `POST` | `/api/posts` | เพิ่มผลงานวิชาการ |
| `GET` | `*` | fallback กลับไปที่ `index.html` |

### Data Model

Tables ที่ใช้:

- `profile`: ข้อมูลเจ้าของ portfolio
- `posts`: ผลงานวิชาการ
- `course_units`: หน่วยการเรียนรู้
- `lesson_plans`: แผนการจัดการเรียนรู้
- `learners`: ข้อมูลผู้เรียนและผลติดตาม
- `activity_news`: ข่าวกิจกรรมพร้อมรูปภาพ

## Frontend Design

ไฟล์หลัก:

- `public/index.html`: โครงสร้างหน้า
- `public/styles.css`: visual design และ responsive layout
- `public/app.js`: ดึงข้อมูลจาก API, render UI, handle form submit, image modal

### Visual Style

แนวทางภาพรวมคือ `AI Light Portfolio`

สีหลัก:

- Ink: `#101318`
- Paper: `#f5f7fb`
- Teal: `#00b8a9`
- Blue: `#2457ff`
- Lime: `#cdfa50`
- Rose: `#ff5c7a`
- Amber: `#ffc857`

หลักการใช้งานสี:

- ใช้พื้นหลังสว่างเพื่อให้อ่านง่าย
- ใช้ lime/teal เป็น accent สำหรับปุ่มและจุดเน้น
- ใช้ภาพจริงเป็น visual anchor
- ใช้ card radius ประมาณ 8px เพื่อให้ดูทันสมัยและเป็นระบบ

### Interaction

- Navigation แบบ anchor link
- Smooth scroll
- Image preview modal
- Form submit ผ่าน API โดยไม่ reload หน้า
- ตารางผู้เรียนมี progress bar

## แนวทาง Responsive

ควรรักษาหลักต่อไปนี้เมื่อแก้ไข CSS:

- Hero ต้องยังเห็นชื่อและภาพหลักชัดบน mobile
- Navigation ต้อง wrap ได้โดยไม่ทับเนื้อหา
- Card grid ต้องลด column อัตโนมัติ
- ตารางผู้เรียนควรเลื่อนแนวนอนได้ถ้าหน้าจอแคบ
- ปุ่มและ input ต้องมีขนาดกดง่ายบนมือถือ

## ข้อควรระวัง

1. ข้อความภาษาไทยบางส่วนในไฟล์อาจแสดงเพี้ยนหาก editor หรือ terminal อ่าน encoding ไม่ตรงกัน ควรรักษาไฟล์เป็น UTF-8
2. ตอนนี้ส่วน Admin ไม่มีระบบ login จึงเหมาะกับการใช้งานในเครื่องหรือเครือข่ายที่ควบคุมได้
3. การเพิ่มรูปผ่านฟอร์มใช้ URL หรือ path ที่ผู้ใช้กรอกเอง ยังไม่มีระบบ upload file
4. `database.sqlite` เป็นไฟล์ local database ควร backup ก่อนแก้ schema
5. API ยังไม่มี validation เชิงลึกหรือ permission แยก role

## แนวทางพัฒนาต่อ

- เพิ่มระบบ login สำหรับส่วน Admin
- เพิ่ม upload รูปภาพไปยัง `public/assets/`
- เพิ่มหน้าแก้ไข/ลบผลงานและผู้เรียน
- เพิ่ม export รายงานผู้เรียนเป็น CSV หรือ PDF
- เพิ่ม filter/search ในตารางผู้เรียน
- เพิ่มสถานะ loading และ error message ที่ชัดเจน
- ปรับระบบ seed data ให้แยกจาก logic หลักของ server
- เพิ่ม automated tests สำหรับ API สำคัญ

## วิธีรัน

```powershell
cd webpage
npm install
npm start
```

เปิดเว็บที่:

```text
http://localhost:3000
```
