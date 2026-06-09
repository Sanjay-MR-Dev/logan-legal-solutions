(function () {
  const cfg = SITE_CONFIG;

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

  function openTelegram(message) {
    const encoded = encodeURIComponent(message);
    const username = cfg.telegramUsername || "LogeshLogan";
    window.open(`https://t.me/${username}?text=${encoded}`, "_blank");
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

  // Modal
  const overlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const modalCategory = document.getElementById("modalCategory");
  const subjectProduct = document.getElementById("subjectProduct");
  const issueDetails = document.getElementById("issueDetails");
  const phoneNumber = document.getElementById("phoneNumber");
  let selectedIssue = "";

  document.querySelectorAll(".complaint-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedIssue = card.dataset.issue;
      modalCategory.textContent = selectedIssue;
      subjectProduct.value = "";
      issueDetails.value = "";
      phoneNumber.value = "";
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
  }

  modalClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function buildMessage(forTelegram = false) {
    const subject = subjectProduct.value.trim();
    const details = issueDetails.value.trim();
    const phone = phoneNumber.value.trim();

    if (!subject || !details || !phone) {
      alert("Please fill in Service/Product Details, Issue Details, and phone number.");
      return null;
    }

    if (forTelegram) {
      return (
        `New Complaint — ${cfg.firmName}\n\n` +
        `Category: ${selectedIssue}\n` +
        `Phone: ${phone}\n\n` +
        `Service/Product Details:\n${subject}\n\n` +
        `Issue Details:\n${details}`
      );
    }

    return (
      `*New Complaint — ${cfg.firmName}*\n\n` +
      `*Category:* ${selectedIssue}\n` +
      `*Phone:* ${phone}\n\n` +
      `*Service/Product Details:*\n${subject}\n\n` +
      `*Issue Details:*\n${details}`
    );
  }

  document.getElementById("sendWhatsApp").addEventListener("click", () => {
    const message = buildMessage();
    if (!message) return;
    openWhatsApp(message);
    closeModal();
  });

  document.getElementById("sendTelegram").addEventListener("click", () => {
    const message = buildMessage(true);
    if (!message) return;
    openTelegram(message);
    closeModal();
  });
})();
