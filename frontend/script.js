document.addEventListener("DOMContentLoaded", function () {
  console.log("Script loaded - checking elements:");
  console.log("adminLink:", document.getElementById("adminLink"));
  console.log("adminPanel:", document.getElementById("adminPanel"));
  console.log("loginFormContainer:", document.getElementById("loginFormContainer"));
  console.log("adminLoginForm:", document.getElementById("adminLoginForm"));
  // Envelope and Wedding Content Elements
  const envelopeContainer = document.getElementById("envelopeContainer");
  const weddingContent = document.getElementById("weddingContent");
  const openEnvCheckbox = document.getElementById("open-env");

  // Initialize - Hide wedding content initially
  if (weddingContent) {
    weddingContent.style.display = "none";
  }

  // When envelope is opened, show wedding content
  if (openEnvCheckbox) {
    openEnvCheckbox.addEventListener("change", function () {
      if (this.checked) {
        // Add class to env element
        const envElement = this.closest(".env");
        if (envElement) {
          envElement.classList.add("opened");
        }
        // Wait for envelope content to be fully revealed
        setTimeout(() => {
          // Fade out the video
          const envelopeVideo = document.getElementById("envelopeVideo");
          if (envelopeVideo) {
            envelopeVideo.style.transition = "opacity 1.2s ease";
            envelopeVideo.style.opacity = "0";

            // Optional: Pause video after fade out
            setTimeout(() => {
              envelopeVideo.pause();
            }, 1200);
          }

          setTimeout(() => {
            if (envelopeContainer) {
              envelopeContainer.style.opacity = "0";
              envelopeContainer.style.transform = "scale(0.8) translateY(-50px)";
              envelopeContainer.style.transition = "all 1s cubic-bezier(0.4, 0, 0.2, 1)";

              setTimeout(() => {
                envelopeContainer.style.display = "none";
                weddingContent.style.display = "block";
                initFAQ();
                weddingContent.style.opacity = "0";
                weddingContent.style.transform = "translateY(30px) scale(0.98)";
                weddingContent.style.transition = "opacity 1.2s ease, transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

                void weddingContent.offsetWidth;
                weddingContent.style.opacity = "1";
                weddingContent.style.transform = "translateY(0) scale(1)";

                // START MUSIC WHEN ENVELOPE OPENS - icon should show volume up
                if (backgroundMusic) {
                  backgroundMusic.volume = 0.3;
                  const playPromise = backgroundMusic.play();

                  if (playPromise !== undefined) {
                    playPromise
                      .then(() => {
                        console.log("Music started successfully");
                        // Update icon to show volume up
                        if (musicToggle) {
                          musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                          musicToggle.setAttribute("data-playing", "true");
                        }
                      })
                      .catch((e) => {
                        console.log("Auto-play prevented");
                        // Keep icon as mute if autoplay failed
                        if (musicToggle) {
                          musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                          musicToggle.setAttribute("data-playing", "false");
                        }
                      });
                  }
                }

                window.scrollTo({ top: 0, behavior: "smooth" });

                setTimeout(() => {
                  initBackgroundSlider();
                }, 500);
              }, 1000);
            }
          }, 800);
        }, 1500); // Wait for envelope content reveal animation to complete
      }
    });
  }

  const rsvpForm = document.getElementById("rsvpForm");
  const attendanceSelect = document.getElementById("attendance");
  const guestCountGroup = document.getElementById("guestCountGroup");
  const mealPreferenceGroup = document.getElementById("mealPreferenceGroup");
  const countdownElement = document.getElementById("countdown");
  const musicToggle = document.getElementById("musicToggle");
  const backgroundMusic = document.getElementById("backgroundMusic");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.querySelector(".lightbox-close");
  const messageDiv = document.getElementById("rsvpMessage");
  const submitBtn = document.getElementById("submitBtn");
  const spinner = document.getElementById("spinner");
  const adminLink = document.getElementById("adminLink");
  const adminPanel = document.getElementById("adminPanel");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const exportBtn = document.getElementById("exportBtn");
  const statsContainer = document.getElementById("statsContainer");
  const rsvpTableBody = document.querySelector("#rsvpTable tbody");
  const deadlineMessage = document.getElementById("deadlineMessage");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // Wedding Date
  const weddingDate = new Date("2027-03-26T13:00:00");

  // Update countdown every second - MODIFIED VERSION
  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;
  
    if (diff <= 0) {
      // Only update secondary countdown
      const countdownSec = document.getElementById("countdown-secondary");
      if (countdownSec) {
        countdownSec.innerHTML =
          '<div class="countdown-item-secondary"><span class="countdown-number-secondary">🎉</span><span class="countdown-label-secondary">Wedding Day!</span></div>';
      }
      return;
    }
  
    // Remove the primary countdown updates since those elements don't exist
    // Just call updateSecondaryCountdown instead
    updateSecondaryCountdown();
  }
  
  // Keep updateSecondaryCountdown as is
  function updateSecondaryCountdown() {
    const now = new Date();
    const diff = weddingDate - now;
  
    if (diff <= 0) {
      const countdownSec = document.getElementById("countdown-secondary");
      if (countdownSec) {
        countdownSec.innerHTML =
          '<div class="countdown-item-secondary"><span class="countdown-number-secondary">🎉</span><span class="countdown-label-secondary">Wedding Day!</span></div>';
      }
      return;
    }
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
    const daysSec = document.getElementById("days-sec");
    const hoursSec = document.getElementById("hours-sec");
    const minutesSec = document.getElementById("minutes-sec");
    const secondsSec = document.getElementById("seconds-sec");
  
    if (daysSec) daysSec.textContent = days.toString().padStart(2, "0");
    if (hoursSec) hoursSec.textContent = hours.toString().padStart(2, "0");
    if (minutesSec) minutesSec.textContent = minutes.toString().padStart(2, "0");
    if (secondsSec) secondsSec.textContent = seconds.toString().padStart(2, "0");
  }
  // Conditional form fields
  if (attendanceSelect) {
    attendanceSelect.addEventListener("change", function () {
      const isAttending = this.value === "Accepts with pleasure";

      if (isAttending) {
        guestCountGroup.classList.add("visible");
        mealPreferenceGroup.classList.add("visible");
        document.getElementById("guest_count").required = true;
        document.getElementById("meal_preference").required = true;
      } else {
        guestCountGroup.classList.remove("visible");
        mealPreferenceGroup.classList.remove("visible");
        document.getElementById("guest_count").required = false;
        document.getElementById("meal_preference").required = false;
      }
    });
  }

  // Form validation
  function validateForm(formData) {
    const errors = [];

    if (!formData.get("guest_name").trim()) {
      errors.push("Full name is required");
    }

    if (!formData.get("attendance")) {
      errors.push("Please select attendance");
    }

    if (formData.get("attendance") === "Accepts with pleasure") {
      const guestCount = parseInt(formData.get("guest_count"));
      if (!guestCount || guestCount < 1) {
        errors.push("Please enter a valid number of guests");
      }

      if (!formData.get("meal_preference")) {
        errors.push("Meal preference is required");
      }
    }

    return errors;
  }

  // Form submission
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const errors = validateForm(formData);

      if (errors.length > 0) {
        showMessage(errors.join("<br>"), "error");
        return;
      }

      showLoading(true);

      const data = {
        guest_name: formData.get("guest_name"),
        attendance: formData.get("attendance"),
        guest_count:
          formData.get("attendance") === "Accepts with pleasure"
            ? parseInt(formData.get("guest_count"))
            : 0,
        meal_preference:
          formData.get("attendance") === "Accepts with pleasure"
            ? formData.get("meal_preference")
            : null,
        message: formData.get("guest_message") || ""
      };

      try {
        const response = await fetch("/api/rsvp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          showMessage(result.message, "success");
          rsvpForm.reset();
          guestCountGroup.classList.remove("visible");
          mealPreferenceGroup.classList.remove("visible");

          // Update admin panel if open
          if (adminPanel && adminPanel.style.display === "block") {
            await loadAdminData();
          }
        } else {
          showMessage(result.error || "An error occurred", "error");
        }
      } catch (error) {
        console.error("Submission error:", error);
        showMessage("Network error. Please try again.", "error");
      } finally {
        showLoading(false);
      }
    });
  }

  // Lightbox functionality
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const imgSrc = this.querySelector("img").src;
      lightboxImg.src = imgSrc;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // Music toggle
  if (musicToggle && backgroundMusic) {
    // Set initial volume
    backgroundMusic.volume = 0.3;

    // Function to update icon based on actual audio state
    function updateMusicIcon() {
      if (backgroundMusic.paused) {
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        musicToggle.setAttribute("data-playing", "false");
      } else {
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        musicToggle.setAttribute("data-playing", "true");
      }
    }

    // Initial icon update (starts with mute)
    updateMusicIcon();

    // Toggle music on click
    musicToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (backgroundMusic.paused) {
        backgroundMusic.play()
          .then(() => {
            updateMusicIcon();
          })
          .catch(error => {
            console.log("Play failed:", error);
            updateMusicIcon();
          });
      } else {
        backgroundMusic.pause();
        updateMusicIcon();
      }
    });
  }

  // Show message
  function showMessage(text, type) {
    if (!messageDiv) return;

    messageDiv.innerHTML = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";

    setTimeout(() => {
      messageDiv.style.display = "none";
    }, 5000);
  }

  // Loading state
  function showLoading(show) {
    if (!submitBtn || !spinner) return;

    if (show) {
      submitBtn.disabled = true;
      spinner.style.display = "block";
      submitBtn.innerHTML = "Submitting...";
    } else {
      submitBtn.disabled = false;
      spinner.style.display = "none";
      submitBtn.innerHTML = 'Submit RSVP <i class="fas fa-paper-plane"></i>';
    }
  }

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("section-hidden");
    observer.observe(section);
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      // Skip if it's just "#"
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });

        // Update URL hash for direct linking
        history.pushState(null, null, targetId);
      }
    });
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      this.innerHTML = navMenu.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside on mobile
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768 && navMenu.classList.contains("active")) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          navMenu.classList.remove("active");
          navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768 && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  }

  // Update countdown every second
  setInterval(updateCountdown, 1000);
  setInterval(updateSecondaryCountdown, 1000);
  updateCountdown();
  updateSecondaryCountdown();

  // Check RSVP deadline on load
  checkRSVPDeadline();

// Admin Panel Functions - UPDATED VERSION
if (adminLink) {
  adminLink.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Admin link clicked"); // Debug
    showAdminPanel();
  });
}

async function showAdminPanel() {
  if (!adminPanel) {
    console.error("❌ Admin panel element not found!");
    return;
  }

  console.log("🟢 Showing admin panel");
  adminPanel.style.display = "block";

  // Check if already logged in from localStorage
  const token = localStorage.getItem("adminToken");
  const user = localStorage.getItem("adminUser");

  console.log("📝 Token exists:", !!token);
  console.log("📝 User exists:", !!user);
  console.log("📝 Token value:", token ? token.substring(0, 20) + "..." : "null");
  console.log("📝 User value:", user || "null");

  const loginFormContainer = document.getElementById("loginFormContainer");
  const adminContent = document.getElementById("adminContent");

  console.log("🔍 loginFormContainer exists:", !!loginFormContainer);
  console.log("🔍 adminContent exists:", !!adminContent);

  if (!loginFormContainer || !adminContent) {
    console.error("❌ Login form or admin content elements not found!");
    console.log("🔍 Checking all elements in adminPanel:");
    if (adminPanel) {
      console.log("Admin panel HTML:", adminPanel.innerHTML.substring(0, 500));
    }
    return;
  }

  if (token && user) {
    // Already logged in, load data directly
    console.log("🟢 Already logged in, loading admin data");
    loginFormContainer.style.display = "none";
    adminContent.style.display = "block";
    await loadAdminData();
  } else {
    // Show login form
    console.log("🟢 Not logged in, showing login form");
    loginFormContainer.style.display = "block";
    adminContent.style.display = "none";
    
    // Clear any previous form values
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
  }
  
  console.log("✅ Final display states:");
  console.log("  - loginFormContainer:", loginFormContainer.style.display);
  console.log("  - adminContent:", adminContent.style.display);
}
  
async function loadAdminData() {
  try {
    console.log("Loading admin data..."); // Debug

    // Load stats and RSVPs
    const response = await fetch("/api/stats");
    console.log("Stats response:", response.status); // Debug

    if (response.ok) {
      const data = await response.json();
      console.log("Stats data:", data); // Debug
      updateStats(data.stats);
      updateRSVPTable(data.stats.recent_rsvps || []);

      // Show admin content
      document.getElementById("loginFormContainer").style.display = "none";
      document.getElementById("adminContent").style.display = "block";
    } else {
      const errorText = await response.text();
      console.error("Failed to load admin data:", errorText);
      showMessage("Failed to load admin data. Check console for details.", "error");
    }
  } catch (error) {
    console.error("Error loading admin data:", error);
    showMessage("Error loading admin data: " + error.message, "error");
  }
}

// Update admin login form handler
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
      username: formData.get("username"),
      password: formData.get("password")
    };

    console.log("Attempting login with username:", data.username); // Debug

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      console.log("Login response status:", response.status); // Debug
      const result = await response.json();
      console.log("Login result:", result); // Debug

      if (response.ok && result.success) {
        // Store token in localStorage
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminUser", result.username);

        // Hide login form, show admin content
        document.getElementById("loginFormContainer").style.display = "none";
        document.getElementById("adminContent").style.display = "block";

        // Load admin data
        await loadAdminData();
        showMessage("Login successful!", "success");
      } else {
        showMessage(result.error || "Invalid username or password", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("Network error. Please check your connection.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// Update logout function
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    console.log("Logging out"); // Debug
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    document.getElementById("loginFormContainer").style.display = "block";
    document.getElementById("adminContent").style.display = "none";

    showMessage("Logged out successfully", "success");
  });
}
  // Update export function
  if (exportBtn) {
    exportBtn.addEventListener("click", async function () {
      try {
        const response = await fetch("/api/export");
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "wedding-rsvps.csv";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          showMessage("Export failed", "error");
        }
      } catch (error) {
        console.error("Export error:", error);
        showMessage("Export failed", "error");
      }
    });
  }

  // Update stats display
  function updateStats(data) {
    if (!statsContainer || !data) return;

    statsContainer.innerHTML = `
            <div class="stat-card">
                <span class="stat-number">${data.total_responses || 0}</span>
                <span>Total Responses</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${data.total_guests || 0}</span>
                <span>Total Guests</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${data.attending_count || 0}</span>
                <span>Attending</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${data.declining_count || 0}</span>
                <span>Declining</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${data.messages_count || 0}</span>
                <span>Messages</span>
            </div>
        `;
  }

  async function checkRSVPDeadline() {
    if (!deadlineMessage) return;

    try {
      const response = await fetch("/api/rsvp-deadline");
      const data = await response.json();

      if (data.passed) {
        deadlineMessage.style.display = "block";
        if (rsvpForm) {
          rsvpForm
            .querySelectorAll("input, select, textarea, button")
            .forEach((el) => {
              el.disabled = true;
            });
          if (submitBtn) {
            submitBtn.textContent = "RSVP Closed";
          }
        }
      }
    } catch (error) {
      console.error("Error checking deadline:", error);
    }
  }

  function updateRSVPTable(rsvps) {
    if (!rsvpTableBody) return;

    rsvpTableBody.innerHTML = "";

    rsvps.forEach((rsvp) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${escapeHtml(rsvp.guest_name || "")}</td>
                <td>${escapeHtml(rsvp.attendance || "")}</td>
                <td>${rsvp.guest_count || "-"}</td>
                <td>${escapeHtml(rsvp.meal_preference || "-")}</td>
                <td>${escapeHtml(rsvp.message || "-")}</td>
                <td>${new Date(rsvp.submission_date).toLocaleDateString()}</td>
            `;
      rsvpTableBody.appendChild(row);
    });
  }

  // Also add this escapeHtml function if not already defined
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Close admin panel when clicking outside
  if (adminPanel) {
    adminPanel.addEventListener("click", function (e) {
      if (e.target === adminPanel) {
        adminPanel.style.display = "none";
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeLightbox();
      if (adminPanel && adminPanel.style.display === "block") {
        adminPanel.style.display = "none";
      }
    }
  });

  // FAQ Question
  function initFAQ() {
    document.querySelectorAll(".faq-question").forEach((question) => {
      question.addEventListener("click", function () {
        const item = this.parentElement;

        document.querySelectorAll(".faq-item").forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
          }
        });

        item.classList.toggle("active");
      });
    });
  }

  // Message Form
  function initMessageForm() {
    const messageForm = document.getElementById("messageForm");

    if (messageForm) {
      messageForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = this.querySelector("#messageName").value.trim();
        const message = this.querySelector("#messageContent").value.trim();

        if (!name || !message) {
          showMessage("Please fill in all fields", "error");
          return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Posting...';

        try {
          const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, content: message })
          });

          const result = await response.json();

          if (response.ok) {
            showMessage("Thank you for your message!", "success");
            this.reset();

            // Add new message to the grid immediately
            addMessageToGrid({
              name,
              content: message,
              date: new Date().toISOString()
            });
          } else {
            showMessage(result.error || "Failed to post message", "error");
          }
        } catch (error) {
          console.error("Message submission error:", error);
          showMessage("Network error. Please try again.", "error");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    }

    // Function to add message to grid
    function addMessageToGrid(message) {
      const messagesGrid = document.getElementById("messagesGrid");
      if (!messagesGrid) return;

      const messageCard = document.createElement("div");
      messageCard.className = "message-card";

      const date = new Date(message.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      messageCard.innerHTML = `
                <div class="message-header">
                    <div class="message-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="message-author">
                        <h4>${escapeHtml(message.name)}</h4>
                        <span class="message-date">${date}</span>
                    </div>
                </div>
                <div class="message-content">
                    <p>${escapeHtml(message.content)}</p>
                </div>
            `;

      // Add to the beginning of the grid
      messagesGrid.insertBefore(messageCard, messagesGrid.firstChild);

      // Limit to 20 messages
      if (messagesGrid.children.length > 20) {
        messagesGrid.removeChild(messagesGrid.lastChild);
      }
    }

    // Helper function to prevent XSS
    function escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Add home link functionality - this handles the scrolling
  document.querySelectorAll('a[href="#home"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      // Close mobile menu if open (optional - add this to the existing handler)
      const navMenu = document.getElementById('navMenu');
      const navToggle = document.getElementById('navToggle');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });
  });

  // No separate nav-brand click handler needed!
  // Initialize FAQ and Message Form
  initFAQ();
  initMessageForm();

  // Enhanced scroll animations for cards
  const enhancedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".detail-card, .sponsor-card, .message-card")
    .forEach((card) => {
      enhancedObserver.observe(card);
    });

  // Initialize story timeline animations
  function initStoryTimeline() {
    const timelineItems = document.querySelectorAll(".timeline-item");

    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${
        index * 0.2
      }s`;
      timelineObserver.observe(item);
    });
  }

  initStoryTimeline();

  function initParallax() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector(".hero");
      const countdown = document.querySelector(".countdown-section");

      if (hero) {
        hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
      }

      if (countdown) {
        countdown.style.backgroundPositionY = `${scrolled * 0.3}px`;
      }
    });
  }

  initParallax();

  // Floating elements
  function createFloatingElements() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const floatingElements = document.createElement("div");
    floatingElements.className = "floating-elements";

    for (let i = 0; i < 4; i++) {
      const element = document.createElement("div");
      element.className = "floating-element";
      element.innerHTML = "❖";
      element.style.fontSize = `${Math.random() * 2 + 1}rem`;
      element.style.color = `rgba(212, 175, 55, ${Math.random() * 0.3 + 0.1})`;
      floatingElements.appendChild(element);
    }

    hero.appendChild(floatingElements);
  }

  createFloatingElements();

  // Simple Background Slider with Door Animation
  function initBackgroundSlider() {
    const bgSlides = document.querySelectorAll(".bg-slide");
    const leftDoor = document.querySelector(".door.left");
    const rightDoor = document.querySelector(".door.right");
    let currentBg = 0;
    let autoSlideInterval;
    let animationStarted = false;

    function openDoors() {
      if (animationStarted) return;
      animationStarted = true;

      // Start door opening animation
      setTimeout(() => {
        leftDoor.classList.add("open-left");
        rightDoor.classList.add("open-right");

        // Start background slideshow after doors open
        setTimeout(() => {
          startAutoSlide();
        }, 800);
      }, 500);
    }

    function updateBackground() {
      bgSlides.forEach((slide, index) => {
        slide.classList.remove("active");
        if (index === currentBg) {
          slide.classList.add("active");
        }
      });
    }

    function nextBackground() {
      currentBg = (currentBg + 1) % bgSlides.length;
      updateBackground();
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextBackground, 5000); // Change every 5 seconds
    }

    // Initialize
    if (bgSlides.length > 0) {
      // Preload images for smooth transition
      const images = [
        "/images/ONE.jpg",
        "/images/TWO.jpg",
        "/images/THREE.jpeg"
      ];

      let loadedImages = 0;
      let allImagesLoaded = false;

      images.forEach((src) => {
        const img = new Image();
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            allImagesLoaded = true;
            // Start animation when all images are loaded
            setTimeout(openDoors, 300);
          }
        };
        img.onerror = () => {
          loadedImages++;
          console.warn(`Failed to load image: ${src}`);
          if (loadedImages === images.length && !allImagesLoaded) {
            // Still start animation even if some images fail
            setTimeout(openDoors, 300);
          }
        };
        img.src = src;
      });

      // Fallback: start animation after 3 seconds even if images not loaded
      setTimeout(() => {
        if (!animationStarted) {
          openDoors();
        }
      }, 3000);

      updateBackground();
    }
  }

  // Remove old carousel/background functions and replace with:
  setTimeout(() => {
    initBackgroundSlider();
  }, 100);

  console.log("Wedding RSVP App initialized");
// Admin Modal Functions
function openAdminModal() {
  const modal = document.getElementById('adminModal');
  modal.classList.add('show');
  
  // Check if already logged in
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  
  if (token && user) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
}

function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  modal.classList.remove('show');
}

function showAdminLogin() {
  document.getElementById('adminLoginSection').style.display = 'block';
  document.getElementById('adminDashboardSection').style.display = 'none';
  document.getElementById('adminLoginForm').reset();
  document.getElementById('adminLoginError').style.display = 'none';
}

function showAdminDashboard() {
  document.getElementById('adminLoginSection').style.display = 'none';
  document.getElementById('adminDashboardSection').style.display = 'block';
  loadAdminDashboard();
}

async function handleAdminLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  const loginBtn = document.getElementById('adminLoginBtn');
  const errorDiv = document.getElementById('adminLoginError');
  
  // Show loading state
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  errorDiv.style.display = 'none';
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminUser', result.username);
      showAdminDashboard();
    } else {
      errorDiv.textContent = result.error || 'Invalid credentials';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorDiv.textContent = 'Network error. Please try again.';
    errorDiv.style.display = 'block';
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
  }
}

function handleAdminLogout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  showAdminLogin();
}

async function loadAdminDashboard() {
  const statsContainer = document.getElementById('adminStatsContainer');
  const tableBody = document.getElementById('adminRsvpTableBody');
  
  // Show loading state
  statsContainer.innerHTML = '<div class="admin-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading dashboard...</p></div>';
  tableBody.innerHTML = '<tr><td colspan="6" class="admin-loading">Loading RSVPs...</td></tr>';
  
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();
    
    if (data.stats) {
      // Update stats
      statsContainer.innerHTML = `
        <div class="admin-stat-card">
          <span class="admin-stat-number">${data.stats.total_responses || 0}</span>
          <span class="admin-stat-label">Total Responses</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-number">${data.stats.total_guests || 0}</span>
          <span class="admin-stat-label">Total Guests</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-number">${data.stats.attending_count || 0}</span>
          <span class="admin-stat-label">Attending</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-number">${data.stats.declining_count || 0}</span>
          <span class="admin-stat-label">Declining</span>
        </div>
        <div class="admin-stat-card">
          <span class="admin-stat-number">${data.stats.messages_count || 0}</span>
          <span class="admin-stat-label">Messages</span>
        </div>
      `;
      
      // Update table
      tableBody.innerHTML = '';
      const rsvps = data.stats.recent_rsvps || [];
      
      if (rsvps.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No RSVPs yet</td></tr>';
      } else {
        rsvps.forEach(rsvp => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${escapeHtml(rsvp.guest_name || '')}</td>
            <td>${escapeHtml(rsvp.attendance || '')}</td>
            <td>${rsvp.guest_count || 0}</td>
            <td>${escapeHtml(rsvp.meal_preference || '-')}</td>
            <td>${escapeHtml(rsvp.message || '-')}</td>
            <td>${new Date(rsvp.submission_date).toLocaleDateString()}</td>
          `;
          tableBody.appendChild(row);
        });
      }
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
    statsContainer.innerHTML = '<div class="admin-error-message">Failed to load dashboard data</div>';
    tableBody.innerHTML = '<tr><td colspan="6" class="admin-error-message">Failed to load RSVPs</td></tr>';
  }
}

async function refreshAdminData() {
  await loadAdminDashboard();
}

async function exportRSVPs() {
  try {
    const response = await fetch('/api/export');
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert('Export failed. Please try again.');
    }
  } catch (error) {
    console.error('Export error:', error);
    alert('Export failed. Please try again.');
  }
}

// Update admin link click handler
document.addEventListener('DOMContentLoaded', function() {
  const adminLink = document.getElementById('adminLink');
  if (adminLink) {
    adminLink.addEventListener('click', function(e) {
      e.preventDefault();
      openAdminModal();
    });
  }
  
  // Close modal when clicking outside
  const modal = document.getElementById('adminModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeAdminModal();
      }
    });
  }
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('adminModal');
      if (modal && modal.classList.contains('show')) {
        closeAdminModal();
      }
    }
  });
});

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}  
});
