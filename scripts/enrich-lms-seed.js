const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "data", "lms-seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const unitAssets = [
  "/assets/new-activities/classroom-network-lesson.jpg",
  "/assets/activities/hpe-server.jpg",
  "/assets/new-activities/computer-lab-student-group.jpg",
  "/assets/activities/osi-model.jpg",
  "/assets/activities/fiber-otdr.jpg",
  "/assets/activities/otdr-testing.jpg",
  "/assets/activities/hpe-server.jpg",
  "/assets/new-activities/ai-codex-ollama-workflow.jpg",
  "/assets/new-activities/fortigate-log-table.jpg",
  "/assets/new-activities/college-large-assembly.jpg",
  "/assets/new-activities/fortigate-dashboard.jpg",
  "/assets/new-activities/research-writing-online.jpg",
  "/assets/activities/ux-ui.png",
  "/assets/activities/fiber-move.jpg",
  "/assets/new-activities/activity-audio-system-field.jpg"
];

const unitDesign = [
  {
    topics: ["Enterprise Network", "Requirements Gathering", "Topology", "Three-Tier Design", "Redundancy"],
    workshop: "วิเคราะห์กรณีศึกษาองค์กรจริง ระบุผู้ใช้ แอปพลิเคชัน ปริมาณข้อมูล และร่าง Current/Target Network",
    product: "เอกสาร Network Requirement และโครงร่าง Logical Diagram"
  },
  {
    topics: ["Network Architecture", "ROI/TCO", "Capacity Planning", "BOM", "Implementation Plan"],
    workshop: "ออกแบบ Blueprint เครือข่ายองค์กร พร้อมประเมินต้นทุน ผลตอบแทน และความเสี่ยงของโครงการ",
    product: "Network Design Proposal พร้อมตาราง ROI/TCO"
  },
  {
    topics: ["IPv4/IPv6", "Subnetting", "VLSM", "CIDR", "IPAM"],
    workshop: "คำนวณ subnet จากเงื่อนไขหลายแผนก แล้วจัดทำ IP Addressing Table และ DHCP Scope",
    product: "IP Addressing Plan และ IPAM Sheet"
  },
  {
    topics: ["VLAN", "802.1Q Trunk", "Inter-VLAN Routing", "STP", "EtherChannel"],
    workshop: "จำลองการแบ่ง VLAN ตามบทบาทผู้ใช้ กำหนด trunk และทดสอบการสื่อสารระหว่าง VLAN",
    product: "VLAN Matrix และ Inter-VLAN Routing Design"
  },
  {
    topics: ["UTP/Fiber", "TIA-568", "Structured Cabling", "Rack Layout", "Cable Testing"],
    workshop: "เลือกสื่อสัญญาณและอุปกรณ์ตามพื้นที่ ติดตั้งเข้าตู้ Rack และกำหนดจุดทดสอบสาย",
    product: "Cabling Plan, Rack Layout และ Cable Test Record"
  },
  {
    topics: ["Cisco IOS", "Switch/Router Basic Config", "SSH", "Static Routing", "Config Backup"],
    workshop: "กำหนดค่าอุปกรณ์เครือข่ายพื้นฐาน ตั้ง hostname, IP, SSH, route และสำรอง configuration",
    product: "Running Configuration และ Network Verification Log"
  },
  {
    topics: ["Windows Server 2022", "Server Roles", "Static IP", "PowerShell", "Event Log"],
    workshop: "ติดตั้ง Windows Server กำหนดค่า IP เพิ่ม Role และตรวจสอบสถานะบริการด้วยเครื่องมือระบบ",
    product: "Windows Server Installation Checklist"
  },
  {
    topics: ["Ubuntu Server", "APT", "systemd", "Netplan", "UFW"],
    workshop: "ติดตั้ง Ubuntu Server กำหนด Static IP ด้วย Netplan จัดการ service และตั้งค่า firewall",
    product: "Ubuntu Server Configuration Record"
  },
  {
    topics: ["DHCP DORA", "DHCP Scope", "DNS Zone", "DNS Record", "nslookup"],
    workshop: "ติดตั้งและกำหนด DHCP/DNS ทดสอบการแจก IP และการ resolve ชื่อเครื่องในเครือข่าย",
    product: "DHCP/DNS Service Validation Report"
  },
  {
    topics: ["AD DS", "Forest/Domain/OU", "FSMO", "User/Group", "GPO"],
    workshop: "ออกแบบ OU Structure สร้างผู้ใช้/กลุ่ม และกำหนด Group Policy ตามนโยบายองค์กร",
    product: "Active Directory Design และ GPO Summary"
  },
  {
    topics: ["Firewall", "ACL", "DMZ", "Segmentation", "Zero Trust"],
    workshop: "ออกแบบ security zone เขียน ACL ตามนโยบาย และวิเคราะห์ผลกระทบก่อนใช้งานจริง",
    product: "Firewall Rule Matrix และ Security Policy"
  },
  {
    topics: ["VPN", "IPSec", "SSL VPN", "Cryptography", "Remote Access"],
    workshop: "เลือกชนิด VPN ให้เหมาะกับกรณีใช้งาน กำหนด policy และจัดทำขั้นตอนทดสอบ tunnel",
    product: "VPN Design Sheet และ Remote Access Policy"
  },
  {
    topics: ["Troubleshooting Methodology", "OSI Approach", "ping/tracert/nslookup", "Wireshark", "Incident Log"],
    workshop: "รับโจทย์ incident วิเคราะห์ทีละ layer ใช้เครื่องมือ command-line และบันทึกหลักฐาน",
    product: "Network Incident Report"
  },
  {
    topics: ["Backup Strategy", "3-2-1 Rule", "Config Backup", "SNMP", "Preventive Maintenance"],
    workshop: "วางแผนสำรองข้อมูล ทดสอบ restore และออกแบบตารางบำรุงรักษาเชิงป้องกัน",
    product: "Backup and Preventive Maintenance Plan"
  },
  {
    topics: ["As-Built Drawing", "IPAM Document", "Technical Report", "Handover", "Presentation"],
    workshop: "รวบรวมเอกสารส่งมอบโครงการ จัดทำ As-Built Diagram และนำเสนอผลต่อผู้บริหาร",
    product: "Project Handover Package"
  }
];

seed.course = {
  ...seed.course,
  code: "31909-2005",
  title: "การออกแบบและการจัดการเครือข่ายในองค์กร",
  model: "MIAP + Competency-Based Learning + Game-Based Learning",
  research_focus: "ใช้ผลก่อนเรียน-หลังเรียน ความก้าวหน้ารายหน่วย คะแนนเกม และค่าความยากง่ายของข้อสอบเพื่อพัฒนางานวิจัยระดับผู้เชี่ยวชาญ"
};

seed.units = seed.units.map((unit, index) => {
  const design = unitDesign[index] || unitDesign[0];
  const topicSentences = design.topics.map((topic, topicIndex) => {
    const sourceLine = unit.content?.[topicIndex] || unit.outcomes?.[topicIndex] || "";
    return {
      title: topic,
      detail: sourceLine.replace(/^\d+\.\s*/, "") || `ศึกษา ${topic} และเชื่อมโยงกับการออกแบบเครือข่ายองค์กรตามสมรรถนะรายวิชา`
    };
  });

  return {
    ...unit,
    image: unitAssets[index],
    phase: index < 2 ? "วิเคราะห์และออกแบบ" : index < 6 ? "ติดตั้งและกำหนดค่า" : index < 10 ? "บริการเครือข่ายและระบบแม่ข่าย" : index < 14 ? "ความปลอดภัยและบำรุงรักษา" : "สรุปและส่งมอบ",
    key_topics: design.topics,
    lesson_sections: topicSentences,
    learning_steps: [
      "ทดสอบก่อนเรียนเพื่อวิเคราะห์พื้นฐานและจัดกลุ่มความพร้อมของผู้เรียน",
      "ศึกษาเนื้อหาหลักจากเอกสารประกอบการสอนและใบความรู้ประจำหน่วย",
      "ทำกิจกรรมปฏิบัติ/ภารกิจจำลองเพื่อเชื่อมโยงความรู้กับงานเครือข่ายจริง",
      "เล่นเกมการเรียนรู้ประจำหน่วยเพื่อฝึกการตัดสินใจและทบทวนแนวคิดสำคัญ",
      "ทำแบบทดสอบหลังเรียน วิเคราะห์ผล และรับข้อเสนอแนะเพื่อพัฒนารายบุคคล"
    ],
    workshop: design.workshop,
    product: design.product,
    teacher_guidance: [
      "เริ่มจากสถานการณ์ปัญหาใกล้ตัวผู้เรียน แล้วชวนวิเคราะห์ข้อมูลก่อนสรุปทฤษฎี",
      "ใช้หลัก MIAP: Motivation, Information, Application, Progress เพื่อจัดลำดับกิจกรรม",
      "เก็บหลักฐานการเรียนรู้จากแบบทดสอบ เกม ชิ้นงาน และการสะท้อนผลหลังเรียน"
    ],
    learner_analysis: {
      readiness: "ใช้คะแนนก่อนเรียนและประวัติความก้าวหน้าเพื่อแยกกลุ่มพื้นฐาน",
      intervention: "ผู้เรียนที่ต่ำกว่า 60% ได้รับกิจกรรมเสริมและคำแนะนำเฉพาะจุด",
      mastery: "ถือว่าผ่านหน่วยเมื่อเรียนบทเรียน ทำเกม และหลังเรียนได้ไม่น้อยกว่า 80%"
    },
    game: {
      ...unit.game,
      description: `ภารกิจจำลองสถานการณ์สำหรับฝึก ${unit.title} โดยเชื่อมโยงกับหัวข้อหลักและแบบทดสอบประจำหน่วย`,
      mechanic: ["จับคู่", "วางแผน", "จำลองสถานการณ์", "แก้ปัญหา", "ตัดสินใจ"][index % 5],
      goal: `ให้ผู้เรียนฝึก ${design.topics.slice(0, 3).join(", ")} ผ่านสถานการณ์จำลอง`,
      feedback: "ระบบแสดงผลทันที พร้อมเชื่อมโยงกลับไปยังหัวข้อที่ควรทบทวน"
    }
  };
});

fs.writeFileSync(seedPath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");
console.log(`Enriched ${seed.units.length} LMS units.`);
