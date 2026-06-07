import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const unitGameCatalog = [
  { key: "unit-01-design", unit_id: 1, title: "Network Design Quest", icon: "DES", activity: "Requirement mapping", image: "/assets/new-activities/classroom-network-lesson.jpg", objective: "เลือก requirement, topology และ redundancy ให้เหมาะกับโจทย์องค์กร" },
  { key: "unit-02-vlan", unit_id: 2, title: "VLAN Zoning Game", icon: "VLAN", activity: "Segment design", image: "/assets/activities/osi-model.jpg", objective: "จัดผู้ใช้ลง VLAN และกำหนด segmentation policy ให้ปลอดภัย" },
  { key: "unit-03-ip-plan", unit_id: 3, title: "IP Planner", icon: "IP", activity: "Address plan", image: "/assets/new-activities/computer-lab-student-group.jpg", objective: "จับคู่ subnet, gateway และ host role ให้ตรงกับแผนผังองค์กร" },
  { key: "unit-04-routing", unit_id: 4, title: "Routing Path Finder", icon: "RTE", activity: "Path tracing", image: "/assets/activities/hpe-server.jpg", objective: "เลือก gateway, route และ troubleshooting step ให้ packet ไปถึงปลายทาง" },
  { key: "unit-05-cable-lab", unit_id: 5, title: "Cable Lab Active", icon: "RJ45", activity: "Cable lab", image: "/assets/activities/fiber-otdr.jpg", objective: "เรียงลำดับมาตรฐานสายและตรวจจุดผิดพลาดของงาน cabling" },
  { key: "unit-06-switching", unit_id: 6, title: "Switching Ops", icon: "SW", activity: "Switch control", image: "/assets/new-activities/college-large-assembly.jpg", objective: "เลือก switch feature, trunk/access port และ loop protection" },
  { key: "unit-07-wireless", unit_id: 7, title: "Wireless Coverage", icon: "WIFI", activity: "Coverage planning", image: "/assets/new-activities/computer-lab-student-group.jpg", objective: "วาง SSID, channel, security และ coverage ให้เหมาะกับพื้นที่" },
  { key: "unit-08-server", unit_id: 8, title: "Server Services Lab", icon: "SRV", activity: "Service match", image: "/assets/activities/hpe-server.jpg", objective: "จับคู่ DNS, DHCP, directory และ service monitoring กับสถานการณ์" },
  { key: "unit-09-packet", unit_id: 9, title: "Packet Simulation", icon: "PKT", activity: "Packet route", image: "/assets/activities/hpe-server.jpg", objective: "จำลองการส่งข้อมูลผ่าน switch, router, firewall และ DNS" },
  { key: "unit-10-monitor", unit_id: 10, title: "Monitoring Command", icon: "LOG", activity: "Log analysis", image: "/assets/new-activities/fortigate-log-table.jpg", objective: "เลือก metric, alert และ log evidence เพื่อแก้ปัญหาเครือข่าย" },
  { key: "unit-11-defense", unit_id: 11, title: "Network Defense", icon: "DEF", activity: "Incident response", image: "/assets/new-activities/fortigate-dashboard.jpg", objective: "ตัดสินใจรับมือ incident ด้วย firewall, isolation และ backup" },
  { key: "unit-12-firewall", unit_id: 12, title: "Firewall Policy Game", icon: "FW", activity: "Policy control", image: "/assets/new-activities/fortigate-dashboard.jpg", objective: "จัดลำดับ policy, zone และ rule ให้ปลอดภัยโดยไม่กระทบงาน" },
  { key: "unit-13-cloud", unit_id: 13, title: "Hybrid Cloud Link", icon: "CLD", activity: "Hybrid link", image: "/assets/new-activities/ai-codex-ollama-workflow.jpg", objective: "เลือก VPN, routing, DNS และ identity integration สำหรับ hybrid network" },
  { key: "unit-14-incident", unit_id: 14, title: "Incident Response Drill", icon: "IR", activity: "Recovery drill", image: "/assets/new-activities/research-writing-online.jpg", objective: "เรียงลำดับ containment, evidence, recovery และ lesson learned" },
  { key: "unit-15-enterprise", unit_id: 15, title: "Virtual Enterprise Network", icon: "ENT", activity: "Enterprise design", image: "/assets/new-activities/ai-codex-ollama-workflow.jpg", objective: "ประกอบ core, access, DMZ, security, services และ monitoring ให้ครบ" }
];

const classicGameCatalog = [
  { key: "osi", unit_id: 1, title: "OSI Model Classic", navTitle: "OSI Model" },
  { key: "cable", unit_id: 4, title: "UTP Crimping Classic", navTitle: "เข้าหัวสาย UTP" }
];

const legacyGameAliases = {
  osi: "unit-01-design",
  vlan: "unit-02-vlan",
  ip: "unit-03-ip-plan",
  packet: "unit-09-packet",
  cable: "unit-05-cable-lab",
  defense: "unit-11-defense",
  enterprise: "unit-15-enterprise"
};

const gameLabels = Object.fromEntries([
  ...unitGameCatalog.map((game) => [game.key, game.title]),
  ...Object.entries(legacyGameAliases).map(([legacy, key]) => [legacy, unitGameCatalog.find((game) => game.key === key)?.title || legacy]),
  ...classicGameCatalog.map((game) => [game.key, game.title])
]);

const gameVisuals = Object.fromEntries([
  ...unitGameCatalog.map((game) => [game.key, game]),
  ...Object.entries(legacyGameAliases).map(([legacy, key]) => [legacy, unitGameCatalog.find((game) => game.key === key)])
]);

const professionalGameScenarios = {
  1: {
    role: "Network Architect",
    scenario: "องค์กรกำลังขยายจาก 1 อาคารเป็น 3 อาคาร ผู้เรียนต้องวิเคราะห์ requirement และเลือกแนวทางสถาปัตยกรรมที่ลด single point of failure",
    goal: "ออกแบบแนวคิดเครือข่ายที่เชื่อม requirement, topology และ security ให้ตรวจสอบย้อนกลับได้",
    kpis: ["Reliability", "Scalability", "Security", "Clarity"],
    challenges: [
      {
        title: "Requirement Discovery",
        prompt: "เริ่มต้นโครงการออกแบบเครือข่ายอย่างไรให้ได้ข้อมูลครบ?",
        options: [
          { label: "สัมภาษณ์ผู้ใช้หลัก ระบบงานสำคัญ ปริมาณ traffic และข้อจำกัดงบประมาณ", impact: "ได้ requirement ที่ใช้ตัดสินใจเชิงออกแบบได้จริง", score: 35, metrics: { reliability: 12, security: 8, performance: 10, cost: 7 } },
          { label: "เลือกอุปกรณ์รุ่นแรงที่สุดก่อน แล้วค่อยถามผู้ใช้ภายหลัง", impact: "เสี่ยงซื้อเกินความจำเป็นและไม่ตอบโจทย์ระบบงาน", score: 12, metrics: { reliability: 2, security: 1, performance: 8, cost: -12 } },
          { label: "วาด topology จากภาพจำของระบบเดิมโดยไม่ตรวจสอบ", impact: "เร็ว แต่พลาด dependency และจุดล้มเหลวที่ซ่อนอยู่", score: 18, metrics: { reliability: -5, security: 0, performance: 2, cost: 5 } }
        ]
      },
      {
        title: "Architecture Choice",
        prompt: "องค์กรมีหลายอาคารและต้องการขยายในอนาคต ควรเลือกแนวทางใด?",
        options: [
          { label: "Three-Tier หรือ Collapsed Core พร้อม redundant uplink ตามขนาดองค์กร", impact: "แบ่งหน้าที่ชัด ขยายและดูแลรักษาง่าย", score: 35, metrics: { reliability: 14, security: 6, performance: 10, cost: 4 } },
          { label: "ต่อ switch ทุกตัวเป็นวงเดียวโดยไม่มี distribution policy", impact: "จัดการง่ายช่วงแรก แต่เสี่ยง loop และ troubleshooting ยาก", score: 14, metrics: { reliability: -8, security: -2, performance: -4, cost: 8 } },
          { label: "ใช้ spine-leaf เต็มรูปแบบทันทีแม้เป็น campus ขนาดเล็ก", impact: "ประสิทธิภาพสูงแต่ต้นทุนและความซับซ้อนเกินโจทย์", score: 24, metrics: { reliability: 8, security: 4, performance: 12, cost: -10 } }
        ]
      },
      {
        title: "Validation Evidence",
        prompt: "หลักฐานใดควรส่งมอบเพื่อยืนยันว่าแบบออกแบบมีเหตุผล?",
        options: [
          { label: "Requirement matrix, current-state diagram, risk/gap และ target concept", impact: "ผู้บริหารและทีมติดตั้งเห็นเหตุผลเดียวกัน", score: 30, metrics: { reliability: 8, security: 8, performance: 6, cost: 6 } },
          { label: "ส่งเฉพาะรูป topology สวย ๆ โดยไม่อธิบายข้อจำกัด", impact: "สื่อสารง่าย แต่ตรวจสอบเหตุผลเชิงวิศวกรรมไม่ได้", score: 14, metrics: { reliability: -2, security: -2, performance: 0, cost: 3 } },
          { label: "ส่งรายการราคาอุปกรณ์อย่างเดียว", impact: "เห็นงบประมาณ แต่ยังไม่รู้ว่าแบบตอบโจทย์หรือไม่", score: 10, metrics: { reliability: -5, security: -4, performance: -2, cost: 4 } }
        ]
      }
    ]
  },
  2: {
    role: "Network Design Lead",
    scenario: "บริษัทต้องการออกแบบ logical/physical network ใหม่ แยกแผนกด้วย VLAN และวาง IP plan ที่รองรับการเติบโต",
    goal: "สร้างแผนออกแบบที่ใช้งานได้จริง ปลอดภัย ขยายได้ และคุ้มค่า",
    kpis: ["IP Plan", "VLAN Policy", "Redundancy", "Diagram Quality"],
    challenges: [
      {
        title: "Logical vs Physical",
        prompt: "ควรเริ่มออกแบบ logical และ physical อย่างไร?",
        options: [
          { label: "แยก logical design สำหรับ VLAN/IP/routing และ physical design สำหรับ rack/cabling/device placement", impact: "ทีมเข้าใจทั้งวิธีทำงานของระบบและตำแหน่งติดตั้งจริง", score: 34, metrics: { reliability: 8, security: 8, performance: 8, cost: 6 } },
          { label: "วาดเฉพาะตำแหน่งอุปกรณ์จริง ไม่ต้องระบุ VLAN หรือ subnet", impact: "ติดตั้งได้บางส่วน แต่ตั้งค่าและตรวจสอบยาก", score: 14, metrics: { reliability: -4, security: -5, performance: -2, cost: 4 } },
          { label: "วาดเฉพาะ logical diagram โดยไม่คิดเรื่อง rack, power และสาย", impact: "แนวคิดดีแต่มีความเสี่ยงตอนติดตั้งจริง", score: 21, metrics: { reliability: 0, security: 3, performance: 4, cost: -4 } }
        ]
      },
      {
        title: "Addressing Plan",
        prompt: "ต้องแบ่ง IP ให้สำนักงานใหญ่ ศูนย์ข้อมูล และสาขา ควรทำอย่างไร?",
        options: [
          { label: "ใช้ VLSM เรียงจาก subnet ที่ต้องการ host มากไปน้อยและเว้น growth reserve", impact: "ใช้ address space คุ้มและลด overlap", score: 34, metrics: { reliability: 8, security: 3, performance: 7, cost: 10 } },
          { label: "ให้ทุกแผนกใช้ /24 เท่ากันทั้งหมดโดยไม่ดูจำนวน host", impact: "ง่ายแต่เปลือง address และไม่สะท้อนความต้องการจริง", score: 18, metrics: { reliability: 3, security: 2, performance: 3, cost: -6 } },
          { label: "กำหนด IP จากเลขที่ห้องและแก้ซ้ำตอนติดตั้ง", impact: "เสี่ยง overlap และ troubleshooting ยาก", score: 8, metrics: { reliability: -10, security: -2, performance: -6, cost: -8 } }
        ]
      },
      {
        title: "Segmentation & Resilience",
        prompt: "ต้องแยก HR, Finance, Sales, Server และลด downtime ควรเลือกอะไร?",
        options: [
          { label: "ใช้ VLAN, 802.1Q trunk, inter-VLAN routing, ACL และ redundant uplinks", impact: "แยก broadcast/security zone และยังมีเส้นทางสำรอง", score: 36, metrics: { reliability: 12, security: 12, performance: 8, cost: 3 } },
          { label: "รวมทุกแผนกอยู่ VLAN เดียวเพื่อให้ง่ายต่อการสื่อสาร", impact: "ง่ายแต่เสี่ยงด้าน security และ broadcast", score: 10, metrics: { reliability: -5, security: -12, performance: -4, cost: 8 } },
          { label: "ทำ VLAN แต่ไม่มี gateway และไม่มี trunk ระหว่าง switch", impact: "แบ่งกลุ่มได้แต่สื่อสารข้าม VLAN ไม่ได้", score: 16, metrics: { reliability: -2, security: 4, performance: -6, cost: 2 } }
        ]
      }
    ]
  },
  3: {
    role: "Procurement Engineer",
    scenario: "ทีมต้องจัดหา switch/router/firewall และระบบสายให้ตรงกับ requirement โดยไม่ซื้อเกินจำเป็น",
    goal: "เลือกอุปกรณ์และระบบสายที่ผ่านมาตรฐาน ติดตั้งได้จริง และตรวจรับงานได้",
    kpis: ["Fit to Spec", "Cabling Quality", "Rack Readiness", "Acceptance"],
    challenges: [
      {
        title: "Device Selection",
        prompt: "จะเลือก switch สำหรับ access layer อย่างไร?",
        options: [
          { label: "อ่าน datasheet เทียบ port, PoE, throughput, VLAN, warranty และ growth", impact: "เลือกได้ตรงงานและป้องกันปัญหาคอขวด", score: 34, metrics: { reliability: 10, security: 4, performance: 10, cost: 6 } },
          { label: "เลือกจากราคาถูกที่สุดเท่านั้น", impact: "ต้นทุนต่ำแต่เสี่ยง port/PoE/throughput ไม่พอ", score: 14, metrics: { reliability: -8, security: -2, performance: -7, cost: 10 } },
          { label: "เลือกจากยี่ห้อที่คุ้นเคยโดยไม่อ่านสเปก", impact: "เร็วแต่ขาดหลักฐานเปรียบเทียบ", score: 18, metrics: { reliability: 0, security: 0, performance: 0, cost: -3 } }
        ]
      },
      {
        title: "Cabling Standard",
        prompt: "งานสายสัญญาณควรควบคุมอย่างไร?",
        options: [
          { label: "กำหนด Cat6A/Fiber ตามระยะ ตรวจ label, patch panel และผลทดสอบ", impact: "ลดปัญหาสัญญาณและตรวจรับงานได้", score: 33, metrics: { reliability: 10, security: 1, performance: 10, cost: 4 } },
          { label: "ใช้สายอะไรก็ได้ถ้าต่อแล้ว link up", impact: "ใช้งานช่วงแรกได้ แต่เสี่ยง performance ตกและซ่อมยาก", score: 10, metrics: { reliability: -10, security: 0, performance: -10, cost: 6 } },
          { label: "ไม่ต้องติด label เพื่อลดเวลาติดตั้ง", impact: "เร็วตอนติดตั้ง แต่เสียเวลามากตอนแก้ปัญหา", score: 12, metrics: { reliability: -8, security: -1, performance: -4, cost: 5 } }
        ]
      },
      {
        title: "Acceptance Test",
        prompt: "ก่อนส่งมอบควรตรวจรับอะไร?",
        options: [
          { label: "ตรวจ port map, cable test, device config, failover และเอกสาร as-built", impact: "ลดงานแก้หลังส่งมอบและมีหลักฐานชัด", score: 33, metrics: { reliability: 10, security: 5, performance: 5, cost: 5 } },
          { label: "เปิดเครื่องติดก็ถือว่าส่งมอบ", impact: "ไม่พอสำหรับระบบ production", score: 8, metrics: { reliability: -10, security: -6, performance: -5, cost: 3 } },
          { label: "ตรวจเฉพาะอุปกรณ์หลัก ไม่ต้องตรวจ access port", impact: "พลาดปัญหาผู้ใช้ปลายทาง", score: 16, metrics: { reliability: -4, security: 0, performance: -3, cost: 4 } }
        ]
      }
    ]
  }
};

const defaultProfessionalScenario = {
  role: "Network Operations Specialist",
  scenario: "ผู้เรียนรับบททีมเครือข่ายองค์กร ต้องเลือกแนวทางที่ทำให้ระบบพร้อมใช้งาน ปลอดภัย และมีหลักฐานตรวจสอบได้",
  goal: "ตัดสินใจจาก requirement จริงและลดความเสี่ยงของระบบ",
  kpis: ["Reliability", "Security", "Performance", "Evidence"],
  challenges: [
    {
      title: "Assess",
      prompt: "ก่อนลงมือควรทำอะไร?",
      options: [
        { label: "เก็บ requirement และตรวจ current state ก่อนตัดสินใจ", impact: "เข้าใจบริบทและลดการแก้ซ้ำ", score: 34, metrics: { reliability: 8, security: 6, performance: 6, cost: 6 } },
        { label: "ลงมือแก้ทันทีจากประสบการณ์เดิม", impact: "เร็วแต่เสี่ยงแก้ผิดจุด", score: 14, metrics: { reliability: -5, security: -2, performance: 1, cost: 2 } },
        { label: "รอจนเกิดปัญหาจริงแล้วค่อยวิเคราะห์", impact: "เสียโอกาสป้องกันปัญหา", score: 8, metrics: { reliability: -10, security: -4, performance: -5, cost: -4 } }
      ]
    },
    {
      title: "Implement",
      prompt: "ระหว่างดำเนินงานควรเลือกแนวทางใด?",
      options: [
        { label: "ทำตามแผนที่มี rollback, test case และผู้รับผิดชอบชัดเจน", impact: "ควบคุมความเสี่ยงและตรวจสอบได้", score: 33, metrics: { reliability: 8, security: 6, performance: 5, cost: 5 } },
        { label: "เปลี่ยนค่าหลายจุดพร้อมกันเพื่อประหยัดเวลา", impact: "ถ้าเสียจะหาสาเหตุยาก", score: 12, metrics: { reliability: -8, security: -2, performance: -3, cost: 4 } },
        { label: "ไม่ต้องบันทึก change เพราะเป็นงานเล็ก", impact: "ขาด audit trail และซ้ำรอยปัญหาได้ง่าย", score: 10, metrics: { reliability: -6, security: -5, performance: 0, cost: 2 } }
      ]
    },
    {
      title: "Verify",
      prompt: "หลังดำเนินงานควรปิดงานอย่างไร?",
      options: [
        { label: "ทดสอบผลลัพธ์ เก็บ evidence และอัปเดตเอกสาร", impact: "มั่นใจว่าระบบพร้อมใช้งานจริง", score: 33, metrics: { reliability: 8, security: 6, performance: 6, cost: 4 } },
        { label: "ถามผู้ใช้หนึ่งคนว่าทำงานได้หรือไม่", impact: "เป็นสัญญาณที่ดีแต่ยังไม่ครอบคลุม", score: 18, metrics: { reliability: -2, security: 0, performance: 1, cost: 3 } },
        { label: "ปิดงานทันทีเมื่อไม่มี alert", impact: "อาจพลาดปัญหาที่ monitoring ยังไม่ครอบคลุม", score: 13, metrics: { reliability: -5, security: -2, performance: -2, cost: 3 } }
      ]
    }
  ]
};

const unitLessonVisuals = {
  1: [
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
  ],
  2: [
    {
      images: ["/assets/lms-unit-02/2-0.png", "/assets/lms-unit-02/2-1.png"],
      caption: "Network design starts from requirements, architecture choices, operations, and expected outcomes"
    },
    {
      images: ["/assets/lms-unit-02/2-1.png"],
      caption: "Logical design defines IP, VLAN, routing, policy, and services; physical design defines cabling, racks, devices, and layout"
    },
    {
      images: ["/assets/lms-unit-02/2-3.png", "/assets/lms-unit-02/2-5.png"],
      caption: "Network diagrams should clearly show addressing, subnet boundaries, VLANs, trunks, gateways, and inter-VLAN routing"
    },
    {
      images: ["/assets/lms-unit-02/2-2.png", "/assets/lms-unit-02/2-4.png"],
      caption: "Design alternatives are evaluated through IP planning, subnet efficiency, VLSM allocation, scalability, and future growth"
    },
    {
      images: ["/assets/lms-unit-02/2-5.png", "/assets/lms-unit-02/2-0.png"],
      caption: "Small-organization designs should connect VLAN segmentation, routing, security, operations, and review into one practical plan"
    }
  ]
};

const defaultActivityCategories = [
  "Network Lesson",
  "Network Lab",
  "Collaborative Learning",
  "Cybersecurity",
  "AI for Learning",
  "Game-Based Learning"
];

const editableUnitArrayFields = [
  ["key_topics", "หัวข้อหลัก"],
  ["outcomes", "ผลลัพธ์การเรียนรู้"],
  ["content", "เนื้อหาบทเรียน"],
  ["learning_steps", "ลำดับการเรียนรู้"],
  ["lab_steps", "ขั้นตอนใบงาน/ปฏิบัติ"],
  ["common_mistakes", "ข้อควรระวัง"],
  ["teacher_guidance", "แนวทางครูผู้สอน"]
];

const emptyLmsUnitForm = {
  id: null,
  unit_no: 1,
  title: "",
  lesson_title: "",
  objective: "",
  image: "",
  phase: "",
  key_topics: [""],
  outcomes: [""],
  content: [""],
  learning_steps: [""],
  lab_steps: [""],
  common_mistakes: [""],
  teacher_guidance: [""],
  case_study: "",
  workshop: "",
  product: "",
  lesson_sections: [],
  game: { title: "", type: "", description: "", existing_key: "", status: "planned", planned_game: "" }
};

function activityImages(activity) {
  return (activity.images || [activity.image, activity.image_2, activity.image_3]).filter(Boolean);
}

function normalizeEditableList(value) {
  const list = Array.isArray(value) ? value : [];
  const normalized = list
    .map((item) => (typeof item === "string" ? item : item?.text || item?.title || item?.detail || ""))
    .filter((item) => String(item).trim())
    .map((item) => String(item));
  return normalized.length ? normalized : [""];
}

function normalizeImageList(value) {
  const list = Array.isArray(value) ? value : [];
  return list.map((item) => String(item || "").trim()).filter(Boolean);
}

function normalizeLessonSections(value, fallbackTitles = [], fallbackDetails = []) {
  const sections = Array.isArray(value) ? value : [];
  const normalized = sections.map((section, index) => {
    const images = normalizeImageList(section?.images || [section?.image, section?.image_2, section?.image_3]);
    const contentImages = normalizeImageList(section?.content_images || section?.contentImages || [section?.content_image, section?.content_image_2, section?.content_image_3]);
    return {
      title: String(section?.title || fallbackTitles[index] || `หัวข้อที่ ${index + 1}`).trim(),
      detail: String(section?.detail || section?.text || fallbackDetails[index] || "").trim(),
      caption: String(section?.caption || "").trim(),
      images,
      content_images: contentImages
    };
  }).filter((section) => section.title || section.detail || section.images.length || section.content_images.length);

  if (normalized.length) return normalized;

  return (fallbackTitles || []).map((title, index) => ({
    title: String(title || `หัวข้อที่ ${index + 1}`).trim(),
    detail: String(fallbackDetails[index] || "").trim(),
    caption: "",
    images: [],
    content_images: []
  })).filter((section) => section.title || section.detail);
}

function lmsUnitToForm(unit) {
  if (!unit) return { ...emptyLmsUnitForm, game: { ...emptyLmsUnitForm.game } };
  return {
    ...emptyLmsUnitForm,
    ...unit,
    key_topics: normalizeEditableList(unit.key_topics),
    outcomes: normalizeEditableList(unit.outcomes),
    content: normalizeEditableList(unit.content),
    learning_steps: normalizeEditableList(unit.learning_steps),
    lab_steps: normalizeEditableList(unit.lab_steps),
    common_mistakes: normalizeEditableList(unit.common_mistakes),
    teacher_guidance: normalizeEditableList(unit.teacher_guidance),
    lesson_sections: normalizeLessonSections(unit.lesson_sections, unit.key_topics, unit.content),
    game: { ...emptyLmsUnitForm.game, ...(unit.game || {}) }
  };
}

function cleanUnitPayload(form) {
  const payload = { ...form, game: { ...form.game } };
  for (const [field] of editableUnitArrayFields) {
    payload[field] = normalizeEditableList(form[field]).map((item) => item.trim()).filter(Boolean);
  }
  payload.unit_no = Number(payload.unit_no) || 1;
  payload.lesson_sections = normalizeLessonSections(form.lesson_sections, payload.key_topics, payload.content).map((section) => ({
    title: section.title,
    detail: section.detail,
    caption: section.caption,
    images: normalizeImageList(section.images),
    content_images: normalizeImageList(section.content_images)
  }));
  payload.external_resources = [];
  return payload;
}

const osiOrder = [
  { layer: 7, name: "Application", hint: "HTTP, DNS, user service", detail: "ให้บริการแอปพลิเคชันและโปรโตคอลที่ผู้ใช้ใช้งาน เช่น Web, DNS, Email", tone: "osi-app" },
  { layer: 6, name: "Presentation", hint: "Encoding, encryption, compression", detail: "แปลงรูปแบบข้อมูล เข้ารหัส บีบอัด และเตรียมข้อมูลให้ Application ใช้ได้", tone: "osi-presentation" },
  { layer: 5, name: "Session", hint: "Session control", detail: "สร้าง ควบคุม และยุติ session การสื่อสารระหว่างระบบ", tone: "osi-session" },
  { layer: 4, name: "Transport", hint: "TCP/UDP, ports", detail: "ควบคุมการส่งข้อมูลแบบ end-to-end จัดการ port, reliability และ flow control", tone: "osi-transport" },
  { layer: 3, name: "Network", hint: "IP routing", detail: "กำหนด IP address และเลือกเส้นทางส่ง packet ข้ามเครือข่ายด้วย router", tone: "osi-network" },
  { layer: 2, name: "Data Link", hint: "MAC, switch, VLAN", detail: "จัดการ frame, MAC address, switching, VLAN และการส่งข้อมูลใน LAN", tone: "osi-data" },
  { layer: 1, name: "Physical", hint: "Cable, signal, fiber", detail: "ส่งสัญญาณจริงผ่านสายทองแดง ไฟเบอร์ หรือคลื่นวิทยุ รวมถึงหัวต่อและมาตรฐานสาย", tone: "osi-physical" }
];

const osiChoices = [osiOrder[3], osiOrder[0], osiOrder[6], osiOrder[1], osiOrder[4], osiOrder[2], osiOrder[5]];

const vlanDevices = [
  { id: "pc-account", label: "Accounting PC", target: "10", unit: "แผนกบัญชี" },
  { id: "pc-it", label: "IT Admin", target: "30", unit: "ผู้ดูแลระบบ" },
  { id: "wifi-student", label: "Student Wi-Fi", target: "20", unit: "ผู้เรียน" },
  { id: "nas", label: "File Server", target: "30", unit: "Server zone" },
  { id: "pc-teacher", label: "Teacher PC", target: "10", unit: "งานวิชาการ" },
  { id: "guest", label: "Guest Tablet", target: "20", unit: "บุคคลทั่วไป" }
];

const packetSteps = [
  "Client creates an HTTP request",
  "DNS resolves the server name",
  "Switch forwards frame by MAC address",
  "Router selects next hop by IP route",
  "Firewall checks policy",
  "Server responds with TCP segments"
];

const cableOrder = ["White-Orange", "Orange", "White-Green", "Blue", "White-Blue", "Green", "White-Brown", "Brown"];
const cableChoices = ["Green", "White-Orange", "Brown", "Blue", "Orange", "White-Brown", "White-Green", "White-Blue"];
const cableColorClass = {
  "White-Orange": "wire-white-orange",
  Orange: "wire-orange",
  "White-Green": "wire-white-green",
  Blue: "wire-blue",
  "White-Blue": "wire-white-blue",
  Green: "wire-green",
  "White-Brown": "wire-white-brown",
  Brown: "wire-brown"
};

const ipQuestions = [
  { id: "host", prompt: "PC นักศึกษา VLAN 20", answer: "192.168.20.25/24", role: "Host address" },
  { id: "gateway", prompt: "Default Gateway VLAN 20", answer: "192.168.20.1/24", role: "Gateway" },
  { id: "server", prompt: "Server ภายในศูนย์ข้อมูล", answer: "10.10.30.10/24", role: "Server address" },
  { id: "loopback", prompt: "Loopback สำหรับ Router", answer: "10.255.255.1/32", role: "Management" },
  { id: "public", prompt: "Public DNS ที่ใช้ทดสอบ", answer: "8.8.8.8/32", role: "External DNS" }
];

const ipChoices = [
  "192.168.20.1/24",
  "8.8.8.8/32",
  "10.10.30.10/24",
  "192.168.20.25/24",
  "10.255.255.1/32"
];

const defenseIncidents = [
  {
    id: "scan",
    title: "Port scan จาก guest Wi-Fi ไปยัง server zone",
    answer: "isolate",
    options: [
      ["allow", "Allow traffic เพื่อลด false positive"],
      ["isolate", "Block inter-VLAN และ isolate guest VLAN"],
      ["dns", "เปลี่ยน DNS resolver"]
    ]
  },
  {
    id: "ransom",
    title: "เครื่อง Accounting มีพฤติกรรมเข้ารหัสไฟล์จำนวนมาก",
    answer: "contain",
    options: [
      ["contain", "Disconnect host, preserve evidence, restore from backup"],
      ["ignore", "รอให้ผู้ใช้แจ้งปัญหาเพิ่ม"],
      ["public", "ย้ายเครื่องไป public subnet"]
    ]
  },
  {
    id: "brute",
    title: "พบ login fail ต่อเนื่องที่ VPN gateway",
    answer: "mfa",
    options: [
      ["mfa", "Enable MFA, rate limit, review account logs"],
      ["open", "เปิด remote access เพิ่ม"],
      ["flat", "รวม VLAN เพื่อลด routing"]
    ]
  },
  {
    id: "iot",
    title: "กล้อง IP camera ส่ง traffic ไปปลายทางไม่รู้จัก",
    answer: "segment",
    options: [
      ["segment", "แยก IoT VLAN และบังคับ egress policy"],
      ["trust", "เพิ่มเป็น trusted device"],
      ["disable-fw", "ปิด firewall ชั่วคราว"]
    ]
  }
];

const enterpriseRequirements = [
  { id: "core", label: "Core network redundancy", answer: "Layer 3 core switch pair" },
  { id: "dmz", label: "Public web service zone", answer: "DMZ behind firewall" },
  { id: "identity", label: "Central user authentication", answer: "Directory + RADIUS" },
  { id: "monitor", label: "Traffic and incident visibility", answer: "Syslog + SIEM monitoring" },
  { id: "branch", label: "Branch-to-HQ secure link", answer: "Site-to-site VPN" },
  { id: "wifi", label: "Separated staff/student wireless", answer: "SSID mapped to VLANs" }
];

const enterpriseOptions = [
  "Layer 3 core switch pair",
  "DMZ behind firewall",
  "Directory + RADIUS",
  "Syslog + SIEM monitoring",
  "Site-to-site VPN",
  "SSID mapped to VLANs"
];

const teacherProfile = {
  name: "ITTHIPHON SUKTERM",
  title: "ครูผู้สอนด้านเทคโนโลยีคอมพิวเตอร์และเครือข่าย",
  college: "วิทยาลัยเทคนิคอุบลราชธานี",
  department: "แผนกวิชาเทคโนโลยีคอมพิวเตอร์",
  email: "itp@utc.ac.th",
  image: "/assets/profile/official-profile.jpg",
  mission: "ออกแบบการเรียนรู้เชิงปฏิบัติที่เชื่อมโยงงานเครือข่ายจริง เกมเพื่อการเรียนรู้ และ AI เพื่อพัฒนาสมรรถนะผู้เรียนระดับ ปวส.",
  specialties: [
    "Network Design & Enterprise Architecture",
    "OSI Model, VLAN, IP Addressing และ Packet Flow",
    "Fiber Optic, OTDR และงานระบบสายสัญญาณ",
    "Cybersecurity, Firewall, Log Analysis และ Incident Response",
    "AI-assisted Learning Media และ Game-Based Learning",
    "React, SQLite, Dashboard และระบบติดตามคะแนนผู้เรียน"
  ],
  highlights: [
    { label: "Teaching Focus", value: "Network + Cyber + AI" },
    { label: "Platform", value: "React + Tailwind + SQLite" },
    { label: "Learning Mode", value: "Simulation & Puzzle" }
  ]
};

const teachingActivities = [
  {
    title: "กิจกรรมการเรียนรู้เครือข่ายในชั้นเรียน",
    category: "Network Lesson",
    image: "/assets/new-activities/classroom-network-lesson.jpg",
    description: "ผู้เรียนฝึกวิเคราะห์ topology, อุปกรณ์เครือข่าย และเส้นทางข้อมูลก่อนเข้าสู่เกมจำลอง packet"
  },
  {
    title: "ปฏิบัติการ Fiber Optic และ OTDR",
    category: "Network Lab",
    image: "/assets/activities/fiber-otdr.jpg",
    description: "เชื่อมโยงทักษะงานภาคสนามกับการออกแบบเครือข่ายองค์กรและการตรวจสอบคุณภาพสัญญาณ"
  },
  {
    title: "กิจกรรมกลุ่มในห้องปฏิบัติการคอมพิวเตอร์",
    category: "Collaborative Learning",
    image: "/assets/new-activities/computer-lab-student-group.jpg",
    description: "ผู้เรียนทำงานเป็นทีม แบ่งบทบาท administrator, user และ network operator"
  },
  {
    title: "Dashboard ความปลอดภัยเครือข่าย",
    category: "Cybersecurity",
    image: "/assets/new-activities/fortigate-dashboard.jpg",
    description: "ใช้ข้อมูล log และ dashboard เพื่อพัฒนาทักษะการวิเคราะห์ traffic และ policy"
  },
  {
    title: "AI Workflow สำหรับพัฒนาสื่อการสอน",
    category: "AI for Learning",
    image: "/assets/new-activities/ai-codex-ollama-workflow.jpg",
    description: "นำ AI มาช่วยออกแบบกิจกรรม บทเรียน และเกมฝึกทักษะให้สอดคล้องกับหน่วยการเรียน"
  },
  {
    title: "กิจกรรมเกมและ Coding",
    category: "Game-Based Learning",
    image: "/assets/new-activities/roblox-quiz-coding.jpg",
    description: "ต่อยอดแนวคิดเกมเพื่อการเรียนรู้สู่ OSI Game, VLAN Puzzle และ Packet Simulation"
  }
];

async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const text = await res.text();
  if (!res.ok) {
    let body = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }
    throw new Error(body.error || "Request failed");
  }
  return text ? JSON.parse(text) : null;
}

function Stat({ label, value, tone = "cyan" }) {
  const tones = {
    cyan: "text-cyber-cyan border-cyber-cyan/40",
    lime: "text-cyber-lime border-cyber-lime/40",
    rose: "text-cyber-rose border-cyber-rose/40"
  };
  return (
    <div className={`rounded-lg border bg-white/5 p-4 ${tones[tone]}`}>
      <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <strong className="mt-2 block text-3xl font-extrabold">{value}</strong>
    </div>
  );
}

function CopyrightBar() {
  return (
    <div className="copyright-bar" role="contentinfo">
      © 2026 Itthiphon Sukterm. Ubon Ratchathani Technical College. All rights reserved.
    </div>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";
  return (
    <button className="theme-toggle" type="button" onClick={onToggle} aria-label="สลับโหมดสี">
      <span>{isLight ? "Light" : "Dark"}</span>
      <strong>{isLight ? "☀" : "☾"}</strong>
    </button>
  );
}

function CommandRail({ mode = "student", activeTab, onNavigate }) {
  const items = mode === "admin"
    ? [["OV", "Overview"], ["ACT", "Activities"], ["LMS", "LMS"], ["ANA", "Analytics"], ["CFG", "Config"]]
    : [["MAP", "Dashboard", "dashboard"], ["LMS", "LMS", "lms"], ["GM", "Games", "games"], ["RPT", "Reports", "leaderboard"], ["AI", "Assist", "dashboard"]];
  return (
    <aside className="command-rail" aria-label={`${mode} command rail`}>
      <div className="rail-logo">NL</div>
      <div className="rail-status"><i /> LIVE</div>
      {items.map(([icon, label, tab]) => (
        <button
          className={`rail-item ${activeTab === tab ? "active" : ""}`}
          disabled={!tab || !onNavigate}
          key={label}
          onClick={() => tab && onNavigate?.(tab)}
          type="button"
        >
          <strong>{icon}</strong>
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ student_code: "", name: "", group_name: "", password: "", confirm_password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (mode === "register" && form.password !== form.confirm_password) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    const payload = mode === "login"
      ? { student_code: form.student_code, password: form.password }
      : { student_code: form.student_code, name: form.name, group_name: form.group_name, password: form.password };
    try {
      const user = await api(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="min-h-screen bg-cyber-ink text-white">
      <section className="grid min-h-screen items-center gap-8 px-5 py-8 md:grid-cols-[1.05fr_0.95fr] md:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-lg border border-cyber-line bg-cyber-panel shadow-glow">
          <img className="h-[52vh] min-h-80 w-full object-cover opacity-80" src="/assets/smart-network-logo.png" alt="Smart network character" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-ink via-cyber-ink/72 to-transparent" />
          <div className="absolute inset-0 grid content-end p-6 md:p-10">
            <div className="mb-5 flex items-center gap-4">
              <img className="h-16 w-16 rounded-full bg-white object-cover p-1" src="/assets/smart-network-logo.png" alt="" />
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyber-lime">Cyber UI Learning</p>
                <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Network Learning Platform</h1>
              </div>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-200">
              เกมฝึกทักษะเครือข่ายสำหรับนักศึกษา ปวส. เชื่อมโยงตั้งแต่พื้นฐาน OSI ถึง Network Defense และ Virtual Enterprise Network พร้อมคะแนนสะสมและ Leaderboard
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-cyber-line bg-slate-950/82 p-6 shadow-glow md:p-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-cyber-cyan">Student Login</p>
          <h2 className="mt-3 text-3xl font-extrabold">เข้าสู่ระบบเกม</h2>
          <div className="mt-7 grid gap-4">
            <input className="cyber-input" required placeholder="รหัสนักศึกษา" value={form.student_code} onChange={(e) => setForm({ ...form, student_code: e.target.value })} />
            <input className="cyber-input" required placeholder="ชื่อ-สกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="cyber-input" required placeholder="กลุ่มเรียน เช่น ปวส.2/1" value={form.group_name} onChange={(e) => setForm({ ...form, group_name: e.target.value })} />
          </div>
          {error && <p className="mt-4 rounded-lg border border-cyber-rose/40 bg-cyber-rose/10 p-3 text-cyber-rose">{error}</p>}
          <button className="mt-6 w-full rounded-lg bg-cyber-lime px-5 py-3 font-extrabold text-cyber-ink transition hover:bg-white" type="submit">
            Connect to Platform
          </button>
        </form>
      </section>
    </main>
  );
}

function AuthScreen({ onLogin, theme, onToggleTheme }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ student_code: "", name: "", group_name: "", password: "", confirm_password: "" });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (mode === "register" && form.password !== form.confirm_password) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    const payload = mode === "login"
      ? { student_code: form.student_code, password: form.password }
      : { student_code: form.student_code, name: form.name, group_name: form.group_name, password: form.password };

    try {
      const user = await api(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className={`app-shell with-command-rail theme-${theme} min-h-screen bg-cyber-ink text-white`}>
      <div className="theme-corner">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <section className="grid min-h-screen items-center gap-8 px-5 py-8 md:grid-cols-[1.05fr_0.95fr] md:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-lg border border-cyber-line bg-cyber-panel shadow-glow">
          <img className="h-[52vh] min-h-80 w-full object-cover opacity-80" src="/assets/smart-network-logo.png" alt="Smart network character" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-ink via-cyber-ink/72 to-transparent" />
          <div className="absolute inset-0 grid content-end p-6 md:p-10">
            <div className="mb-5 flex items-center gap-4">
              <img className="h-16 w-16 rounded-full bg-white object-cover p-1" src="/assets/smart-network-logo.png" alt="" />
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyber-lime">Cyber UI Learning</p>
                <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Network Learning Platform</h1>
              </div>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-200">
              เกมฝึกทักษะเครือข่ายสำหรับนักศึกษา ปวส. เชื่อมโยงตั้งแต่พื้นฐาน OSI ถึง Network Defense และ Virtual Enterprise Network พร้อมคะแนนสะสมและ Leaderboard
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-cyber-line bg-slate-950/82 p-6 shadow-glow md:p-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.26em] text-cyber-cyan">{mode === "login" ? "Student Login" : "Student Register"}</p>
          <h2 className="mt-3 text-3xl font-extrabold">{mode === "login" ? "เข้าสู่ระบบเกม" : "สมัครสมาชิก"}</h2>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg border border-cyber-line bg-cyber-ink/60 p-1">
            <button className={`rounded-md px-4 py-2 font-extrabold transition ${mode === "login" ? "bg-cyber-cyan text-cyber-ink" : "text-slate-300 hover:bg-white/10"}`} type="button" onClick={() => switchMode("login")}>
              เข้าสู่ระบบ
            </button>
            <button className={`rounded-md px-4 py-2 font-extrabold transition ${mode === "register" ? "bg-cyber-lime text-cyber-ink" : "text-slate-300 hover:bg-white/10"}`} type="button" onClick={() => switchMode("register")}>
              สมัครสมาชิก
            </button>
          </div>
          <div className="mt-7 grid gap-4">
            <input className="cyber-input" required placeholder="รหัสนักศึกษา" value={form.student_code} onChange={(event) => updateField("student_code", event.target.value)} />
            {mode === "register" && (
              <>
                <input className="cyber-input" required placeholder="ชื่อ-สกุล" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
                <input className="cyber-input" required placeholder="กลุ่มเรียน เช่น ปวส.2/1" value={form.group_name} onChange={(event) => updateField("group_name", event.target.value)} />
              </>
            )}
            <input className="cyber-input" required minLength={4} type="password" placeholder="รหัสผ่าน" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
            {mode === "register" && (
              <input className="cyber-input" required minLength={4} type="password" placeholder="ยืนยันรหัสผ่าน" value={form.confirm_password} onChange={(event) => updateField("confirm_password", event.target.value)} />
            )}
          </div>
          {error && <p className="mt-4 rounded-lg border border-cyber-rose/40 bg-cyber-rose/10 p-3 text-cyber-rose">{error}</p>}
          <button className="mt-6 w-full rounded-lg bg-cyber-lime px-5 py-3 font-extrabold text-cyber-ink transition hover:bg-white" type="submit">
            {mode === "login" ? "Login to Platform" : "Create Account"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-400">
            {mode === "login" ? "ยังไม่มีบัญชี กดสมัครสมาชิกก่อนเข้าเล่นเกม" : "สมัครแล้วระบบจะเข้าสู่เกมให้อัตโนมัติ"}
          </p>
        </form>
      </section>
    </main>
  );
}

function ActivityLanding({ onEnterGame, onOpenAdmin, theme, onToggleTheme }) {
  const [preview, setPreview] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [activities, setActivities] = useState(teachingActivities);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api("/api/activities")
      .then((rows) => setActivities(rows.length ? rows : teachingActivities))
      .catch(() => setActivities(teachingActivities));
  }, []);

  const visibleActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return activities;
    return activities.filter((activity) => [
      activity.title,
      activity.category,
      activity.description,
      activity.content,
      activity.published_at
    ].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [activities, searchQuery]);

  function openProfile() {
    setShowProfile(true);
    window.setTimeout(() => {
      document.getElementById("profile")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <main className={`app-shell with-command-rail theme-${theme} min-h-screen bg-cyber-ink text-white`}>
      <div className="cyber-grid fixed inset-0 opacity-35" />
      <CommandRail mode="admin" />
      <header className="sticky top-0 z-20 border-b border-cyber-line bg-cyber-ink/88 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <a className="flex items-center gap-3" href="#activities">
            <img className="h-12 w-12 rounded-full bg-white object-cover p-1" src="/assets/smart-network-logo.png" alt="" />
            <div>
              <strong className="block text-lg">Teaching Activity Hub</strong>
              <small className="text-slate-400">ITTHIPHON SUKTERM</small>
            </div>
          </a>
          <nav className="flex flex-wrap gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button className={`nav-chip ${showProfile ? "active" : ""}`} type="button" onClick={openProfile}>Profile</button>
            <a className="nav-chip" href="#activities" onClick={() => setShowProfile(false)}>Activity News</a>
            <a className="nav-chip" href="#course-link" onClick={() => setShowProfile(false)}>Course Link</a>
            <button className="nav-chip" type="button" onClick={onOpenAdmin}>Admin</button>
            <button className="nav-chip active" onClick={onEnterGame}>เข้าสู่เกม</button>
          </nav>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1.04fr_0.96fr] md:px-8 md:py-12">
        <div className="activity-hero-card relative min-h-[520px] overflow-hidden rounded-lg border border-cyber-line bg-cyber-panel shadow-glow">
          <img className="absolute inset-0 h-full w-full object-cover opacity-72" src="/assets/new-activities/classroom-network-lesson.jpg" alt="Teaching activity" />
          <div className="activity-hero-overlay absolute inset-0 bg-gradient-to-t from-cyber-ink via-cyber-ink/74 to-cyber-ink/10" />
          <div className="activity-hero-copy absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyber-lime">Activity News</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl">กิจกรรมการสอน เครือข่ายคอมพิวเตอร์และความปลอดภัย</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
              รวมกิจกรรมการเรียนรู้ ห้องปฏิบัติการ และสื่อดิจิทัลที่เชื่อมโยงสู่เกม OSI, VLAN, Packet, Cable Crimping, IP Matching, Network Defense และ Enterprise Network
            </p>
          </div>
        </div>

        <div id="course-link" className="grid content-center gap-4 rounded-lg border border-cyber-line bg-cyber-panel/88 p-5 shadow-glow md:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Learning Path</p>
          <h2 className="text-3xl font-extrabold">จากกิจกรรมจริง สู่เกมฝึกสมรรถนะ</h2>
          <p className="leading-8 text-slate-300">
            ผู้เรียนเริ่มจากอ่านภาพรวมกิจกรรมการสอน แล้วเข้าสู่เกมเพื่อฝึก OSI, VLAN, packet flow, การเข้าหัวสาย, IP addressing, cyber defense และ enterprise design คะแนนจะถูกบันทึกลง SQLite เพื่อใช้ติดตามผลการเรียนรู้
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Games" value="7" />
            <Stat label="Units" value="7" tone="lime" />
            <Stat label="Score DB" value="SQLite" tone="rose" />
          </div>
          <button className="cyber-button mt-2" onClick={onEnterGame}>เข้าสู่ Network Learning Platform</button>
        </div>
      </section>

      {showProfile && <TeacherProfile />}

      <section id="activities" className="relative mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_minmax(280px,420px)_auto] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Teaching Portfolio</p>
            <h2 className="mt-2 text-3xl font-extrabold">กิจกรรมการสอน เครือข่ายคอมพิวเตอร์และความปลอดภัย</h2>
          </div>
          <label className="activity-search">
            <span>ค้นหาข่าว</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ค้นหาชื่อข่าว หมวดหมู่ หรือคำอธิบาย"
              type="search"
            />
          </label>
          <button className="nav-chip active" onClick={onEnterGame}>เริ่มเล่นเกม</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleActivities.map((activity) => (
            <button key={activity.id || activity.title} className="activity-card" type="button" onClick={() => setPreview(activity)}>
              <img src={activity.image} alt={activity.title} />
              {activityImages(activity).length > 1 && <b className="activity-count">+{activityImages(activity).length - 1} รูป</b>}
              <div className="p-4">
                <span>{activity.category}</span>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </div>
            </button>
          ))}
        </div>
        {visibleActivities.length === 0 && <p className="rounded-lg border border-cyber-line bg-white/5 p-4 text-slate-300">ไม่พบข่าวที่ตรงกับคำค้นหา</p>}
      </section>

      {preview && <ImagePreview activity={preview} onClose={() => setPreview(null)} />}
    </main>
  );
}

function ImagePreview({ activity, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="image-preview" role="dialog" aria-modal="true" aria-label={activity.title} onClick={onClose}>
      <button className="preview-close" type="button" onClick={onClose} aria-label="ปิดรูปภาพ">×</button>
      <figure className="preview-stage" onClick={(event) => event.stopPropagation()}>
        <img src={activity.image} alt={activity.title} />
        {activityImages(activity).length > 1 && (
          <div className="preview-thumbs">
            {activityImages(activity).slice(0, 3).map((image, index) => (
              <img key={image} src={image} alt={`${activity.title} ${index + 1}`} />
            ))}
          </div>
        )}
        <figcaption>
          <span>{activity.category}</span>
          <strong>{activity.title}</strong>
          <p>{activity.description}</p>
        </figcaption>
      </figure>
    </div>
  );
}

function TeacherProfile() {
  return (
    <section id="profile" className="relative mx-auto max-w-7xl px-4 pb-10 md:px-8">
      <div className="profile-panel">
        <div className="profile-visual">
          <img src={teacherProfile.image} alt={teacherProfile.name} />
        </div>
        <div className="profile-content">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Teacher Profile</p>
          <h2>{teacherProfile.name}</h2>
          <strong>{teacherProfile.title}</strong>
          <p>{teacherProfile.mission}</p>

          <div className="profile-meta">
            <span>{teacherProfile.department}</span>
            <span>{teacherProfile.college}</span>
            <span>{teacherProfile.email}</span>
          </div>

          <div className="profile-highlights">
            {teacherProfile.highlights.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div>
            <h3>ความสามารถพิเศษ</h3>
            <div className="skill-grid">
              {teacherProfile.specialties.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OSIGame({ onScore }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const score = selected.reduce((sum, item, index) => sum + (item.name === osiOrder[index]?.name ? 14 : 0), 0);
  const finalScore = Math.min(100, score + (selected.length === 7 && score === 98 ? 2 : 0));

  function choose(item) {
    if (submitted || selected.some((choice) => choice.name === item.name)) return;
    setSelected([...selected, item]);
  }

  function submit() {
    setSubmitted(true);
    onScore("osi", 1, finalScore);
  }

  return (
    <GameShell title="OSI Game" unit="หน่วยที่ 1" description="คลิกชั้น OSI ตามลำดับจาก Layer 7 ลงไป Layer 1">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-3">
          {osiChoices.map((item) => (
            <button key={item.name} onClick={() => choose(item)} className={`choice-button osi-choice ${item.tone}`} data-detail={item.detail} disabled={selected.some((choice) => choice.name === item.name)}>
              <strong>{item.name} Layer</strong>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-cyber-line bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-white">Answer Stack</h3>
            <span className="text-cyber-lime">{finalScore}/100</span>
          </div>
          <div className="grid gap-2">
            {osiOrder.map((target, index) => {
              const answer = selected[index];
              const correct = submitted && answer?.name === target.name;
              const wrong = submitted && answer && answer.name !== target.name;
              return (
                <div key={target.name} className={`osi-answer ${target.tone} ${correct ? "is-correct" : wrong ? "is-wrong" : ""}`}>
                  <span className="text-xs text-slate-400">Layer {target.layer}</span>
                  <strong className="block">{answer?.name || "รอคำตอบ"}</strong>
                </div>
              );
            })}
          </div>
          <button className="cyber-button mt-4" onClick={submit} disabled={selected.length !== 7 || submitted}>Submit OSI Score</button>
        </div>
      </div>
    </GameShell>
  );
}

function VLANPuzzle({ onScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const correctCount = vlanDevices.filter((device) => answers[device.id] === device.target).length;
  const score = Math.round((correctCount / vlanDevices.length) * 100);

  function submit() {
    setSubmitted(true);
    onScore("vlan", 2, score);
  }

  return (
    <GameShell title="VLAN Puzzle" unit="หน่วยที่ 2" description="เลือก VLAN ให้ตรงกับอุปกรณ์และบทบาทในองค์กร">
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="vlan-tag border-cyber-cyan text-cyber-cyan">VLAN 10 Staff</div>
        <div className="vlan-tag border-cyber-lime text-cyber-lime">VLAN 20 Student/Guest</div>
        <div className="vlan-tag border-cyber-violet text-cyber-violet">VLAN 30 Server/Admin</div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {vlanDevices.map((device) => {
          const isCorrect = submitted && answers[device.id] === device.target;
          const isWrong = submitted && answers[device.id] !== device.target;
          return (
            <label key={device.id} className={`rounded-lg border bg-slate-950/70 p-4 ${isCorrect ? "border-cyber-lime" : isWrong ? "border-cyber-rose" : "border-cyber-line"}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{device.unit}</span>
              <strong className="mt-2 block text-lg">{device.label}</strong>
              <select className="cyber-input mt-4" value={answers[device.id] || ""} onChange={(e) => setAnswers({ ...answers, [device.id]: e.target.value })}>
                <option value="">เลือก VLAN</option>
                <option value="10">VLAN 10</option>
                <option value="20">VLAN 20</option>
                <option value="30">VLAN 30</option>
              </select>
            </label>
          );
        })}
      </div>
      <button className="cyber-button mt-5" onClick={submit} disabled={Object.keys(answers).length !== vlanDevices.length}>Submit VLAN Score: {score}/100</button>
    </GameShell>
  );
}

function PacketSimulation({ onScore }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ dns: "", gateway: "", firewall: "" });
  const [submitted, setSubmitted] = useState(false);
  const quizScore = (answers.dns === "resolve" ? 25 : 0) + (answers.gateway === "router" ? 25 : 0) + (answers.firewall === "policy" ? 25 : 0);
  const progressScore = step === packetSteps.length - 1 ? 25 : Math.round((step / (packetSteps.length - 1)) * 25);
  const score = quizScore + progressScore;

  function submit() {
    setSubmitted(true);
    onScore("packet", 3, score);
  }

  return (
    <GameShell title="Packet Simulation" unit="หน่วยที่ 3" description="กดจำลอง packet และตอบคำถามเส้นทางเครือข่าย">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-cyber-line bg-slate-950/70 p-5">
          <div className="grid grid-cols-6 items-center gap-2 text-center text-xs font-bold md:text-sm">
            {["Client", "Switch", "Router", "DNS", "Firewall", "Server"].map((node, index) => (
              <div key={node} className={`rounded-lg border p-3 ${index <= step ? "border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan" : "border-cyber-line bg-white/5 text-slate-400"}`}>
                {node}
              </div>
            ))}
          </div>
          <div className="mt-5 h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-cyber-lime transition-all" style={{ width: `${(step / (packetSteps.length - 1)) * 100}%` }} />
          </div>
          <p className="mt-5 rounded-lg border border-cyber-line bg-white/5 p-4 text-lg font-bold">{packetSteps[step]}</p>
          <button className="cyber-button mt-4" onClick={() => setStep(Math.min(packetSteps.length - 1, step + 1))}>Next Hop</button>
        </div>
        <div className="grid gap-3 rounded-lg border border-cyber-line bg-slate-950/70 p-5">
          <QuizSelect label="DNS ทำหน้าที่อะไร" value={answers.dns} onChange={(value) => setAnswers({ ...answers, dns: value })} options={[["resolve", "แปลงชื่อเป็น IP"], ["encrypt", "เข้ารหัส frame"]]} />
          <QuizSelect label="Default gateway มักเป็นอุปกรณ์ใด" value={answers.gateway} onChange={(value) => setAnswers({ ...answers, gateway: value })} options={[["router", "Router"], ["switch", "Access switch"]]} />
          <QuizSelect label="Firewall ตรวจสอบอะไรเป็นหลัก" value={answers.firewall} onChange={(value) => setAnswers({ ...answers, firewall: value })} options={[["policy", "Policy/Rule"], ["voltage", "แรงดันสายสัญญาณ"]]} />
          <button className="cyber-button" onClick={submit} disabled={submitted || Object.values(answers).some((value) => !value)}>Submit Packet Score: {score}/100</button>
        </div>
      </div>
    </GameShell>
  );
}

function CableCrimping({ onScore }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const correctPins = selected.filter((color, index) => color === cableOrder[index]).length;
  const score = Math.round((correctPins / cableOrder.length) * 100);

  function choose(color) {
    if (submitted || selected.includes(color)) return;
    setSelected([...selected, color]);
  }

  function submit() {
    setSubmitted(true);
    onScore("cable", 4, score);
  }

  function undo() {
    if (submitted) return;
    setSelected(selected.slice(0, -1));
  }

  function clear() {
    if (submitted) return;
    setSelected([]);
  }

  return (
    <GameShell title="Cable Crimping" unit="หน่วยที่ 4" description="เรียงสีสาย UTP มาตรฐาน T568B จาก Pin 1 ถึง Pin 8">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-cyber-line bg-slate-950/70 p-5">
          <p className="mb-4 font-bold text-slate-300">Color tray</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {cableChoices.map((color) => (
              <button key={color} className="choice-button" onClick={() => choose(color)} disabled={selected.includes(color)}>
                <span className={`wire-swatch ${cableColorClass[color]}`} aria-hidden="true"></span>
                <strong>{color}</strong>
                <small>คลิกเพื่อวางลงหัว RJ45</small>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-cyber-line bg-slate-950/70 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-extrabold">RJ45 Pinout: T568B</h3>
            <span className="font-extrabold text-cyber-lime">{score}/100</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {cableOrder.map((target, index) => {
              const answer = selected[index];
              const correct = submitted && answer === target;
              const wrong = submitted && answer && answer !== target;
              return (
                <div key={target} className={`rounded-lg border p-3 ${correct ? "border-cyber-lime bg-cyber-lime/10" : wrong ? "border-cyber-rose bg-cyber-rose/10" : "border-cyber-line bg-white/5"}`}>
                  <span className="text-xs font-bold text-slate-400">Pin {index + 1}</span>
                  <span className={`wire-slot ${answer ? cableColorClass[answer] : ""}`} aria-hidden="true"></span>
                  <strong className="mt-2 block min-h-12">{answer || "รอสีสาย"}</strong>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 p-3 text-sm leading-6 text-slate-200">
            มาตรฐาน T568B: White-Orange, Orange, White-Green, Blue, White-Blue, Green, White-Brown, Brown
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="tool-button" onClick={undo} disabled={selected.length === 0 || submitted}>ย้อนกลับ</button>
            <button className="tool-button" onClick={clear} disabled={selected.length === 0 || submitted}>เคลียร์</button>
            <button className="cyber-button" onClick={submit} disabled={selected.length !== cableOrder.length || submitted}>Submit Cable Score</button>
          </div>
        </div>
      </div>
    </GameShell>
  );
}

function IPMatching({ onScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const correctCount = ipQuestions.filter((item) => answers[item.id] === item.answer).length;
  const score = Math.round((correctCount / ipQuestions.length) * 100);

  function submit() {
    setSubmitted(true);
    onScore("ip", 5, score);
  }

  return (
    <GameShell title="IP Matching" unit="หน่วยที่ 5" description="จับคู่ IP address ให้ตรงกับบทบาทของอุปกรณ์ในเครือข่าย">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {ipQuestions.map((item) => {
          const correct = submitted && answers[item.id] === item.answer;
          const wrong = submitted && answers[item.id] && answers[item.id] !== item.answer;
          return (
            <label key={item.id} className={`rounded-lg border bg-slate-950/70 p-4 ${correct ? "border-cyber-lime" : wrong ? "border-cyber-rose" : "border-cyber-line"}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.role}</span>
              <strong className="mt-2 block min-h-14">{item.prompt}</strong>
              <select className="cyber-input mt-4" value={answers[item.id] || ""} onChange={(event) => setAnswers({ ...answers, [item.id]: event.target.value })}>
                <option value="">เลือก IP</option>
                {ipChoices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
              </select>
            </label>
          );
        })}
      </div>
      <button className="cyber-button mt-5" onClick={submit} disabled={Object.keys(answers).length !== ipQuestions.length || submitted}>Submit IP Score: {score}/100</button>
    </GameShell>
  );
}

function NetworkDefense({ onScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const correctCount = defenseIncidents.filter((incident) => answers[incident.id] === incident.answer).length;
  const score = Math.round((correctCount / defenseIncidents.length) * 100);

  function submit() {
    setSubmitted(true);
    onScore("defense", 6, score);
  }

  return (
    <GameShell title="Network Defense" unit="หน่วยที่ 6 • Advanced" description="เลือกแนวทางป้องกันและตอบสนอง incident ให้เหมาะกับสถานการณ์เครือข่ายองค์กร">
      <div className="grid gap-4 xl:grid-cols-2">
        {defenseIncidents.map((incident) => {
          const correct = submitted && answers[incident.id] === incident.answer;
          const wrong = submitted && answers[incident.id] && answers[incident.id] !== incident.answer;
          return (
            <article key={incident.id} className={`rounded-lg border bg-slate-950/70 p-4 ${correct ? "border-cyber-lime" : wrong ? "border-cyber-rose" : "border-cyber-line"}`}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyber-rose">Incident</span>
              <h3 className="mt-2 text-lg font-extrabold">{incident.title}</h3>
              <div className="mt-4 grid gap-2">
                {incident.options.map(([value, label]) => (
                  <label key={value} className={`rounded-lg border p-3 ${answers[incident.id] === value ? "border-cyber-cyan bg-cyber-cyan/10" : "border-cyber-line bg-white/5"}`}>
                    <input
                      className="mr-2"
                      type="radio"
                      name={incident.id}
                      value={value}
                      checked={answers[incident.id] === value}
                      onChange={(event) => setAnswers({ ...answers, [incident.id]: event.target.value })}
                      disabled={submitted}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <button className="cyber-button mt-5" onClick={submit} disabled={Object.keys(answers).length !== defenseIncidents.length || submitted}>Submit Defense Score: {score}/100</button>
    </GameShell>
  );
}

function VirtualEnterpriseNetwork({ onScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const correctCount = enterpriseRequirements.filter((item) => answers[item.id] === item.answer).length;
  const score = Math.round((correctCount / enterpriseRequirements.length) * 100);

  function submit() {
    setSubmitted(true);
    onScore("enterprise", 7, score);
  }

  return (
    <GameShell title="Virtual Enterprise Network" unit="หน่วยที่ 7 • Advanced" description="ออกแบบ architecture เครือข่ายองค์กรเสมือน โดยจับคู่ requirement กับองค์ประกอบที่เหมาะสม">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-cyber-line bg-slate-950/70 p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Enterprise Brief</p>
          <h3 className="mt-2 text-2xl font-extrabold">HQ + Branch + DMZ + Wireless</h3>
          <p className="mt-3 leading-7 text-slate-300">
            องค์กรต้องการเครือข่ายที่รองรับผู้ใช้หลายแผนก บริการ public web, authentication กลาง, สาขาระยะไกล และระบบ monitoring สำหรับ incident response
          </p>
          <div className="mt-5 grid gap-2">
            {["Core", "Access", "DMZ", "Security", "Services", "Branch"].map((zone) => (
              <span key={zone} className="rounded-lg border border-cyber-line bg-white/5 px-3 py-2 text-sm font-bold text-slate-300">{zone}</span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {enterpriseRequirements.map((item) => {
            const correct = submitted && answers[item.id] === item.answer;
            const wrong = submitted && answers[item.id] && answers[item.id] !== item.answer;
            return (
              <label key={item.id} className={`rounded-lg border bg-slate-950/70 p-4 ${correct ? "border-cyber-lime" : wrong ? "border-cyber-rose" : "border-cyber-line"}`}>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Requirement</span>
                <strong className="mt-2 block min-h-12">{item.label}</strong>
                <select className="cyber-input mt-4" value={answers[item.id] || ""} onChange={(event) => setAnswers({ ...answers, [item.id]: event.target.value })} disabled={submitted}>
                  <option value="">เลือกองค์ประกอบ</option>
                  {enterpriseOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            );
          })}
        </div>
      </div>
      <button className="cyber-button mt-5" onClick={submit} disabled={Object.keys(answers).length !== enterpriseRequirements.length || submitted}>Submit Enterprise Score: {score}/100</button>
    </GameShell>
  );
}

function QuizSelect({ label, value, onChange, options }) {
  return (
    <label>
      <span className="mb-2 block font-bold text-slate-300">{label}</span>
      <select className="cyber-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">เลือกคำตอบ</option>
        {options.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}
      </select>
    </label>
  );
}

function GameShell({ title, unit, description, children }) {
  return (
    <section className="rounded-lg border border-cyber-line bg-cyber-panel/88 p-4 shadow-glow md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">{unit}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">{title}</h2>
          <p className="mt-2 text-slate-300">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ActiveUnitGame({ game, onScore }) {
  const visual = gameVisuals[game.key] || unitGameCatalog.find((item) => item.unit_id === game.unit_id) || {};
  const scenario = professionalGameScenarios[game.unit_id] || defaultProfessionalScenario;
  const [answers, setAnswers] = useState({});
  const [activeRound, setActiveRound] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const selectedOptions = scenario.challenges.map((challenge, index) => challenge.options[answers[index]]).filter(Boolean);
  const score = boundedPercent(selectedOptions.reduce((sum, option) => sum + option.score, 0));
  const metrics = selectedOptions.reduce((totals, option) => ({
    reliability: totals.reliability + (option.metrics?.reliability || 0),
    security: totals.security + (option.metrics?.security || 0),
    performance: totals.performance + (option.metrics?.performance || 0),
    cost: totals.cost + (option.metrics?.cost || 0)
  }), { reliability: 62, security: 62, performance: 62, cost: 62 });
  const metricRows = [
    ["Reliability", boundedPercent(metrics.reliability)],
    ["Security", boundedPercent(metrics.security)],
    ["Performance", boundedPercent(metrics.performance)],
    ["Budget Fit", boundedPercent(metrics.cost)]
  ];
  const currentChallenge = scenario.challenges[activeRound] || scenario.challenges[0];
  const answeredCount = Object.keys(answers).length;

  function choose(optionIndex) {
    setSubmitted(false);
    setAnswers((current) => ({ ...current, [activeRound]: optionIndex }));
    if (activeRound < scenario.challenges.length - 1) {
      window.setTimeout(() => setActiveRound((round) => Math.min(round + 1, scenario.challenges.length - 1)), 180);
    }
  }

  function submit() {
    setSubmitted(true);
    onScore(game.key, game.unit_id, score);
  }

  return (
    <GameShell title={game.title} unit={`Unit ${game.unit_id} • Active Game`} description={game.objective}>
      <div className="pro-game-stage">
        <div className="pro-game-brief">
          <div className="pro-game-visual">
            <img src={visual.image || "/assets/smart-network-logo.png"} alt="" />
            <strong>{visual.icon || `U${game.unit_id}`}</strong>
          </div>
          <p className="ops-eyebrow"><span /> Professional Simulation</p>
          <h3>{scenario.role}</h3>
          <p>{scenario.scenario}</p>
          <div className="pro-game-goal">
            <span>Mission Goal</span>
            <strong>{scenario.goal}</strong>
          </div>
          <div className="pro-kpi-list">
            {scenario.kpis.map((kpi) => <span key={kpi}>{kpi}</span>)}
          </div>
        </div>

        <div className="pro-game-console">
          <div className="pro-game-topline">
            <div>
              <p className="ops-eyebrow"><span /> Decision Round {activeRound + 1}/{scenario.challenges.length}</p>
              <h3>{currentChallenge.title}</h3>
              <p>{currentChallenge.prompt}</p>
            </div>
            <div className="pro-game-score">
              <span>Score</span>
              <strong>{score}</strong>
            </div>
          </div>

          <div className="pro-round-tabs">
            {scenario.challenges.map((challenge, index) => (
              <button
                key={challenge.title}
                className={[index === activeRound ? "active" : "", answers[index] !== undefined ? "done" : ""].filter(Boolean).join(" ")}
                type="button"
                onClick={() => setActiveRound(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="pro-choice-grid">
            {currentChallenge.options.map((option, optionIndex) => {
              const isSelected = answers[activeRound] === optionIndex;
              return (
                <button
                  key={option.label}
                  type="button"
                  className={`pro-choice ${isSelected ? "selected" : ""}`}
                  onClick={() => choose(optionIndex)}
                >
                  <span>{option.score} pts</span>
                  <strong>{option.label}</strong>
                  <small>{option.impact}</small>
                </button>
              );
            })}
          </div>

          <div className="pro-metric-grid">
            {metricRows.map(([label, value]) => (
              <div key={label} className="pro-meter">
                <div><span>{label}</span><strong>{value}%</strong></div>
                <i><b style={{ width: `${value}%` }} /></i>
              </div>
            ))}
          </div>

          <div className="pro-decision-log">
            <strong>Decision Log</strong>
            {scenario.challenges.map((challenge, index) => (
              <p key={challenge.title}>
                <span>{index + 1}</span>
                {answers[index] === undefined ? "รอการตัดสินใจ" : challenge.options[answers[index]].label}
              </p>
            ))}
          </div>

          <div className="active-game-actions">
            <button className="tool-button" type="button" onClick={() => { setAnswers({}); setSubmitted(false); setActiveRound(0); }}>
              Reset Mission
            </button>
            <button className="cyber-button" type="button" disabled={answeredCount !== scenario.challenges.length} onClick={submit}>
              Submit Professional Mission
            </button>
          </div>
          {submitted && (
            <p className={score >= 80 ? "answer-note correct" : "answer-note wrong"}>
              {score >= 80 ? "ผ่านภารกิจระดับมืออาชีพและบันทึกคะแนนแล้ว" : "ยังไม่ผ่าน ลองปรับ decision log ให้ลดความเสี่ยงและมีหลักฐานตรวจสอบมากขึ้น"}
            </p>
          )}
        </div>
      </div>
    </GameShell>
  );
}

function Leaderboard({ rows, activeGame, onGameChange }) {
  return (
    <section className="rounded-lg border border-cyber-line bg-cyber-panel/88 p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Leaderboard</p>
          <h2 className="mt-2 text-2xl font-extrabold">อันดับคะแนน</h2>
        </div>
        <select className="cyber-input max-w-52" value={activeGame} onChange={(e) => onGameChange(e.target.value)}>
          <option value="all">All Games</option>
          {classicGameCatalog.map((game) => <option key={game.key} value={game.key}>{game.title}</option>)}
          {unitGameCatalog.map((game) => <option key={game.key} value={game.key}>{game.title}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead className="text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="py-3">Rank</th>
              <th>Student</th>
              <th>Group</th>
              <th>Completed</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-t border-cyber-line/80">
                <td className="py-4 font-extrabold text-cyber-lime">#{index + 1}</td>
                <td><strong>{row.name}</strong><span className="block text-sm text-slate-400">{row.student_code}</span></td>
                <td>{row.group_name}</td>
                <td>{row.completed_games}</td>
                <td className="text-xl font-extrabold text-cyber-cyan">{row.total_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="rounded-lg border border-cyber-line bg-white/5 p-4 text-slate-300">ยังไม่มีคะแนนในกระดานนี้</p>}
      </div>
    </section>
  );
}

function Units({ units }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {units.map((unit) => (
        <article key={unit.id} className="rounded-lg border border-cyber-line bg-white/5 p-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyber-lime">Unit {unit.id} • {unit.hours} hrs</span>
          <h3 className="mt-2 font-extrabold">{unit.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{unit.competency}</p>
          <span className="mt-3 inline-flex rounded-md border border-cyber-cyan/40 px-2 py-1 text-xs text-cyber-cyan">{gameLabels[unit.game]}</span>
        </article>
      ))}
    </section>
  );
}

function boundedPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function learnerStage(percent) {
  if (percent >= 80) return { label: "Mastery", tone: "online", note: "พร้อมต่อยอด/ช่วยเพื่อน" };
  if (percent >= 50) return { label: "In Progress", tone: "busy", note: "กำลังพัฒนาสมรรถนะ" };
  if (percent > 0) return { label: "Need Support", tone: "pending", note: "ควรติดตามและเสริมแรง" };
  return { label: "Not Started", tone: "idle", note: "รอเริ่มกิจกรรม" };
}

function AnimatedLearningMap({ items }) {
  const zones = [
    { key: "lesson", title: "Lesson Studio", label: "อ่านเนื้อหา", x: 17, y: 27, image: "/assets/new-activities/classroom-network-lesson.jpg" },
    { key: "lab", title: "Network Lab", label: "ใบงาน/ปฏิบัติ", x: 56, y: 23, image: "/assets/activities/fiber-otdr.jpg" },
    { key: "game", title: "Game Arena", label: "เกมประจำหน่วย", x: 33, y: 66, image: "/assets/new-activities/roblox-quiz-coding.jpg" },
    { key: "assessment", title: "Assessment Hub", label: "แบบทดสอบท้ายบท", x: 73, y: 61, image: "/assets/new-activities/fortigate-dashboard.jpg" }
  ];
  const activeStep = zones.reduce((best, zone, index) => {
    const percent = boundedPercent(items[index]?.percent || 0);
    return percent < best.percent ? { ...zone, percent, index } : best;
  }, { ...zones[0], percent: 100, index: 0 });

  return (
    <div className="learning-city" aria-label="แผนที่กิจกรรมการเรียนรู้แบบเคลื่อนไหว">
      <div className="city-backdrop">
        {zones.map((zone, index) => (
          <img key={zone.key} src={zone.image} alt="" style={{ "--delay": `${index * -3}s` }} />
        ))}
      </div>
      <div className="city-routes" />
      {zones.map((zone, index) => {
        const item = items[index] || {};
        const stage = learnerStage(item.percent);
        return (
          <div className={`learning-zone ${stage.tone}`} key={zone.key} style={{ left: `${zone.x}%`, top: `${zone.y}%`, "--delay": `${index * 0.7}s` }}>
            <span className="zone-pulse" />
            <strong>{zone.title}</strong>
            <small>{zone.label} • {boundedPercent(item.percent)}%</small>
          </div>
        );
      })}
      <RunningStatusAgent
        label={activeStep.label}
        status={activeStep.percent >= 80 ? "กำลังส่งต่อภารกิจ" : activeStep.percent > 0 ? "กำลังประมวลผล" : "รอเริ่มงาน"}
        tone={activeStep.percent >= 80 ? "online" : activeStep.percent > 0 ? "busy" : "pending"}
      />
      <div className="city-live-badge">
        <i /> LIVE ACTIVITY
      </div>
    </div>
  );
}

function RunningStatusAgent({ label, status, tone = "online" }) {
  return (
    <div className={`running-agent ${tone}`} aria-label={`ตัวการ์ตูนแสดงสถานะ ${label} ${status}`}>
      <div className="agent-speech">
        <strong>{label}</strong>
        <span>{status}</span>
      </div>
      <div className="agent-body">
        <span className="agent-antenna" />
        <span className="agent-eye left" />
        <span className="agent-eye right" />
        <span className="agent-mouth" />
        <span className="agent-arm left" />
        <span className="agent-arm right" />
        <span className="agent-leg left" />
        <span className="agent-leg right" />
      </div>
      <span className="agent-shadow" />
    </div>
  );
}

function LearningOpsDashboard({ user, games = [], scores = [], attempts = [], overview, adminSummary, recent = [] }) {
  const scoreMap = Object.fromEntries((scores || []).map((score) => [score.game_key, score]));
  const gameItems = games.map((game) => {
    const score = scoreMap[game.key];
    const percent = boundedPercent(score?.score || 0);
    return {
      id: game.key,
      label: game.title,
      sublabel: `Unit ${game.unit_id}`,
      percent,
      attempts: score?.attempts || 0,
      stage: learnerStage(percent)
    };
  });

  const lmsUnits = overview?.units || [];
  const lmsPercent = lmsUnits.length
    ? boundedPercent(lmsUnits.reduce((sum, unit) => sum + (unit.progress?.percent || 0), 0) / lmsUnits.length)
    : boundedPercent(adminSummary?.avgMastery || 0);
  const completedUnits = overview?.summary?.completedUnits ?? adminSummary?.completedUnits ?? 0;
  const totalUnits = overview?.summary?.totalUnits ?? adminSummary?.totalUnits ?? 15;
  const totalLearners = adminSummary?.totalLearners;
  const activeLearners = adminSummary?.activeLearners;
  const masteryStage = learnerStage(lmsPercent);
  const mapItems = [
    { percent: lmsUnits.filter((unit) => unit.progress?.lesson_viewed).length / Math.max(1, lmsUnits.length) * 100 || lmsPercent },
    { percent: lmsUnits.filter((unit) => unit.progress?.game_score).length / Math.max(1, lmsUnits.length) * 100 || boundedPercent(adminSummary?.avgGame || 0) },
    { percent: gameItems.length ? gameItems.reduce((sum, item) => sum + item.percent, 0) / gameItems.length : boundedPercent(adminSummary?.avgGame || 0) },
    { percent: lmsPercent }
  ];
  const activityFeed = (recent.length ? recent : attempts).slice(0, 6);

  return (
    <section className="learning-ops">
      <div className="ops-main">
        <div className="ops-hero">
          <div>
            <p className="ops-eyebrow"><span /> Learning Operations Center</p>
            <h2>{adminSummary ? "สถานะการเรียนรู้ผู้เรียนทั้งระบบ" : "สถานะการเรียนรู้ของผู้เรียน"}</h2>
            <p>
              {adminSummary
                ? "ติดตามภาพรวมการเรียน บทเรียน เกม แบบทดสอบ และกิจกรรมล่าสุดในรูปแบบ active dashboard"
                : `${user?.name || "ผู้เรียน"} กำลังเชื่อมต่อระบบ LMS และเกมฝึกสมรรถนะเครือข่ายแบบต่อเนื่อง`}
            </p>
          </div>
          <div className={`ops-status ${masteryStage.tone}`}>
            <small>{masteryStage.label}</small>
            <strong>{lmsPercent}%</strong>
            <span>{masteryStage.note}</span>
          </div>
        </div>

        <AnimatedLearningMap items={mapItems} />

        <div className="ops-metrics">
          <div>
            <span>{adminSummary ? "Learners" : "LMS Units"}</span>
            <strong>{adminSummary ? totalLearners || 0 : `${completedUnits}/${totalUnits}`}</strong>
            <small>{adminSummary ? `${activeLearners || 0} คนมีกิจกรรมล่าสุด` : "หน่วยที่สำเร็จ"}</small>
          </div>
          <div>
            <span>Game Avg</span>
            <strong>{boundedPercent(adminSummary?.avgGame ?? (gameItems.reduce((sum, item) => sum + item.percent, 0) / Math.max(1, gameItems.length)))}</strong>
            <small>คะแนนเฉลี่ยกิจกรรม/เกม</small>
          </div>
          <div>
            <span>Assessment</span>
            <strong>{boundedPercent(adminSummary?.avgQuiz ?? ((overview?.summary?.averageChapterScore || 0) * 10))}</strong>
            <small>ความพร้อมแบบทดสอบ</small>
          </div>
        </div>
      </div>

      <aside className="ops-side">
        <div className="ops-panel">
          <div className="ops-panel-head">
            <strong>{adminSummary ? "Learner Status" : "Mission Status"}</strong>
            <span><i /> ACTIVE</span>
          </div>
          <div className="ops-list">
            {(adminSummary?.learners || gameItems).slice(0, 7).map((item) => {
              const percent = boundedPercent(item.percent ?? item.mastery_index);
              const stage = learnerStage(percent);
              return (
                <div className="ops-row" key={item.id || item.student_code || item.label}>
                  <div>
                    <strong>{item.name || item.label}</strong>
                    <small>{item.group_name || item.sublabel || item.student_code}</small>
                  </div>
                  <span className={`status-pill ${stage.tone}`}>{stage.label}</span>
                  <em>{percent}%</em>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ops-panel">
          <div className="ops-panel-head">
            <strong>Activity Log</strong>
            <span><i /> STREAM</span>
          </div>
          <div className="activity-stream">
            {activityFeed.map((item, index) => (
              <div key={`${item.id || index}-${item.created_at || item.submitted_at || index}`} style={{ "--delay": `${index * 0.25}s` }}>
                <span>{item.created_at || item.submitted_at || "live"}</span>
                <strong>{item.name || gameLabels[item.game_key] || item.unit_title || "Learning activity"}</strong>
                <small>{gameLabels[item.game_key] || item.student_code || item.title || `score ${item.score || 0}/${item.max_score || 100}`}</small>
              </div>
            ))}
            {activityFeed.length === 0 && <p>ยังไม่มีกิจกรรมล่าสุด ระบบพร้อมบันทึกเมื่อผู้เรียนเริ่มใช้งาน</p>}
          </div>
        </div>
      </aside>
    </section>
  );
}

function ProgressPanel({ games, scores, attempts, onOpenGame }) {
  const scoreMap = Object.fromEntries((scores || []).map((score) => [score.game_key, score]));
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="rounded-lg border border-cyber-line bg-cyber-panel/88 p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Learning Progress</p>
            <h2 className="mt-2 text-2xl font-extrabold">Mission status</h2>
          </div>
          <span className="rounded-md border border-cyber-lime/40 px-3 py-1 text-sm font-bold text-cyber-lime">
            Pass target 80+
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => {
            const score = scoreMap[game.key];
            const value = score?.score || 0;
            const visual = gameVisuals[game.key] || {};
            return (
              <article key={game.key} className="mission-card">
                <div className="mission-visual">
                  <img src={visual.image} alt={game.title} />
                  <span className="mission-icon">{visual.icon || game.unit_id}</span>
                  <small>{visual.activity}</small>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Unit {game.unit_id}</span>
                    <h3 className="mt-1 font-extrabold">{game.title}</h3>
                  </div>
                  <strong className={value >= 80 ? "text-cyber-lime" : "text-cyber-cyan"}>{value}</strong>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-cyber-cyan" style={{ width: `${value}%` }} />
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{game.objective}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">Attempts: {score?.attempts || 0}</span>
                  <button className="rounded-md border border-cyber-cyan/40 px-3 py-2 text-sm font-bold text-cyber-cyan hover:bg-cyber-cyan/10" onClick={() => onOpenGame(game.key)}>
                    Play
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <RecentAttempts attempts={attempts} />
    </section>
  );
}

function GameHub({ games = [], scores = [], onOpenGame }) {
  const scoreMap = Object.fromEntries((scores || []).map((score) => [score.game_key, score]));
  const allGames = [...classicGameCatalog, ...games];

  return (
    <section className="game-hub">
      <div className="game-hub-hero">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Game Center</p>
          <h1>เลือกเกมฝึกทักษะ</h1>
          <p>รวมเกมทั้งหมดไว้ในหน้าเดียว กดเล่นได้ทันที คะแนนผ่านเป้าหมายคือ 80 คะแนนขึ้นไป</p>
        </div>
        <div className="game-hub-score">
          <span>ทั้งหมด</span>
          <strong>{allGames.length}</strong>
          <small>เกม</small>
        </div>
      </div>

      <div className="game-hub-list">
        {allGames.map((game) => {
          const score = scoreMap[game.key];
          const bestScore = score?.score || 0;
          const visual = gameVisuals[game.key] || unitGameCatalog.find((item) => item.unit_id === game.unit_id) || {};
          const isClassic = classicGameCatalog.some((item) => item.key === game.key);
          return (
            <article className="game-launch-card" key={game.key}>
              <div className="game-launch-media">
                {visual.image ? <img src={visual.image} alt={game.title} /> : <span>{visual.icon || game.unit_id}</span>}
              </div>
              <div className="game-launch-body">
                <div className="game-launch-topline">
                  <span>{isClassic ? "Classic Game" : `Unit ${game.unit_id}`}</span>
                  <strong className={bestScore >= 80 ? "text-cyber-lime" : "text-cyber-cyan"}>{bestScore}/100</strong>
                </div>
                <h2>{game.navTitle || game.title}</h2>
                <p>{game.objective || (game.key === "osi" ? "ฝึกเรียงลำดับและจับคู่หน้าที่ของ OSI Model ทั้ง 7 ชั้น" : "ฝึกเรียงสีสาย UTP และมาตรฐาน RJ45 ให้ถูกต้อง")}</p>
                <div className="game-launch-meta">
                  <span>{score?.attempts || 0} attempts</span>
                  <span className={bestScore >= 80 ? "passed" : ""}>{bestScore >= 80 ? "ผ่าน mission" : "ยังไม่ผ่าน mission"}</span>
                </div>
              </div>
              <button className="game-launch-button" onClick={() => onOpenGame(game.key)} type="button">
                เล่นเกม
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RecentAttempts({ attempts = [] }) {
  return (
    <aside className="rounded-lg border border-cyber-line bg-cyber-panel/88 p-4 md:p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Attempt Log</p>
      <h2 className="mt-2 text-2xl font-extrabold">เล่นล่าสุด</h2>
      <div className="mt-4 grid gap-3">
        {attempts.slice(0, 6).map((attempt) => (
          <div key={attempt.id} className="rounded-lg border border-cyber-line bg-slate-950/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <strong>{gameLabels[attempt.game_key]}</strong>
              <span className="font-extrabold text-cyber-cyan">{attempt.score}/{attempt.max_score}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Unit {attempt.unit_id} • {attempt.created_at}</p>
          </div>
        ))}
        {attempts.length === 0 && (
          <p className="rounded-lg border border-cyber-line bg-white/5 p-4 text-sm leading-6 text-slate-400">
            ยังไม่มีประวัติการเล่น เริ่มจากเกมใดก็ได้เพื่อบันทึก attempt แรก
          </p>
        )}
      </div>
    </aside>
  );
}

function AdminPanel({ onBack, theme, onToggleTheme }) {
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem("nlp-admin") || "null"));
  const [login, setLogin] = useState({ username: "admin", password: "" });
  const [adminSection, setAdminSection] = useState("overview");
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activityPage, setActivityPage] = useState(1);
  const [activityCategories, setActivityCategories] = useState(defaultActivityCategories.map((name, index) => ({ id: `seed-${index}`, name })));
  const [lmsUnits, setLmsUnits] = useState([]);
  const [lmsUnitForm, setLmsUnitForm] = useState(lmsUnitToForm(null));
  const lmsUnitFormRef = useRef(lmsUnitForm);
  const [categoryForm, setCategoryForm] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [stats, setStats] = useState(null);
  const [lmsReport, setLmsReport] = useState(null);
  const [learnerReport, setLearnerReport] = useState(null);
  const [form, setForm] = useState({ student_code: "", name: "", group_name: "", role: "student" });
  const [editingId, setEditingId] = useState(null);
  const [activityForm, setActivityForm] = useState({
    title: "",
    category: "Network Lesson",
    image: "/assets/new-activities/classroom-network-lesson.jpg",
    image_2: "",
    image_3: "",
    description: "",
    content: "",
    is_published: true
  });
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const activityPageSize = 10;
  const activityTotalPages = Math.max(1, Math.ceil(activities.length / activityPageSize));
  const pagedActivities = activities.slice((activityPage - 1) * activityPageSize, activityPage * activityPageSize);
  const adminLearningSummary = useMemo(() => {
    const learners = (lmsReport?.learnerProgress || []).map((learner) => ({
      ...learner,
      percent: learner.mastery_index || 0
    }));
    const totalLearners = learners.length;
    const activeLearners = learners.filter((learner) => Number(learner.chapter_attempts || 0) > 0 || Number(learner.game_completed || 0) > 0).length;
    const avgMastery = totalLearners ? learners.reduce((sum, learner) => sum + Number(learner.mastery_index || 0), 0) / totalLearners : 0;
    const avgQuiz = totalLearners ? learners.reduce((sum, learner) => sum + Number(learner.avg_chapter || 0) * 10, 0) / totalLearners : 0;
    const avgGame = totalLearners ? learners.reduce((sum, learner) => sum + Number(learner.avg_game_score || 0), 0) / totalLearners : 0;
    const completedUnits = learners.reduce((sum, learner) => sum + Number(learner.completed_units || 0), 0);
    return { learners, totalLearners, activeLearners, avgMastery, avgQuiz, avgGame, completedUnits, totalUnits: 15 * Math.max(1, totalLearners) };
  }, [lmsReport]);
  const adminSections = [
    { key: "overview", label: "ภาพรวม" },
    { key: "activities", label: "ข่าวกิจกรรม" },
    { key: "categories", label: "หมวดหมู่" },
    { key: "learners", label: "ผู้เรียน" },
    { key: "unitContent", label: "จัดการหน่วยเรียน" },
    { key: "lms", label: "รายงานผล LMS" },
    { key: "learnerAnalytics", label: "วิเคราะห์ผู้เรียน" },
    { key: "analytics", label: "สถิติ" }
  ];

  useEffect(() => {
    lmsUnitFormRef.current = lmsUnitForm;
  }, [lmsUnitForm]);

  function updateLmsUnitForm(updater) {
    setLmsUnitForm((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      lmsUnitFormRef.current = next;
      return next;
    });
  }

  async function adminRequest(path, options = {}) {
    return api(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": admin?.token,
        ...(options.headers || {})
      }
    });
  }

  async function loadAdminData() {
    const [nextStats, nextUsers, nextActivities, nextCategories, nextLmsReport, nextLmsUnits] = await Promise.all([
      adminRequest("/api/admin/stats"),
      adminRequest("/api/admin/users"),
      adminRequest("/api/admin/activities"),
      adminRequest("/api/admin/activity-categories"),
      adminRequest("/api/admin/lms-report"),
      adminRequest("/api/admin/lms-units")
    ]);
    setStats(nextStats);
    setUsers(nextUsers);
    setLmsReport(nextLmsReport);
    setLmsUnits(nextLmsUnits);
    setLmsUnitForm((current) => {
      const match = nextLmsUnits.find((unit) => unit.id === current.id) || nextLmsUnits[0];
      const next = lmsUnitToForm(match);
      lmsUnitFormRef.current = next;
      return next;
    });
    setActivities(nextActivities);
    setActivityPage((page) => Math.min(page, Math.max(1, Math.ceil(nextActivities.length / activityPageSize))));
    setActivityCategories(nextCategories.length ? nextCategories : defaultActivityCategories.map((name, index) => ({ id: `seed-${index}`, name })));
  }

  async function loadLearnerReport(userId) {
    const detail = await adminRequest(`/api/admin/lms-learners/${userId}`);
    setLearnerReport(detail);
    setAdminSection("learnerAnalytics");
  }

  function selectLmsUnit(unit) {
    setError("");
    setNotice("");
    updateLmsUnitForm(lmsUnitToForm(unit));
  }

  function updateLmsUnitArray(field, index, value) {
    setLmsUnitForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => itemIndex === index ? value : item)
    }));
  }

  function addLmsUnitArrayItem(field) {
    setLmsUnitForm((current) => ({ ...current, [field]: [...(current[field] || []), ""] }));
  }

  function removeLmsUnitArrayItem(field, index) {
    setLmsUnitForm((current) => {
      const next = (current[field] || []).filter((_, itemIndex) => itemIndex !== index);
      return { ...current, [field]: next.length ? next : [""] };
    });
  }

  function updateLessonSection(index, updates) {
    updateLmsUnitForm((current) => ({
      ...current,
      lesson_sections: (current.lesson_sections || []).map((section, sectionIndex) => (
        sectionIndex === index ? { ...section, ...updates } : section
      ))
    }));
  }

  function addLessonSection() {
    updateLmsUnitForm((current) => ({
      ...current,
      lesson_sections: [
        ...(current.lesson_sections || []),
        { title: "", detail: "", caption: "", images: [], content_images: [] }
      ]
    }));
  }

  function removeLessonSection(index) {
    updateLmsUnitForm((current) => ({
      ...current,
      lesson_sections: (current.lesson_sections || []).filter((_, sectionIndex) => sectionIndex !== index)
    }));
  }

  function updateLessonSectionImage(sectionIndex, imageIndex, value, field = "images") {
    updateLmsUnitForm((current) => ({
      ...current,
      lesson_sections: (current.lesson_sections || []).map((section, index) => {
        if (index !== sectionIndex) return section;
        const images = [...(section[field] || [])];
        images[imageIndex] = value;
        return { ...section, [field]: images };
      })
    }));
  }

  function addLessonSectionImage(sectionIndex, field = "images") {
    updateLmsUnitForm((current) => ({
      ...current,
      lesson_sections: (current.lesson_sections || []).map((section, index) => (
        index === sectionIndex ? { ...section, [field]: [...(section[field] || []), ""] } : section
      ))
    }));
  }

  function removeLessonSectionImage(sectionIndex, imageIndex, field = "images") {
    updateLmsUnitForm((current) => ({
      ...current,
      lesson_sections: (current.lesson_sections || []).map((section, index) => (
        index === sectionIndex
          ? { ...section, [field]: (section[field] || []).filter((_, currentImageIndex) => currentImageIndex !== imageIndex) }
          : section
      ))
    }));
  }

  async function submitLmsUnit(event) {
    event.preventDefault();
    const currentForm = lmsUnitFormRef.current;
    if (!currentForm.id) return;
    setError("");
    setNotice("");
    try {
      const updated = await adminRequest(`/api/admin/lms-units/${currentForm.id}`, {
        method: "PUT",
        body: JSON.stringify(cleanUnitPayload(currentForm))
      });
      setLmsUnits((current) => current.map((unit) => unit.id === updated.id ? updated : unit).sort((a, b) => a.unit_no - b.unit_no));
      updateLmsUnitForm(lmsUnitToForm(updated));
      await loadAdminData();
      setNotice(`บันทึกเนื้อหาหน่วยที่ ${updated.unit_no} แล้ว`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveLmsUnitDraft(nextForm, message) {
    updateLmsUnitForm(nextForm);
    if (!nextForm.id) return;
    const updated = await adminRequest(`/api/admin/lms-units/${nextForm.id}`, {
      method: "PUT",
      body: JSON.stringify(cleanUnitPayload(nextForm))
    });
    setLmsUnits((current) => current.map((unit) => unit.id === updated.id ? updated : unit).sort((a, b) => a.unit_no - b.unit_no));
    updateLmsUnitForm(lmsUnitToForm(updated));
    setNotice(message || `บันทึกเนื้อหาหน่วยที่ ${updated.unit_no} แล้ว`);
  }

  async function saveCurrentLmsUnitImages() {
    const currentForm = lmsUnitFormRef.current;
    if (!currentForm.id) return;
    setError("");
    setNotice("");
    try {
      await saveLmsUnitDraft(currentForm, "บันทึกรูปภาพของหน่วยเรียนแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (admin?.token) loadAdminData().catch((err) => setError(err.message));
  }, [admin?.token]);

  async function submitLogin(event) {
    event.preventDefault();
    setError("");
    try {
      const nextAdmin = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(login)
      });
      setAdmin(nextAdmin);
      localStorage.setItem("nlp-admin", JSON.stringify(nextAdmin));
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitUser(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const path = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
    const method = editingId ? "PUT" : "POST";
    try {
      await adminRequest(path, { method, body: JSON.stringify(form) });
      setForm({ student_code: "", name: "", group_name: "", role: "student" });
      setEditingId(null);
      await loadAdminData();
      setNotice(method === "PUT" ? "บันทึกการแก้ไขผู้เรียนแล้ว" : "เพิ่มผู้เรียนแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  function editUser(user) {
    setError("");
    setNotice("เลือกผู้เรียนแล้ว แก้ไขข้อมูลในฟอร์มด้านบนแล้วกดบันทึก");
    setEditingId(user.id);
    setForm({ student_code: user.student_code, name: user.name, group_name: user.group_name, role: user.role || "student" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteUser(id) {
    if (!window.confirm("ลบผู้เรียนและคะแนนทั้งหมดของผู้เรียนนี้?")) return;
    setError("");
    setNotice("");
    try {
      await adminRequest(`/api/admin/users/${id}`, { method: "DELETE" });
      if (editingId === id) {
        setEditingId(null);
        setForm({ student_code: "", name: "", group_name: "", role: "student" });
      }
      await loadAdminData();
      setNotice("ลบผู้เรียนและคะแนนที่เกี่ยวข้องแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  function resetActivityForm() {
    setEditingActivityId(null);
    setActivityForm({
      title: "",
      category: activityCategories[0]?.name || "Network Lesson",
      image: "/assets/new-activities/classroom-network-lesson.jpg",
      image_2: "",
      image_3: "",
      description: "",
      content: "",
      is_published: true
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadActivityImages(files) {
    const selectedFiles = Array.from(files).slice(0, 3);
    if (!selectedFiles.length) return;
    setError("");
    setNotice("");
    try {
      const payloadFiles = await Promise.all(selectedFiles.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await readFileAsDataUrl(file)
      })));
      const result = await adminRequest("/api/admin/uploads", {
        method: "POST",
        body: JSON.stringify({ files: payloadFiles })
      });
      const [image, image_2, image_3] = result.paths;
      setActivityForm((current) => ({
        ...current,
        image: image || current.image,
        image_2: image_2 || current.image_2,
        image_3: image_3 || current.image_3
      }));
      setNotice("อัปโหลดรูปภาพแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  async function uploadLmsUnitImage(files) {
    const selectedFile = Array.from(files)[0];
    if (!selectedFile) return;
    setError("");
    setNotice("");
    try {
      const result = await adminRequest("/api/admin/uploads", {
        method: "POST",
        body: JSON.stringify({
          files: [{
            name: selectedFile.name,
            type: selectedFile.type,
            data: await readFileAsDataUrl(selectedFile)
          }]
        })
      });
      const currentForm = lmsUnitFormRef.current;
      const nextForm = { ...currentForm, image: result.paths?.[0] || currentForm.image };
      await saveLmsUnitDraft(nextForm, "อัปโหลดและบันทึกรูปหน้าปกหน่วยเรียนแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  async function uploadLessonSectionImages(sectionIndex, files, field = "images") {
    const selectedFiles = Array.from(files).slice(0, 6);
    if (!selectedFiles.length) return;
    setError("");
    setNotice("");
    try {
      const payloadFiles = await Promise.all(selectedFiles.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await readFileAsDataUrl(file)
      })));
      const result = await adminRequest("/api/admin/uploads", {
        method: "POST",
        body: JSON.stringify({ files: payloadFiles })
      });
      const paths = result.paths || [];
      const currentForm = lmsUnitFormRef.current;
      const nextForm = {
        ...currentForm,
        lesson_sections: (currentForm.lesson_sections || []).map((section, index) => (
          index === sectionIndex
            ? { ...section, [field]: [...normalizeImageList(section[field]), ...paths].slice(0, 6) }
            : section
        ))
      };
      await saveLmsUnitDraft(nextForm, field === "content_images" ? "อัปโหลดและบันทึกรูปในเนื้อหาแล้ว" : "อัปโหลดและบันทึกรูปบทเรียนแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitCategory(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const name = categoryForm.trim();
    if (!name) return;
    const path = editingCategoryId ? `/api/admin/activity-categories/${editingCategoryId}` : "/api/admin/activity-categories";
    const method = editingCategoryId ? "PUT" : "POST";
    try {
      await adminRequest(path, { method, body: JSON.stringify({ name }) });
      setCategoryForm("");
      setEditingCategoryId(null);
      await loadAdminData();
      setNotice(editingCategoryId ? "แก้ไขหมวดหมู่แล้ว" : "เพิ่มหมวดหมู่แล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  function editCategory(category) {
    setEditingCategoryId(category.id);
    setCategoryForm(category.name);
  }

  async function deleteCategory(category) {
    if (!window.confirm(`ลบหมวดหมู่ ${category.name}?`)) return;
    setError("");
    setNotice("");
    try {
      await adminRequest(`/api/admin/activity-categories/${category.id}`, { method: "DELETE" });
      if (editingCategoryId === category.id) {
        setEditingCategoryId(null);
        setCategoryForm("");
      }
      await loadAdminData();
      setNotice("ลบหมวดหมู่แล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitActivity(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const path = editingActivityId ? `/api/admin/activities/${editingActivityId}` : "/api/admin/activities";
    const method = editingActivityId ? "PUT" : "POST";
    try {
      await adminRequest(path, { method, body: JSON.stringify(activityForm) });
      resetActivityForm();
      await loadAdminData();
      setNotice(method === "PUT" ? "บันทึกการแก้ไขข่าวสารแล้ว" : "เพิ่มข่าวสารกิจกรรมแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  function editActivity(activity) {
    setError("");
    setNotice("เลือกข่าวสารแล้ว แก้ไขข้อมูลในฟอร์มข่าวสารแล้วกดบันทึก");
    setEditingActivityId(activity.id);
    setActivityForm({
      title: activity.title,
      category: activity.category,
      image: activity.image,
      image_2: activity.image_2 || "",
      image_3: activity.image_3 || "",
      description: activity.description,
      content: activity.content || activity.description,
      is_published: Boolean(activity.is_published)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteActivity(id) {
    if (!window.confirm("ลบข่าวสารกิจกรรมนี้?")) return;
    setError("");
    setNotice("");
    try {
      await adminRequest(`/api/admin/activities/${id}`, { method: "DELETE" });
      if (editingActivityId === id) resetActivityForm();
      await loadAdminData();
      setNotice("ลบข่าวสารกิจกรรมแล้ว");
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("nlp-admin");
    setAdmin(null);
  }

  if (!admin?.token) {
    return (
      <main className={`app-shell theme-${theme} min-h-screen bg-cyber-ink text-white`}>
        <div className="cyber-grid fixed inset-0 opacity-35" />
        <div className="theme-corner">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <section className="relative mx-auto grid min-h-screen max-w-xl content-center px-4">
          <form className="admin-panel" onSubmit={submitLogin}>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Admin Back Office</p>
            <h1 className="mt-2 text-3xl font-extrabold">เข้าสู่ระบบผู้ดูแล</h1>
            <input className="cyber-input mt-5" placeholder="Username" value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} />
            <input className="cyber-input mt-3" type="password" placeholder="Password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} />
            {error && <p className="mt-3 rounded-lg border border-cyber-rose/40 bg-cyber-rose/10 p-3 text-cyber-rose">{error}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="cyber-button" type="submit">Login Admin</button>
              <button className="tool-button" type="button" onClick={onBack}>กลับหน้าแรก</button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className={`app-shell theme-${theme} min-h-screen bg-cyber-ink text-white`}>
      <div className="cyber-grid fixed inset-0 opacity-35" />
      <header className="sticky top-0 z-20 border-b border-cyber-line bg-cyber-ink/88 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <strong className="block text-lg">Admin Back Office</strong>
            <small className="text-slate-400">ผู้ดูแลระบบ • สถิติ • ผู้เรียน • คะแนน</small>
          </div>
          <nav className="flex flex-wrap gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button className="nav-chip" onClick={loadAdminData}>Refresh</button>
            <button className="nav-chip" onClick={onBack}>หน้าแรก</button>
            <button className="nav-chip" onClick={logout}>Logout Admin</button>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl gap-5 px-4 py-6 md:px-8">
        {error && <p className="rounded-lg border border-cyber-rose/40 bg-cyber-rose/10 p-3 text-cyber-rose">{error}</p>}
        {notice && <p className="rounded-lg border border-cyber-lime/40 bg-cyber-lime/10 p-3 font-bold text-cyber-lime">{notice}</p>}

        <nav className="admin-section-tabs" aria-label="Admin sections">
          {adminSections.map((section) => (
            <button
              key={section.key}
              className={adminSection === section.key ? "active" : ""}
              type="button"
              onClick={() => setAdminSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {adminSection === "overview" && <>
          {stats?.readiness?.warnings?.length > 0 && (
            <section className="rounded-lg border border-cyber-rose/40 bg-cyber-rose/10 p-4 text-cyber-rose">
              <strong className="block">ควรตั้งค่าความปลอดภัยก่อนใช้งานจริง</strong>
              <span className="mt-1 block text-sm text-rose-100">
                {stats.readiness.warnings.join(" • ")} กรุณากำหนดค่าใน environment variables: ADMIN_PASSWORD, ADMIN_TOKEN และ PASSWORD_SALT
              </span>
            </section>
          )}
          <LearningOpsDashboard
            adminSummary={adminLearningSummary}
            recent={stats?.recentAttempts || []}
          />
          <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <Stat label="Users" value={stats?.totalUsers || 0} />
            <Stat label="Attempts" value={stats?.totalAttempts || 0} tone="lime" />
            <Stat label="Best Scores" value={stats?.totalScores || 0} />
            <Stat label="Avg Score" value={stats?.avgScore || 0} tone="rose" />
            <Stat label="Page Views" value={stats?.totalPageViews || 0} />
            <Stat label="Today" value={stats?.todayPageViews || 0} tone="lime" />
          </section>
          <section className="admin-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Back Office Reports</p>
                <h2 className="mt-2 text-2xl font-extrabold">รายงานผลแยกอยู่ในหลังบ้าน</h2>
                <p className="mt-2 text-slate-300">รายงานผลการเรียน วิเคราะห์ข้อสอบรายข้อ และผลรายบุคคล ถูกแยกออกจากหน้าเนื้อหาผู้เรียนแล้ว</p>
              </div>
              <button className="cyber-button" type="button" onClick={() => setAdminSection("lms")}>เปิดรายงานผล LMS</button>
            </div>
          </section>
        </>}

        {adminSection === "activities" && <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <form className="admin-panel" onSubmit={submitActivity}>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">{editingActivityId ? "Edit Activity News" : "Add Activity News"}</p>
            <h2 className="mt-2 text-2xl font-extrabold">{editingActivityId ? "แก้ไขข่าวสารกิจกรรม" : "เพิ่มข่าวสารกิจกรรมการเรียนการสอน"}</h2>
            <div className="mt-4 grid gap-3">
              <input className="cyber-input" placeholder="หัวข้อข่าวสาร" value={activityForm.title} onChange={(event) => setActivityForm({ ...activityForm, title: event.target.value })} required />
              <select className="cyber-input" value={activityForm.category} onChange={(event) => setActivityForm({ ...activityForm, category: event.target.value })} required>
                {activityCategories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
              </select>
              <label className="upload-drop">
                <span>Upload รูปกิจกรรมได้สูงสุด 3 รูป</span>
                <small>รองรับ JPG, PNG, WEBP, GIF และจะแสดงรูปแรกเป็นภาพหน้าปก</small>
                <input type="file" accept="image/*" multiple onChange={(event) => uploadActivityImages(event.target.files)} />
              </label>
              <div className="image-slot-grid">
                {[activityForm.image, activityForm.image_2, activityForm.image_3].map((image, index) => (
                  <div className="image-slot" key={index}>
                    {image ? <img src={image} alt={`Activity ${index + 1}`} /> : <span>รูปที่ {index + 1}</span>}
                  </div>
                ))}
              </div>
              <input className="cyber-input" placeholder="URL รูปที่ 1 / ภาพหน้าปก" value={activityForm.image} onChange={(event) => setActivityForm({ ...activityForm, image: event.target.value })} required />
              <input className="cyber-input" placeholder="URL รูปที่ 2" value={activityForm.image_2} onChange={(event) => setActivityForm({ ...activityForm, image_2: event.target.value })} />
              <input className="cyber-input" placeholder="URL รูปที่ 3" value={activityForm.image_3} onChange={(event) => setActivityForm({ ...activityForm, image_3: event.target.value })} />
              <textarea className="cyber-input min-h-24" placeholder="คำอธิบายสั้นสำหรับหน้าบ้าน" value={activityForm.description} onChange={(event) => setActivityForm({ ...activityForm, description: event.target.value })} required />
              <textarea className="cyber-input min-h-28" placeholder="รายละเอียดเพิ่มเติม" value={activityForm.content} onChange={(event) => setActivityForm({ ...activityForm, content: event.target.value })} />
              <label className="flex items-center gap-3 rounded-lg border border-cyber-line bg-white/5 p-3 font-bold text-slate-200">
                <input type="checkbox" checked={activityForm.is_published} onChange={(event) => setActivityForm({ ...activityForm, is_published: event.target.checked })} />
                แสดงข่าวนี้บนหน้าบ้าน
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="cyber-button" type="submit">{editingActivityId ? "บันทึกข่าวสาร" : "เพิ่มข่าวสาร"}</button>
              {editingActivityId && <button className="tool-button" type="button" onClick={resetActivityForm}>ยกเลิก</button>}
            </div>
          </form>

          <div className="admin-panel overflow-x-auto">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Activity News Management</p>
            <h2 className="mt-2 text-2xl font-extrabold">ข่าวสารกิจกรรมทั้งหมด</h2>
            <table className="mt-4 w-full min-w-[820px] text-left">
              <thead className="text-xs uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="py-3">ข่าวสาร</th>
                  <th>หมวดหมู่</th>
                  <th>สถานะ</th>
                  <th>วันที่</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedActivities.map((activity) => (
                  <tr key={activity.id} className="border-t border-cyber-line/80">
                    <td className="py-3">
                      <strong>{activity.title}</strong>
                      <span className="block max-w-xl text-sm text-slate-400">{activity.description}</span>
                    </td>
                    <td>{activity.category}</td>
                    <td className={activity.is_published ? "text-cyber-lime" : "text-slate-400"}>{activity.is_published ? "เผยแพร่" : "ซ่อน"}</td>
                    <td className="text-sm text-slate-400">{activity.published_at}</td>
                    <td>
                      <button className="mini-button" type="button" onClick={() => editActivity(activity)}>แก้ไข</button>
                      <button className="mini-button danger" type="button" onClick={() => deleteActivity(activity.id)}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activities.length > activityPageSize && (
              <div className="pagination-row">
                <span>
                  แสดง {(activityPage - 1) * activityPageSize + 1}-{Math.min(activityPage * activityPageSize, activities.length)} จาก {activities.length} ข่าว
                </span>
                <div>
                  <button className="mini-button" type="button" disabled={activityPage === 1} onClick={() => setActivityPage((page) => Math.max(1, page - 1))}>ก่อนหน้า</button>
                  <strong>{activityPage}/{activityTotalPages}</strong>
                  <button className="mini-button" type="button" disabled={activityPage === activityTotalPages} onClick={() => setActivityPage((page) => Math.min(activityTotalPages, page + 1))}>ถัดไป</button>
                </div>
              </div>
            )}
            {activities.length === 0 && <p className="mt-4 rounded-lg border border-cyber-line bg-white/5 p-4 text-slate-300">ยังไม่มีข่าวสารกิจกรรม</p>}
          </div>
        </section>}

        {adminSection === "categories" && <section className="admin-panel">
          <form className="category-manager" onSubmit={submitCategory}>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Category Management</p>
              <h2 className="mt-2 text-2xl font-extrabold">จัดการหมวดหมู่ข่าวกิจกรรม</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <input className="cyber-input min-w-[260px] flex-1" placeholder="ชื่อหมวดหมู่" value={categoryForm} onChange={(event) => setCategoryForm(event.target.value)} />
              <button className="mini-button" type="submit">{editingCategoryId ? "บันทึก" : "เพิ่ม"}</button>
              {editingCategoryId && <button className="mini-button danger" type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm(""); }}>ยกเลิก</button>}
            </div>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {activityCategories.map((category) => (
              <span className="category-admin-chip" key={category.id}>
                {category.name}
                <button type="button" onClick={() => editCategory(category)}>แก้ไข</button>
                <button type="button" onClick={() => deleteCategory(category)}>ลบ</button>
              </span>
            ))}
          </div>
        </section>}

        {adminSection === "learners" && <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <form className="admin-panel" onSubmit={submitUser}>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">{editingId ? "Edit Learner" : "Add Learner"}</p>
            <h2 className="mt-2 text-2xl font-extrabold">{editingId ? "แก้ไขผู้เรียน" : "เพิ่มผู้เรียน"}</h2>
            <div className="mt-4 grid gap-3">
              <input className="cyber-input" placeholder="รหัสนักศึกษา" value={form.student_code} onChange={(event) => setForm({ ...form, student_code: event.target.value })} required />
              <input className="cyber-input" placeholder="ชื่อ-สกุล" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              <input className="cyber-input" placeholder="กลุ่มเรียน" value={form.group_name} onChange={(event) => setForm({ ...form, group_name: event.target.value })} required />
              <select className="cyber-input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                <option value="student">นักเรียน</option>
                <option value="teacher">ครูผู้สอน</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="cyber-button" type="submit">{editingId ? "บันทึกการแก้ไข" : "เพิ่มผู้เรียน"}</button>
              {editingId && <button className="tool-button" type="button" onClick={() => { setEditingId(null); setForm({ student_code: "", name: "", group_name: "", role: "student" }); }}>ยกเลิก</button>}
            </div>
          </form>

          <div className="admin-panel overflow-x-auto">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Learner Management</p>
            <h2 className="mt-2 text-2xl font-extrabold">ผู้เรียนทั้งหมด</h2>
            <table className="mt-4 w-full min-w-[760px] text-left">
              <thead className="text-xs uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="py-3">Code</th>
                  <th>Name</th>
                  <th>Group</th>
                  <th>Role</th>
                  <th>Total</th>
                  <th>Games</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <tr key={row.id} className="border-t border-cyber-line/80">
                    <td className="py-3">{row.student_code}</td>
                    <td>{row.name}</td>
                    <td>{row.group_name}</td>
                    <td>{row.role || "student"}</td>
                    <td className="font-extrabold text-cyber-lime">{row.total_score}</td>
                    <td>{row.completed_games}</td>
                    <td>
                      <button className="mini-button" type="button" onClick={() => editUser(row)}>แก้ไข</button>
                      <button className="mini-button" type="button" onClick={() => loadLearnerReport(row.id)}>ผล LMS</button>
                      <button className="mini-button danger" type="button" onClick={() => deleteUser(row.id)}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>}

        {adminSection === "unitContent" && <section className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="admin-panel">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">LMS Unit Content</p>
            <h2 className="mt-2 text-2xl font-extrabold">เลือกหน่วยเรียน</h2>
            <div className="mt-4 grid gap-3">
              {lmsUnits.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  className={`unit-admin-card ${lmsUnitForm.id === unit.id ? "active" : ""}`}
                  onClick={() => selectLmsUnit(unit)}
                >
                  <span>หน่วย {unit.unit_no}</span>
                  <strong>{unit.title}</strong>
                  <small>{unit.key_topics?.length || 0} หัวข้อหลัก • {unit.content?.length || 0} เนื้อหา</small>
                </button>
              ))}
            </div>
          </div>

          <form className="admin-panel" onSubmit={submitLmsUnit}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Content Editor</p>
                <h2 className="mt-2 text-2xl font-extrabold">แก้ไขเนื้อหา หน่วยที่ {lmsUnitForm.unit_no}</h2>
              </div>
              <button className="cyber-button" type="submit" disabled={!lmsUnitForm.id}>บันทึกหน่วยเรียน</button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[120px_1fr]">
              <input className="cyber-input" type="number" min="1" value={lmsUnitForm.unit_no} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, unit_no: event.target.value })} />
              <input className="cyber-input" placeholder="ชื่อหน่วยเรียน" value={lmsUnitForm.title} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, title: event.target.value })} required />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input className="cyber-input" placeholder="ชื่อบทเรียน/หัวข้อหน้าเรียน" value={lmsUnitForm.lesson_title} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, lesson_title: event.target.value })} />
              <input className="cyber-input" placeholder="ระยะ/หมวดการเรียนรู้" value={lmsUnitForm.phase} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, phase: event.target.value })} />
            </div>
            <div className="unit-image-editor mt-3">
              <div className="image-slot">
                {lmsUnitForm.image ? <img src={lmsUnitForm.image} alt={lmsUnitForm.title} /> : <span>รูปหน้าปกหน่วย</span>}
              </div>
              <div className="grid gap-2">
                <label className="activity-upload-label">
                  <span>อัปโหลดรูปหน้าปกหน่วยเรียน</span>
                  <input type="file" accept="image/*" onChange={(event) => uploadLmsUnitImage(event.target.files)} />
                </label>
                <input className="cyber-input" placeholder="URL รูปภาพประกอบหน่วย" value={lmsUnitForm.image} onBlur={saveCurrentLmsUnitImages} onChange={(event) => updateLmsUnitForm({ ...lmsUnitFormRef.current, image: event.target.value })} />
              </div>
            </div>
            <textarea className="cyber-input mt-3" rows="3" placeholder="จุดประสงค์การเรียนรู้ของหน่วย" value={lmsUnitForm.objective} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, objective: event.target.value })} />

            <div className="unit-editor-group mt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3>รูปภาพและหัวข้อบทเรียน</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="mini-button" type="button" onClick={addLessonSection}>เพิ่มหัวข้อบทเรียน</button>
                  <button className="mini-button" type="button" onClick={saveCurrentLmsUnitImages}>บันทึกรูปทั้งหมด</button>
                </div>
              </div>
              <div className="mt-3 grid gap-4">
                {(lmsUnitForm.lesson_sections || []).map((section, sectionIndex) => (
                  <div className="lesson-section-editor" key={`lesson-section-${sectionIndex}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <strong>หัวข้อที่ {sectionIndex + 1}</strong>
                      <button className="mini-button danger" type="button" onClick={() => removeLessonSection(sectionIndex)}>ลบหัวข้อ</button>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <input className="cyber-input" placeholder="ชื่อหัวข้อบทเรียน" value={section.title || ""} onChange={(event) => updateLessonSection(sectionIndex, { title: event.target.value })} />
                      <input className="cyber-input" placeholder="คำบรรยายใต้รูป" value={section.caption || ""} onChange={(event) => updateLessonSection(sectionIndex, { caption: event.target.value })} />
                    </div>
                    <textarea className="cyber-input mt-3" rows="3" placeholder="รายละเอียดบทเรียน" value={section.detail || ""} onChange={(event) => updateLessonSection(sectionIndex, { detail: event.target.value })} />
                    <label className="activity-upload-label mt-3">
                      <span>อัปโหลดรูปของหัวข้อนี้ (ได้หลายรูป)</span>
                      <input type="file" accept="image/*" multiple onChange={(event) => uploadLessonSectionImages(sectionIndex, event.target.files)} />
                    </label>
                    <div className="lesson-image-list mt-3">
                      {((section.images || []).length ? section.images : [""]).map((image, imageIndex) => (
                        <div className="lesson-image-row" key={`lesson-image-${sectionIndex}-${imageIndex}`}>
                          <div className="image-slot">
                            {image ? <img src={image} alt={`${section.title || "Lesson"} ${imageIndex + 1}`} /> : <span>รูปที่ {imageIndex + 1}</span>}
                          </div>
                          <input className="cyber-input" placeholder={`URL รูปที่ ${imageIndex + 1}`} value={image || ""} onBlur={saveCurrentLmsUnitImages} onChange={(event) => updateLessonSectionImage(sectionIndex, imageIndex, event.target.value)} />
                          <button className="mini-button danger" type="button" onClick={() => removeLessonSectionImage(sectionIndex, imageIndex)}>ลบรูป</button>
                        </div>
                      ))}
                    </div>
                    <button className="mini-button mt-3" type="button" onClick={() => addLessonSectionImage(sectionIndex)}>เพิ่มช่องรูป</button>
                    <div className="content-image-editor mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <strong>รูปในเนื้อหาอ่านเพิ่มเติม</strong>
                        <button className="mini-button" type="button" onClick={() => addLessonSectionImage(sectionIndex, "content_images")}>เพิ่มช่องรูปในเนื้อหา</button>
                      </div>
                      <label className="activity-upload-label mt-3">
                        <span>อัปโหลดรูปในเนื้อหา (ได้หลายรูป)</span>
                        <input type="file" accept="image/*" multiple onChange={(event) => uploadLessonSectionImages(sectionIndex, event.target.files, "content_images")} />
                      </label>
                      <div className="lesson-image-list mt-3">
                        {((section.content_images || []).length ? section.content_images : [""]).map((image, imageIndex) => (
                          <div className="lesson-image-row" key={`content-image-${sectionIndex}-${imageIndex}`}>
                            <div className="image-slot">
                              {image ? <img src={image} alt={`${section.title || "Content"} ${imageIndex + 1}`} /> : <span>รูปเนื้อหาที่ {imageIndex + 1}</span>}
                            </div>
                            <input className="cyber-input" placeholder={`URL รูปในเนื้อหาที่ ${imageIndex + 1}`} value={image || ""} onBlur={saveCurrentLmsUnitImages} onChange={(event) => updateLessonSectionImage(sectionIndex, imageIndex, event.target.value, "content_images")} />
                            <button className="mini-button danger" type="button" onClick={() => removeLessonSectionImage(sectionIndex, imageIndex, "content_images")}>ลบรูป</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {!(lmsUnitForm.lesson_sections || []).length && (
                  <p className="rounded-lg border border-cyber-line bg-white/5 p-4 text-sm text-slate-400">
                    ยังไม่มีหัวข้อบทเรียน กด “เพิ่มหัวข้อบทเรียน” เพื่อใส่เนื้อหาและรูปภาพ
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {editableUnitArrayFields.map(([field, label]) => (
                <div className="unit-editor-group" key={field}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3>{label}</h3>
                    <button className="mini-button" type="button" onClick={() => addLmsUnitArrayItem(field)}>เพิ่มรายการ</button>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {(lmsUnitForm[field] || [""]).map((item, index) => (
                      <div className="unit-editor-row" key={`${field}-${index}`}>
                        <textarea className="cyber-input" rows={field === "content" ? 3 : 2} value={item} onChange={(event) => updateLmsUnitArray(field, index, event.target.value)} />
                        <button className="mini-button danger" type="button" onClick={() => removeLmsUnitArrayItem(field, index)}>ลบ</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <textarea className="cyber-input" rows="4" placeholder="กรณีศึกษา" value={lmsUnitForm.case_study} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, case_study: event.target.value })} />
              <textarea className="cyber-input" rows="4" placeholder="กิจกรรม/ใบงาน" value={lmsUnitForm.workshop} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, workshop: event.target.value })} />
              <textarea className="cyber-input" rows="4" placeholder="ชิ้นงาน/ผลผลิตที่คาดหวัง" value={lmsUnitForm.product} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, product: event.target.value })} />
            </div>

            <div className="unit-editor-group mt-5">
              <h3>เกมประจำหน่วย</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <input className="cyber-input" placeholder="ชื่อเกม" value={lmsUnitForm.game.title || ""} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, game: { ...lmsUnitForm.game, title: event.target.value } })} />
                <input className="cyber-input" placeholder="ประเภทเกม" value={lmsUnitForm.game.type || ""} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, game: { ...lmsUnitForm.game, type: event.target.value } })} />
                <select className="cyber-input" value={lmsUnitForm.game.existing_key || ""} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, game: { ...lmsUnitForm.game, existing_key: event.target.value, status: event.target.value ? "available" : "planned" } })}>
                  <option value="">ยังไม่มีเกมในระบบ/วางแผนเพิ่ม</option>
                  {Object.entries(gameLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
                <input className="cyber-input" placeholder="แผนสร้างเกมเพิ่มเติม" value={lmsUnitForm.game.planned_game || ""} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, game: { ...lmsUnitForm.game, planned_game: event.target.value } })} />
              </div>
              <textarea className="cyber-input mt-3" rows="3" placeholder="คำอธิบายเกมหรือกิจกรรม" value={lmsUnitForm.game.description || ""} onChange={(event) => setLmsUnitForm({ ...lmsUnitForm, game: { ...lmsUnitForm.game, description: event.target.value } })} />
            </div>
          </form>
        </section>}

        {adminSection === "lms" && <section className="grid gap-5">
          <div className="admin-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">LMS Assessment Analytics</p>
                <h2 className="mt-2 text-2xl font-extrabold">วิเคราะห์ข้อสอบรายข้อ</h2>
              </div>
              <button className="mini-button" type="button" onClick={loadAdminData}>โหลดรายงานใหม่</button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {(lmsReport?.unitStats || []).slice(0, 15).map((item) => (
                <div className="question-stat" key={item.unit_no}>
                  <strong>หน่วย {item.unit_no}</strong>
                  <span>ท้ายบท {item.avg_chapter || 0} • {item.chapter_attempts || 0} ครั้ง</span>
                  <small>{item.title}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-panel overflow-x-auto">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Item Analysis</p>
            <h2 className="mt-2 text-2xl font-extrabold">ตารางวิเคราะห์ข้อสอบรายข้อ</h2>
            <table className="mt-4 w-full min-w-[1080px] text-left">
              <thead className="text-xs uppercase tracking-widest text-slate-400">
                <tr>
                  <th>หน่วย</th>
                  <th>ข้อ</th>
                  <th>โจทย์</th>
                  <th>เฉลย</th>
                  <th>ท้ายบท p</th>
                  <th>จำนวนครั้ง</th>
                  <th>คุณภาพ</th>
                </tr>
              </thead>
              <tbody>
                {(lmsReport?.questionAnalytics || []).map((item) => (
                  <tr key={item.id} className="border-t border-cyber-line/80">
                    <td>U{item.unit_no}</td>
                    <td>{item.question_no}</td>
                    <td className="max-w-md py-3">{item.prompt}</td>
                    <td className="font-extrabold text-cyber-lime">{item.answer_key}</td>
                    <td>{item.difficulty ?? "-"}</td>
                    <td>{item.attempts || 0}</td>
                    <td>{item.quality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>}


        {adminSection === "learnerAnalytics" && <section className="grid gap-5">
          <div className="admin-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Learner Analytics</p>
                <h2 className="mt-2 text-2xl font-extrabold">วิเคราะห์ผู้เรียนรายบุคคล</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">แยกคะแนนแบบทดสอบท้ายบท คะแนนเกม ความก้าวหน้ารายหน่วย และข้อเสนอแนะรายบุคคลออกจากหน้าวิเคราะห์ข้อสอบ</p>
              </div>
              <button className="mini-button" type="button" onClick={loadAdminData}>โหลดข้อมูลผู้เรียนใหม่</button>
            </div>
          </div>
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="admin-panel overflow-x-auto">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Learner Records</p>
              <h2 className="mt-2 text-2xl font-extrabold">ผลการเรียนรายบุคคล</h2>
              <table className="mt-4 w-full min-w-[720px] text-left">
                <thead className="text-xs uppercase tracking-widest text-slate-400">
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Quiz</th>
                    <th>Avg</th>
                    <th>Game</th>
                    <th>Level</th>
                    <th>Complete</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(lmsReport?.learnerProgress || []).map((row) => (
                    <tr key={row.id} className="border-t border-cyber-line/80">
                      <td className="py-3">
                        <button className="detail-link" type="button" onClick={() => loadLearnerReport(row.id)}>{row.student_code}</button>
                      </td>
                      <td>
                        <button className="detail-link text-left" type="button" onClick={() => loadLearnerReport(row.id)}>{row.name}</button>
                      </td>
                      <td>{row.chapter_attempts || 0}</td>
                      <td>{row.avg_chapter || "-"}</td>
                      <td>{row.avg_game_score || 0}</td>
                      <td><span className="learner-level">{row.learner_level || "-"}</span></td>
                      <td>{row.completed_units || 0}/15</td>
                      <td><button className="mini-button detail-action" type="button" onClick={() => loadLearnerReport(row.id)}>ดูรายละเอียดเพิ่มเติม</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-panel">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Individual Detail</p>
              <h2 className="mt-2 text-2xl font-extrabold">{learnerReport ? learnerReport.learner.name : "เลือกรายชื่อผู้เรียน"}</h2>
              {learnerReport ? (
                <div className="mt-4 grid gap-4">
                  <div className="learner-insight-grid">
                    <div>
                      <span>Mastery</span>
                      <strong>{learnerReport.analytics?.summary?.masteryIndex || 0}%</strong>
                      <small>{learnerReport.analytics?.summary?.learnerLevel || "-"}</small>
                    </div>
                    <div>
                      <span>Quiz Avg</span>
                      <strong>{learnerReport.analytics?.summary?.avgQuizPercent || 0}%</strong>
                      <small>{learnerReport.analytics?.summary?.quizAttempts || 0} ครั้ง</small>
                    </div>
                    <div>
                      <span>Game Avg</span>
                      <strong>{learnerReport.analytics?.summary?.avgGameScore || 0}</strong>
                      <small>{learnerReport.analytics?.summary?.gameCompleted || 0} เกม</small>
                    </div>
                    <div>
                      <span>Progress</span>
                      <strong>{learnerReport.analytics?.summary?.completedUnits || 0}/{learnerReport.analytics?.summary?.totalUnits || 15}</strong>
                      <small>{learnerReport.analytics?.summary?.completionPercent || 0}%</small>
                    </div>
                  </div>

                  <div className="learner-feedback-grid">
                    <div>
                      <h3>จุดแข็ง</h3>
                      {(learnerReport.analytics?.strengths || []).map((item) => <p key={item}>{item}</p>)}
                    </div>
                    <div>
                      <h3>ควรเสริม</h3>
                      {(learnerReport.analytics?.needsSupport || []).map((item) => <p key={item}>{item}</p>)}
                    </div>
                  </div>

                  <div className="chart-bars">
                    {(learnerReport.analytics?.unitProfiles || learnerReport.units).map((unit) => (
                      <div key={unit.id}>
                        <span>U{unit.unit_no}</span>
                        <i style={{ height: `${Math.max(4, (unit.quiz_percent || (unit.completed ? 80 : unit.lesson_viewed ? 45 : 10)))}px` }} />
                        <small>{unit.quiz_score !== null ? `${unit.quiz_percent}%` : unit.lesson_viewed ? "เรียน" : "-"}</small>
                      </div>
                    ))}
                  </div>

                  <div className="admin-panel compact-panel overflow-x-auto">
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Learner Unit Analysis</p>
                    <table className="mt-3 w-full min-w-[760px] text-left">
                      <thead className="text-xs uppercase tracking-widest text-slate-400">
                        <tr>
                          <th>Unit</th>
                          <th>Quiz</th>
                          <th>Game</th>
                          <th>Status</th>
                          <th>Recommendation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(learnerReport.analytics?.unitProfiles || []).map((unit) => (
                          <tr key={unit.id} className="border-t border-cyber-line/80">
                            <td className="py-3">U{unit.unit_no}</td>
                            <td>{unit.quiz_score !== null ? `${unit.quiz_score}/${unit.quiz_max_score}` : "-"}</td>
                            <td>{unit.game_score || 0}</td>
                            <td>{unit.status}</td>
                            <td>{unit.recommendation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="question-stat">
                      <strong>วิเคราะห์ตาม Bloom</strong>
                      {(learnerReport.analytics?.bloomPerformance || []).length ? (
                        learnerReport.analytics.bloomPerformance.map((item) => (
                          <span key={item.level}>{item.level}: {item.percent}% ({item.correct}/{item.total})</span>
                        ))
                      ) : <small>ยังไม่มีข้อมูลคำตอบรายข้อ</small>}
                    </div>
                    <div className="question-stat">
                      <strong>คะแนนเกม/กิจกรรม</strong>
                      {(learnerReport.gameScores || []).length ? (
                        learnerReport.gameScores.map((item) => (
                          <span key={item.id}>{gameLabels[item.game_key] || item.game_key}: {item.score}/{item.max_score}</span>
                        ))
                      ) : <small>ยังไม่มีคะแนนเกม</small>}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {learnerReport.attempts.slice(0, 10).map((attempt) => (
                      <div className="question-stat" key={attempt.id}>
                        <strong>U{attempt.unit_no} • แบบทดสอบท้ายบท • {attempt.score}/{attempt.max_score}</strong>
                        <span>{attempt.submitted_at}</span>
                        <small>{attempt.unit_title}</small>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-slate-300">เลือกผู้เรียนจากตารางด้านซ้ายเพื่อดูประวัติแบบทดสอบท้ายบทและความก้าวหน้ารายหน่วย</p>
              )}
            </div>
          </div>
        </section>}

        {adminSection === "analytics" && <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <div className="admin-panel">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Website Usage</p>
            <h2 className="mt-2 text-2xl font-extrabold">สถิติการใช้งานเว็บไซต์</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {(stats?.sitePaths || []).map((item) => (
                <div key={item.path} className="rounded-lg border border-cyber-line bg-white/5 p-3">
                  <strong>{item.path}</strong>
                  <span className="block text-cyber-lime">{item.views} views</span>
                </div>
              ))}
            </div>
          </div>
          <div className="admin-panel">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Game Analytics</p>
            <h2 className="mt-2 text-2xl font-extrabold">สถิติการใช้งานระบบ</h2>
            <div className="mt-4 grid gap-3">
              {(stats?.gameStats || []).map((item) => (
                <div key={item.game_key} className="rounded-lg border border-cyber-line bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{gameLabels[item.game_key] || item.game_key}</strong>
                    <span className="text-cyber-cyan">{item.attempts} attempts</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">Avg {item.average_score || 0} • Best {item.best_score || 0}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-6 text-lg font-extrabold">กิจกรรมล่าสุด</h3>
            <div className="mt-3 grid gap-3">
              {(stats?.recentAttempts || []).slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-lg border border-cyber-line bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{item.name}</strong>
                    <span className="text-cyber-lime">{item.score}/{item.max_score}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{gameLabels[item.game_key] || item.game_key} • {item.student_code} • {item.created_at}</p>
                </div>
              ))}
            </div>
          </div>
        </section>}
      </div>
    </main>
  );
}

function LMSAssessment({ unit, onDone }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    api(`/api/lms/units/${unit.unit_no}?user_id=${unit.user_id}`).then((data) => setQuestions(data.questions));
  }, [unit.unit_no, unit.user_id]);

  async function submit(event) {
    event.preventDefault();
    const response = await api("/api/lms/attempts", {
      method: "POST",
      body: JSON.stringify({
        user_id: unit.user_id,
        unit_id: unit.id,
        assessment_type: "chapter",
        answers
      })
    });
    setResult(response);
    onDone(response.overview);
  }

  return (
    <form className="lms-assessment" onSubmit={submit}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Assessment</p>
          <h3 className="text-2xl font-extrabold">แบบทดสอบท้ายบท หน่วยที่ {unit.unit_no}</h3>
        </div>
        {result && <strong className="score-pill">{result.score}/{result.max_score}</strong>}
      </div>
      <div className="mt-4 grid gap-4">
        {questions.map((question) => {
          const itemResult = result?.results?.find((item) => item.question_id === question.id);
          return (
            <div className="question-card" key={question.id}>
              <strong>{question.question_no}. {question.prompt}</strong>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {question.choices.map((choice) => (
                  <label className={`choice-row ${answers[question.id] === choice.key ? "active" : ""}`} key={choice.key}>
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      value={choice.key}
                      checked={answers[question.id] === choice.key}
                      onChange={() => setAnswers({ ...answers, [question.id]: choice.key })}
                      disabled={Boolean(result)}
                      required
                    />
                    <span>{choice.key}. {choice.text}</span>
                  </label>
                ))}
              </div>
              {itemResult && (
                <p className={itemResult.is_correct ? "answer-note correct" : "answer-note wrong"}>
                  เฉลย {itemResult.answer_key} {itemResult.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {!result && <button className="cyber-button" type="submit">ส่งแบบทดสอบท้ายบท</button>}
        {result && <button className="tool-button" type="button" onClick={() => setResult(null)}>ทำใหม่</button>}
      </div>
    </form>
  );
}

function LearningManagementSystem({ user, onOpenGame, onSessionExpired }) {
  const [overview, setOverview] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [activeUnitNo, setActiveUnitNo] = useState(1);
  const [expanded, setExpanded] = useState(new Set());
  const [speakingKey, setSpeakingKey] = useState(null);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeakingKey(null);
    setExpanded(new Set());
  }, [activeUnitNo]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function toggleExpand(key) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function speak(key, text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speakingKey === key) { setSpeakingKey(null); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "th-TH";
    utt.rate = 0.9;
    utt.onend = () => setSpeakingKey(null);
    utt.onerror = () => setSpeakingKey(null);
    setSpeakingKey(key);
    window.speechSynthesis.speak(utt);
  }

  useEffect(() => {
    let active = true;
    setOverview(null);
    setLoadError("");
    api(`/api/lms/overview?user_id=${user.id}`)
      .then((data) => {
        if (active) setOverview(data);
      })
      .catch((error) => {
        if (!active) return;
        if (error.message === "ไม่พบผู้เรียน") {
          onSessionExpired?.();
          return;
        }
        setLoadError(error.message || "โหลดข้อมูล LMS ไม่สำเร็จ");
      });
    return () => {
      active = false;
    };
  }, [user.id, onSessionExpired]);

  const units = overview?.units || [];
  const activeUnit = units.find((unit) => unit.unit_no === activeUnitNo) || units[0];

  async function markLessonViewed() {
    const next = await api("/api/lms/progress", {
      method: "POST",
      body: JSON.stringify({ user_id: user.id, unit_id: activeUnit.id, lesson_viewed: 1 })
    });
    setOverview(next);
  }

  async function completeGame() {
    const gameKey = activeUnit.game?.existing_key || `unit-${String(activeUnit.unit_no).padStart(2, "0")}`;
    await api("/api/scores", {
      method: "POST",
      body: JSON.stringify({ user_id: user.id, game_key: gameKey, unit_id: activeUnit.unit_no, score: 100, max_score: 100 })
    });
    const next = await api("/api/lms/progress", {
      method: "POST",
      body: JSON.stringify({ user_id: user.id, unit_id: activeUnit.id, lesson_viewed: 1, game_score: 100 })
    });
    setOverview(next);
  }

  function openMappedGame() {
    if (activeUnit.game?.existing_key && onOpenGame) onOpenGame(activeUnit.game.existing_key);
  }

  if (!overview || !activeUnit) {
    if (loadError) {
      return (
        <section className="admin-panel">
          <h2 className="text-2xl font-extrabold">โหลดข้อมูล LMS ไม่สำเร็จ</h2>
          <p className="mt-3 text-slate-300">{loadError}</p>
        </section>
      );
    }
    return <section className="admin-panel">กำลังโหลด LMS...</section>;
  }

  const overallPercent = Math.round(units.reduce((sum, unit) => sum + unit.progress.percent, 0) / Math.max(1, units.length));
  const phases = [...new Set(units.map((unit) => unit.phase).filter(Boolean))];
  const hasViewedLesson = Boolean(activeUnit.progress.lesson_viewed);
  const hasActivityDone = Number(activeUnit.progress.game_score || 0) > 0;
  const canBypassSequence = ["teacher", "admin"].includes(user.role || overview.role);
  const canChapterTest = canBypassSequence || (hasViewedLesson && hasActivityDone);
  const mappedGameKey = activeUnit.game?.existing_key;
  const gameIsAvailable = activeUnit.game?.status === "available" && mappedGameKey;

  return (
    <section className="lms-shell">
      <div className="lms-hero">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-lime">Intelligent LMS</p>
          <h2>ระบบจัดการเรียนการสอนอัจฉริยะ</h2>
          <p>รายวิชา {overview.course.code} {overview.course.title} จัดลำดับตาม MIAP, Competency-Based Learning และ Game-Based Learning เพื่อใช้เรียนจริงและเก็บข้อมูลวิจัย</p>
        </div>
        <div className="overall-progress">
          <span>{overallPercent}%</span>
          <div><i style={{ width: `${overallPercent}%` }} /></div>
          <small>{overview.summary.completedUnits}/{overview.summary.totalUnits} หน่วยสำเร็จ</small>
        </div>
      </div>

      <div className="phase-map">
        {phases.map((phase) => (
          <button
            key={phase}
            type="button"
            className={phase === activeUnit.phase ? "active" : ""}
            disabled={!canBypassSequence && units.find((unit) => unit.phase === phase)?.locked}
            onClick={() => setActiveUnitNo(units.find((unit) => unit.phase === phase)?.unit_no || activeUnitNo)}
          >
            <strong>{phase}</strong>
            <span>{units.filter((unit) => unit.phase === phase).length} หน่วย</span>
          </button>
        ))}
      </div>

      <div className="lms-layout">
        <div className="lms-workspace">
          <article className="lesson-panel">
            <div className="lesson-cover">
              <img src={activeUnit.image || "/assets/smart-network-logo.png"} alt={activeUnit.title} />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Unit {activeUnit.unit_no} • {activeUnit.phase}</p>
                <h2>{activeUnit.title}</h2>
                <p>{activeUnit.objective}</p>
                <div className="topic-chips">
                  {(activeUnit.key_topics || []).map((topic) => <span key={topic}>{topic}</span>)}
                </div>
              </div>
              <strong className="score-pill">{activeUnit.progress.percent}%</strong>
            </div>
            <div className="progress-strip">
              <span className={activeUnit.progress.lesson_viewed ? "done" : ""}><em>1</em>บทเรียน</span>
              <span className={activeUnit.progress.game_score ? "done" : ""}><em>2</em>กิจกรรม/เกม</span>
              <span className={activeUnit.chapter || activeUnit.post ? "done" : ""}><em>3</em>ท้ายบท</span>
            </div>

            <div className="learning-sequence">
              {(activeUnit.learning_steps || []).map((step, index) => (
                <div key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <><h3>บทเรียนจากหัวข้อหลัก</h3>
            <div className="lesson-section-grid">
              {(activeUnit.lesson_sections?.length ? activeUnit.lesson_sections : []).map((section, index) => {
                const key = `sec-${index}`;
                const extra = activeUnit.content?.[index];
                const contentImages = normalizeImageList(section.content_images || [section.content_image, section.content_image_2, section.content_image_3]);
                const hasExpandableContent = Boolean(extra);
                const sectionImages = normalizeImageList(section.images || [section.image, section.image_2, section.image_3]);
                const fallbackVisual = unitLessonVisuals[activeUnit.unit_no]?.[index];
                const visual = sectionImages.length
                  ? { images: sectionImages, caption: section.caption }
                  : fallbackVisual;
                return (
                  <article key={`${section.title}-${index}`}>
                    {visual && (
                      <figure className="lesson-section-visual">
                        {(visual.images || [visual.image]).filter(Boolean).map((image) => (
                          <img key={image} src={image} alt={visual.caption || section.title} loading="lazy" />
                        ))}
                        {visual.caption && <figcaption>{visual.caption}</figcaption>}
                      </figure>
                    )}
                    <div className="lesson-section-copy">
                      <div className="card-header-row">
                        <strong>{section.title}</strong>
                        <button
                          className={`speak-btn${speakingKey === key ? " speaking" : ""}`}
                          type="button"
                          title="อ่านออกเสียง"
                          onClick={() => speak(key, section.title + ". " + section.detail + (extra ? ". " + extra : ""))}
                        >
                          {speakingKey === key ? "⏹" : "🔊"}
                        </button>
                      </div>
                      <p>{section.detail}</p>
                      {hasExpandableContent && (
                        <button className="expand-btn" type="button" onClick={() => toggleExpand(key)}>
                          {expanded.has(key) ? "▲ ย่อลง" : "▼ อ่านเพิ่มเติม"}
                        </button>
                      )}
                      {extra && expanded.has(key) && <p className="expanded-detail">{extra}</p>}
                      {contentImages.length > 0 && (
                        <div className="lesson-content-images">
                          {contentImages.map((image) => (
                            <img key={image} src={image} alt={`${section.title} content`} loading="lazy" />
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="teaching-grid">
              <div>
                <h3>กรณีศึกษา
                  <button className={`speak-btn${speakingKey === "case" ? " speaking" : ""}`} type="button" style={{marginLeft:"auto"}} title="อ่านออกเสียง"
                    onClick={() => speak("case", "กรณีศึกษา. " + (activeUnit.case_study || activeUnit.workshop || ""))}>
                    {speakingKey === "case" ? "⏹" : "🔊"}
                  </button>
                </h3>
                <p>{activeUnit.case_study || activeUnit.workshop}</p>
                {activeUnit.lab_steps?.length > 0 && (
                  <button className="expand-btn" type="button" onClick={() => toggleExpand("lab")}>
                    {expanded.has("lab") ? "▲ ย่อลง" : "▼ ดูขั้นตอนปฏิบัติ"}
                  </button>
                )}
                {expanded.has("lab") && (
                  <ol className="expanded-list">
                    {activeUnit.lab_steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                )}
              </div>
              <div>
                <h3>ชิ้นงาน/หลักฐาน
                  <button className={`speak-btn${speakingKey === "product" ? " speaking" : ""}`} type="button" style={{marginLeft:"auto"}} title="อ่านออกเสียง"
                    onClick={() => speak("product", "ชิ้นงานหลักฐาน. " + (activeUnit.product || ""))}>
                    {speakingKey === "product" ? "⏹" : "🔊"}
                  </button>
                </h3>
                <p>{activeUnit.product}</p>
                {activeUnit.common_mistakes?.length > 0 && (
                  <button className="expand-btn" type="button" onClick={() => toggleExpand("mistakes")}>
                    {expanded.has("mistakes") ? "▲ ย่อลง" : "▼ ข้อผิดพลาดที่พบบ่อย"}
                  </button>
                )}
                {expanded.has("mistakes") && (
                  <ul className="expanded-list">
                    {activeUnit.common_mistakes.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </div>
              <div>
                <h3>วิเคราะห์ผู้เรียน
                  <button className={`speak-btn${speakingKey === "analysis" ? " speaking" : ""}`} type="button" style={{marginLeft:"auto"}} title="อ่านออกเสียง"
                    onClick={() => speak("analysis", [activeUnit.learner_analysis?.readiness, activeUnit.learner_analysis?.intervention, activeUnit.learner_analysis?.mastery].filter(Boolean).join(". "))}>
                    {speakingKey === "analysis" ? "⏹" : "🔊"}
                  </button>
                </h3>
                <p>{activeUnit.learner_analysis?.readiness}</p>
                <p>{activeUnit.learner_analysis?.intervention}</p>
                <p>{activeUnit.learner_analysis?.mastery}</p>
                {activeUnit.teacher_guidance?.length > 0 && (
                  <button className="expand-btn" type="button" onClick={() => toggleExpand("guidance")}>
                    {expanded.has("guidance") ? "▲ ย่อลง" : "▼ แนวทางการสอน"}
                  </button>
                )}
                {expanded.has("guidance") && (
                  <ul className="expanded-list">
                    {activeUnit.teacher_guidance.map((g) => <li key={g}>{g}</li>)}
                  </ul>
                )}
              </div>
            </div>

            <div className="learning-material-grid">
              <article>
                <h3>ขั้นตอนปฏิบัติในใบงาน</h3>
                <ol>
                  {(activeUnit.lab_steps || []).map((step) => <li key={step}>{step}</li>)}
                </ol>
              </article>
              <article>
                <h3>ข้อผิดพลาดที่พบบ่อย</h3>
                <ul>
                  {(activeUnit.common_mistakes || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
              <article>
                <h3>แหล่งเรียนรู้เพิ่มเติม</h3>
                <div className="resource-list">
                  {(activeUnit.external_resources || []).slice(0, 6).map((resource) => (
                    <a href={resource.url} target="_blank" rel="noreferrer" key={resource.url}>{resource.title}</a>
                  ))}
                </div>
              </article>
            </div>

            <h3>เกมประจำหน่วย</h3>
            <div className="game-mission">
              <span className={`game-status ${gameIsAvailable ? "available" : "planned"}`}>
                {gameIsAvailable ? "เกมที่มีในระบบ" : "แผนสร้างเกมเพิ่มเติม"}
              </span>
              <strong>{activeUnit.game_title}</strong>
              <p>{activeUnit.game_description}</p>
              <p><b>รูปแบบเกม:</b> {activeUnit.game?.mechanic} • <b>เป้าหมาย:</b> {activeUnit.game?.goal}</p>
              <div className="game-mission-actions">
                {gameIsAvailable && (
                  <button className="mini-button" type="button" disabled={!canBypassSequence && !hasViewedLesson} onClick={openMappedGame}>
                    เล่น {gameLabels[mappedGameKey] || activeUnit.game_title}
                  </button>
                )}
                <button className="mini-button" type="button" disabled={!canBypassSequence && !hasViewedLesson} onClick={completeGame}>
                  {gameIsAvailable ? "บันทึกว่าเล่น/ส่งกิจกรรมแล้ว 100 คะแนน" : "บันทึกกิจกรรมจำลองตามแผนเกม 100 คะแนน"}
                </button>
              </div>
              <small>{activeUnit.game?.feedback}</small>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="cyber-button" type="button" onClick={markLessonViewed}>บันทึกว่าเรียนบทนี้แล้ว</button>
            </div>
            </>
          </article>

          {!canChapterTest ? (
            <section className="lms-assessment">
              <p className="answer-note wrong">แบบทดสอบท้ายบทจะเปิดหลังจากอ่านเนื้อหา บันทึกการเรียน และส่งงานกิจกรรมหรือเล่นเกมประจำหน่วยแล้ว</p>
            </section>
          ) : (
            <LMSAssessment
              unit={{ ...activeUnit, user_id: user.id }}
              onDone={setOverview}
            />
          )}
        </div>

        <aside className="unit-rail">
          {units.map((unit) => (
            <button
              key={unit.id}
              className={[
                unit.unit_no === activeUnit.unit_no ? "active" : "",
                unit.locked ? "locked" : "",
                unit.progress.percent === 100 ? "done" : ""
              ].filter(Boolean).join(" ")}
              type="button"
              title={`${unit.unit_no}. ${unit.title}`}
              disabled={!canBypassSequence && unit.locked}
              onClick={() => setActiveUnitNo(unit.unit_no)}
            >
              {unit.unit_no}
            </button>
          ))}
        </aside>
      </div>
    </section>
  );
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("nlp-user") || "null"));
  const [theme, setTheme] = useState(() => localStorage.getItem("nlp-theme") || "dark");
  const [showGame, setShowGame] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [gameData, setGameData] = useState({ units: [], games: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const [dashboardOverview, setDashboardOverview] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeBoard, setActiveBoard] = useState("all");
  const [notice, setNotice] = useState("");

  const totalScore = useMemo(() => user?.scores?.reduce((sum, item) => sum + item.score, 0) || 0, [user]);
  const bestByGame = useMemo(() => Object.fromEntries((user?.scores || []).map((score) => [score.game_key, score.score])), [user]);
  const activeGame = useMemo(() => gameData.games.find((game) => game.key === activeTab), [activeTab, gameData.games]);

  useEffect(() => {
    api("/api/game-data").then(setGameData);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nlp-theme", theme);
  }, [theme]);

  useEffect(() => {
    api(`/api/leaderboard?game=${activeBoard}`).then(setLeaderboard);
  }, [activeBoard, user]);

  useEffect(() => {
    if (!user?.id) {
      setDashboardOverview(null);
      return;
    }
    let active = true;
    api(`/api/lms/overview?user_id=${user.id}`)
      .then((data) => {
        if (active) setDashboardOverview(data);
      })
      .catch(() => {
        if (active) setDashboardOverview(null);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  function handleLogin(nextUser) {
    setUser(nextUser);
    localStorage.setItem("nlp-user", JSON.stringify(nextUser));
  }

  function toggleTheme() {
    setTheme((current) => current === "dark" ? "light" : "dark");
  }

  const handleSessionExpired = useCallback(() => {
    localStorage.removeItem("nlp-user");
    setUser(null);
    setActiveTab("dashboard");
    setNotice("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
  }, []);

  async function submitScore(gameKey, unitId, score) {
    const nextUser = await api("/api/scores", {
      method: "POST",
      body: JSON.stringify({ user_id: user.id, game_key: gameKey, unit_id: unitId, score, max_score: 100 })
    });
    handleLogin(nextUser);
    setNotice(`บันทึกคะแนน ${gameLabels[gameKey]}: ${score}/100 แล้ว`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  if (showAdmin) return <><AdminPanel onBack={() => setShowAdmin(false)} theme={theme} onToggleTheme={toggleTheme} /><CopyrightBar /></>;
  if (!showGame) return <><ActivityLanding onEnterGame={() => setShowGame(true)} onOpenAdmin={() => setShowAdmin(true)} theme={theme} onToggleTheme={toggleTheme} /><CopyrightBar /></>;
  if (!user) return <><AuthScreen onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} /><CopyrightBar /></>;

  return (
    <main className={`app-shell theme-${theme} min-h-screen bg-cyber-ink text-white`}>
      <div className="cyber-grid fixed inset-0 opacity-35" />
      <CommandRail mode="student" activeTab={activeTab} onNavigate={setActiveTab} />
      <header className="sticky top-0 z-20 border-b border-cyber-line bg-cyber-ink/88 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center justify-between gap-4 py-2.5">
            <button
              className="flex items-center gap-3 text-left transition hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyber-cyan"
              onClick={() => setShowGame(false)}
              type="button"
              title="กลับหน้าแรก"
            >
              <img className="h-9 w-9 flex-shrink-0 rounded-full bg-white object-cover p-0.5" src="/assets/smart-network-logo.png" alt="" />
              <div>
                <strong className="block leading-tight">Smart Network Learning</strong>
                <small className="text-xs text-slate-400">ITTHIPHON SUKTERM</small>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button className="nav-chip" onClick={() => setShowAdmin(true)}>Admin</button>
              <button className="nav-chip nav-chip-logout" onClick={() => { localStorage.removeItem("nlp-user"); setUser(null); }}>Logout</button>
            </div>
          </div>
          <nav className="header-nav" aria-label="การนำทางหลัก">
            {[
              ["dashboard", "Dashboard"],
              ["lms", "LMS 15 Units"],
              ["games", "Games"],
              ["profile", "Profile"],
              ["leaderboard", "Leaderboard"],
              ["units", "Units"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                className={`nav-chip flex-shrink-0 ${activeTab === tab || (tab === "games" && (activeGame || classicGameCatalog.some((game) => game.key === activeTab))) ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {label}
              </button>
            ))}
            <button className="nav-chip flex-shrink-0" onClick={() => setShowGame(false)}>Activities</button>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl gap-5 px-4 py-6 md:pl-16 md:pr-8 lg:pl-20 lg:pr-12">
        {activeTab !== "lms" && (
          <section className="grid gap-4 md:grid-cols-[minmax(320px,420px)_180px_180px_180px]">
            <div className="connected-card">
              <img src="/assets/smart-network-logo.png" alt="" />
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-cyber-cyan">Connected Student</p>
                <h1 className="mt-2 text-3xl font-extrabold">{user.name}</h1>
                <p className="mt-1 text-slate-400">{user.student_code} • {user.group_name}</p>
              </div>
            </div>
            <Stat label="Total Score" value={totalScore} tone="lime" />
            <Stat label="Completed" value={`${user.completed || 0}/15`} />
            <Stat label="Best Game" value={Math.max(0, ...Object.values(bestByGame))} tone="rose" />
          </section>
        )}

        {notice && <p className="rounded-lg border border-cyber-lime/40 bg-cyber-lime/10 p-3 font-bold text-cyber-lime">{notice}</p>}

        {activeTab === "dashboard" && (
          <>
            <LearningOpsDashboard
              user={user}
              games={gameData.games}
              scores={user.scores || []}
              attempts={user.attempts || []}
              overview={dashboardOverview}
            />
            <ProgressPanel
              games={gameData.games}
              scores={user.scores || []}
              attempts={user.attempts || []}
              onOpenGame={setActiveTab}
            />
          </>
        )}
        {activeTab === "lms" && <LearningManagementSystem user={user} onOpenGame={setActiveTab} onSessionExpired={handleSessionExpired} />}
        {activeTab === "games" && <GameHub games={gameData.games} scores={user.scores || []} onOpenGame={setActiveTab} />}
        {activeTab === "profile" && <TeacherProfile />}
        {activeTab === "osi" && <OSIGame onScore={submitScore} />}
        {activeTab === "cable" && <CableCrimping onScore={submitScore} />}
        {activeGame && <ActiveUnitGame game={activeGame} onScore={submitScore} />}
        {activeTab === "leaderboard" && <Leaderboard rows={leaderboard} activeGame={activeBoard} onGameChange={setActiveBoard} />}
        {activeTab === "units" && <Units units={gameData.units} />}
      </div>
      <CopyrightBar />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
