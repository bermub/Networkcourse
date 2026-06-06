const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "data", "lms-seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const imageBase = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const externalUnits = [
  {
    image: `${imageBase}Overview_of_a_three-tier_application_vectorVersion.svg`,
    sections: [
      ["กรอบคิดการออกแบบเครือข่ายองค์กร", "เริ่มจากเป้าหมายธุรกิจ จำนวนผู้ใช้ แอปพลิเคชันสำคัญ รูปแบบการทำงาน และข้อกำหนดความพร้อมใช้งาน ก่อนเลือกอุปกรณ์หรือเทคโนโลยีใด ๆ"],
      ["สถาปัตยกรรมแบบลำดับชั้น", "แบ่งบทบาทเป็น Access, Distribution และ Core เพื่อแยกงานเชื่อมต่อผู้ใช้ งานควบคุมนโยบาย และงานส่งผ่านข้อมูลความเร็วสูง"],
      ["การวิเคราะห์ Current State", "สำรวจอุปกรณ์เดิม IP/VLAN เดิม เส้นทางสาย ปัญหา downtime และคอขวด เพื่อกำหนดช่องว่างระหว่างระบบปัจจุบันกับระบบเป้าหมาย"],
      ["Availability และ Redundancy", "ระบุ single point of failure แล้วออกแบบลิงก์สำรอง อุปกรณ์สำรอง แหล่งจ่ายไฟสำรอง และแผน failover ให้เหมาะกับงบประมาณ"],
      ["ผลลัพธ์ที่คาดหวัง", "ผู้เรียนต้องอธิบายเหตุผลเชิงออกแบบได้ ไม่ใช่เพียงวาด diagram แต่ต้องเชื่อมโยง requirement, risk, cost และ operation"]
    ],
    caseStudy: "องค์กรสมมติ 3 อาคาร มีผู้ใช้ 300 คน ระบบบัญชีและระบบทะเบียนต้องใช้งานต่อเนื่อง ให้ผู้เรียนเก็บ requirement แล้วเลือก topology ที่ลด single point of failure",
    lab: ["สัมภาษณ์ผู้ใช้จำลอง 3 กลุ่ม", "สร้างตาราง requirement", "วาด current topology", "ระบุ risk และ gap", "นำเสนอ target topology"],
    mistakes: ["เริ่มจากซื้ออุปกรณ์ก่อนวิเคราะห์งาน", "ไม่แยก logical กับ physical diagram", "ไม่ระบุ critical application", "ลืมแผนขยายในอนาคต"]
  },
  {
    image: `${imageBase}Corporate_LAN_VLAN_segmentation.svg`,
    sections: [
      ["Network Architecture Blueprint", "จัดโครงสร้าง campus network เป็น block เช่น user access, server zone, internet edge และ management network เพื่อให้ขยายและดูแลง่าย"],
      ["ROI และ TCO", "ROI ใช้มองผลตอบแทนจากการลงทุน ส่วน TCO รวมต้นทุนตลอดอายุระบบ เช่น license, support, training, power และ downtime"],
      ["Capacity Planning", "ประมาณ peak traffic, growth rate, uplink oversubscription และ buffer สำหรับการขยายงาน เพื่อไม่ให้ระบบติดคอขวดเร็วเกินไป"],
      ["BOM และมาตรฐานอุปกรณ์", "Bill of Materials ควรระบุรุ่น จำนวน port, throughput, license, warranty และเหตุผลการเลือกตาม requirement"],
      ["Implementation Roadmap", "แบ่งงานเป็น survey, staging, migration, testing, training และ handover พร้อม rollback plan"]
    ],
    caseStudy: "ฝ่ายบริหารต้องการลด downtime จาก 8 ชั่วโมง/ปี เหลือไม่เกิน 1 ชั่วโมง/ปี ให้ผู้เรียนคำนวณประโยชน์เทียบต้นทุนและเสนอแผนลงทุน",
    lab: ["กำหนด service requirement", "คำนวณ TCO 3 ปี", "ประเมิน ROI", "จัดทำ BOM", "ทำแผน migration"],
    mistakes: ["นับเฉพาะราคาซื้อ", "ไม่คิดค่า license/support", "ไม่เผื่อ growth", "ไม่มี rollback plan"]
  },
  {
    image: `${imageBase}Subnetting_Concept-en.svg`,
    sections: [
      ["หลักการ IPv4/IPv6", "เข้าใจ network portion, host portion, prefix length และ private address เพื่อออกแบบ address plan ที่ไม่ชนกัน"],
      ["Subnetting", "ใช้การยืม bit เพื่อแบ่ง network ให้เหมาะกับจำนวน host และลด broadcast domain"],
      ["VLSM", "จัดสรร subnet ขนาดต่างกันตามความต้องการจริง เริ่มจาก subnet ที่ต้องการ host มากที่สุดก่อน"],
      ["CIDR และ Summarization", "ใช้ prefix เพื่อรวม route ลด routing table และทำให้ diagram/readability ดีขึ้น"],
      ["IPAM", "บันทึก VLAN, subnet, gateway, DHCP range, static IP, device owner และวันที่แก้ไข เพื่อควบคุมการใช้งานระยะยาว"]
    ],
    caseStudy: "วิทยาลัยมี 5 แผนกและ server zone ต้องแบ่ง 192.168.10.0/24 ด้วย VLSM ให้ไม่สิ้นเปลือง IP",
    lab: ["ระบุจำนวน host แต่ละแผนก", "เรียง subnet จากใหญ่ไปเล็ก", "คำนวณ network/broadcast", "กำหนด gateway", "จัดทำ IPAM"],
    mistakes: ["ลืมลบ network/broadcast address", "กำหนด DHCP ทับ static IP", "ไม่เว้น growth", "ใช้ subnet mask ไม่ตรง prefix"]
  },
  {
    image: `${imageBase}Corporate_LAN_VLAN_segmentation.svg`,
    sections: [
      ["VLAN Segmentation", "แยกผู้ใช้ตามบทบาท เช่น student, teacher, admin, server และ guest เพื่อลด broadcast และเพิ่มการควบคุม"],
      ["802.1Q Trunk", "trunk link ส่งหลาย VLAN ผ่านลิงก์เดียวโดยใส่ VLAN tag ระหว่าง switch หรือ switch-router"],
      ["Inter-VLAN Routing", "ให้ VLAN ต่างกันสื่อสารผ่าน router-on-a-stick หรือ Layer 3 switch พร้อมควบคุมนโยบายด้วย ACL"],
      ["STP และ Loop Prevention", "Spanning Tree ป้องกัน loop ใน Layer 2 เมื่อมีลิงก์สำรอง แต่ต้องออกแบบ root bridge ให้เหมาะสม"],
      ["VLAN Security", "กำหนด native VLAN, disable unused ports, port security และแยก guest ออกจาก internal resource"]
    ],
    caseStudy: "ห้องปฏิบัติการมีเครื่องนักศึกษา เครื่องครู และ server ให้แยก VLAN แล้วกำหนดเฉพาะครูเข้าถึง server ได้",
    lab: ["ออกแบบ VLAN table", "กำหนด access port", "กำหนด trunk", "ตั้ง gateway", "ทดสอบ ping และ ACL"],
    mistakes: ["ใช้ VLAN 1 เป็น production", "ลืมกำหนด trunk allowed VLAN", "native VLAN ไม่ตรงกัน", "ไม่ทดสอบ inter-VLAN"]
  },
  {
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
    sections: [
      ["Structured Cabling", "ระบบสายต้องมี horizontal cabling, backbone, patch panel, labeling และ cable management เพื่อรองรับการบำรุงรักษา"],
      ["UTP และ Fiber", "UTP เหมาะกับ endpoint ระยะสั้น ส่วน fiber เหมาะกับ backbone, inter-building และ bandwidth สูง"],
      ["มาตรฐาน TIA-568", "กำหนด pinout, category, performance และวิธี termination เพื่อลดปัญหาสัญญาณรบกวน"],
      ["Rack Layout", "จัดอุปกรณ์โดยคำนึงถึงน้ำหนัก airflow, patching และช่องว่างสำหรับ service"],
      ["Cable Testing", "ทดสอบ continuity, wiremap, length, attenuation และบันทึกผลก่อนส่งมอบ"]
    ],
    caseStudy: "ติดตั้งห้อง lab ใหม่ 40 จุด ต้องเลือกชนิดสาย จัด patch panel และวางแผนทดสอบก่อนส่งมอบ",
    lab: ["อ่านแบบห้อง", "กำหนด outlet", "เลือกสาย", "ออกแบบ rack", "จัดทำ test record"],
    mistakes: ["ไม่มี label", "สายโค้งงอเกินมาตรฐาน", "แยกสายไฟกับสาย data ไม่ดี", "ไม่บันทึกผลทดสอบ"]
  },
  {
    image: `${imageBase}Cisco_Switch_Router_Bad_Wiring.jpg`,
    sections: [
      ["Cisco IOS Modes", "เข้าใจ user EXEC, privileged EXEC, global config และ interface config เพื่อทำงานถูกบริบท"],
      ["Basic Security", "ตั้ง enable secret, local user, SSH และปิด service ที่ไม่จำเป็นเพื่อลดความเสี่ยง"],
      ["Interface Configuration", "กำหนด IP, description, speed/duplex และ no shutdown พร้อมตรวจสอบสถานะ"],
      ["Static Routing", "ใช้ route แบบ static ในเครือข่ายขนาดเล็กหรือเส้นทางที่คงที่และต้องการควบคุม"],
      ["Configuration Backup", "บันทึก running-config ไป startup-config และสำรองไฟล์ออกนอกอุปกรณ์"]
    ],
    caseStudy: "เชื่อมต่อ router ระหว่าง 2 subnet และ switch 2 ตัว ให้ผู้เรียนตั้งค่า SSH และทดสอบ route",
    lab: ["ตั้ง hostname", "ตั้งรหัสผ่านและ SSH", "กำหนด IP interface", "เพิ่ม static route", "backup config"],
    mistakes: ["ลืม copy run start", "interface shutdown", "default gateway ผิด", "เปิด telnet แทน SSH"]
  },
  {
    image: `${imageBase}Server_room.jpg`,
    sections: [
      ["Windows Server Role", "เลือก role ให้ตรงงาน เช่น File Server, DHCP, DNS, Web Server หรือ Domain Controller"],
      ["Static IP", "server ต้องใช้ IP คงที่และ DNS ที่ถูกต้องเพื่อให้ client และ service อื่นค้นหาได้"],
      ["PowerShell Administration", "ใช้ PowerShell เพื่อทำงานซ้ำได้ ตรวจสอบได้ และเหมาะกับการจัดการระบบหลายเครื่อง"],
      ["Event Viewer", "อ่าน log เพื่อวิเคราะห์ service failure, authentication problem และ hardware warning"],
      ["Baseline Configuration", "ตั้งชื่อเครื่อง update, firewall, time sync และ remote management ก่อนติดตั้ง role"]
    ],
    caseStudy: "ตั้ง Windows Server สำหรับแผนกวิชา ให้บริการไฟล์และเตรียมต่อยอดเป็น domain service",
    lab: ["ติดตั้ง OS", "ตั้ง static IP", "เปลี่ยน hostname", "เพิ่ม role", "ตรวจ event log"],
    mistakes: ["ตั้ง DNS ผิด", "ไม่อัปเดตระบบ", "ใช้ admin account ร่วมกัน", "ไม่บันทึก baseline"]
  },
  {
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1400&q=80",
    sections: [
      ["Ubuntu Server LTS", "ใช้รุ่น LTS เพื่อความเสถียรและรอบ support ยาว เหมาะกับบริการในองค์กร"],
      ["APT Package Management", "ติดตั้ง อัปเดต และตรวจสอบ package จาก repository ที่เชื่อถือได้"],
      ["Netplan", "กำหนด network interface ด้วย YAML โดยต้องระวัง indentation และชื่อ interface"],
      ["systemd", "จัดการ service ด้วย systemctl เช่น start, stop, enable และตรวจ status"],
      ["UFW Firewall", "เปิดเฉพาะ port ที่จำเป็นและตรวจ policy ก่อนนำ server เข้าระบบจริง"]
    ],
    caseStudy: "ติดตั้ง Ubuntu Server เพื่อให้บริการภายใน เช่น web หรือ monitoring พร้อม static IP และ firewall",
    lab: ["ติดตั้ง OS", "แก้ netplan", "apply network", "ติดตั้ง service", "เปิด UFW เฉพาะ port"],
    mistakes: ["YAML indentation ผิด", "ไม่ตรวจ interface name", "เปิด firewall กว้างเกินไป", "ไม่ enable service"]
  },
  {
    image: `${imageBase}Dhcp.png`,
    sections: [
      ["DHCP DORA", "เข้าใจ Discover, Offer, Request, Acknowledge เพื่อวิเคราะห์ปัญหาการรับ IP"],
      ["Scope Design", "กำหนด range, exclusion, reservation, lease time, gateway และ DNS option ให้เหมาะกับแต่ละ VLAN"],
      ["DHCP Relay", "เมื่อ DHCP server อยู่คนละ subnet ต้องใช้ relay/ip helper เพื่อส่ง broadcast ข้าม router"],
      ["DNS Zone", "จัดการ forward lookup, reverse lookup และ record สำคัญ เช่น A, PTR, CNAME, MX"],
      ["Service Validation", "ทดสอบด้วย ipconfig, nslookup และ log เพื่อยืนยันว่า client ได้ค่าถูกต้อง"]
    ],
    caseStudy: "ผู้เรียนบาง VLAN รับ IP ไม่ได้ ให้ตรวจ DHCP scope, relay และ DNS resolution",
    lab: ["สร้าง scope", "กำหนด options", "ทดสอบ renew", "สร้าง DNS record", "ตรวจ nslookup"],
    mistakes: ["scope ซ้อนกัน", "ลืม default gateway option", "ไม่มี DHCP relay", "reverse DNS ไม่ครบ"]
  },
  {
    image: `${imageBase}Active_Directory_Domain_Services.png`,
    sections: [
      ["AD DS Concept", "Active Directory จัดการ identity, computer, group และ policy เพื่อควบคุมทรัพยากรใน domain"],
      ["OU Design", "ออกแบบ OU ตามโครงสร้างบริหารและนโยบาย ไม่ใช่เพียงตามห้องหรืออาคาร"],
      ["Group Strategy", "ใช้กลุ่มเพื่อกำหนดสิทธิ์แทนการให้ permission รายบุคคล ลดความผิดพลาดในการดูแล"],
      ["Group Policy", "ใช้ GPO เพื่อบังคับ password policy, desktop setting, software และ security baseline"],
      ["DNS Dependency", "AD DS พึ่ง DNS ในการค้นหา domain controller จึงต้องตั้ง DNS ถูกต้องก่อน promote"]
    ],
    caseStudy: "สร้าง domain สำหรับวิทยาลัย แยก OU นักศึกษา ครู ห้องปฏิบัติการ และกำหนดนโยบายรหัสผ่าน",
    lab: ["ติดตั้ง AD DS", "promote DC", "สร้าง OU", "สร้าง user/group", "ผูก GPO"],
    mistakes: ["ออกแบบ OU ตามความสวยงาม", "ให้สิทธิ์รายบุคคล", "DNS ชี้ออก internet", "ไม่ทดสอบ login"]
  },
  {
    image: `${imageBase}DMZ_network_diagram_1_firewall.svg`,
    sections: [
      ["Firewall Policy", "นโยบาย firewall ต้องระบุ source, destination, service, action และเหตุผลทางธุรกิจ"],
      ["ACL", "ACL ใช้กรอง traffic ตาม IP, protocol และ port ต้องวางใกล้ source หรือ destination ตามชนิด ACL"],
      ["DMZ", "แยก public-facing server ออกจาก internal network เพื่อลดผลกระทบเมื่อ server ถูกโจมตี"],
      ["Segmentation", "แบ่ง network ตามความเสี่ยงและสิทธิ์เข้าถึง เช่น user, server, guest, IoT และ management"],
      ["Zero Trust", "ลด implicit trust โดยตรวจ identity, device posture, policy และ telemetry ก่อนอนุญาตการเข้าถึง"]
    ],
    caseStudy: "เปิด web server ให้คนภายนอกเข้าถึงได้ แต่ต้องป้องกันไม่ให้เข้าถึง database ภายในโดยตรง",
    lab: ["วาด zone diagram", "เขียน rule matrix", "สร้าง ACL", "ทดสอบ allow/deny", "บันทึก policy"],
    mistakes: ["allow any any", "ไม่บันทึกเหตุผล rule", "DMZ เชื่อม internal ตรง", "ไม่ทดสอบ deny case"]
  },
  {
    image: `${imageBase}VPN_overview-en.svg`,
    sections: [
      ["VPN Use Case", "เลือก site-to-site สำหรับเชื่อมสาขา และ remote access สำหรับผู้ใช้ทำงานนอกสถานที่"],
      ["IPSec", "ประกอบด้วย IKE, ESP/AH, encryption, integrity และ key exchange เพื่อสร้าง tunnel ที่ปลอดภัย"],
      ["SSL VPN", "เหมาะกับผู้ใช้ปลายทาง ใช้งานง่ายผ่าน client หรือ browser แต่ต้องคุมนโยบายอุปกรณ์"],
      ["Authentication", "ควรใช้ MFA, certificate หรือ identity provider เพื่อลดความเสี่ยงจากรหัสผ่านรั่ว"],
      ["Monitoring", "ตรวจ tunnel status, log, bandwidth และ failed login เพื่อดูความมั่นคงปลอดภัย"]
    ],
    caseStudy: "ครูต้องเข้าระบบภายในจากบ้าน ให้ผู้เรียนเลือก VPN design พร้อมนโยบาย MFA และ logging",
    lab: ["เลือก VPN type", "กำหนด subnet", "กำหนด authentication", "ทดสอบ tunnel", "ตรวจ log"],
    mistakes: ["ใช้ pre-shared key ง่าย", "ไม่จำกัด subnet", "ไม่มี MFA", "ไม่ตรวจ log"]
  },
  {
    image: `${imageBase}Wireshark_icon.svg`,
    sections: [
      ["Troubleshooting Methodology", "แก้ปัญหาอย่างเป็นระบบ: ระบุปัญหา ตั้งสมมติฐาน ทดสอบ แก้ไข ตรวจผล และบันทึก"],
      ["OSI Approach", "ใช้ bottom-up, top-down หรือ divide-and-conquer เพื่อจำกัดขอบเขตปัญหา"],
      ["Command Tools", "ping, tracert, ipconfig, nslookup, netstat และ route ช่วยตรวจ connectivity และ name resolution"],
      ["Packet Analysis", "Wireshark ใช้ดู packet จริงเพื่อแยกปัญหา DNS, TCP handshake, retransmission หรือ policy block"],
      ["Incident Log", "บันทึกเวลา อาการ หลักฐาน สาเหตุ วิธีแก้ และมาตรการป้องกันซ้ำ"]
    ],
    caseStudy: "เครื่องนักศึกษาเข้าเว็บภายในไม่ได้ ให้ผู้เรียนพิสูจน์ว่าเป็นปัญหา DNS, gateway หรือ firewall",
    lab: ["เก็บอาการ", "ทดสอบ ping", "ทดสอบ DNS", "capture packet", "สรุป incident"],
    mistakes: ["เดาสาเหตุโดยไม่เก็บหลักฐาน", "ไม่เปรียบเทียบเครื่องที่ใช้งานได้", "ไม่บันทึกเวลา", "แก้หลายอย่างพร้อมกัน"]
  },
  {
    image: `${imageBase}Backup_icon.svg`,
    sections: [
      ["Backup Strategy", "กำหนด full, incremental, differential และ retention ให้เหมาะกับ RPO/RTO ขององค์กร"],
      ["3-2-1 Rule", "เก็บอย่างน้อย 3 ชุด 2 สื่อ และ 1 ชุดอยู่นอกสถานที่หรือ offline เพื่อลดความเสี่ยง ransomware"],
      ["Configuration Backup", "อุปกรณ์เครือข่ายควรสำรอง config ก่อนและหลังเปลี่ยนแปลงทุกครั้ง"],
      ["Restore Testing", "backup ที่ไม่เคย restore ถือว่ายังไม่พิสูจน์ ต้องทดสอบตามรอบเวลา"],
      ["Preventive Maintenance", "กำหนด daily/weekly/monthly checklist เช่น log, disk, patch, UPS, temperature และ cable condition"]
    ],
    caseStudy: "ไฟล์ server เสียหายและ switch config หาย ให้ผู้เรียนวางแผนกู้คืนตาม RTO 4 ชั่วโมง",
    lab: ["กำหนด RPO/RTO", "เลือก backup type", "เขียน schedule", "ทดสอบ restore", "ทำ PM checklist"],
    mistakes: ["backup ไว้เครื่องเดียวกับต้นฉบับ", "ไม่ทดสอบ restore", "ไม่มี version", "ไม่สำรอง config อุปกรณ์"]
  },
  {
    image: `${imageBase}Network_diagram.svg`,
    sections: [
      ["As-Built Document", "เอกสารหลังติดตั้งต้องสะท้อนระบบจริง เช่น topology, IP, VLAN, rack, cable label และ account handover"],
      ["Technical Report", "รายงานควรมี problem, requirement, design, implementation, testing, result, limitation และ recommendation"],
      ["IPAM และ Inventory", "ส่งมอบตาราง IP, device inventory, serial number, license และ warranty เพื่อดูแลต่อ"],
      ["Handover Package", "รวม diagram, configuration backup, test result, admin guide, user guide และ training record"],
      ["Presentation", "นำเสนอผลด้วยภาษาผู้บริหาร เน้นผลลัพธ์ ความเสี่ยงที่ลดลง ค่าใช้จ่าย และแผนดูแลต่อ"]
    ],
    caseStudy: "โครงการเครือข่ายห้องปฏิบัติการเสร็จแล้ว ให้ผู้เรียนจัดเอกสารส่งมอบที่ทีม IT ใช้งานต่อได้ทันที",
    lab: ["รวบรวม diagram", "ทำ IPAM", "แนบ config backup", "ทำ test report", "นำเสนอ handover"],
    mistakes: ["diagram ไม่ตรงระบบจริง", "ไม่มี config backup", "ไม่ระบุผู้รับผิดชอบ", "รายงานเน้นรูปสวยแต่ตรวจสอบไม่ได้"]
  }
];

const sharedResources = [
  { title: "Cisco Enterprise Campus Architecture", url: "https://www.cisco.com/c/en/us/td/docs/solutions/Enterprise/Campus/campover.pdf" },
  { title: "Microsoft Learn: Windows Server DHCP", url: "https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server" },
  { title: "Microsoft Learn: Windows Server DNS", url: "https://learn.microsoft.com/en-us/windows-server/networking/dns/dns-overview" },
  { title: "Ubuntu Server Documentation", url: "https://help.ubuntu.com/" },
  { title: "NIST SP 800-207 Zero Trust Architecture", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
  { title: "Wikimedia Commons: Computer network diagrams", url: "https://commons.wikimedia.org/wiki/Category:Computer_network_diagrams" }
];

seed.course = {
  ...seed.course,
  title: "การออกแบบและการจัดการเครือข่ายในองค์กร",
  external_content_note: "เนื้อหาเสริมชุดนี้จัดทำเพิ่มเติมจากแหล่งความรู้ภายนอก เพื่อให้บทเรียน ใบความรู้ ใบงาน และกิจกรรม LMS สมบูรณ์ขึ้น"
};

seed.units = seed.units.map((unit, index) => {
  const ext = externalUnits[index];
  return {
    ...unit,
    image: ext.image,
    lesson_sections: ext.sections.map(([title, detail]) => ({ title, detail })),
    case_study: ext.caseStudy,
    lab_steps: ext.lab,
    common_mistakes: ext.mistakes,
    external_resources: sharedResources,
    workshop: ext.caseStudy,
    product: `${unit.product || "ชิ้นงานประจำหน่วย"} พร้อมหลักฐานการทดสอบและรายงานสะท้อนผล`,
    learning_steps: [
      "ทำแบบทดสอบก่อนเรียนเพื่อวิเคราะห์พื้นฐานและจัดกลุ่มผู้เรียน",
      "ศึกษาเนื้อหาหลักพร้อมภาพประกอบและตัวอย่างสถานการณ์จริง",
      "ทำใบงาน/กิจกรรมปฏิบัติตามขั้นตอน lab และ checklist",
      "เล่นเกมหรือภารกิจจำลองเพื่อฝึกการตัดสินใจและการแก้ปัญหา",
      "ทำแบบทดสอบหลังเรียน วิเคราะห์ข้อผิดพลาด และวางแผนเสริมรายบุคคล"
    ]
  };
});

fs.writeFileSync(seedPath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");
console.log(`External LMS content enriched for ${seed.units.length} units.`);
