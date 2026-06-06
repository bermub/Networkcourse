const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database(path.join(__dirname, "database.sqlite"));
const distDir = path.join(__dirname, "dist");
const publicDir = path.join(__dirname, "public");
const uploadsDir = path.join(publicDir, "uploads", "activity-news");
const lmsSeedPath = path.join(__dirname, "data", "lms-seed.json");
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "network-admin-token";
const PASSWORD_SALT = process.env.PASSWORD_SALT || "smart-network-learning";

app.use(express.json({ limit: "30mb" }));

function systemReadiness() {
  const usingDefaultAdminPassword = ADMIN_PASSWORD === "admin123";
  const usingDefaultAdminToken = ADMIN_TOKEN === "network-admin-token";
  const usingDefaultPasswordSalt = PASSWORD_SALT === "smart-network-learning";
  const warnings = [];

  if (usingDefaultAdminPassword) warnings.push("ADMIN_PASSWORD ยังเป็นค่าเริ่มต้น");
  if (usingDefaultAdminToken) warnings.push("ADMIN_TOKEN ยังเป็นค่าเริ่มต้น");
  if (usingDefaultPasswordSalt) warnings.push("PASSWORD_SALT ยังเป็นค่าเริ่มต้น");

  return {
    ok: warnings.length === 0,
    warnings,
    config: {
      adminPassword: usingDefaultAdminPassword ? "default" : "custom",
      adminToken: usingDefaultAdminToken ? "default" : "custom",
      passwordSalt: usingDefaultPasswordSalt ? "default" : "custom"
    }
  };
}

function loadLmsSeed() {
  try {
    return JSON.parse(fs.readFileSync(lmsSeedPath, "utf8"));
  } catch (err) {
    return { course: {}, units: [] };
  }
}

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(`${PASSWORD_SALT}:${password}`)
    .digest("hex");
}

const unitGameCatalog = [
  ["unit-01-design", 1, "Network Design Quest", "วิเคราะห์ความต้องการและออกแบบโครงสร้างเครือข่ายองค์กร", "เลือก requirement, topology และ redundancy ให้เหมาะกับโจทย์องค์กร", 8],
  ["unit-02-vlan", 2, "VLAN Zoning Game", "ออกแบบ LAN/VLAN และแบ่งเขตผู้ใช้งาน", "จัดผู้ใช้ลง VLAN และกำหนด segmentation policy ให้ปลอดภัย", 10],
  ["unit-03-ip-plan", 3, "IP Planner", "วางแผน IP Addressing และ Subnet", "จับคู่ subnet, gateway และ host role ให้ตรงกับแผนผังองค์กร", 10],
  ["unit-04-routing", 4, "Routing Path Finder", "กำหนดเส้นทางและตรวจสอบ packet path", "เลือก gateway, route และ troubleshooting step ให้ packet ไปถึงปลายทาง", 10],
  ["unit-05-cable-lab", 5, "Cable Lab Active", "งานระบบสายสัญญาณและการเข้าหัวสาย", "เรียงลำดับมาตรฐานสายและตรวจจุดผิดพลาดของงาน cabling", 12],
  ["unit-06-switching", 6, "Switching Ops", "ตั้งค่า switching และ loop prevention", "เลือก switch feature, trunk/access port และ loop protection", 10],
  ["unit-07-wireless", 7, "Wireless Coverage", "ออกแบบเครือข่ายไร้สายองค์กร", "วาง SSID, channel, security และ coverage ให้เหมาะกับพื้นที่", 10],
  ["unit-08-server", 8, "Server Services Lab", "บริการเครือข่ายและ server services", "จับคู่ DNS, DHCP, directory และ service monitoring กับสถานการณ์", 10],
  ["unit-09-packet", 9, "Packet Simulation", "วิเคราะห์ packet flow และ protocol", "จำลองการส่งข้อมูลผ่าน switch, router, firewall และ DNS", 10],
  ["unit-10-monitor", 10, "Monitoring Command", "ตรวจสอบระบบและวิเคราะห์ log", "เลือก metric, alert และ log evidence เพื่อแก้ปัญหาเครือข่าย", 8],
  ["unit-11-defense", 11, "Network Defense", "ความปลอดภัยเครือข่ายองค์กร", "ตัดสินใจรับมือ incident ด้วย firewall, isolation และ backup", 10],
  ["unit-12-firewall", 12, "Firewall Policy Game", "ออกแบบ firewall policy และ access control", "จัดลำดับ policy, zone และ rule ให้ปลอดภัยโดยไม่กระทบงาน", 10],
  ["unit-13-cloud", 13, "Hybrid Cloud Link", "เชื่อมต่อเครือข่ายองค์กรกับ cloud", "เลือก VPN, routing, DNS และ identity integration สำหรับ hybrid network", 8],
  ["unit-14-incident", 14, "Incident Response Drill", "ซ้อมรับมือเหตุการณ์และกู้คืนระบบ", "เรียงลำดับ containment, evidence, recovery และ lesson learned", 8],
  ["unit-15-enterprise", 15, "Virtual Enterprise Network", "ออกแบบเครือข่ายองค์กรเสมือนแบบครบวงจร", "ประกอบ core, access, DMZ, security, services และ monitoring ให้ครบ", 15]
];

const courseUnits = unitGameCatalog.map(([game, id, gameTitle, title, competency, hours]) => ({
  id,
  title,
  game,
  competency,
  hours
}));

const games = unitGameCatalog.map(([key, unit_id, title, , objective]) => ({
  key,
  unit_id,
  title,
  max_score: 100,
  objective,
  active: true
}));

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      group_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      password_hash TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS game_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_key TEXT NOT NULL,
      unit_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      max_score INTEGER NOT NULL DEFAULT 100,
      attempts INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, game_key),
      FOREIGN KEY(user_id) REFERENCES game_users(id)
    );

    CREATE TABLE IF NOT EXISTS game_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_key TEXT NOT NULL,
      unit_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      max_score INTEGER NOT NULL DEFAULT 100,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES game_users(id)
    );

    CREATE TABLE IF NOT EXISTS site_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      path TEXT NOT NULL,
      user_agent TEXT NOT NULL DEFAULT '',
      ip TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      image_2 TEXT NOT NULL DEFAULT '',
      image_3 TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      is_published INTEGER NOT NULL DEFAULT 1,
      published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lms_units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_no INTEGER NOT NULL UNIQUE,
      title TEXT NOT NULL,
      lesson_title TEXT NOT NULL DEFAULT '',
      objective TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      phase TEXT NOT NULL DEFAULT '',
      outcomes_json TEXT NOT NULL DEFAULT '[]',
      content_json TEXT NOT NULL DEFAULT '[]',
      key_topics_json TEXT NOT NULL DEFAULT '[]',
      lesson_sections_json TEXT NOT NULL DEFAULT '[]',
      learning_steps_json TEXT NOT NULL DEFAULT '[]',
      lab_steps_json TEXT NOT NULL DEFAULT '[]',
      common_mistakes_json TEXT NOT NULL DEFAULT '[]',
      external_resources_json TEXT NOT NULL DEFAULT '[]',
      case_study TEXT NOT NULL DEFAULT '',
      workshop TEXT NOT NULL DEFAULT '',
      product TEXT NOT NULL DEFAULT '',
      teacher_guidance_json TEXT NOT NULL DEFAULT '[]',
      learner_analysis_json TEXT NOT NULL DEFAULT '{}',
      game_title TEXT NOT NULL DEFAULT '',
      game_type TEXT NOT NULL DEFAULT '',
      game_description TEXT NOT NULL DEFAULT '',
      game_json TEXT NOT NULL DEFAULT '{}',
      source TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lms_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      unit_id INTEGER NOT NULL,
      question_no INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      choices_json TEXT NOT NULL,
      answer_key TEXT NOT NULL,
      explanation TEXT NOT NULL DEFAULT '',
      bloom_level TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(unit_id, question_no),
      FOREIGN KEY(unit_id) REFERENCES lms_units(id)
    );

    CREATE TABLE IF NOT EXISTS lms_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      unit_id INTEGER NOT NULL,
      lesson_viewed INTEGER NOT NULL DEFAULT 0,
      game_score INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, unit_id),
      FOREIGN KEY(user_id) REFERENCES game_users(id),
      FOREIGN KEY(unit_id) REFERENCES lms_units(id)
    );

    CREATE TABLE IF NOT EXISTS lms_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      unit_id INTEGER NOT NULL,
      assessment_type TEXT NOT NULL CHECK(assessment_type IN ('pre','post')),
      score INTEGER NOT NULL,
      max_score INTEGER NOT NULL,
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES game_users(id),
      FOREIGN KEY(unit_id) REFERENCES lms_units(id)
    );

    CREATE TABLE IF NOT EXISTS lms_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      selected_key TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      FOREIGN KEY(attempt_id) REFERENCES lms_attempts(id),
      FOREIGN KEY(question_id) REFERENCES lms_questions(id)
    );
  `);

  const userColumns = db.prepare("PRAGMA table_info(game_users)").all().map((column) => column.name);
  if (!userColumns.includes("password_hash")) {
    db.prepare("ALTER TABLE game_users ADD COLUMN password_hash TEXT").run();
  }
  if (!userColumns.includes("role")) {
    db.prepare("ALTER TABLE game_users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'").run();
  }

  const newsColumns = db.prepare("PRAGMA table_info(activity_news)").all().map((column) => column.name);
  const addNewsColumn = (name, definition) => {
    if (!newsColumns.includes(name)) db.prepare(`ALTER TABLE activity_news ADD COLUMN ${name} ${definition}`).run();
  };
  addNewsColumn("image", "TEXT NOT NULL DEFAULT ''");
  addNewsColumn("image_2", "TEXT NOT NULL DEFAULT ''");
  addNewsColumn("image_3", "TEXT NOT NULL DEFAULT ''");
  addNewsColumn("description", "TEXT NOT NULL DEFAULT ''");
  addNewsColumn("content", "TEXT NOT NULL DEFAULT ''");
  addNewsColumn("is_published", "INTEGER NOT NULL DEFAULT 1");
  addNewsColumn("created_at", "TEXT NOT NULL DEFAULT ''");
  addNewsColumn("updated_at", "TEXT NOT NULL DEFAULT ''");
  if (newsColumns.includes("image_url")) {
    db.prepare("UPDATE activity_news SET image = image_url WHERE image = ''").run();
  }
  if (newsColumns.includes("lead")) {
    db.prepare("UPDATE activity_news SET description = lead WHERE description = ''").run();
  }
  if (newsColumns.includes("body")) {
    db.prepare("UPDATE activity_news SET content = body WHERE content = ''").run();
  }

  const lmsUnitColumns = db.prepare("PRAGMA table_info(lms_units)").all().map((column) => column.name);
  const addLmsUnitColumn = (name, definition) => {
    if (!lmsUnitColumns.includes(name)) db.prepare(`ALTER TABLE lms_units ADD COLUMN ${name} ${definition}`).run();
  };
  addLmsUnitColumn("image", "TEXT NOT NULL DEFAULT ''");
  addLmsUnitColumn("phase", "TEXT NOT NULL DEFAULT ''");
  addLmsUnitColumn("key_topics_json", "TEXT NOT NULL DEFAULT '[]'");
  addLmsUnitColumn("lesson_sections_json", "TEXT NOT NULL DEFAULT '[]'");
  addLmsUnitColumn("learning_steps_json", "TEXT NOT NULL DEFAULT '[]'");
  addLmsUnitColumn("lab_steps_json", "TEXT NOT NULL DEFAULT '[]'");
  addLmsUnitColumn("common_mistakes_json", "TEXT NOT NULL DEFAULT '[]'");
  addLmsUnitColumn("external_resources_json", "TEXT NOT NULL DEFAULT '[]'");
  addLmsUnitColumn("case_study", "TEXT NOT NULL DEFAULT ''");
  addLmsUnitColumn("workshop", "TEXT NOT NULL DEFAULT ''");
  addLmsUnitColumn("product", "TEXT NOT NULL DEFAULT ''");
  addLmsUnitColumn("teacher_guidance_json", "TEXT NOT NULL DEFAULT '[]'");
  addLmsUnitColumn("learner_analysis_json", "TEXT NOT NULL DEFAULT '{}'");
  addLmsUnitColumn("game_json", "TEXT NOT NULL DEFAULT '{}'");

  const seedCategories = [
    "Network Lesson",
    "Network Lab",
    "Collaborative Learning",
    "Cybersecurity",
    "AI for Learning",
    "Game-Based Learning"
  ];
  const insertCategory = db.prepare("INSERT OR IGNORE INTO activity_categories (name) VALUES (?)");
  for (const category of seedCategories) insertCategory.run(category);

  const newsCount = db.prepare("SELECT COUNT(*) AS count FROM activity_news").get().count;
  if (newsCount === 0) {
    const seedNews = [
      ["กิจกรรมการเรียนรู้เครือข่ายในชั้นเรียน", "Network Lesson", "/assets/new-activities/classroom-network-lesson.jpg", "ผู้เรียนฝึกวิเคราะห์ topology, อุปกรณ์เครือข่าย และเส้นทางข้อมูลก่อนเข้าสู่เกมจำลอง packet"],
      ["ปฏิบัติการ Fiber Optic และ OTDR", "Network Lab", "/assets/activities/fiber-otdr.jpg", "เชื่อมโยงทักษะงานภาคสนามกับการออกแบบเครือข่ายองค์กรและการตรวจสอบคุณภาพสัญญาณ"],
      ["Dashboard ความปลอดภัยเครือข่าย", "Cybersecurity", "/assets/new-activities/fortigate-dashboard.jpg", "ใช้ข้อมูล log และ dashboard เพื่อพัฒนาทักษะการวิเคราะห์ traffic และ policy"],
      ["กิจกรรมเกมและ Coding", "Game-Based Learning", "/assets/new-activities/roblox-quiz-coding.jpg", "ต่อยอดแนวคิดเกมเพื่อการเรียนรู้สู่ OSI Game, VLAN Puzzle และ Packet Simulation"]
    ];
    const insertNews = db.prepare(`
      INSERT INTO activity_news (title, category, image, description, content)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const item of seedNews) insertNews.run(...item, item[3]);
  }

  seedLmsFromDocuments();
}

function seedLmsFromDocuments() {
  const seed = loadLmsSeed();
  const source = (seed.course?.source_documents || []).join("; ");
  const upsertUnit = db.prepare(`
    INSERT INTO lms_units (
      unit_no, title, lesson_title, objective, image, phase, outcomes_json, content_json,
      key_topics_json, lesson_sections_json, learning_steps_json, lab_steps_json,
      common_mistakes_json, external_resources_json, case_study, workshop, product,
      teacher_guidance_json, learner_analysis_json, game_title, game_type, game_description,
      game_json, source, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(unit_no) DO UPDATE SET
      title = excluded.title,
      lesson_title = excluded.lesson_title,
      objective = excluded.objective,
      image = excluded.image,
      phase = excluded.phase,
      outcomes_json = excluded.outcomes_json,
      content_json = excluded.content_json,
      key_topics_json = excluded.key_topics_json,
      lesson_sections_json = excluded.lesson_sections_json,
      learning_steps_json = excluded.learning_steps_json,
      lab_steps_json = excluded.lab_steps_json,
      common_mistakes_json = excluded.common_mistakes_json,
      external_resources_json = excluded.external_resources_json,
      case_study = excluded.case_study,
      workshop = excluded.workshop,
      product = excluded.product,
      teacher_guidance_json = excluded.teacher_guidance_json,
      learner_analysis_json = excluded.learner_analysis_json,
      game_title = excluded.game_title,
      game_type = excluded.game_type,
      game_description = excluded.game_description,
      game_json = excluded.game_json,
      source = excluded.source,
      updated_at = CURRENT_TIMESTAMP
  `);
  const upsertQuestion = db.prepare(`
    INSERT INTO lms_questions (
      unit_id, question_no, prompt, choices_json, answer_key, explanation, bloom_level, source, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(unit_id, question_no) DO UPDATE SET
      prompt = excluded.prompt,
      choices_json = excluded.choices_json,
      answer_key = excluded.answer_key,
      explanation = excluded.explanation,
      bloom_level = excluded.bloom_level,
      source = excluded.source,
      updated_at = CURRENT_TIMESTAMP
  `);

  for (const unit of seed.units || []) {
    upsertUnit.run(
      unit.unit_no,
      unit.title,
      unit.lesson_title || unit.title,
      unit.objective || "",
      unit.image || "",
      unit.phase || "",
      JSON.stringify(unit.outcomes || []),
      JSON.stringify(unit.content || []),
      JSON.stringify(unit.key_topics || []),
      JSON.stringify(unit.lesson_sections || []),
      JSON.stringify(unit.learning_steps || []),
      JSON.stringify(unit.lab_steps || []),
      JSON.stringify(unit.common_mistakes || []),
      JSON.stringify(unit.external_resources || []),
      unit.case_study || "",
      unit.workshop || "",
      unit.product || "",
      JSON.stringify(unit.teacher_guidance || []),
      JSON.stringify(unit.learner_analysis || {}),
      unit.game?.title || "",
      unit.game?.type || "",
      unit.game?.description || "",
      JSON.stringify(unit.game || {}),
      source
    );
    const row = db.prepare("SELECT id FROM lms_units WHERE unit_no = ?").get(unit.unit_no);
    for (const question of unit.questions || []) {
      upsertQuestion.run(
        row.id,
        question.number,
        question.prompt,
        JSON.stringify(question.choices || []),
        question.answer,
        question.explanation || "",
        question.bloom || "",
        source
      );
    }
  }
}

function requireAdmin(req, res, next) {
  if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "ไม่ได้รับอนุญาตสำหรับผู้ดูแลระบบ" });
  }
  next();
}

function userWithScores(userId) {
  const user = db.prepare("SELECT * FROM game_users WHERE id = ?").get(userId);
  if (!user) return null;
  const scores = db.prepare("SELECT * FROM game_scores WHERE user_id = ? ORDER BY updated_at DESC").all(userId);
  const attempts = db.prepare(`
    SELECT *
    FROM game_attempts
    WHERE user_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT 12
  `).all(userId);
  const total = scores.reduce((sum, item) => sum + item.score, 0);
  const completed = scores.filter((item) => item.score >= 80).length;
  return { ...user, scores, attempts, total, completed };
}

function normalizeRole(role) {
  return ["student", "teacher", "admin"].includes(role) ? role : "student";
}

function isPrivilegedRole(role) {
  return role === "teacher" || role === "admin";
}

function userCanAccessUnit(userId, unitNo) {
  const user = db.prepare("SELECT id, role FROM game_users WHERE id = ?").get(userId);
  if (!user) return { ok: false, status: 404, error: "ไม่พบผู้เรียน" };
  if (isPrivilegedRole(user.role)) return { ok: true, user, privileged: true };
  if (Number(unitNo) === 1) return { ok: true, user, privileged: false };
  const previous = db.prepare(`
    SELECT
      COALESCE(lms_progress.completed, 0) AS completed,
      COUNT(lms_attempts.id) AS chapter_attempts
    FROM lms_units
    LEFT JOIN lms_progress
      ON lms_progress.unit_id = lms_units.id AND lms_progress.user_id = ?
    LEFT JOIN lms_attempts
      ON lms_attempts.unit_id = lms_units.id
      AND lms_attempts.user_id = ?
      AND lms_attempts.assessment_type = 'post'
    WHERE lms_units.unit_no = ?
    GROUP BY lms_units.id
  `).get(userId, userId, Number(unitNo) - 1);
  if (previous?.completed || previous?.chapter_attempts) return { ok: true, user, privileged: false };
  return { ok: false, status: 403, error: "ยังไม่สามารถเข้าเรียนหน่วยนี้ได้ กรุณาเรียนหน่วยก่อนหน้าให้สำเร็จก่อน" };
}

function activityNewsColumns() {
  return db.prepare("PRAGMA table_info(activity_news)").all().map((column) => column.name);
}

function normalizeActivity(row) {
  if (!row) return row;
  const images = [row.image, row.image_2, row.image_3].filter(Boolean);
  return { ...row, images };
}

function asJsonArray(value) {
  return JSON.stringify(Array.isArray(value) ? value : []);
}

function asJsonObject(value) {
  return JSON.stringify(value && typeof value === "object" && !Array.isArray(value) ? value : {});
}

function hasLessonSectionImages(sections) {
  return Array.isArray(sections) && sections.some((section) => (
    (Array.isArray(section?.images) && section.images.filter(Boolean).length > 0) ||
    (Array.isArray(section?.content_images) && section.content_images.filter(Boolean).length > 0)
  ));
}

function preserveLessonSectionImagesWhenMissing(nextSections, currentJson) {
  if (!Array.isArray(nextSections)) return [];
  const currentSections = JSON.parse(currentJson || "[]");
  if (hasLessonSectionImages(nextSections) || !hasLessonSectionImages(currentSections)) return nextSections;
  return nextSections.map((section, index) => ({
    ...section,
    images: section.images?.length ? section.images : (currentSections[index]?.images || []),
    content_images: section.content_images?.length ? section.content_images : (currentSections[index]?.content_images || [])
  }));
}

function normalizeLmsUnit(row) {
  if (!row) return row;
  const fallbackGame = games.find((game) => game.unit_id === Number(row.unit_no));
  const storedGame = JSON.parse(row.game_json || "{}");
  const activeGame = fallbackGame ? {
    ...storedGame,
    title: storedGame.title || fallbackGame.title,
    type: storedGame.type || "interactive-game",
    description: storedGame.description || fallbackGame.objective,
    existing_key: fallbackGame.key,
    status: "available",
    mechanic: storedGame.mechanic || "เลือกภารกิจและตัดสินใจตามสถานการณ์",
    goal: storedGame.goal || fallbackGame.objective,
    feedback: storedGame.feedback || "ระบบจะบันทึกคะแนนและปลดล็อกแบบทดสอบท้ายบทเมื่อทำกิจกรรมสำเร็จ"
  } : storedGame;
  return {
    ...row,
    outcomes: JSON.parse(row.outcomes_json || "[]"),
    content: JSON.parse(row.content_json || "[]"),
    key_topics: JSON.parse(row.key_topics_json || "[]"),
    lesson_sections: JSON.parse(row.lesson_sections_json || "[]"),
    learning_steps: JSON.parse(row.learning_steps_json || "[]"),
    lab_steps: JSON.parse(row.lab_steps_json || "[]"),
    common_mistakes: JSON.parse(row.common_mistakes_json || "[]"),
    external_resources: JSON.parse(row.external_resources_json || "[]"),
    teacher_guidance: JSON.parse(row.teacher_guidance_json || "[]"),
    learner_analysis: JSON.parse(row.learner_analysis_json || "{}"),
    game: activeGame,
    game_title: row.game_title || activeGame.title || "",
    game_type: row.game_type || activeGame.type || "",
    game_description: row.game_description || activeGame.description || ""
  };
}

function normalizeQuestion(row, includeAnswer = false) {
  const question = {
    id: row.id,
    unit_id: row.unit_id,
    question_no: row.question_no,
    prompt: row.prompt,
    choices: JSON.parse(row.choices_json || "[]"),
    bloom_level: row.bloom_level
  };
  if (includeAnswer) {
    question.answer_key = row.answer_key;
    question.explanation = row.explanation;
  }
  return question;
}

function lmsOverviewForUser(userId) {
  const user = db.prepare("SELECT id, role FROM game_users WHERE id = ?").get(userId);
  const privileged = isPrivilegedRole(user?.role);
  const units = db.prepare("SELECT * FROM lms_units ORDER BY unit_no ASC").all().map(normalizeLmsUnit);
  const progressRows = db.prepare("SELECT * FROM lms_progress WHERE user_id = ?").all(userId);
  const progressByUnit = Object.fromEntries(progressRows.map((row) => [row.unit_id, row]));
  const attemptRows = db.prepare(`
    SELECT lms_attempts.*, lms_units.unit_no
    FROM lms_attempts
    JOIN lms_units ON lms_units.id = lms_attempts.unit_id
    WHERE user_id = ?
    ORDER BY submitted_at DESC, id DESC
  `).all(userId);

  const best = {};
  for (const attempt of attemptRows) {
    const key = `${attempt.unit_id}:${attempt.assessment_type}`;
    if (!best[key] || attempt.score > best[key].score) best[key] = attempt;
  }

  let previousCompleted = true;
  const decoratedUnits = units.map((unit) => {
    const progress = progressByUnit[unit.id] || {};
    const chapter = best[`${unit.id}:post`] || null;
    const locked = !privileged && !previousCompleted;
    const contentAvailable = privileged || !locked;
    const chapterAvailable = privileged || (!locked && Boolean(progress.lesson_viewed) && Number(progress.game_score || 0) > 0);
    const unitCompleted = Boolean(progress.completed || chapter);
    const percent = Math.round(
      ((progress.lesson_viewed ? 35 : 0) + (progress.game_score ? 35 : 0) + (chapter ? 30 : 0))
    );
    previousCompleted = unitCompleted;
    return {
      ...unit,
      locked,
      contentAvailable,
      chapterAvailable,
      lesson_sections: contentAvailable ? unit.lesson_sections : [],
      lab_steps: contentAvailable ? unit.lab_steps : [],
      common_mistakes: contentAvailable ? unit.common_mistakes : [],
      external_resources: contentAvailable ? unit.external_resources : [],
      content: contentAvailable ? unit.content : [],
      outcomes: contentAvailable ? unit.outcomes : [],
      case_study: contentAvailable ? unit.case_study : "",
      workshop: contentAvailable ? unit.workshop : "",
      product: contentAvailable ? unit.product : "",
      progress: { ...progress, completed: unitCompleted ? 1 : 0, percent },
      chapter,
      post: chapter
    };
  });

  return {
    course: loadLmsSeed().course || {},
    role: user?.role || "student",
    units: decoratedUnits,
    summary: {
      totalUnits: units.length,
      completedUnits: decoratedUnits.filter((unit) => unit.progress.completed).length,
      averageChapterScore: Math.round(
        decoratedUnits.reduce((sum, unit) => sum + (unit.chapter?.score || 0), 0) /
        Math.max(1, decoratedUnits.filter((unit) => unit.chapter).length)
      )
    }
  };
}

function questionAnalytics() {
  const rows = db.prepare(`
    SELECT
      lms_units.unit_no,
      lms_units.title AS unit_title,
      lms_questions.id,
      lms_questions.question_no,
      lms_questions.prompt,
      lms_questions.answer_key,
      lms_questions.bloom_level,
      COUNT(CASE WHEN lms_attempts.assessment_type = 'post' THEN 1 END) AS attempts,
      SUM(CASE WHEN lms_attempts.assessment_type = 'post' THEN lms_answers.is_correct ELSE 0 END) AS correct
    FROM lms_questions
    JOIN lms_units ON lms_units.id = lms_questions.unit_id
    LEFT JOIN lms_answers ON lms_answers.question_id = lms_questions.id
    LEFT JOIN lms_attempts ON lms_attempts.id = lms_answers.attempt_id
    GROUP BY lms_questions.id
    ORDER BY lms_units.unit_no ASC, lms_questions.question_no ASC
  `).all();

  return rows.map((row) => {
    const difficulty = row.attempts ? Number((row.correct / row.attempts).toFixed(2)) : null;
    let quality = "รอข้อมูล";
    if (difficulty !== null) {
      if (difficulty < 0.2) quality = "ยากมาก";
      else if (difficulty < 0.4) quality = "ค่อนข้างยาก";
      else if (difficulty <= 0.8) quality = "เหมาะสม";
      else quality = "ง่ายมาก";
    }
    const choices = db.prepare(`
      SELECT selected_key, COUNT(*) AS count
      FROM lms_answers
      JOIN lms_attempts ON lms_attempts.id = lms_answers.attempt_id
      WHERE question_id = ? AND lms_attempts.assessment_type = 'post'
      GROUP BY selected_key
      ORDER BY selected_key ASC
    `).all(row.id);
    return { ...row, difficulty, quality, choices };
  });
}

function percentScore(score, maxScore) {
  return maxScore ? Math.round((Number(score || 0) / Number(maxScore)) * 100) : 0;
}

function learnerLevelFromIndex(index) {
  if (index >= 80) return "ชำนาญ";
  if (index >= 60) return "กำลังพัฒนา";
  if (index >= 40) return "ต้องเสริม";
  return "เริ่มต้น";
}

function buildLearnerAnalytics({ units, attempts, answers, gameScores }) {
  const totalUnits = units.length || 15;
  const completedUnits = units.filter((unit) => unit.completed || unit.quiz_score !== null).length;
  const quizAttempts = attempts.length;
  const avgQuizPercent = quizAttempts
    ? Math.round(attempts.reduce((sum, item) => sum + percentScore(item.score, item.max_score), 0) / quizAttempts)
    : 0;
  const avgGameScore = gameScores.length
    ? Math.round(gameScores.reduce((sum, item) => sum + Number(item.score || 0), 0) / gameScores.length)
    : 0;
  const completionPercent = Math.round((completedUnits / Math.max(1, totalUnits)) * 100);
  const masteryIndex = Math.round((avgQuizPercent * 0.5) + (avgGameScore * 0.3) + (completionPercent * 0.2));

  const bloom = {};
  for (const answer of answers) {
    const level = answer.bloom_level || "ไม่ระบุ";
    if (!bloom[level]) bloom[level] = { level, correct: 0, total: 0, percent: 0 };
    bloom[level].total += 1;
    bloom[level].correct += Number(answer.is_correct || 0);
  }
  const bloomPerformance = Object.values(bloom).map((item) => ({
    ...item,
    percent: item.total ? Math.round((item.correct / item.total) * 100) : 0
  })).sort((a, b) => a.percent - b.percent);

  const unitProfiles = units.map((unit) => {
    const quizPercent = unit.quiz_max_score ? percentScore(unit.quiz_score, unit.quiz_max_score) : 0;
    let status = "ยังไม่เริ่ม";
    if (unit.quiz_score !== null) status = quizPercent >= 80 ? "ผ่านดี" : quizPercent >= 50 ? "ผ่านแล้วควรทบทวน" : "ต้องเสริม";
    else if (unit.game_score) status = "รอทำแบบทดสอบท้ายบท";
    else if (unit.lesson_viewed) status = "รอทำกิจกรรม/เกม";
    return {
      ...unit,
      quiz_percent: quizPercent,
      status,
      recommendation: unit.quiz_score === null
        ? "เรียนเนื้อหา ทำกิจกรรม/เกม แล้วทำแบบทดสอบท้ายบท"
        : quizPercent < 60
          ? "ทบทวนหัวข้อหลักและทำใบงานซ้ำก่อนเรียนหน่วยถัดไป"
          : "ต่อยอดด้วยสถานการณ์ปฏิบัติและสรุปหลักฐานการเรียนรู้"
    };
  });

  const strengths = [];
  if (avgQuizPercent >= 70) strengths.push("ทำแบบทดสอบท้ายบทได้ดี มีความเข้าใจเนื้อหาเชิงทฤษฎี");
  if (avgGameScore >= 80) strengths.push("คะแนนเกม/กิจกรรมสูง แสดงทักษะปฏิบัติและการตัดสินใจดี");
  if (completionPercent >= 70) strengths.push("มีความต่อเนื่องในการเรียนและส่งงานตามลำดับหน่วย");
  if (!strengths.length) strengths.push("เริ่มมีข้อมูลการเรียนแล้ว ควรสะสมผลกิจกรรมและแบบทดสอบเพิ่มเติม");

  const needsSupport = [];
  if (avgQuizPercent && avgQuizPercent < 60) needsSupport.push("ควรเสริมความเข้าใจเนื้อหาก่อนทำแบบทดสอบท้ายบทครั้งถัดไป");
  if (avgGameScore && avgGameScore < 70) needsSupport.push("ควรฝึกเกม/กิจกรรมสถานการณ์ซ้ำเพื่อเพิ่มความแม่นยำในการปฏิบัติ");
  if (completionPercent < 50) needsSupport.push("ควรกำกับลำดับเรียนรายหน่วยให้ครบ อ่านเนื้อหา ส่งกิจกรรม และทำแบบทดสอบ");
  const weakBloom = bloomPerformance.find((item) => item.total >= 2 && item.percent < 60);
  if (weakBloom) needsSupport.push(`ควรเสริมข้อสอบระดับ ${weakBloom.level} ซึ่งตอบถูก ${weakBloom.percent}%`);
  if (!needsSupport.length) needsSupport.push("รักษาความต่อเนื่องและใช้โจทย์ประยุกต์ที่ซับซ้อนขึ้น");

  return {
    summary: {
      totalUnits,
      completedUnits,
      completionPercent,
      quizAttempts,
      avgQuizPercent,
      gameCompleted: gameScores.length,
      avgGameScore,
      masteryIndex,
      learnerLevel: learnerLevelFromIndex(masteryIndex)
    },
    strengths,
    needsSupport,
    bloomPerformance,
    unitProfiles,
    gameScores
  };
}

function saveUploadedImage(file) {
  if (!file?.data || !file?.type?.startsWith("image/")) {
    throw new Error("Invalid image file");
  }
  const extensionByType = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
  };
  const extension = extensionByType[file.type] || path.extname(file.name || "").toLowerCase() || ".png";
  const base64 = String(file.data).replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) {
    throw new Error("Invalid image size");
  }
  fs.mkdirSync(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return `/uploads/activity-news/${filename}`;
}

initDb();

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.startsWith("/assets") && !req.path.startsWith("/uploads")) {
    db.prepare(`
      INSERT INTO site_events (event_type, path, user_agent, ip)
      VALUES ('page_view', ?, ?, ?)
    `).run(req.path, req.headers["user-agent"] || "", req.ip || "");
  }
  next();
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านผู้ดูแลระบบไม่ถูกต้อง" });
  }
  res.json({ token: ADMIN_TOKEN, username: ADMIN_USERNAME });
});

app.get("/api/health", (req, res) => {
  const readiness = systemReadiness();
  const database = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM game_users) AS users,
      (SELECT COUNT(*) FROM lms_units) AS lmsUnits,
      (SELECT COUNT(*) FROM activity_news) AS activities
  `).get();

  res.status(readiness.ok ? 200 : 200).json({
    status: readiness.ok ? "ready" : "needs-configuration",
    database,
    readiness
  });
});

app.post("/api/auth/register", (req, res) => {
  const { student_code, name, group_name, password } = req.body;
  if (!student_code || !name || !group_name || !password) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลสมัครสมาชิกให้ครบ" });
  }
  if (String(password).length < 4) {
    return res.status(400).json({ error: "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร" });
  }

  const passwordHash = hashPassword(password);
  const existing = db.prepare("SELECT * FROM game_users WHERE student_code = ?").get(student_code);
  if (existing?.password_hash) {
    return res.status(409).json({ error: "รหัสนักศึกษานี้สมัครสมาชิกแล้ว กรุณาเข้าสู่ระบบ" });
  }
  if (existing) {
    db.prepare(`
      UPDATE game_users
      SET name = ?, group_name = ?, password_hash = ?, last_login_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, group_name, passwordHash, existing.id);
    return res.json(userWithScores(existing.id));
  }

  const result = db.prepare(`
    INSERT INTO game_users (student_code, name, group_name, role, password_hash)
    VALUES (?, ?, ?, 'student', ?)
  `).run(student_code, name, group_name, passwordHash);
  res.status(201).json(userWithScores(result.lastInsertRowid));
});

app.post("/api/auth/login", (req, res) => {
  const { student_code, password } = req.body;
  if (!student_code || !password) {
    return res.status(400).json({ error: "กรุณากรอกรหัสนักศึกษาและรหัสผ่าน" });
  }

  const existing = db.prepare("SELECT * FROM game_users WHERE student_code = ?").get(student_code);
  if (!existing || !existing.password_hash || existing.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง" });
  }

  db.prepare(`
    UPDATE game_users
    SET last_login_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(existing.id);
  res.json(userWithScores(existing.id));
});

app.get("/api/users/:id", (req, res) => {
  const user = userWithScores(req.params.id);
  if (!user) return res.status(404).json({ error: "ไม่พบผู้เรียน" });
  res.json(user);
});

app.get("/api/game-data", (req, res) => {
  res.json({ units: courseUnits, games });
});

app.get("/api/activities", (req, res) => {
  const rows = db.prepare(`
    SELECT id, title, category, image, image_2, image_3, description, content, published_at
    FROM activity_news
    WHERE is_published = 1
    ORDER BY datetime(published_at) DESC, id DESC
  `).all();
  res.json(rows.map(normalizeActivity));
});

app.get("/api/activity-categories", (req, res) => {
  const rows = db.prepare("SELECT * FROM activity_categories ORDER BY name ASC").all();
  res.json(rows);
});

app.post("/api/scores", (req, res) => {
  const { user_id, game_key, unit_id, score, max_score = 100 } = req.body;
  if (!user_id || !game_key || !unit_id || Number.isNaN(Number(score))) {
    return res.status(400).json({ error: "ข้อมูลคะแนนไม่ครบถ้วน" });
  }

  const user = db.prepare("SELECT id FROM game_users WHERE id = ?").get(user_id);
  if (!user) return res.status(404).json({ error: "ไม่พบผู้เรียน" });

  const current = db.prepare("SELECT * FROM game_scores WHERE user_id = ? AND game_key = ?").get(user_id, game_key);
  const boundedScore = Math.max(0, Math.min(Number(score), Number(max_score)));

  db.prepare(`
    INSERT INTO game_attempts (user_id, game_key, unit_id, score, max_score)
    VALUES (?, ?, ?, ?, ?)
  `).run(user_id, game_key, unit_id, boundedScore, max_score);

  if (current) {
    db.prepare(`
      UPDATE game_scores
      SET score = MAX(score, ?), max_score = ?, attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND game_key = ?
    `).run(boundedScore, max_score, user_id, game_key);
  } else {
    db.prepare(`
      INSERT INTO game_scores (user_id, game_key, unit_id, score, max_score)
      VALUES (?, ?, ?, ?, ?)
    `).run(user_id, game_key, unit_id, boundedScore, max_score);
  }

  res.status(201).json(userWithScores(user_id));
});

app.get("/api/users/:id/attempts", (req, res) => {
  const user = db.prepare("SELECT id FROM game_users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "ไม่พบผู้เรียน" });
  const rows = db.prepare(`
    SELECT *
    FROM game_attempts
    WHERE user_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT 50
  `).all(req.params.id);
  res.json(rows);
});

app.get("/api/leaderboard", (req, res) => {
  const game = req.query.game || "all";
  const where = game === "all" ? "" : "WHERE game_scores.game_key = @game";
  const rows = db.prepare(`
    SELECT
      game_users.id,
      game_users.student_code,
      game_users.name,
      game_users.group_name,
      SUM(game_scores.score) AS total_score,
      COUNT(game_scores.id) AS completed_games,
      MAX(game_scores.updated_at) AS updated_at
    FROM game_scores
    JOIN game_users ON game_users.id = game_scores.user_id
    ${where}
    GROUP BY game_users.id
    ORDER BY total_score DESC, completed_games DESC, updated_at ASC
    LIMIT 20
  `).all({ game });
  res.json(rows);
});

app.get("/api/lms/overview", (req, res) => {
  const userId = Number(req.query.user_id || 0);
  if (!userId) return res.status(400).json({ error: "กรุณาระบุผู้เรียน" });
  const user = db.prepare("SELECT id FROM game_users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "ไม่พบผู้เรียน" });
  res.json(lmsOverviewForUser(userId));
});

app.get("/api/lms/units/:unitNo", (req, res) => {
  const userId = Number(req.query.user_id || 0);
  if (!userId) return res.status(400).json({ error: "กรุณาระบุผู้เรียน" });
  const access = userCanAccessUnit(userId, req.params.unitNo);
  if (!access.ok) return res.status(access.status).json({ error: access.error });
  const unit = normalizeLmsUnit(db.prepare("SELECT * FROM lms_units WHERE unit_no = ?").get(req.params.unitNo));
  if (!unit) return res.status(404).json({ error: "ไม่พบหน่วยการเรียน" });
  unit.contentAvailable = true;
  const questions = db.prepare("SELECT * FROM lms_questions WHERE unit_id = ? ORDER BY question_no ASC").all(unit.id);
  res.json({ unit, questions: questions.map((row) => normalizeQuestion(row, false)) });
});

app.post("/api/lms/progress", (req, res) => {
  const { user_id, unit_id, lesson_viewed = 0, game_score = 0, completed = 0 } = req.body;
  if (!user_id || !unit_id) return res.status(400).json({ error: "ข้อมูลความก้าวหน้าไม่ครบ" });
  const unit = db.prepare("SELECT unit_no FROM lms_units WHERE id = ?").get(unit_id);
  if (!unit) return res.status(404).json({ error: "ไม่พบหน่วยการเรียน" });
  const access = userCanAccessUnit(user_id, unit.unit_no);
  if (!access.ok) return res.status(access.status).json({ error: access.error });
  if (!access.privileged && game_score) {
    const progress = db.prepare("SELECT lesson_viewed FROM lms_progress WHERE user_id = ? AND unit_id = ?").get(user_id, unit_id);
    if (!progress?.lesson_viewed && !lesson_viewed) return res.status(409).json({ error: "กรุณาอ่านเนื้อหาและบันทึกการเรียนก่อนส่งงานหรือเล่นเกม" });
  }
  db.prepare(`
    INSERT INTO lms_progress (user_id, unit_id, lesson_viewed, game_score, completed, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, unit_id) DO UPDATE SET
      lesson_viewed = MAX(lesson_viewed, excluded.lesson_viewed),
      game_score = MAX(game_score, excluded.game_score),
      completed = MAX(completed, excluded.completed),
      updated_at = CURRENT_TIMESTAMP
  `).run(user_id, unit_id, lesson_viewed ? 1 : 0, Number(game_score) || 0, completed ? 1 : 0);
  res.json(lmsOverviewForUser(user_id));
});

app.post("/api/lms/attempts", (req, res) => {
  const { user_id, unit_id, assessment_type, answers = {} } = req.body;
  if (!user_id || !unit_id || !["chapter", "post", undefined, null, ""].includes(assessment_type)) {
    return res.status(400).json({ error: "ข้อมูลการทดสอบไม่ครบ" });
  }
  const storedAssessmentType = "post";
  const unit = db.prepare("SELECT unit_no FROM lms_units WHERE id = ?").get(unit_id);
  if (!unit) return res.status(404).json({ error: "ไม่พบหน่วยการเรียน" });
  const access = userCanAccessUnit(user_id, unit.unit_no);
  if (!access.ok) return res.status(access.status).json({ error: access.error });
  if (!access.privileged) {
    const state = db.prepare(`
      SELECT
        COALESCE((SELECT lesson_viewed FROM lms_progress WHERE user_id = ? AND unit_id = ?), 0) AS lesson_viewed,
        COALESCE((SELECT game_score FROM lms_progress WHERE user_id = ? AND unit_id = ?), 0) AS game_score
    `).get(user_id, unit_id, user_id, unit_id);
    if (!state.lesson_viewed) return res.status(409).json({ error: "กรุณาอ่านเนื้อหาและบันทึกการเรียนก่อนทำแบบทดสอบท้ายบท" });
    if (!state.game_score) return res.status(409).json({ error: "กรุณาส่งงานกิจกรรมหรือเล่นเกมประจำหน่วยก่อนทำแบบทดสอบท้ายบท" });
  }
  const questions = db.prepare("SELECT * FROM lms_questions WHERE unit_id = ? ORDER BY question_no ASC").all(unit_id);
  if (!questions.length) return res.status(404).json({ error: "ไม่พบข้อสอบของหน่วยนี้" });

  let score = 0;
  const checked = questions.map((question) => {
    const selected = String(answers[question.id] || "");
    const isCorrect = selected === question.answer_key;
    if (isCorrect) score += 1;
    return { question, selected, isCorrect };
  });

  const result = db.prepare(`
    INSERT INTO lms_attempts (user_id, unit_id, assessment_type, score, max_score)
    VALUES (?, ?, ?, ?, ?)
  `).run(user_id, unit_id, storedAssessmentType, score, questions.length);
  const insertAnswer = db.prepare(`
    INSERT INTO lms_answers (attempt_id, question_id, selected_key, is_correct)
    VALUES (?, ?, ?, ?)
  `);
  for (const item of checked) {
    insertAnswer.run(result.lastInsertRowid, item.question.id, item.selected, item.isCorrect ? 1 : 0);
  }

  db.prepare(`
    INSERT INTO lms_progress (user_id, unit_id, lesson_viewed, game_score, completed, updated_at)
    VALUES (?, ?, 1, 0, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, unit_id) DO UPDATE SET
      completed = MAX(completed, excluded.completed),
      updated_at = CURRENT_TIMESTAMP
  `).run(user_id, unit_id, 1);

  res.status(201).json({
    attempt_id: result.lastInsertRowid,
    score,
    max_score: questions.length,
    results: checked.map((item) => ({
      question_id: item.question.id,
      selected_key: item.selected,
      answer_key: item.question.answer_key,
      is_correct: item.isCorrect,
      explanation: item.question.explanation
    })),
    overview: lmsOverviewForUser(user_id)
  });
});

app.get("/api/admin/lms-report", requireAdmin, (req, res) => {
  const unitStats = db.prepare(`
    SELECT
      lms_units.unit_no,
      lms_units.title,
      COUNT(DISTINCT CASE WHEN assessment_type = 'post' THEN lms_attempts.user_id END) AS learners,
      ROUND(AVG(CASE WHEN assessment_type = 'post' THEN score END), 2) AS avg_chapter,
      COUNT(CASE WHEN assessment_type = 'post' THEN 1 END) AS chapter_attempts
    FROM lms_units
    LEFT JOIN lms_attempts ON lms_attempts.unit_id = lms_units.id
    GROUP BY lms_units.id
    ORDER BY lms_units.unit_no ASC
  `).all();
  const learnerProgress = db.prepare(`
    SELECT
      game_users.id,
      game_users.student_code,
      game_users.name,
      game_users.group_name,
      (SELECT COUNT(DISTINCT unit_id) FROM lms_attempts WHERE user_id = game_users.id AND assessment_type = 'post') AS completed_units,
      (SELECT COUNT(*) FROM lms_attempts WHERE user_id = game_users.id AND assessment_type = 'post') AS chapter_attempts,
      (SELECT ROUND(AVG(score), 2) FROM lms_attempts WHERE user_id = game_users.id AND assessment_type = 'post') AS avg_chapter,
      (SELECT COUNT(*) FROM game_scores WHERE user_id = game_users.id) AS game_completed,
      (SELECT ROUND(AVG(score), 1) FROM game_scores WHERE user_id = game_users.id) AS avg_game_score,
      (SELECT COALESCE(SUM(score), 0) FROM game_scores WHERE user_id = game_users.id) AS total_game_score
    FROM game_users
    GROUP BY game_users.id
    ORDER BY completed_units DESC, avg_chapter DESC
  `).all().map((row) => {
    const quizPercent = row.avg_chapter ? Math.round((Number(row.avg_chapter) / 10) * 100) : 0;
    const gamePercent = Number(row.avg_game_score || 0);
    const completionPercent = Math.round((Number(row.completed_units || 0) / 15) * 100);
    const masteryIndex = Math.round((quizPercent * 0.5) + (gamePercent * 0.3) + (completionPercent * 0.2));
    return { ...row, mastery_index: masteryIndex, learner_level: learnerLevelFromIndex(masteryIndex) };
  });
  res.json({ unitStats, learnerProgress, questionAnalytics: questionAnalytics() });
});

app.get("/api/admin/lms-units", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM lms_units ORDER BY unit_no ASC").all().map(normalizeLmsUnit);
  res.json(rows);
});

app.get("/api/admin/lms-units/:id", requireAdmin, (req, res) => {
  const unit = normalizeLmsUnit(db.prepare("SELECT * FROM lms_units WHERE id = ?").get(req.params.id));
  if (!unit) return res.status(404).json({ error: "ไม่พบหน่วยเรียน" });
  res.json(unit);
});

app.put("/api/admin/lms-units/:id", requireAdmin, (req, res) => {
  const current = db.prepare("SELECT * FROM lms_units WHERE id = ?").get(req.params.id);
  if (!current) return res.status(404).json({ error: "ไม่พบหน่วยเรียน" });

  const unitNo = Number(req.body.unit_no || current.unit_no);
  const title = String(req.body.title || "").trim();
  if (!unitNo || !title) return res.status(400).json({ error: "กรุณากรอกเลขหน่วยและชื่อหน่วยเรียน" });

  const duplicate = db.prepare("SELECT id FROM lms_units WHERE unit_no = ? AND id <> ?").get(unitNo, req.params.id);
  if (duplicate) return res.status(409).json({ error: "เลขหน่วยนี้ถูกใช้แล้ว" });

  const game = req.body.game && typeof req.body.game === "object" ? req.body.game : {};
  const gameTitle = game.title || req.body.game_title || current.game_title || "";
  const gameType = game.type || req.body.game_type || current.game_type || "";
  const gameDescription = game.description || req.body.game_description || current.game_description || "";
  const lessonSections = preserveLessonSectionImagesWhenMissing(req.body.lesson_sections, current.lesson_sections_json);

  db.prepare(`
    UPDATE lms_units SET
      unit_no = ?,
      title = ?,
      lesson_title = ?,
      objective = ?,
      image = ?,
      phase = ?,
      outcomes_json = ?,
      content_json = ?,
      key_topics_json = ?,
      lesson_sections_json = ?,
      learning_steps_json = ?,
      lab_steps_json = ?,
      common_mistakes_json = ?,
      external_resources_json = ?,
      case_study = ?,
      workshop = ?,
      product = ?,
      teacher_guidance_json = ?,
      learner_analysis_json = ?,
      game_title = ?,
      game_type = ?,
      game_description = ?,
      game_json = ?,
      source = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    unitNo,
    title,
    String(req.body.lesson_title || title).trim(),
    String(req.body.objective || "").trim(),
    String(req.body.image || "").trim(),
    String(req.body.phase || "").trim(),
    asJsonArray(req.body.outcomes),
    asJsonArray(req.body.content),
    asJsonArray(req.body.key_topics),
    asJsonArray(lessonSections),
    asJsonArray(req.body.learning_steps),
    asJsonArray(req.body.lab_steps),
    asJsonArray(req.body.common_mistakes),
    asJsonArray(req.body.external_resources),
    String(req.body.case_study || "").trim(),
    String(req.body.workshop || "").trim(),
    String(req.body.product || "").trim(),
    asJsonArray(req.body.teacher_guidance),
    asJsonObject(req.body.learner_analysis),
    String(gameTitle).trim(),
    String(gameType).trim(),
    String(gameDescription).trim(),
    asJsonObject(game),
    String(req.body.source || current.source || "Back Office").trim(),
    req.params.id
  );

  res.json(normalizeLmsUnit(db.prepare("SELECT * FROM lms_units WHERE id = ?").get(req.params.id)));
});

app.get("/api/admin/lms-learners/:id", requireAdmin, (req, res) => {
  const learner = db.prepare(`
    SELECT id, student_code, name, group_name, created_at, last_login_at
    FROM game_users
    WHERE id = ?
  `).get(req.params.id);
  if (!learner) return res.status(404).json({ error: "ไม่พบผู้เรียน" });

  const units = db.prepare(`
    SELECT
      lms_units.id,
      lms_units.unit_no,
      lms_units.title,
      COALESCE(lms_progress.lesson_viewed, 0) AS lesson_viewed,
      COALESCE(lms_progress.game_score, 0) AS game_score,
      COALESCE(lms_progress.completed, 0) AS completed,
      (
        SELECT score FROM lms_attempts
        WHERE lms_attempts.user_id = ? AND lms_attempts.unit_id = lms_units.id AND assessment_type = 'post'
        ORDER BY score DESC, submitted_at DESC
        LIMIT 1
      ) AS quiz_score,
      (
        SELECT max_score FROM lms_attempts
        WHERE lms_attempts.user_id = ? AND lms_attempts.unit_id = lms_units.id AND assessment_type = 'post'
        ORDER BY score DESC, submitted_at DESC
        LIMIT 1
      ) AS quiz_max_score
    FROM lms_units
    LEFT JOIN lms_progress
      ON lms_progress.unit_id = lms_units.id AND lms_progress.user_id = ?
    ORDER BY lms_units.unit_no ASC
  `).all(req.params.id, req.params.id, req.params.id);

  const attempts = db.prepare(`
    SELECT
      lms_attempts.*,
      lms_units.unit_no,
      lms_units.title AS unit_title
    FROM lms_attempts
    JOIN lms_units ON lms_units.id = lms_attempts.unit_id
    WHERE lms_attempts.user_id = ? AND lms_attempts.assessment_type = 'post'
    ORDER BY lms_attempts.submitted_at DESC, lms_attempts.id DESC
  `).all(req.params.id);

  const answers = db.prepare(`
    SELECT
      lms_answers.*,
      lms_questions.question_no,
      lms_questions.prompt,
      lms_questions.answer_key,
      lms_questions.bloom_level,
      lms_attempts.assessment_type,
      lms_attempts.unit_id
    FROM lms_answers
    JOIN lms_questions ON lms_questions.id = lms_answers.question_id
    JOIN lms_attempts ON lms_attempts.id = lms_answers.attempt_id
    WHERE lms_attempts.user_id = ? AND lms_attempts.assessment_type = 'post'
    ORDER BY lms_attempts.id DESC, lms_questions.question_no ASC
  `).all(req.params.id);

  const gameScores = db.prepare(`
    SELECT game_scores.*, game_attempts.max_score AS last_max_score
    FROM game_scores
    LEFT JOIN game_attempts
      ON game_attempts.user_id = game_scores.user_id
      AND game_attempts.game_key = game_scores.game_key
    WHERE game_scores.user_id = ?
    GROUP BY game_scores.id
    ORDER BY game_scores.updated_at DESC
  `).all(req.params.id);

  const analytics = buildLearnerAnalytics({ units, attempts, answers, gameScores });

  res.json({ learner, units, attempts, answers, gameScores, analytics });
});

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const totalUsers = db.prepare("SELECT COUNT(*) AS count FROM game_users").get().count;
  const totalAttempts = db.prepare("SELECT COUNT(*) AS count FROM game_attempts").get().count;
  const totalScores = db.prepare("SELECT COUNT(*) AS count FROM game_scores").get().count;
  const totalPageViews = db.prepare("SELECT COUNT(*) AS count FROM site_events WHERE event_type = 'page_view'").get().count;
  const todayPageViews = db.prepare(`
    SELECT COUNT(*) AS count
    FROM site_events
    WHERE event_type = 'page_view' AND date(created_at) = date('now', 'localtime')
  `).get().count;
  const avgScore = db.prepare("SELECT ROUND(AVG(score), 1) AS value FROM game_scores").get().value || 0;
  const gameStats = db.prepare(`
    SELECT game_key, COUNT(*) AS attempts, ROUND(AVG(score), 1) AS average_score, MAX(score) AS best_score
    FROM game_attempts
    GROUP BY game_key
    ORDER BY attempts DESC
  `).all();
  const recentAttempts = db.prepare(`
    SELECT game_attempts.*, game_users.student_code, game_users.name, game_users.group_name
    FROM game_attempts
    JOIN game_users ON game_users.id = game_attempts.user_id
    ORDER BY game_attempts.created_at DESC, game_attempts.id DESC
    LIMIT 12
  `).all();
  const sitePaths = db.prepare(`
    SELECT path, COUNT(*) AS views
    FROM site_events
    WHERE event_type = 'page_view'
    GROUP BY path
    ORDER BY views DESC
    LIMIT 10
  `).all();
  res.json({ totalUsers, totalAttempts, totalScores, totalPageViews, todayPageViews, avgScore, gameStats, recentAttempts, sitePaths, readiness: systemReadiness() });
});

app.get("/api/admin/users", requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT
      game_users.*,
      COALESCE(SUM(game_scores.score), 0) AS total_score,
      COUNT(game_scores.id) AS completed_games,
      MAX(game_scores.updated_at) AS last_score_at
    FROM game_users
    LEFT JOIN game_scores ON game_scores.user_id = game_users.id
    GROUP BY game_users.id
    ORDER BY game_users.id DESC
  `).all();
  res.json(rows);
});

app.get("/api/admin/activities", requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT *
    FROM activity_news
    ORDER BY datetime(published_at) DESC, id DESC
  `).all();
  res.json(rows.map(normalizeActivity));
});

app.get("/api/admin/activity-categories", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM activity_categories ORDER BY name ASC").all();
  res.json(rows);
});

app.post("/api/admin/activity-categories", requireAdmin, (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "กรุณากรอกชื่อหมวดหมู่" });
  try {
    const result = db.prepare("INSERT INTO activity_categories (name) VALUES (?)").run(name);
    res.status(201).json(db.prepare("SELECT * FROM activity_categories WHERE id = ?").get(result.lastInsertRowid));
  } catch (err) {
    res.status(409).json({ error: "มีหมวดหมู่นี้แล้ว" });
  }
});

app.put("/api/admin/activity-categories/:id", requireAdmin, (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "กรุณากรอกชื่อหมวดหมู่" });
  const current = db.prepare("SELECT * FROM activity_categories WHERE id = ?").get(req.params.id);
  if (!current) return res.status(404).json({ error: "ไม่พบหมวดหมู่" });
  db.prepare("UPDATE activity_categories SET name = ? WHERE id = ?").run(name, req.params.id);
  db.prepare("UPDATE activity_news SET category = ? WHERE category = ?").run(name, current.name);
  res.json(db.prepare("SELECT * FROM activity_categories WHERE id = ?").get(req.params.id));
});

app.delete("/api/admin/activity-categories/:id", requireAdmin, (req, res) => {
  const current = db.prepare("SELECT * FROM activity_categories WHERE id = ?").get(req.params.id);
  if (!current) return res.status(404).json({ error: "ไม่พบหมวดหมู่" });
  const usage = db.prepare("SELECT COUNT(*) AS count FROM activity_news WHERE category = ?").get(current.name).count;
  if (usage > 0) return res.status(409).json({ error: "หมวดหมู่นี้มีข่าวใช้งานอยู่ กรุณาย้ายข่าวไปหมวดอื่นก่อน" });
  db.prepare("DELETE FROM activity_categories WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

app.post("/api/admin/uploads", requireAdmin, (req, res) => {
  const files = Array.isArray(req.body.files) ? req.body.files.slice(0, 3) : [];
  if (!files.length) return res.status(400).json({ error: "กรุณาเลือกไฟล์รูปภาพ" });
  try {
    res.status(201).json({ paths: files.map(saveUploadedImage) });
  } catch (err) {
    res.status(400).json({ error: "อัปโหลดรูปไม่สำเร็จ กรุณาใช้ไฟล์ JPG, PNG, WEBP หรือ GIF ขนาดไม่เกิน 8MB ต่อรูป" });
  }
});

app.post("/api/admin/activities", requireAdmin, (req, res) => {
  const { title, category, image, image_2 = "", image_3 = "", description, content = "", is_published = 1, published_at } = req.body;
  if (!title || !category || !image || !description) {
    return res.status(400).json({ error: "กรุณากรอกหัวข้อ หมวดหมู่ รูปภาพ และคำอธิบายข่าวสาร" });
  }
  const columns = activityNewsColumns();
  const values = {
    title,
    category,
    image,
    image_2,
    image_3,
    description,
    content: content || description,
    is_published: is_published ? 1 : 0,
    published_at: published_at || new Date().toISOString(),
    image_url: image,
    lead: description,
    body: content || description,
    learning_profile: category,
    source_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  const insertColumns = Object.keys(values).filter((key) => columns.includes(key));
  const placeholders = insertColumns.map(() => "?").join(", ");
  const result = db.prepare(`
    INSERT INTO activity_news (${insertColumns.join(", ")})
    VALUES (${placeholders})
  `).run(...insertColumns.map((key) => values[key]));
  res.status(201).json(db.prepare("SELECT * FROM activity_news WHERE id = ?").get(result.lastInsertRowid));
});

app.put("/api/admin/activities/:id", requireAdmin, (req, res) => {
  const { title, category, image, image_2 = "", image_3 = "", description, content = "", is_published = 1, published_at } = req.body;
  const current = db.prepare("SELECT * FROM activity_news WHERE id = ?").get(req.params.id);
  if (!current) return res.status(404).json({ error: "ไม่พบข่าวสารกิจกรรม" });
  const columns = activityNewsColumns();
  const values = {
    title: title || current.title,
    category: category || current.category,
    image: image || current.image || current.image_url,
    image_2,
    image_3,
    description: description || current.description || current.lead,
    content: content || description || current.content || current.body,
    is_published: is_published ? 1 : 0,
    published_at: published_at || current.published_at || new Date().toISOString(),
    image_url: image || current.image || current.image_url,
    lead: description || current.description || current.lead,
    body: content || description || current.content || current.body,
    learning_profile: category || current.category,
    source_url: current.source_url || "",
    updated_at: new Date().toISOString()
  };
  const updateColumns = Object.keys(values).filter((key) => columns.includes(key));
  const assignments = updateColumns.map((key) => `${key} = ?`).join(", ");
  db.prepare(`UPDATE activity_news SET ${assignments} WHERE id = ?`)
    .run(...updateColumns.map((key) => values[key]), req.params.id);
  res.json(db.prepare("SELECT * FROM activity_news WHERE id = ?").get(req.params.id));
});

app.delete("/api/admin/activities/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM activity_news WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

app.post("/api/admin/users", requireAdmin, (req, res) => {
  const { student_code, name, group_name, role = "student" } = req.body;
  if (!student_code || !name || !group_name) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลผู้เรียนให้ครบ" });
  }
  const result = db.prepare(`
    INSERT INTO game_users (student_code, name, group_name, role)
    VALUES (?, ?, ?, ?)
  `).run(student_code, name, group_name, normalizeRole(role));
  res.status(201).json(userWithScores(result.lastInsertRowid));
});

app.put("/api/admin/users/:id", requireAdmin, (req, res) => {
  const { student_code, name, group_name, role } = req.body;
  const current = db.prepare("SELECT * FROM game_users WHERE id = ?").get(req.params.id);
  if (!current) return res.status(404).json({ error: "ไม่พบผู้เรียน" });
  db.prepare(`
    UPDATE game_users
    SET student_code = ?, name = ?, group_name = ?, role = ?
    WHERE id = ?
  `).run(student_code || current.student_code, name || current.name, group_name || current.group_name, normalizeRole(role || current.role), req.params.id);
  res.json(userWithScores(req.params.id));
});

app.delete("/api/admin/users/:id", requireAdmin, (req, res) => {
  const attemptIds = db.prepare("SELECT id FROM lms_attempts WHERE user_id = ?").all(req.params.id).map((row) => row.id);
  const deleteLmsAnswers = db.prepare("DELETE FROM lms_answers WHERE attempt_id = ?");
  for (const attemptId of attemptIds) deleteLmsAnswers.run(attemptId);
  db.prepare("DELETE FROM lms_attempts WHERE user_id = ?").run(req.params.id);
  db.prepare("DELETE FROM lms_progress WHERE user_id = ?").run(req.params.id);
  db.prepare("DELETE FROM game_attempts WHERE user_id = ?").run(req.params.id);
  db.prepare("DELETE FROM game_scores WHERE user_id = ?").run(req.params.id);
  db.prepare("DELETE FROM game_users WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

app.use(express.static(distDir));
app.use("/assets", express.static(path.join(publicDir, "assets")));
app.use("/uploads", express.static(path.join(publicDir, "uploads")));

app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Network Learning Platform running at http://localhost:${PORT}`);
});
