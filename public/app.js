const els = {
  profileName: document.querySelector("#profileName"),
  profileMission: document.querySelector("#profileMission"),
  profileTags: document.querySelector("#profileTags"),
  profileInfo: document.querySelector("#profileInfo"),
  newsGrid: document.querySelector("#newsGrid"),
  unitList: document.querySelector("#unitList"),
  unitCount: document.querySelector("#unitCount"),
  planCount: document.querySelector("#planCount"),
  learnerRows: document.querySelector("#learnerRows"),
  learnerSummary: document.querySelector("#learnerSummary"),
  learnerForm: document.querySelector("#learnerForm"),
  imageModal: document.querySelector("#imageModal"),
  modalImage: document.querySelector("#modalImage"),
  modalCategory: document.querySelector("#modalCategory"),
  modalTitle: document.querySelector("#modalTitle"),
  modalDescription: document.querySelector("#modalDescription"),
  modalClose: document.querySelector(".modal-close")
};

async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function escapeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function openImageModal({ image, title, category, description }) {
  els.modalImage.src = image;
  els.modalImage.alt = title;
  els.modalCategory.textContent = category;
  els.modalTitle.textContent = title;
  els.modalDescription.textContent = description;
  els.imageModal.classList.add("open");
  els.imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeImageModal() {
  els.imageModal.classList.remove("open");
  els.imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  els.modalImage.removeAttribute("src");
}

function attachImageViewer(scope = document) {
  scope.querySelectorAll("[data-preview-image]").forEach((button) => {
    button.addEventListener("click", () => {
      openImageModal({
        image: button.dataset.previewImage,
        title: button.dataset.previewTitle,
        category: button.dataset.previewCategory,
        description: button.dataset.previewDescription
      });
    });
  });
}

function renderProfile(profile, highlights = []) {
  els.profileName.textContent = profile.name_en || profile.name_th;
  els.profileMission.textContent = profile.mission;
  els.profileTags.innerHTML = highlights.map((item) => `<span>${item}</span>`).join("");
  const rows = [
    ["ตำแหน่ง", profile.position],
    ["หน่วยงาน", `${profile.department} ${profile.college}`],
    ["อีเมล", profile.email],
    ["โทรศัพท์", profile.phone],
    ["ที่อยู่", profile.address]
  ];
  els.profileInfo.innerHTML = rows.map(([label, value]) => `
    <div class="info-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function renderActivityNews(news) {
  els.newsGrid.innerHTML = news.map((item, index) => `
    <article class="news-card ${index === 0 ? "lead-news" : ""}">
      <button class="news-image preview-button" type="button"
        data-preview-image="${escapeText(item.image_url)}"
        data-preview-title="${escapeText(item.title)}"
        data-preview-category="${escapeText(item.category)}"
        data-preview-description="${escapeText(item.lead)}">
        <img src="${item.image_url}" alt="${item.title}" loading="lazy">
        <span>View image</span>
      </button>
      <div class="news-content">
        <span>${item.category}${item.published_at ? ` • ${item.published_at}` : ""}</span>
        <h3>${item.title}</h3>
        <p class="news-lead">${item.lead}</p>
        <p>${item.body}</p>
        <div class="learning-profile">
          <strong>Profile from activity</strong>
          <p>${item.learning_profile}</p>
        </div>
      </div>
    </article>
  `).join("");
}

function renderUnits(units, plans) {
  els.unitCount.textContent = units.length;
  els.planCount.textContent = plans.length;
  els.unitList.innerHTML = units.map((unit) => {
    const unitPlans = plans.filter((plan) => plan.unit_id === unit.id);
    return `
      <article class="unit-card">
        <header>
          <span class="unit-number">${unit.id}</span>
          <div>
            <small>${unit.hours} ชั่วโมง • ${unit.bloom}</small>
            <h3>${unit.title}</h3>
          </div>
        </header>
        <p>${unit.objectives}</p>
        <strong>${unit.competency}</strong>
        <small>${unitPlans.map((plan) => plan.code).join(", ")}</small>
      </article>
    `;
  }).join("");
}

function renderLearners(learners) {
  els.learnerSummary.textContent = `${learners.length} ผู้เรียน`;
  els.learnerRows.innerHTML = learners.map((learner) => `
    <tr>
      <td>${learner.student_code}</td>
      <td>${learner.name}</td>
      <td>${learner.group_name}</td>
      <td>
        <div class="progress">
          <span class="bar"><i style="width:${Number(learner.progress)}%"></i></span>
          <span>${learner.progress}%</span>
        </div>
      </td>
      <td>${learner.score}</td>
      <td>${learner.status}</td>
    </tr>
  `).join("");
}

async function loadSite() {
  const [site, learners] = await Promise.all([
    api("/api/site"),
    api("/api/learners")
  ]);
  renderProfile(site.profile, site.profileHighlights);
  renderActivityNews(site.activityNews);
  attachImageViewer();
  renderUnits(site.units, site.plans);
  renderLearners(learners);
}

els.modalClose.addEventListener("click", closeImageModal);
els.imageModal.addEventListener("click", (event) => {
  if (event.target === els.imageModal) closeImageModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && els.imageModal.classList.contains("open")) closeImageModal();
});

els.learnerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formData(event.currentTarget);
  await api("/api/learners", {
    method: "POST",
    body: JSON.stringify(data)
  });
  event.currentTarget.reset();
  loadSite();
});

loadSite().catch((error) => {
  document.body.insertAdjacentHTML("afterbegin", `<p style="padding:16px;background:#ffd9df">${error.message}</p>`);
});
