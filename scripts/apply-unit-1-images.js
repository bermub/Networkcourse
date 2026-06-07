const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const unitNo = 1;
const mapping = [
  {
    images: ["/assets/lms-unit-01/1-12.png"],
    caption: "Enterprise network overview: office LAN, core, security, cloud, and data center"
  },
  {
    images: ["/assets/lms-unit-01/1-15.png"],
    caption: "Traffic, availability, security, and monitoring requirements for enterprise networks"
  },
  {
    images: ["/assets/lms-unit-01/1-1.png", "/assets/lms-unit-01/1-2.png"],
    caption: "Three-tier campus design and spine-leaf comparison"
  },
  {
    images: ["/assets/lms-unit-01/1-14.png", "/assets/lms-unit-01/1-3.png", "/assets/lms-unit-01/1-3-1.png"],
    caption: "Topology choices with OSI/TCP-IP models for network analysis"
  },
  {
    images: ["/assets/lms-unit-01/1-11.png"],
    caption: "Requirements analysis workflow and current-state discovery"
  },
  {
    images: ["/assets/lms-unit-01/1-13.png"],
    caption: "Defense-in-depth evidence connects design decisions to security and risk reduction"
  }
];

function applySections(sections) {
  return (sections || []).map((section, index) => {
    const item = mapping[index];
    if (!item) return section;
    return {
      ...section,
      caption: item.caption,
      image_caption: item.caption,
      images: item.images,
      content_images: []
    };
  });
}

const seedPath = path.join(process.cwd(), "data", "lms-seed.json");
if (fs.existsSync(seedPath)) {
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  const unit = seed.units?.find((item) => item.unit_no === unitNo);
  if (unit) {
    unit.lesson_sections = applySections(unit.lesson_sections);
    fs.writeFileSync(seedPath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");
    console.log(`Updated seed images for unit ${unitNo}`);
  }
}

const dbPath = path.join(process.cwd(), "database.sqlite");
if (fs.existsSync(dbPath)) {
  const db = new Database(dbPath);
  const row = db.prepare("SELECT id, lesson_sections_json FROM lms_units WHERE unit_no = ?").get(unitNo);
  if (row) {
    const sections = JSON.parse(row.lesson_sections_json || "[]");
    const nextSections = applySections(sections);
    db.prepare("UPDATE lms_units SET lesson_sections_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(JSON.stringify(nextSections), row.id);
    console.log(`Updated database images for unit ${unitNo}`);
  }
  db.close();
}
