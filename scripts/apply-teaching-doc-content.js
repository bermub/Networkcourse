const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "data", "lms-seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const learningSteps = [
  "ศึกษาเป้าหมายหน่วยการเรียนและสำรวจความรู้เดิมผ่านคำถามนำเข้าสู่บทเรียน",
  "อ่านเนื้อหาหลักจากเอกสารประกอบการสอนพร้อมเชื่อมโยงกับตัวอย่างองค์กรจริง",
  "ทำใบงานหรือกิจกรรมปฏิบัติ โดยบันทึกหลักฐานการวิเคราะห์ ออกแบบ หรือตั้งค่าระบบ",
  "เล่นเกมหรือภารกิจจำลองประจำหน่วยเพื่อฝึกตัดสินใจตามสถานการณ์",
  "ทำแบบทดสอบท้ายบทและใช้ผลวิเคราะห์ข้อสอบเพื่อวางแผนเสริมรายบุคคล"
];

const unitUpdates = {
  1: {
    key_topics: ["Enterprise Network", "Reliability", "Scalability", "Security", "OSI/TCP-IP", "Requirements Analysis"],
    lesson_sections: [
      {
        title: "แนวคิดระบบเครือข่ายในองค์กร",
        detail: "Enterprise Network คือโครงสร้างพื้นฐานที่เชื่อมโยงคอมพิวเตอร์ เซิร์ฟเวอร์ ระบบจัดเก็บข้อมูล และผู้ใช้งาน เพื่อให้แลกเปลี่ยนข้อมูล ใช้ทรัพยากรร่วมกัน และสนับสนุนงานธุรกิจได้อย่างต่อเนื่อง"
      },
      {
        title: "คุณลักษณะสำคัญของ Enterprise Network",
        detail: "เอกสารประกอบการสอนระบุคุณลักษณะหลัก ได้แก่ Reliability, Scalability, Security, QoS และ Manageability ซึ่งต้องนำมาพิจารณาก่อนเลือกอุปกรณ์หรือออกแบบ topology"
      },
      {
        title: "สถาปัตยกรรมแบบ Three-Tier",
        detail: "Core Layer ทำหน้าที่ส่งผ่านข้อมูลความเร็วสูง, Distribution Layer ควบคุมนโยบาย Routing, VLAN และ QoS, ส่วน Access Layer เชื่อมต่อ PC, Printer, IP Phone และ Access Point"
      },
      {
        title: "Topology และแบบจำลองเครือข่าย",
        detail: "ผู้เรียนต้องแยกความแตกต่างของ Star, Ring, Bus, Mesh, Tree และ Hybrid Topology รวมถึงใช้ OSI และ TCP/IP Model เป็นกรอบคิดสำหรับออกแบบและวิเคราะห์ปัญหา"
      },
      {
        title: "กระบวนการวิเคราะห์ความต้องการ",
        detail: "เริ่มจากสำรวจจำนวนผู้ใช้ แอปพลิเคชันสำคัญ ปริมาณข้อมูล ระบบเดิม จุดเสี่ยง และเป้าหมายอนาคต แล้วจัดทำ requirement ที่ตรวจสอบย้อนกลับได้"
      },
      {
        title: "หลักฐานการเรียนรู้",
        detail: "ผลลัพธ์ของหน่วยนี้คือเอกสาร Requirement, Current State Diagram, Risk/Gap Analysis และ Target Network Concept ที่อธิบายเหตุผลเชิงออกแบบได้"
      }
    ],
    content: [
      "Enterprise Network ต้องรองรับการใช้งานจริงขององค์กร ทั้งการสื่อสารภายใน การเข้าถึง Server การออก Internet และการเชื่อมต่อสาขา",
      "Reliability คือความต่อเนื่องของระบบ เช่น Redundant Link, Failover Switch และ UPS เพื่อลด downtime",
      "Scalability คือการออกแบบให้ขยายจำนวนผู้ใช้ อุปกรณ์ VLAN และบริการเครือข่ายได้โดยไม่ต้องรื้อระบบทั้งหมด",
      "Security ต้องวางตั้งแต่ชั้นออกแบบ เช่น Firewall, VLAN Segmentation, VPN และการกำหนดสิทธิ์การเข้าถึง",
      "QoS ช่วยจัดลำดับความสำคัญของ Traffic เช่น Voice/Video ให้มี latency และ jitter ต่ำกว่างานทั่วไป",
      "Manageability ทำให้ผู้ดูแลระบบตรวจสอบ แก้ปัญหา และบันทึกสถานะจากส่วนกลางได้ เช่น SNMP และ Network Management System"
    ],
    lab_steps: [
      "กำหนดบริบทองค์กรจำลอง เช่น จำนวนผู้ใช้ แผนก แอปพลิเคชัน และความต้องการเชื่อมต่อ",
      "สร้างตาราง Requirement แยกด้าน Reliability, Scalability, Security, QoS และ Manageability",
      "วาด Current State Diagram และระบุปัญหาคอขวดหรือ single point of failure",
      "ออกแบบ Target Concept โดยใช้ Three-Tier หรือ Hybrid Topology ตามความเหมาะสม",
      "นำเสนอเหตุผลการออกแบบพร้อมข้อจำกัดด้านงบประมาณและการขยายระบบ"
    ],
    common_mistakes: [
      "เริ่มจากเลือกยี่ห้ออุปกรณ์ก่อนวิเคราะห์ความต้องการ",
      "ไม่แยก Logical Diagram ออกจาก Physical Diagram",
      "ละเลยแอปพลิเคชันสำคัญและปริมาณ traffic จริง",
      "ไม่ระบุ single point of failure และแผนขยายในอนาคต"
    ]
  },
  2: {
    key_topics: ["Hierarchical Design", "Logical Topology", "Physical Topology", "Network Diagram", "Design Planning", "ROI"],
    lesson_sections: [
      {
        title: "หลักการออกแบบเครือข่ายแบบลำดับชั้น",
        detail: "เอกสารประกอบการสอนสรุปหลักออกแบบที่ดี 4 ประการ ได้แก่ Modularity, Resiliency, Flexibility และ Simplicity เพื่อให้เครือข่ายจัดการง่ายและขยายได้"
      },
      {
        title: "โครงสร้างเชิงตรรกะและกายภาพ",
        detail: "Logical Topology แสดง VLAN, IP Scheme และ Routing ส่วน Physical Topology แสดงตำแหน่ง Rack, Port Connection และชนิดสายจริง ผู้เรียนต้องใช้ทั้งสองมุมมองคู่กัน"
      },
      {
        title: "มาตรฐาน Network Diagram",
        detail: "การวาดผังเครือข่ายควรใช้สัญลักษณ์มาตรฐาน ระบุชื่ออุปกรณ์ Interface, VLAN, Subnet และ Gateway ให้ชัดเจน เพื่อใช้สื่อสารกับทีมติดตั้งและผู้บริหาร"
      },
      {
        title: "การประเมินทางเลือกการออกแบบ",
        detail: "เมื่อต้องเลือก architecture ให้เปรียบเทียบต้นทุน ความเสี่ยง ความสามารถขยาย และผลต่อการดูแลระบบ แล้วเชื่อมโยงเป็น ROI หรือความคุ้มค่าของโครงการ"
      },
      {
        title: "การออกแบบสำหรับองค์กรขนาดเล็ก",
        detail: "ตัวอย่างในเอกสารเน้นการวาง Internet Gateway, Firewall, Core/Access Switch, VLAN แยกแผนก และ Server Zone ให้มีเส้นทางข้อมูลชัดเจน"
      }
    ],
    content: [
      "Modularity แบ่งระบบเป็นส่วนย่อยที่ดูแลได้ เช่น Internet Edge, Server Zone, User Access และ Wireless",
      "Resiliency ช่วยให้ระบบยังให้บริการได้เมื่อ link หรืออุปกรณ์บางส่วนเสียหาย",
      "Flexibility รองรับการเพิ่มแผนก สาขา Server หรือบริการใหม่โดยไม่กระทบโครงสร้างหลัก",
      "Simplicity ลดความซับซ้อนของ configuration และช่วยให้แก้ปัญหาได้รวดเร็ว",
      "Logical Diagram ใช้ในการออกแบบ VLAN/IP/Routing ส่วน Physical Diagram ใช้ในการติดตั้ง เดินสาย และตรวจรับงาน",
      "ROI ของโครงการเครือข่ายควรสะท้อนประโยชน์ด้าน downtime ที่ลดลง ความปลอดภัย การบริหารจัดการ และความพร้อมขยายระบบ"
    ],
    lab_steps: [
      "เลือกกรณีศึกษาองค์กรขนาดเล็กหรือกลาง",
      "วาด Logical Topology ระบุ VLAN, Subnet และ Gateway",
      "วาด Physical Topology ระบุตู้ Rack, Switch, Firewall และสายเชื่อมต่อ",
      "จัดทำตารางเปรียบเทียบ 2 ทางเลือกด้านต้นทุน ความเสี่ยง และการขยาย",
      "สรุปเหตุผลเชิง ROI สำหรับทางเลือกที่เหมาะสม"
    ]
  },
  3: {
    key_topics: ["IPv4 Class", "Private IP", "Subnetting", "VLSM", "Gateway", "IPAM"],
    lesson_sections: [
      {
        title: "IPv4 Address Class และ Private Address",
        detail: "เอกสารอธิบายช่วง Class A, B, C และ Private Address เช่น 10.x.x.x, 172.16-31.x.x และ 192.168.x.x ซึ่งใช้เป็นฐานในการออกแบบ IP ภายในองค์กร"
      },
      {
        title: "แนวคิด Subnetting",
        detail: "Subnetting แบ่งเครือข่ายใหญ่เป็นเครือข่ายย่อยเพื่อลด broadcast domain เพิ่มความปลอดภัย และจัดการ address ให้เหมาะกับจำนวนเครื่องจริง"
      },
      {
        title: "VLSM สำหรับการใช้ IP อย่างคุ้มค่า",
        detail: "VLSM ช่วยกำหนด subnet mask ต่างขนาดตามจำนวน host ของแต่ละแผนก เช่น แผนกใหญ่ใช้ /25 แผนกเล็กใช้ /27 หรือ /28"
      },
      {
        title: "Gateway และ Network Services",
        detail: "ทุก subnet ต้องกำหนด default gateway, DNS และ DHCP scope ที่สอดคล้องกัน เพื่อให้ client รับค่าเครือข่ายถูกต้องและออกนอก subnet ได้"
      },
      {
        title: "เอกสาร IP Address Management",
        detail: "การออกแบบ IP ที่ดีต้องมีตาราง IPAM ระบุ VLAN, Network Address, Subnet Mask, Gateway, DHCP Range, Reserved IP และอุปกรณ์สำคัญ"
      }
    ],
    content: [
      "Class A, B, C เป็นกรอบพื้นฐานของ IPv4 แต่ในงานจริงนิยมใช้ CIDR และ VLSM เพื่อจัดสรร IP ให้ยืดหยุ่นกว่า classful addressing",
      "Private IP ตาม RFC 1918 เหมาะสำหรับเครือข่ายภายใน และต้องผ่าน NAT เมื่อต้องออก Internet",
      "Subnet Mask กำหนดส่วน Network และ Host เช่น /24 มี host ใช้งานได้ 254 เครื่อง",
      "VLSM ต้องเรียงความต้องการจาก subnet ที่ใช้ host มากไปน้อย แล้วค่อยจัดสรร block เพื่อไม่ให้ IP กระจัดกระจาย",
      "Gateway มักใช้หมายเลขต้นหรือท้ายของ subnet เช่น .1 หรือ .254 และควรกำหนดเป็นมาตรฐานเดียวกันทั้งองค์กร",
      "IPAM ลดปัญหา IP ซ้ำ ช่วยตรวจสอบอุปกรณ์ และเป็นข้อมูลสำคัญสำหรับการแก้ปัญหาเครือข่าย"
    ],
    lab_steps: [
      "รับโจทย์จำนวน host ของแต่ละแผนก",
      "คำนวณ subnet ด้วย VLSM จากกลุ่มที่ต้องการ host มากที่สุด",
      "กำหนด Network, First Host, Last Host, Broadcast และ Gateway",
      "สร้างตาราง DHCP Scope และ Reserved IP",
      "ตรวจสอบว่า subnet ไม่ซ้อนทับกันและเหลือ IP สำหรับขยาย"
    ]
  },
  4: {
    key_topics: ["VLAN Design", "Inter-VLAN Routing", "Trunk", "Access Port", "Segmentation", "Diagram Standard"],
    lesson_sections: [
      {
        title: "VLAN Design ตามบทบาทการใช้งาน",
        detail: "เอกสารประกอบการสอนเชื่อมโยง VLAN กับการออกแบบเครือข่ายองค์กร โดยแยกผู้ใช้ Server, Guest, Management และบริการสำคัญเพื่อลด broadcast และเพิ่มความปลอดภัย"
      },
      {
        title: "Access Port และ Trunk Port",
        detail: "Access Port ใช้กับอุปกรณ์ปลายทางใน VLAN เดียว ส่วน Trunk Port ใช้ส่งหลาย VLAN ระหว่าง Switch, Router หรือ Firewall ด้วยการ tag VLAN"
      },
      {
        title: "Inter-VLAN Routing",
        detail: "เมื่อแยก VLAN แล้วต้องมีอุปกรณ์ Layer 3 เช่น Router-on-a-Stick, Multilayer Switch หรือ Firewall เพื่อ routing ระหว่าง VLAN ตาม policy"
      },
      {
        title: "VLAN กับ Security Policy",
        detail: "การแบ่ง VLAN ไม่ใช่ความปลอดภัยสมบูรณ์ ต้องกำหนด ACL หรือ Firewall Rule เพิ่ม เช่น Guest ห้ามเข้า Server Zone แต่ให้ใช้งาน Internet ได้"
      },
      {
        title: "การสื่อสารผ่าน Network Diagram",
        detail: "ผัง VLAN ต้องระบุ VLAN ID, Name, Subnet, Gateway, Trunk Link และอุปกรณ์ Layer 3 เพื่อให้ทีมติดตั้งตั้งค่าตรงกัน"
      }
    ],
    content: [
      "VLAN ช่วยแยก broadcast domain โดยไม่จำเป็นต้องแยก switch ทางกายภาพ",
      "VLAN สำหรับองค์กรควรตั้งชื่อสื่อความหมาย เช่น VLAN10-IT, VLAN20-FINANCE, VLAN30-GUEST และ VLAN99-MGMT",
      "Trunk Link ต้องกำหนด allowed VLAN ให้ชัดเจน ลดความเสี่ยงจากการส่ง VLAN ที่ไม่จำเป็น",
      "Inter-VLAN Routing ควรควบคุมด้วย ACL หรือ Firewall Rule เพื่อให้แต่ละแผนกเข้าถึงเฉพาะบริการที่จำเป็น",
      "Management VLAN ควรแยกจาก user VLAN และจำกัดสิทธิ์เฉพาะผู้ดูแลระบบ",
      "เอกสารตรวจรับควรมีตาราง VLAN Mapping ระหว่าง Port, VLAN, IP Subnet และอุปกรณ์ปลายทาง"
    ],
    lab_steps: [
      "ออกแบบ VLAN ID และชื่อ VLAN ตามแผนก",
      "กำหนด subnet และ gateway ของแต่ละ VLAN",
      "ระบุ access port และ trunk port บน switch",
      "เขียน policy ระหว่าง VLAN เช่น User ไป Server, Guest ไป Internet",
      "วาด Logical Diagram พร้อม VLAN และ Inter-VLAN Routing"
    ]
  },
  5: {
    key_topics: ["Router", "Managed Switch", "Firewall/UTM", "Wireless AP", "UTP", "Fiber Optic", "Rack"],
    lesson_sections: [
      {
        title: "ประเภทและคุณสมบัติอุปกรณ์เครือข่าย",
        detail: "เอกสารแยก Router, Managed Switch, Firewall/UTM, Wireless AP และ NAS/SAN ตามหน้าที่ OSI Layer และเกณฑ์เลือก เช่น throughput, PoE, VPN, coverage และ capacity"
      },
      {
        title: "สาย UTP และมาตรฐาน Category",
        detail: "สาย UTP เช่น Cat5e, Cat6 และ Cat6A มีความเร็ว bandwidth และระยะใช้งานต่างกัน ผู้เรียนต้องเลือกให้สัมพันธ์กับความเร็ว port และระยะสายไม่เกินมาตรฐาน"
      },
      {
        title: "Fiber Optic สำหรับ Backbone",
        detail: "Fiber Optic เหมาะกับการเชื่อมต่อระยะไกลหรือ uplink ความเร็วสูง เช่น ระหว่างอาคาร ระหว่างชั้น หรือจาก access switch ไป core switch"
      },
      {
        title: "มาตรฐานการเข้าหัว RJ-45",
        detail: "การเข้าหัวสายต้องใช้ลำดับสีตาม T568A หรือ T568B อย่างสม่ำเสมอ และทดสอบ continuity, wire map และ length หลังเข้าหัว"
      },
      {
        title: "การติดตั้งในตู้ Rack",
        detail: "การจัด Rack ต้องคำนึงถึงหน่วย U, airflow, cable management, patch panel, labeling และการเข้าถึงเพื่อซ่อมบำรุง"
      }
    ],
    content: [
      "Router ทำหน้าที่ routing ระหว่าง network และเชื่อมต่อ WAN/Internet จึงต้องพิจารณา throughput, interface และ VPN support",
      "Managed Switch รองรับ VLAN, PoE, stacking และการจัดการจากส่วนกลาง เหมาะกับเครือข่ายองค์กร",
      "Firewall/UTM กรอง traffic ได้หลายชั้น อาจมี IPS, VPN, Web Filter และ SSL Inspection",
      "Wireless AP ต้องพิจารณามาตรฐาน Wi-Fi, band, coverage area และจำนวน client ต่อพื้นที่",
      "NAS/SAN ใช้จัดเก็บข้อมูลส่วนกลาง ต้องพิจารณา capacity, RAID, IOPS และ protocol เช่น NFS หรือ iSCSI",
      "ตู้ Rack ที่ดีช่วยให้อุปกรณ์ระบายอากาศดี สายเป็นระเบียบ และลดเวลาการแก้ปัญหา"
    ],
    lab_steps: [
      "จัดทำรายการอุปกรณ์ที่ต้องใช้จาก network diagram",
      "เลือกชนิดสาย UTP หรือ Fiber ตามระยะและความเร็ว",
      "ออกแบบตำแหน่งอุปกรณ์ใน Rack เป็นหน่วย U",
      "กำหนด label สายและ port ทั้งสองด้าน",
      "ทดสอบสายด้วย cable tester และบันทึกผลตรวจรับ"
    ]
  },
  6: {
    key_topics: ["Cisco IOS", "Switch Configuration", "Router Configuration", "Static IP", "Connectivity Test", "Basic Hardening"],
    lesson_sections: [
      {
        title: "บทบาท Switch และ Router ในระบบเครือข่าย",
        detail: "เนื้อหาเอกสารหน่วยติดตั้งระบบเครือข่ายเชื่อมโยงการตั้งค่า Cisco IOS กับการทดสอบ IP และคำสั่งตรวจสอบ เพื่อให้ผู้เรียนตั้งค่าอุปกรณ์ได้ครบวงจร"
      },
      {
        title: "การตั้งค่าพื้นฐาน Cisco IOS",
        detail: "ผู้เรียนควรกำหนด hostname, enable secret, console password, SSH, banner, management IP และบันทึก configuration ให้เป็นมาตรฐาน"
      },
      {
        title: "Switch Configuration",
        detail: "ตั้งค่า VLAN, access port, trunk port, description และตรวจสอบสถานะ port ด้วยคำสั่ง show เช่น show vlan brief และ show interfaces status"
      },
      {
        title: "Router Configuration",
        detail: "กำหนด IP บน interface, default route, static route หรือ sub-interface สำหรับ Router-on-a-Stick ตาม topology ที่ออกแบบ"
      },
      {
        title: "การทดสอบการเชื่อมต่อ",
        detail: "ใช้ ping, traceroute/tracert, ipconfig/ifconfig และ show command เพื่อยืนยันว่า physical, data link และ network layer ทำงานถูกต้อง"
      }
    ],
    content: [
      "การตั้งค่าอุปกรณ์เครือข่ายควรเริ่มจากชื่ออุปกรณ์และการรักษาความปลอดภัยพื้นฐานก่อนเปิดใช้งานจริง",
      "Management IP ของ switch ต้องอยู่ใน VLAN ที่กำหนด และต้องมี default gateway เพื่อบริหารจาก subnet อื่น",
      "Port description ช่วยให้ตรวจสอบสายและอุปกรณ์ปลายทางได้รวดเร็วเมื่อเกิดปัญหา",
      "Router interface ต้องกำหนด IP/Mask ให้ตรงกับ subnet และเปิดใช้งานด้วย no shutdown",
      "การบันทึก running-config ไป startup-config เป็นขั้นตอนจำเป็นก่อนส่งมอบงาน",
      "การทดสอบควรทำจากใกล้ไปไกล เช่น ping gateway, ping server, ping DNS และทดสอบออก Internet"
    ],
    lab_steps: [
      "กำหนด hostname และรหัสผ่านพื้นฐานของ switch/router",
      "สร้าง VLAN และผูก port เข้ากับ VLAN",
      "กำหนด IP สำหรับ management หรือ router interface",
      "ตั้งค่า SSH หรือการเข้าถึงสำหรับผู้ดูแลระบบ",
      "ใช้ show command และ ping ตรวจสอบผลก่อนบันทึก configuration"
    ]
  },
  7: {
    key_topics: ["Windows Server 2022", "Server Edition", "Disk Partition", "Static IP", "IIS", "Security Baseline"],
    lesson_sections: [
      {
        title: "เปรียบเทียบ Windows Server กับ Ubuntu Server",
        detail: "เอกสารประกอบการสอนเปรียบเทียบด้านค่าลิขสิทธิ์ GUI, Active Directory, Web Server, Database, Security และการใช้ทรัพยากร เพื่อเลือกใช้ให้ตรงภารกิจ"
      },
      {
        title: "ขั้นตอนติดตั้ง Windows Server 2022",
        detail: "เริ่มจากเตรียม ISO/USB, ตั้ง Boot Order, เลือก Edition, แบ่ง Partition, ติดตั้ง OS, ตั้ง Administrator Password และติดตั้ง Driver/Update"
      },
      {
        title: "การกำหนด Static IP",
        detail: "Server ควรใช้ Static IP พร้อม subnet mask, gateway และ DNS ที่สอดคล้องกับแผน IPAM เพื่อให้บริการเครือข่ายได้คงที่"
      },
      {
        title: "บทบาทบริการบน Windows Server",
        detail: "Windows Server รองรับ AD DS, DNS, DHCP, File Server, IIS และ Policy Management ซึ่งเป็นบริการหลักในองค์กร"
      },
      {
        title: "Security Baseline เบื้องต้น",
        detail: "หลังติดตั้งต้อง update, ตั้ง firewall profile, ปิด service ไม่จำเป็น, ตั้งชื่อเครื่องตามมาตรฐาน และบันทึก configuration baseline"
      }
    ],
    content: [
      "Windows Server เหมาะกับองค์กรที่ใช้ Active Directory, Group Policy และการจัดการผู้ใช้แบบศูนย์กลาง",
      "การเลือก Edition ต้องสัมพันธ์กับ license, virtualization right และบทบาทของ server",
      "Partition ควรแยก OS และ Data เพื่อให้สำรองข้อมูลและกู้คืนระบบง่ายขึ้น",
      "Static IP ป้องกันบริการสำคัญเปลี่ยนที่อยู่โดยไม่ตั้งใจ",
      "Server Manager ใช้ติดตั้ง role และ feature เช่น DHCP, DNS, File Server และ IIS",
      "หลังติดตั้งควรบันทึก hostname, IP, role, update status และ admin account policy"
    ],
    lab_steps: [
      "เตรียม VM หรือเครื่องจริงสำหรับ Windows Server 2022",
      "ติดตั้ง OS และตั้ง Administrator Password",
      "ตั้งชื่อเครื่องและ Static IP",
      "ตรวจสอบ Windows Update และ Firewall",
      "บันทึก baseline ลงในเอกสารส่งงาน"
    ]
  },
  8: {
    key_topics: ["Ubuntu Server", "Netplan", "CLI", "UFW", "SSH", "Apache/Nginx"],
    lesson_sections: [
      {
        title: "Ubuntu Server ในงานเครือข่ายองค์กร",
        detail: "เอกสารชี้ว่า Ubuntu Server เป็น Open Source ใช้ทรัพยากรต่ำ เหมาะกับ Web Server, Database, Container, Monitoring และบริการเครือข่ายที่เน้น CLI"
      },
      {
        title: "การตั้งค่า Static IP ด้วย Netplan",
        detail: "Ubuntu Server ใช้ไฟล์ YAML ของ Netplan เพื่อกำหนด addresses, gateway และ nameservers ต้องระวัง indentation และทดสอบด้วย netplan try"
      },
      {
        title: "การจัดการผ่าน CLI และ SSH",
        detail: "ผู้ดูแลระบบควรใช้คำสั่งพื้นฐาน เช่น ip addr, ip route, systemctl, journalctl และติดตั้ง OpenSSH เพื่อบริหารจากระยะไกลอย่างปลอดภัย"
      },
      {
        title: "Firewall และ Security",
        detail: "UFW, AppArmor และการ update package เป็นมาตรการพื้นฐาน ลดความเสี่ยงจาก service ที่เปิดเกินจำเป็น"
      },
      {
        title: "บริการพื้นฐานบน Linux",
        detail: "Ubuntu Server รองรับ Apache2, Nginx, MySQL, PostgreSQL, MariaDB และบริการ monitoring ที่เหมาะกับระบบองค์กร"
      }
    ],
    content: [
      "Ubuntu Server เหมาะกับงานที่ต้องการความยืดหยุ่น ค่าลิขสิทธิ์ต่ำ และทำงานบน VM/Container ได้ดี",
      "Netplan configuration ต้องใช้ YAML ที่ถูกต้อง หากย่อหน้าไม่ถูกต้องระบบอาจไม่รับค่า IP",
      "คำสั่ง ip addr แสดง interface และ IP ส่วน ip route ใช้ตรวจสอบ default gateway",
      "systemctl ใช้ตรวจสอบ start, stop, enable และ status ของ service",
      "UFW ช่วยเปิดเฉพาะ port ที่จำเป็น เช่น SSH, HTTP และ HTTPS",
      "การบันทึกค่า configuration ก่อนแก้ไขช่วยให้ rollback ได้เมื่อเกิดปัญหา"
    ],
    lab_steps: [
      "ติดตั้ง Ubuntu Server 22.04 LTS",
      "กำหนด Static IP ด้วย Netplan",
      "ติดตั้งและเปิดใช้งาน OpenSSH",
      "กำหนด UFW ให้เปิดเฉพาะบริการจำเป็น",
      "ติดตั้ง Apache หรือ Nginx และทดสอบจากเครื่อง client"
    ]
  },
  9: {
    key_topics: ["DHCP", "DORA", "Scope", "DNS", "DNS Record", "Windows Server"],
    lesson_sections: [
      {
        title: "หลักการทำงานของ DHCP",
        detail: "DHCP จัดสรร IP Address และพารามิเตอร์เครือข่ายให้ client อัตโนมัติ ลดความผิดพลาดจากการตั้ง Static IP ด้วยมือ"
      },
      {
        title: "กระบวนการ DORA",
        detail: "เอกสารอธิบาย Discover, Offer, Request และ Acknowledge เป็นลำดับที่ client ใช้ค้นหา server รับข้อเสนอ ขอใช้ IP และรับการยืนยัน"
      },
      {
        title: "การกำหนด DHCP Scope",
        detail: "Scope ต้องมีช่วง IP, Subnet Mask, Lease Duration, Default Gateway, DNS Server, Domain Name, Exclusion และ Reservation สำหรับอุปกรณ์สำคัญ"
      },
      {
        title: "หลักการทำงานของ DNS",
        detail: "DNS แปลงชื่อโดเมนเป็น IP Address และเป็นบริการพื้นฐานที่จำเป็นต่อ Active Directory, Web, Email และบริการภายในองค์กร"
      },
      {
        title: "ประเภท DNS Record",
        detail: "Record ที่พบบ่อย ได้แก่ A, AAAA, CNAME, MX, PTR, NS และ SRV ผู้เรียนต้องเลือกใช้ให้ตรงกับบริการและการแก้ปัญหา"
      }
    ],
    content: [
      "DHCP ลดภาระผู้ดูแลระบบและป้องกัน IP ซ้ำในองค์กร",
      "Exclusion ใช้กัน IP สำหรับ server, printer หรืออุปกรณ์ที่ต้องการ static address",
      "Reservation จอง IP ให้ MAC Address เฉพาะ เพื่อให้อุปกรณ์ได้รับ IP เดิมทุกครั้ง",
      "DNS ที่ตั้งผิดจะทำให้ client เข้า domain, web service หรือ file share ไม่ได้ แม้ IP network จะยังทำงาน",
      "A Record ชี้ชื่อไป IPv4 ส่วน PTR ใช้ reverse lookup จาก IP กลับเป็นชื่อ",
      "SRV Record สำคัญต่อ Active Directory เพราะ client ใช้ค้นหา domain controller และบริการ domain"
    ],
    lab_steps: [
      "ติดตั้ง DHCP Server Role",
      "สร้าง Scope ตาม subnet ที่กำหนด",
      "ตั้งค่า option 003 Router, 006 DNS และ 015 Domain Name",
      "สร้าง DNS Forward Lookup Zone และ A Record",
      "ทดสอบ client รับ IP และ resolve ชื่อ server"
    ]
  },
  10: {
    key_topics: ["Active Directory", "Domain Controller", "OU", "FSMO", "GPO", "Permissions", "AGdLP"],
    lesson_sections: [
      {
        title: "โครงสร้าง Active Directory",
        detail: "AD DS ใช้บริหารผู้ใช้ กลุ่ม คอมพิวเตอร์ และนโยบายจากส่วนกลาง ประกอบด้วย Domain, OU, User, Group, Computer และ Site"
      },
      {
        title: "Domain Controller และ FSMO Roles",
        detail: "Domain Controller ให้บริการ authentication และ directory ส่วน FSMO Roles เป็นบทบาทพิเศษที่ต้องรู้ตำแหน่งเพื่อดูแลระบบได้ถูกต้อง"
      },
      {
        title: "Group Policy Objects",
        detail: "GPO ใช้กำหนดนโยบาย เช่น password policy, desktop setting, drive mapping และ security baseline ให้ user หรือ computer ตาม OU"
      },
      {
        title: "File Server และ Permissions",
        detail: "เอกสารอธิบาย NTFS Permissions และ Share Permissions ซึ่งต้องพิจารณาร่วมกัน เพราะสิทธิ์จริงจะถูกจำกัดโดย permission ที่เข้มที่สุด"
      },
      {
        title: "กลยุทธ์ AGdLP",
        detail: "AGdLP ช่วยจัดสิทธิ์อย่างเป็นระบบ: Account -> Global Group -> Domain Local Group -> Permission ลดความสับสนเมื่อองค์กรเติบโต"
      }
    ],
    content: [
      "Active Directory ทำให้องค์กรควบคุมตัวตนและสิทธิ์ผู้ใช้แบบรวมศูนย์",
      "OU ควรออกแบบตามโครงสร้างบริหารหรือการใช้ policy ไม่ใช่เพียงตามความสวยงามของรายชื่อ",
      "GPO ต้องทดสอบกับกลุ่มนำร่องก่อนใช้จริง เพื่อลดผลกระทบวงกว้าง",
      "NTFS Permission ใช้ควบคุมสิทธิ์บน disk ส่วน Share Permission ควบคุมการเข้าถึงผ่าน network",
      "การใช้ group แทนการกำหนดสิทธิ์ให้ user รายคน ทำให้ตรวจสอบและแก้ไขง่ายกว่า",
      "เอกสารสิทธิ์ควรระบุ folder, group, permission level และเจ้าของข้อมูล"
    ],
    lab_steps: [
      "ติดตั้ง AD DS และ promote เป็น Domain Controller",
      "สร้าง OU ตามแผนกหรือบทบาท",
      "สร้าง user และ group ตามหลัก AGdLP",
      "สร้าง shared folder และกำหนด NTFS/Share Permission",
      "สร้าง GPO พื้นฐานและทดสอบกับ client"
    ]
  },
  11: {
    key_topics: ["Threats", "Defense-in-Depth", "Segmentation", "Firewall", "ACL", "IDS/IPS", "SIEM"],
    lesson_sections: [
      {
        title: "ภัยคุกคามเครือข่ายหลัก",
        detail: "เอกสารจำแนก Malware, Phishing, DoS/DDoS, Man-in-the-Middle, SQL Injection, Insider Threat และ APT พร้อมกลไกและผลกระทบต่อองค์กร"
      },
      {
        title: "Defense-in-Depth",
        detail: "การป้องกันหลายชั้นทำให้แม้ชั้นหนึ่งถูกเจาะ ระบบยังมีชั้นถัดไปช่วยลดความเสียหาย เช่น Firewall, IPS/IDS, DMZ, Endpoint Security และ Monitoring"
      },
      {
        title: "Network Segmentation",
        detail: "แบ่งโซน เช่น User, Server, DMZ, Guest, Management และ IoT เพื่อลดการแพร่กระจายของภัยคุกคามและควบคุมการเข้าถึงตามบทบาท"
      },
      {
        title: "Firewall และ ACL",
        detail: "Firewall ควบคุม traffic หลายชั้น ส่วน ACL บน router/switch ใช้ permit หรือ deny traffic ตาม source, destination, protocol และ port"
      },
      {
        title: "IDS/IPS และ SIEM",
        detail: "IDS/IPS ตรวจจับหรือป้องกัน traffic ผิดปกติ ส่วน SIEM รวม log เพื่อวิเคราะห์เหตุการณ์และตอบสนอง incident"
      }
    ],
    content: [
      "Malware และ ransomware ส่งผลโดยตรงต่อข้อมูลและความต่อเนื่องของธุรกิจ",
      "Phishing มุ่งขโมย credential จึงต้องใช้ทั้ง user awareness และ MFA",
      "DDoS ทำให้บริการล่มจาก traffic มหาศาล ต้องมีการป้องกันที่ edge หรือผู้ให้บริการ",
      "Segmentation ทำให้ attacker เคลื่อนที่ในเครือข่ายได้ยากขึ้น",
      "ACL ควรเขียนจาก policy ที่ชัดเจนและทดสอบก่อนใช้งานจริง",
      "Log จาก firewall, server และ network device เป็นหลักฐานสำคัญในการวิเคราะห์เหตุการณ์"
    ],
    lab_steps: [
      "วิเคราะห์ภัยคุกคามจากสถานการณ์จำลอง",
      "แบ่ง network zone และกำหนด traffic ที่อนุญาต",
      "เขียน ACL หรือ firewall rule ตาม least privilege",
      "ทดสอบ rule ด้วย ping, web access หรือ service ที่กำหนด",
      "บันทึกผลและวิเคราะห์ log ที่เกิดขึ้น"
    ]
  },
  12: {
    key_topics: ["VPN", "Remote Access", "Site-to-Site", "Zero Trust", "MFA", "Encryption"],
    lesson_sections: [
      {
        title: "Virtual Private Network",
        detail: "เอกสารอธิบาย VPN เป็นกลไกเชื่อมต่อระยะไกลอย่างปลอดภัย โดยเข้ารหัส traffic ระหว่างผู้ใช้ สาขา หรือระบบ cloud กับเครือข่ายองค์กร"
      },
      {
        title: "ประเภทของ VPN",
        detail: "Remote Access VPN เหมาะกับผู้ใช้รายบุคคล ส่วน Site-to-Site VPN เหมาะกับการเชื่อมต่อสำนักงานสาขาหรือ data center เข้าด้วยกัน"
      },
      {
        title: "Zero Trust Architecture",
        detail: "Zero Trust ยึดหลักไม่เชื่อถือโดยอัตโนมัติ ต้อง verify explicitly, ใช้ least privilege และประเมินบริบทของผู้ใช้ อุปกรณ์ และตำแหน่งตลอดเวลา"
      },
      {
        title: "MFA และการควบคุมสิทธิ์",
        detail: "VPN สำหรับองค์กรควรผูกกับ identity provider, MFA, group policy และ logging เพื่อควบคุมผู้ใช้และตรวจสอบย้อนหลังได้"
      },
      {
        title: "การทดสอบความปลอดภัยของ VPN",
        detail: "หลังติดตั้งต้องทดสอบ authentication, encryption, split/full tunnel, route, DNS และการเข้าถึง resource ตามสิทธิ์"
      }
    ],
    content: [
      "VPN ไม่ใช่เพียงการเชื่อมต่อได้ แต่ต้องควบคุมว่าเชื่อมต่อแล้วเข้าถึงอะไรได้บ้าง",
      "Remote Access VPN รองรับ work from anywhere แต่ต้องเสริม MFA และ device compliance",
      "Site-to-Site VPN ต้องตรวจสอบ subnet, phase parameter, pre-shared key/certificate และ routing",
      "Zero Trust ลดความเสี่ยงจากบัญชีที่ถูกขโมยหรือเครื่องปลายทางไม่ปลอดภัย",
      "Log VPN ช่วยตรวจสอบเวลาเชื่อมต่อ IP ต้นทาง ผู้ใช้ และ resource ที่เข้าถึง",
      "นโยบาย VPN ควรกำหนดอายุ session, idle timeout และสิทธิ์ตามกลุ่มผู้ใช้"
    ],
    lab_steps: [
      "ออกแบบ topology VPN สำหรับผู้ใช้ระยะไกลหรือสาขา",
      "กำหนดกลุ่มผู้ใช้และสิทธิ์ resource ที่เข้าถึงได้",
      "ตั้งค่า VPN policy และ authentication",
      "ทดสอบการเชื่อมต่อ route และ DNS",
      "บันทึก log และสรุปผลตาม checklist ความปลอดภัย"
    ]
  },
  13: {
    key_topics: ["Troubleshooting Process", "OSI Approach", "Ping", "Traceroute", "Wireshark", "Incident Log"],
    lesson_sections: [
      {
        title: "กระบวนการแก้ไขปัญหา 7 ขั้นตอน",
        detail: "เอกสารยกแนวทางระบุปัญหา สร้างทฤษฎี ทดสอบ วางแผนแก้ไข ลงมือแก้ ตรวจสอบผล และบันทึกผล เพื่อให้การแก้ปัญหาเป็นระบบ"
      },
      {
        title: "OSI-Based Troubleshooting",
        detail: "Bottom-Up เหมาะกับปัญหา physical, Top-Down เหมาะกับปัญหา application, Divide and Conquer เริ่มที่ Layer 3 และ Follow-the-Path ใช้ติดตามเส้นทาง packet"
      },
      {
        title: "Command-Line Tools",
        detail: "เครื่องมือสำคัญ ได้แก่ ping, tracert/traceroute, ipconfig/ifconfig, nslookup, netstat, arp และ route เพื่อแยกปัญหาแต่ละชั้น"
      },
      {
        title: "Wireshark",
        detail: "Wireshark ใช้วิเคราะห์ packet และ protocol เช่น ARP, DNS, TCP Handshake, HTTP และ error traffic เพื่อยืนยันสาเหตุเชิงหลักฐาน"
      },
      {
        title: "การบันทึก Incident",
        detail: "ทุกการแก้ปัญหาควรมีเวลา อาการ สาเหตุ วิธีแก้ ผู้รับผิดชอบ และผลตรวจสอบ เพื่อใช้เป็นความรู้ของทีมและหลักฐานงานวิจัย"
      }
    ],
    content: [
      "การแก้ปัญหาแบบเดาสุ่มทำให้เสียเวลาและอาจสร้างปัญหาใหม่ จึงต้องใช้กระบวนการตรวจสอบทีละขั้น",
      "ping ใช้ทดสอบ L3 connectivity และ latency เบื้องต้น",
      "traceroute แสดง hop ระหว่างต้นทางและปลายทาง ใช้หาจุดที่ packet หยุดหรือ delay สูง",
      "nslookup ใช้ตรวจสอบปัญหา DNS ว่าแปลงชื่อเป็น IP ถูกต้องหรือไม่",
      "Wireshark ช่วยเห็น packet จริง แต่ต้องใช้ filter เพื่อลดข้อมูลที่ไม่เกี่ยวข้อง",
      "การบันทึกผลหลังแก้ปัญหาช่วยป้องกันปัญหาเดิมเกิดซ้ำและใช้ปรับปรุงระบบ"
    ],
    lab_steps: [
      "รับ incident จากสถานการณ์จำลอง",
      "เลือกวิธี Bottom-Up, Top-Down, Divide and Conquer หรือ Follow-the-Path",
      "ใช้ ping, traceroute และ nslookup เก็บหลักฐาน",
      "วิเคราะห์ packet หรือ log ที่เกี่ยวข้อง",
      "จัดทำ incident report พร้อม root cause และ corrective action"
    ]
  },
  14: {
    key_topics: ["Backup Strategy", "Configuration Backup", "Restore", "Preventive Maintenance", "Patch", "Monitoring"],
    lesson_sections: [
      {
        title: "กลยุทธ์ Backup",
        detail: "เอกสารกล่าวถึงการสำรองข้อมูลและกู้คืนระบบ โดยต้องกำหนดชนิด backup, ความถี่, retention, storage location และผู้รับผิดชอบ"
      },
      {
        title: "การสำรอง Configuration อุปกรณ์เครือข่าย",
        detail: "Router, Switch, Firewall และ Server ควรมี configuration backup หลังเปลี่ยนแปลงทุกครั้ง พร้อมระบุวันที่ เวอร์ชัน และผู้แก้ไข"
      },
      {
        title: "การทดสอบ Restore",
        detail: "Backup ที่ไม่เคยทดสอบอาจใช้ไม่ได้จริง ต้องมีการ restore test เป็นระยะ เพื่อยืนยันว่า RTO/RPO เป็นไปตามที่องค์กรต้องการ"
      },
      {
        title: "Preventive Maintenance",
        detail: "การบำรุงรักษาเชิงป้องกันครอบคลุม patch, firmware, ตรวจสุขภาพอุปกรณ์, log review, capacity check และทำความสะอาด/จัดสาย"
      },
      {
        title: "Maintenance Window และ Change Log",
        detail: "งานบำรุงรักษาควรมีช่วงเวลาที่ได้รับอนุมัติ แผน rollback และบันทึกการเปลี่ยนแปลง เพื่อควบคุมความเสี่ยงต่อระบบผลิตจริง"
      }
    ],
    content: [
      "Backup ต้องออกแบบตามความสำคัญของระบบ ไม่ใช่สำรองทุกอย่างด้วยนโยบายเดียวกัน",
      "Full, Incremental และ Differential Backup มีข้อดีข้อจำกัดด้านเวลาและพื้นที่ต่างกัน",
      "Configuration Backup ของอุปกรณ์เครือข่ายช่วยกู้คืนบริการได้เร็วเมื่ออุปกรณ์เสียหรือ config ผิดพลาด",
      "RTO คือเวลาที่ยอมให้ระบบหยุดได้ ส่วน RPO คือปริมาณข้อมูลที่ยอมสูญหายได้",
      "Preventive Maintenance ลด incident โดยแก้ความเสี่ยงก่อนเกิดผลกระทบจริง",
      "Change Log ทำให้ตรวจสอบย้อนหลังได้ว่าใครเปลี่ยนอะไร เมื่อใด และเพราะเหตุใด"
    ],
    lab_steps: [
      "จัดกลุ่มระบบตามความสำคัญและกำหนด RTO/RPO",
      "ออกแบบตาราง backup และ retention",
      "สำรอง configuration ของ switch/router/server",
      "จำลอง restore หรือ rollback configuration",
      "จัดทำ preventive maintenance checklist"
    ]
  },
  15: {
    key_topics: ["As-Built Drawing", "IPAM", "Inventory", "Configuration Baseline", "Change Log", "Project Handover"],
    lesson_sections: [
      {
        title: "ประเภทของเอกสารเครือข่าย",
        detail: "เอกสารประกอบการสอนระบุ Network Diagram, IPAM, Device Inventory, Configuration Baseline, Change Management Log, SLA/SOP และ Incident Log เป็นชุดเอกสารหลัก"
      },
      {
        title: "As-Built Drawing",
        detail: "As-Built Drawing คือแผนผังที่สะท้อนสถานะติดตั้งจริง ต้องอัปเดตทุกครั้งที่เปลี่ยนอุปกรณ์ สาย VLAN, IP หรือเส้นทางเชื่อมต่อ"
      },
      {
        title: "มาตรฐานการวาด Network Diagram",
        detail: "ควรระบุ ISP, WAN IP, Firewall, Core Switch, VLAN, Gateway, Access Switch, AP และ Server สำคัญให้ทีมดูแลระบบอ่านต่อได้ทันที"
      },
      {
        title: "รายงานโครงการเครือข่าย",
        detail: "รายงานควรมีที่มา วัตถุประสงค์ ขอบเขต วิธีดำเนินงาน ผลการติดตั้ง ผลทดสอบ ปัญหา ข้อเสนอแนะ และภาคผนวกหลักฐาน"
      },
      {
        title: "Project Handover",
        detail: "ชุดส่งมอบที่สมบูรณ์ควรมี diagram, IPAM, inventory, configuration backup, account handover, คู่มือดูแลระบบ และผลทดสอบการใช้งาน"
      },
      {
        title: "เส้นทางอาชีพและใบรับรอง",
        detail: "ผู้เรียนสามารถต่อยอดสู่สายงาน Network Technician, Network Administrator, System Administrator และเตรียมใบรับรองเช่น CCNA, Network+ หรือ Linux/Windows Server"
      }
    ],
    content: [
      "เอกสารเครือข่ายที่ดีทำให้ระบบดูแลต่อได้แม้ผู้ติดตั้งเดิมไม่อยู่",
      "IPAM ต้องระบุ VLAN, subnet, gateway, DHCP range, reserved IP และอุปกรณ์ที่ใช้ IP คงที่",
      "Device Inventory ควรมี model, serial number, firmware, location, warranty และผู้รับผิดชอบ",
      "Configuration Baseline เป็นค่ามาตรฐานที่อนุมัติแล้ว ใช้เทียบเมื่อเกิดปัญหาหรือหลังเปลี่ยนแปลง",
      "Change Management Log ลดความเสี่ยงจากการเปลี่ยนแปลงที่ไม่มีหลักฐาน",
      "การนำเสนอโครงการควรแสดงปัญหาเดิม แนวทางออกแบบ ผลลัพธ์ และหลักฐานทดสอบอย่างกระชับ"
    ],
    lab_steps: [
      "รวบรวม diagram, IPAM และ inventory จากหน่วยก่อนหน้า",
      "จัดทำ As-Built Drawing ฉบับสมบูรณ์",
      "จัดทำ configuration baseline และ change log",
      "จัดทำรายงานโครงการพร้อมผลทดสอบ",
      "นำเสนอ project handover ต่อครูผู้สอนหรือคณะกรรมการจำลอง"
    ]
  }
};

const aliases = {
  6: unitUpdates[6],
  7: unitUpdates[7],
  8: unitUpdates[8],
  9: unitUpdates[9],
  10: unitUpdates[10],
  11: unitUpdates[11],
  12: unitUpdates[12],
  13: unitUpdates[13],
  14: unitUpdates[14],
  15: unitUpdates[15]
};

for (const [unitNo, update] of Object.entries({ ...unitUpdates, ...aliases })) {
  const unit = seed.units.find((item) => item.unit_no === Number(unitNo));
  if (!unit) continue;
  unit.key_topics = update.key_topics || unit.key_topics;
  unit.lesson_sections = update.lesson_sections || unit.lesson_sections;
  unit.content = update.content || unit.content;
  unit.lab_steps = update.lab_steps || unit.lab_steps;
  unit.common_mistakes = update.common_mistakes || unit.common_mistakes;
  unit.learning_steps = learningSteps;
  unit.teacher_guidance = [
    ...(unit.teacher_guidance || []).slice(0, 2),
    "อ้างอิงเนื้อหาหลักจากเอกสารประกอบการสอน รายวิชา 31909-2005 แล้วให้ผู้เรียนเชื่อมโยงกับสถานการณ์องค์กรจริง",
    "ใช้ผลแบบทดสอบท้ายบทและหลักฐานกิจกรรมเพื่อวิเคราะห์ผู้เรียนรายบุคคล"
  ];
  unit.doc_source = "เอกสารประกอบการสอนOK.docx";
}

seed.course.source_documents = Array.from(new Set([
  "เอกสารประกอบการสอนOK.docx",
  ...(seed.course.source_documents || [])
]));
seed.course.research_focus = "ใช้ลำดับการเรียนรู้รายหน่วย ผลแบบทดสอบท้ายบท คะแนนกิจกรรม/เกม และค่าความยากง่ายรายข้อ เพื่อพัฒนางานวิจัยระดับผู้เชี่ยวชาญ";
seed.course.external_content_note = "เนื้อหาหลักของหน่วยการเรียนได้รับการจัดวางจากเอกสารประกอบการสอนOK.docx และเสริมด้วยกิจกรรม/เกม/ใบงานให้เหมาะกับ LMS 15 หน่วย";

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2) + "\n", "utf8");
console.log(`Updated ${seed.units.length} LMS units from teaching document content.`);
