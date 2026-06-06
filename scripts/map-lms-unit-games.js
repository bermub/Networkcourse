const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "data", "lms-seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const gameMap = {
  1: {
    status: "available",
    existing_key: "osi",
    title: "OSI Game",
    type: "interactive-game",
    description: "ใช้เกม OSI Game ที่มีในระบบ เพื่อฝึกจับคู่บทบาทของชั้น OSI/TCP-IP กับการวิเคราะห์โครงสร้างเครือข่ายองค์กร",
    mechanic: "เรียงลำดับ/จับคู่ชั้นเครือข่าย",
    goal: "เชื่อมโยง Enterprise Network, Topology และ OSI/TCP-IP ให้เป็นฐานก่อนออกแบบเครือข่าย"
  },
  2: {
    status: "available",
    existing_key: "enterprise",
    title: "Virtual Enterprise Network",
    type: "interactive-game",
    description: "ใช้เกม Virtual Enterprise Network ที่มีในระบบ เพื่อเลือกองค์ประกอบสถาปัตยกรรมเครือข่ายองค์กรให้ครบ Core, Access, DMZ, Security และ Services",
    mechanic: "เลือกองค์ประกอบสถาปัตยกรรม",
    goal: "ฝึกออกแบบ Network Architecture และอธิบายเหตุผลเชิงความคุ้มค่า/ROI"
  },
  3: {
    status: "available",
    existing_key: "ip",
    title: "IP Matching",
    type: "interactive-game",
    description: "ใช้เกม IP Matching ที่มีในระบบ เพื่อฝึกจับคู่ IP Address, Subnet, Gateway และบทบาทอุปกรณ์ตามโจทย์ VLSM",
    mechanic: "จับคู่ IP/Subnet/Gateway",
    goal: "ฝึกอ่าน IP Scheme และตรวจความสอดคล้องของ subnet ในองค์กร"
  },
  4: {
    status: "available",
    existing_key: "vlan",
    title: "VLAN Puzzle",
    type: "interactive-game",
    description: "ใช้เกม VLAN Puzzle ที่มีในระบบ เพื่อจัดอุปกรณ์ลง VLAN ให้ตรงบทบาท แผนก และนโยบาย segmentation",
    mechanic: "จัดกลุ่มอุปกรณ์ลง VLAN",
    goal: "ฝึกออกแบบ VLAN, Access Port, Trunk และ Inter-VLAN Policy"
  },
  5: {
    status: "available",
    existing_key: "cable",
    title: "Cable Crimping",
    type: "interactive-game",
    description: "ใช้เกม Cable Crimping ที่มีในระบบ เพื่อฝึกเรียงสีสาย UTP ตามมาตรฐาน T568B และเชื่อมโยงกับงานติดตั้งสายจริง",
    mechanic: "เรียงลำดับสีสาย",
    goal: "ฝึกเลือกสาย ตรวจสอบสาย และลดข้อผิดพลาดในการเข้าหัว RJ-45"
  },
  6: {
    status: "available",
    existing_key: "packet",
    title: "Packet Simulation",
    type: "interactive-game",
    description: "ใช้เกม Packet Simulation ที่มีในระบบ เพื่อจำลองการเดินทางของข้อมูลผ่าน Switch, Router, Gateway, DNS และ Firewall",
    mechanic: "เรียงลำดับเส้นทาง Packet",
    goal: "เชื่อมโยงการตั้งค่า Switch/Router กับผลการส่งข้อมูลจริงในเครือข่าย"
  },
  7: {
    status: "planned",
    planned_key: "windows-server-lab",
    title: "แผนเกม Windows Server Setup Challenge",
    type: "planned-game",
    description: "วางแผนสร้างเกมแบบ Step Builder ให้ผู้เรียนเรียงขั้นตอนติดตั้ง Windows Server 2022 ตั้งชื่อเครื่อง Static IP และเลือก Server Role ให้ถูกต้อง",
    mechanic: "เรียงขั้นตอน/เลือกค่าติดตั้ง",
    goal: "ฝึกตัดสินใจติดตั้ง Windows Server 2022 ตาม checklist ก่อนทำ lab จริง"
  },
  8: {
    status: "planned",
    planned_key: "ubuntu-terminal-quest",
    title: "แผนเกม Ubuntu Terminal Quest",
    type: "planned-game",
    description: "วางแผนสร้างเกมจำลอง Terminal ให้ผู้เรียนเลือกคำสั่ง Netplan, systemctl, ufw และ apt ให้เหมาะกับสถานการณ์ Ubuntu Server",
    mechanic: "เลือกคำสั่ง CLI ตามสถานการณ์",
    goal: "ฝึกอ่านโจทย์และเลือกคำสั่งบริหาร Ubuntu Server อย่างเป็นระบบ"
  },
  9: {
    status: "available",
    existing_key: "packet",
    title: "Packet Simulation",
    type: "interactive-game",
    description: "ใช้เกม Packet Simulation ที่มีในระบบ โดยเน้นขั้นตอน DNS Resolution และการส่งข้อมูล Client-to-Server ก่อนเชื่อมโยงกับ DHCP/DNS Lab",
    mechanic: "จำลอง DNS และเส้นทาง Packet",
    goal: "ฝึกมองความสัมพันธ์ระหว่าง Client, DNS, Gateway และ Server Service"
  },
  10: {
    status: "planned",
    planned_key: "ad-ds-domain-builder",
    title: "แผนเกม AD DS Domain Builder",
    type: "planned-game",
    description: "วางแผนสร้างเกมออกแบบ Domain, OU, User, Group และ GPO โดยให้ผู้เรียนจัดสิทธิ์ตามหลัก AGdLP",
    mechanic: "ลากวางโครงสร้าง Domain และสิทธิ์",
    goal: "ฝึกออกแบบ Active Directory และ Permission ให้เหมาะกับองค์กร"
  },
  11: {
    status: "available",
    existing_key: "defense",
    title: "Network Defense",
    type: "interactive-game",
    description: "ใช้เกม Network Defense ที่มีในระบบ เพื่อฝึกตัดสินใจรับมือ Port Scan, Ransomware, Brute Force และ IoT Traffic ผิดปกติ",
    mechanic: "เลือกมาตรการป้องกัน Incident",
    goal: "ฝึกกำหนด Firewall, ACL, Segmentation และ Monitoring ตามสถานการณ์"
  },
  12: {
    status: "available",
    existing_key: "defense",
    title: "Network Defense",
    type: "interactive-game",
    description: "ใช้เกม Network Defense ที่มีในระบบ โดยเน้นเหตุการณ์ VPN Brute Force และการใช้ MFA/Rate Limit/Log Review",
    mechanic: "ตัดสินใจด้าน VPN Security",
    goal: "ฝึกเชื่อมโยง VPN, Remote Access, MFA และ Zero Trust กับการป้องกันจริง"
  },
  13: {
    status: "available",
    existing_key: "packet",
    title: "Packet Simulation",
    type: "interactive-game",
    description: "ใช้เกม Packet Simulation ที่มีในระบบ เพื่อฝึก Follow-the-Path และแยกปัญหา DNS, Gateway, Routing และ Firewall",
    mechanic: "วิเคราะห์เส้นทาง Packet",
    goal: "ฝึก troubleshooting แบบ OSI/Follow-the-Path จากหลักฐานการส่งข้อมูล"
  },
  14: {
    status: "available",
    existing_key: "defense",
    title: "Network Defense",
    type: "interactive-game",
    description: "ใช้เกม Network Defense ที่มีในระบบ โดยเชื่อมโยงสถานการณ์ Ransomware กับการกักกันเครื่อง เก็บหลักฐาน และกู้คืนจาก Backup",
    mechanic: "เลือกแผนรับมือและกู้คืน",
    goal: "ฝึกคิดเรื่อง Backup, Restore, Incident Response และ Preventive Maintenance"
  },
  15: {
    status: "available",
    existing_key: "enterprise",
    title: "Virtual Enterprise Network",
    type: "interactive-game",
    description: "ใช้เกม Virtual Enterprise Network ที่มีในระบบ เพื่อทบทวนองค์ประกอบเครือข่ายก่อนจัดทำ As-Built, IPAM และเอกสารส่งมอบโครงการ",
    mechanic: "จัดองค์ประกอบเครือข่ายองค์กร",
    goal: "ฝึกสรุปภาพรวมระบบเพื่อทำเอกสาร As-Built และ Project Handover"
  }
};

for (const unit of seed.units) {
  const mapped = gameMap[unit.unit_no];
  if (!mapped) continue;
  unit.game = {
    ...mapped,
    feedback: mapped.status === "available"
      ? "เล่นเกมในระบบแล้วบันทึกคะแนน จากนั้นกลับมาบันทึกผลกิจกรรมในหน่วยเพื่อเปิดแบบทดสอบท้ายบท"
      : "ใช้เป็นแผนพัฒนาเกมเพิ่มเติมใน LMS โดยยังสามารถบันทึกกิจกรรมจำลองเพื่อเปิดแบบทดสอบท้ายบทได้"
  };
}

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n", "utf8");
console.log("Mapped LMS unit games to available games and planned game concepts.");
