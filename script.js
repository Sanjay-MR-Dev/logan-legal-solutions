(function () {
  const cfg = SITE_CONFIG;
  const MAX_PHOTOS = 3;

  document.getElementById("companyName").textContent = cfg.firmName;
  document.getElementById("appbarBrand").textContent = cfg.firmName;
  document.getElementById("footerFirmName").textContent = cfg.firmName;
  document.getElementById("firmName").textContent = cfg.firmName;
  document.getElementById("profileName").textContent = cfg.advocateName;
  document.getElementById("profileQualifications").textContent = cfg.qualifications || "";
  document.getElementById("profileTitle").textContent = cfg.title;
  document.getElementById("locationDisplay").textContent = cfg.location || "";
  document.getElementById("contactPhone").href = `tel:+${cfg.phone}`;
  document.getElementById("phoneDisplay").textContent = cfg.phoneDisplay;
  document.getElementById("contactEmail").href = `mailto:${cfg.email}`;
  document.getElementById("emailDisplay").textContent = cfg.email;
  document.getElementById("contactInstagram").href = cfg.instagram;
  const profilePhoto = document.getElementById("profilePhoto");
  profilePhoto.src = cfg.photoPath;
  profilePhoto.alt = cfg.advocateName;
  profilePhoto.onerror = function () {
    this.onerror = null;
    this.src = "assets/lawyer-photo.svg";
  };
  document.title = `${cfg.firmName} | Consumer Rights Advocate`;

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  function openWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    const phone = cfg.phone;

    if (isMobileDevice()) {
      window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`, "_blank");
    }
  }

  // Scroll spy
  const tabs = document.querySelectorAll(".appbar-tab");
  const sections = document.querySelectorAll(".page-section");
  let isClickScrolling = false;

  function setActiveTab(tabName) {
    tabs.forEach((t) => {
      t.classList.toggle("active", t.dataset.tab === tabName);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (isClickScrolling) return;
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length > 0) {
        setActiveTab(visible[0].target.dataset.section);
      }
    },
    { root: null, rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5] }
  );

  sections.forEach((section) => observer.observe(section));

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(tab.getAttribute("href"));
      if (!target) return;
      isClickScrolling = true;
      setActiveTab(tab.dataset.tab);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => { isClickScrolling = false; }, 800);
    });
  });

  document.getElementById("appbarBrand").addEventListener("click", (e) => {
    e.preventDefault();
    isClickScrolling = true;
    setActiveTab("home");
    document.getElementById("section-home").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { isClickScrolling = false; }, 800);
  });

  // Photo upload — progressive slots (max 3)
  const photoSlotsEl = document.getElementById("photoSlots");
  const uploadedPhotos = [];

  function resetPhotos() {
    uploadedPhotos.length = 0;
    photoSlotsEl.innerHTML = "";
    addPhotoSlot(0);
  }

  function addPhotoSlot(index) {
    const slot = document.createElement("div");
    slot.className = "photo-slot";
    slot.dataset.index = index;

    const inputId = `photoInput${index}`;
    slot.innerHTML = `
      <input type="file" accept="image/*" class="photo-input" id="${inputId}" />
      <label for="${inputId}" class="photo-upload-label upload-ui">
        <span class="photo-upload-icon">📷</span>
        <span>Add Photo ${index + 1}</span>
      </label>
      <div class="photo-preview-wrap hidden preview-ui">
        <img class="photo-preview-img" alt="Photo ${index + 1}" />
        <div class="photo-preview-info">
          <p class="photo-preview-name"></p>
        </div>
        <button type="button" class="photo-remove-btn">Remove</button>
      </div>
    `;

    const input = slot.querySelector(".photo-input");
    const uploadUi = slot.querySelector(".upload-ui");
    const previewUi = slot.querySelector(".preview-ui");
    const previewImg = slot.querySelector(".photo-preview-img");
    const previewName = slot.querySelector(".photo-preview-name");
    const removeBtn = slot.querySelector(".photo-remove-btn");

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file || !file.type.startsWith("image/")) {
        input.value = "";
        return;
      }

      uploadedPhotos[index] = file;
      previewImg.src = URL.createObjectURL(file);
      previewName.textContent = file.name;
      uploadUi.classList.add("hidden");
      previewUi.classList.remove("hidden");

      const nextIndex = index + 1;
      if (nextIndex < MAX_PHOTOS && !photoSlotsEl.querySelector(`[data-index="${nextIndex}"]`)) {
        addPhotoSlot(nextIndex);
      }
    });

    removeBtn.addEventListener("click", () => {
      if (previewImg.src) URL.revokeObjectURL(previewImg.src);
      uploadedPhotos[index] = null;

      for (let i = photoSlotsEl.children.length - 1; i > index; i--) {
        const child = photoSlotsEl.children[i];
        const img = child.querySelector(".photo-preview-img");
        if (img && img.src) URL.revokeObjectURL(img.src);
        child.remove();
        uploadedPhotos.pop();
      }

      input.value = "";
      previewImg.src = "";
      previewName.textContent = "";
      uploadUi.classList.remove("hidden");
      previewUi.classList.add("hidden");
    });

    photoSlotsEl.appendChild(slot);
  }

  // Modal
  const overlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const modalCategory = document.getElementById("modalCategory");
  const subjectProduct = document.getElementById("subjectProduct");
  const subjectProductLabel = document.getElementById("subjectProductLabel");
  const issueDetails = document.getElementById("issueDetails");
  const phoneNumber = document.getElementById("phoneNumber");
  let selectedIssue = "";

  const SUBJECT_LABEL_DEFAULT = "Subject or Product Details";
  const SUBJECT_LABEL_OTHERS = "Service or Product Details";
  const SUBJECT_PLACEHOLDER_DEFAULT = "e.g. Product name, company name, order ID...";
  const SUBJECT_PLACEHOLDER_OTHERS = "e.g. Service name, provider, company name...";

  function updateSubjectField(issue) {
    const isOthers = issue === "Others";
    const labelText = isOthers ? SUBJECT_LABEL_OTHERS : SUBJECT_LABEL_DEFAULT;
    subjectProductLabel.innerHTML = `${labelText} <span class="required">*</span>`;
    subjectProduct.placeholder = isOthers
      ? SUBJECT_PLACEHOLDER_OTHERS
      : SUBJECT_PLACEHOLDER_DEFAULT;
  }

  document.querySelectorAll(".complaint-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedIssue = card.dataset.issue;
      modalCategory.textContent = selectedIssue;
      updateSubjectField(selectedIssue);
      subjectProduct.value = "";
      issueDetails.value = "";
      phoneNumber.value = "";
      resetPhotos();
      openModal();
    });
  });

  function openModal() {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => subjectProduct.focus(), 300);
  }

  function closeModal() {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    photoSlotsEl.querySelectorAll(".photo-preview-img").forEach((img) => {
      if (img.src) URL.revokeObjectURL(img.src);
    });
  }

  modalClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function getPhotoFiles() {
    return uploadedPhotos.filter((f) => f instanceof File);
  }

  function buildMessage() {
    const subject = subjectProduct.value.trim();
    const details = issueDetails.value.trim();
    const phone = phoneNumber.value.trim();

    if (!subject || !details || !phone) {
      alert("Please fill in Subject/Product Details, Issue Details, and phone number.");
      return null;
    }

    const files = getPhotoFiles();
    const subjectHeading =
      selectedIssue === "Others" ? "Service / Product" : "Subject / Product";
    let message =
      `*New Complaint — ${cfg.firmName}*\n\n` +
      `*Category:* ${selectedIssue}\n` +
      `*Phone:* ${phone}\n\n` +
      `*${subjectHeading}:*\n${subject}\n\n` +
      `*Issue Details:*\n${details}`;

    if (files.length > 0) {
      message += `\n\n*Photos attached:* ${files.length} image(s)`;
    }

    return message;
  }

  async function shareComplaint(platform) {
    const message = buildMessage();
    if (!message) return;

    const files = getPhotoFiles();

    if (files.length > 0 && navigator.share) {
      const shareData = { title: `Complaint — ${selectedIssue}`, text: message, files };
      try {
        if (navigator.canShare && navigator.canShare({ files })) {
          await navigator.share(shareData);
          closeModal();
          return;
        }
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    if (platform === "whatsapp") {
      openWhatsApp(message);
      if (files.length > 0) {
        setTimeout(() => {
          alert(
            `${files.length} photo(s) selected.\n\n` +
            "In WhatsApp, tap the attachment icon and add your photos from the gallery."
          );
        }, 600);
      }
    } else {
      window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(message)}`, "_blank");
      if (cfg.telegramUsername) {
        setTimeout(() => {
          window.open(`https://t.me/${cfg.telegramUsername}`, "_blank");
        }, 800);
      }
      if (files.length > 0) {
        setTimeout(() => {
          alert(
            `${files.length} photo(s) selected.\n\n` +
            "In Telegram, attach your photos manually in the chat."
          );
        }, 1000);
      }
    }

    closeModal();
  }

  document.getElementById("sendWhatsApp").addEventListener("click", () => {
    shareComplaint("whatsapp");
  });

  document.getElementById("sendTelegram").addEventListener("click", () => {
    shareComplaint("telegram");
  });
})();
