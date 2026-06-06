const path = require("path");
const Database = require("better-sqlite3");

const unitNo = Number(process.argv[2] || 1);
const db = new Database(path.join(process.cwd(), "database.sqlite"));
const row = db.prepare("SELECT id, unit_no, title, image, lesson_sections_json FROM lms_units WHERE unit_no = ?").get(unitNo);

if (!row) {
  console.log(`Unit ${unitNo} not found`);
  process.exit(1);
}

const sections = JSON.parse(row.lesson_sections_json || "[]");
console.log(JSON.stringify({
  id: row.id,
  unit_no: row.unit_no,
  title: row.title,
  image: row.image,
  sections: sections.map((section, index) => ({
    index: index + 1,
    title: section.title,
    caption: section.caption || "",
    images: section.images || [],
    content_images: section.content_images || []
  }))
}, null, 2));
