function initVideoParallax() {
  if (window.innerWidth < 768) return; // optional mobile disable

  const sections = document.querySelectorAll(".video-parallax-section");

  function updateParallax() {
    sections.forEach((section) => {
      const video = section.querySelector(".parallax-bg-video");
      if (!video) return;

      const rect = section.getBoundingClientRect();
      const speed = 0.18;

      const movement = rect.top * speed;
      video.style.transform = `translateY(${movement}px)`;
    });

    requestAnimationFrame(updateParallax);
  }

  requestAnimationFrame(updateParallax);
}
// ============================================
// WEATHER ADVISORY - MINIMALIST LUXURY
// ============================================

async function fetchWeatherForRoxas() {
  const lat = 12.5833;
  const lon = 121.5167;

  const apiUrl =
  `https://api.open-meteo.com/v1/forecast
  ?latitude=${lat}
  &longitude=${lon}
  &current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m
  &hourly=temperature_2m
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &forecast_days=7
  &timezone=Asia%2FManila`
  .replace(/\s+/g,'');

  const weatherContainer = document.getElementById('weddingWeather');
  if (!weatherContainer) return;

  try {
    weatherContainer.innerHTML = '<div class="weather-loading"><i class="fas fa-spinner fa-spin"></i>Loading forecast</div>';

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data && data.current) {
      displayWeatherData(data);
    } else {
      throw new Error('Invalid data format');
    }

  } catch (error) {
    console.error('Weather fetch failed:', error);
    weatherContainer.innerHTML = `
      <div class="weather-error">
        <i class="fas fa-cloud-moon"></i>
        <span>Weather unavailable</span>
      </div>
    `;
  }
}
function generateWeddingAdvisory(
  temp,
  rain,
  humidity,
  wind,
  weatherCode
) {

  // Thunderstorm
  if (weatherCode === 95) {
    return `
      ⛈️ Thunderstorms are possible during the day.
      Please allow extra travel time and bring rain protection.
      Indoor preparations have been arranged for everyone's comfort.
    `;
  }

  // Heavy Rain
  if (rain >= 60) {
    return `
      🌧️ Rain showers are expected.
      Guests may wish to bring a small umbrella.
      Our celebration will proceed rain or shine.
    `;
  }

  // Hot Weather
  if (temp >= 32) {
    return `
      🌡️ Warm tropical temperatures are expected.
      Light and breathable attire is recommended.
      Stay hydrated and comfortable throughout the celebration.
    `;
  }

  // Pleasant Weather
  if (temp >= 26) {
    return `
      ☀️ Pleasant weather is expected for the celebration.
      Perfect conditions for a beautiful day with family and friends.
    `;
  }

  // Cooler Weather
  return `
    🌤️ Cooler temperatures are expected.
    Bringing a light shawl or jacket may be helpful.
  `;
}

function displayWeatherData(data) {

  const weatherContainer =
    document.getElementById("weddingWeather");

  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  const temp = Math.round(current.temperature_2m);
  const humidity = current.relative_humidity_2m;
  const wind = Math.round(current.wind_speed_10m);
  const rain = current.precipitation;
  const weatherCode = current.weather_code;

  const today = new Date();

  const dayName =
    today.toLocaleDateString("en-US", {
      weekday: "long"
    });

  const dailyCards =
    daily.time.map((date, index) => {

      const day =
        new Date(date)
        .toLocaleDateString("en-US", {
          weekday: "short"
        });

      return `
        <div class="forecast-day">
          <i class="fas fa-cloud-rain"></i>
          <span>${day}</span>
          <strong>
            ${Math.round(daily.temperature_2m_max[index])}°
          </strong>
          <small>
            ${Math.round(daily.temperature_2m_min[index])}°
          </small>
        </div>
      `;
    }).join("");

  const hourlyTemps =
    hourly.temperature_2m
      .slice(0,8)
      .map((t,index)=>{

        const hour =
          new Date(hourly.time[index])
          .toLocaleTimeString([],{
            hour:'numeric'
          });

        return `
          <div class="hour-item">
            <span>${hour}</span>
            <strong>${Math.round(t)}°</strong>
          </div>
        `;
      })
      .join("");
  const advisoryText = generateWeddingAdvisory(
    temp,
    rain,
    humidity,
    wind,
    weatherCode
  );
  weatherContainer.innerHTML = `
  
    <div class="weather-top">

      <div class="weather-main">

        <div class="weather-icon">
          <i class="fas fa-cloud-rain"></i>
        </div>

        <div class="weather-temp">
          ${temp}°
        </div>

        <div class="weather-details">
          <div>Precipitation: ${current.precipitation}%</div>
          <div>Humidity: ${humidity}%</div>
          <div>Wind: ${wind} km/h</div>
        </div>

      </div>

      <div class="weather-right">
        <h2>Weather</h2>
        <p>${dayName}</p>
      </div>

    </div>

    <div class="hourly-row">
      ${hourlyTemps}
    </div>

    <div class="weekly-forecast">
      ${dailyCards}
    </div>

    <div class="wedding-advisory">
      ${advisoryText}
    </div>

  `;
}

let weatherRefreshInterval;

function startWeatherRefresh() {
  fetchWeatherForRoxas();
  if (weatherRefreshInterval) clearInterval(weatherRefreshInterval);
  weatherRefreshInterval = setInterval(fetchWeatherForRoxas, 1800000);
}
let deferredPrompt = null;

// Capture install prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Optional: detect successful install
window.addEventListener("appinstalled", () => {
  console.log("PWA installed successfully");
  deferredPrompt = null;
});

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  // Envelope and Wedding Content Elements
  const urlParams = new URLSearchParams(window.location.search);
  const fromGallery = urlParams.get("from") === "gallery";
  const mainNav = document.querySelector(".main-nav");
  const envelopeContainer = document.getElementById("envelopeContainer");
  const weddingContent = document.getElementById("weddingContent");
  const openEnvCheckbox = document.getElementById("open-env");

  // Auto-update copyright year
  const footerYear = document.querySelector('.footer-bottom p:first-child');
  if (footerYear) {
    footerYear.innerHTML = `&copy; ${new Date().getFullYear()} Shing & Jam. All rights reserved.`;
  }

  function showInstallPrompt() {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      });
    }
  }
  // Initialize - Hide wedding content initially
  if (!fromGallery && weddingContent) {
    weddingContent.style.display = "none";
  }

  if (!fromGallery && mainNav) {
    mainNav.classList.remove("show-nav");
  }
  // When envelope is opened, show wedding content
  if (fromGallery) {
    // simulate envelope already opened
    if (openEnvCheckbox) {
      openEnvCheckbox.checked = true;
    }

    const envElement = document.querySelector(".env");
    if (envElement) {
      envElement.classList.add("opened");
    }

    if (envelopeContainer) {
      envelopeContainer.style.display = "none";
    }

    if (weddingContent) {
      weddingContent.style.display = "block";
      weddingContent.style.opacity = "1";
      weddingContent.style.transform = "translateY(0) scale(1)";
    }

    if (mainNav) {
      mainNav.classList.add("show-nav");
    }

    // ensure layout renders correctly
    setTimeout(() => {
      const target = window.location.hash || "#home";

      window.scrollTo({
        top: document.querySelector(target)?.offsetTop - 80 || 0,
        behavior: "instant"
      });
    }, 50);
    setTimeout(() => {
      initBackgroundSlider();
    }, 500);
  }

  if (openEnvCheckbox) {
    openEnvCheckbox.addEventListener("change", function () {
      if (this.checked) {
        const weddingTitle = document.querySelector(".background_wedding_title");
        const weddingName = document.querySelector(".background_wedding_name");

        if (weddingTitle) {
          weddingTitle.classList.add("hide-title");
        }

        if (weddingName) {
          weddingName.classList.add("hide-title");
        }
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
              envelopeContainer.style.transform =
                "scale(0.8) translateY(-50px)";
              envelopeContainer.style.transition =
                "all 1s cubic-bezier(0.4, 0, 0.2, 1)";

              setTimeout(() => {
                envelopeContainer.style.display = "none";
                weddingContent.style.display = "block";

                if (mainNav) {
                  mainNav.classList.add("show-nav");
                }
                setTimeout(() => {
                  showInstallPrompt();
                }, 800);
                document.addEventListener("DOMContentLoaded", function () {
                  initFAQ();
                });
                weddingContent.style.opacity = "0";
                weddingContent.style.transform = "translateY(30px) scale(0.98)";
                weddingContent.style.transition =
                  "opacity 1.2s ease, transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

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
                          musicToggle.innerHTML =
                            '<i class="fas fa-volume-up"></i>';
                          musicToggle.setAttribute("data-playing", "true");
                        }
                      })
                      .catch((e) => {
                        console.log("Auto-play prevented");
                        // Keep icon as mute if autoplay failed
                        if (musicToggle) {
                          musicToggle.innerHTML =
                            '<i class="fas fa-volume-mute"></i>';
                          musicToggle.setAttribute("data-playing", "false");
                        }
                      });
                  }
                }
                // Toggle music when touching anywhere
                document.addEventListener("click", function (e) {

                  // ignore form elements/buttons
                  if (
                    e.target.closest("button") ||
                    e.target.closest("input") ||
                    e.target.closest("textarea") ||
                    e.target.closest("select") ||
                    e.target.closest("a") ||

                    // FAQ
                    e.target.closest(".faq-question") ||
                    e.target.closest(".faq-item") ||

                    // Attire
                    e.target.closest(".attire-detail") ||
                    e.target.closest(".attire-sample-btn") ||
                    e.target.closest("summary") ||
                    e.target.closest("details") ||

                    // Travel / Details
                    e.target.closest(".travel-route") ||
                    e.target.closest(".travel-link") ||
                    e.target.closest(".details-btn") ||
                    e.target.closest(".copy-btn") ||
                    
                    // Gallery
                    e.target.closest(".cube-gallery") ||
                    e.target.closest(".cube-nav") ||
                    e.target.closest(".cube-face") ||
                    e.target.closest(".cube-track") ||
                    e.target.closest(".cube-dots") ||
                    e.target.closest(".view-gallery-btn") ||

                    // Gift Registry
                    e.target.closest("#toggleGiftGridBtn") ||
                    e.target.closest(".global-toggle-btn") ||
                    e.target.closest(".gift-card") ||

                    // RSVP Modal
                    e.target.closest(".rsvp-modal") ||
                    e.target.closest(".rsvp-modal-content") ||
                    e.target.closest(".rsvp-modal-close")
                  ) {
                    return;
                  }

                  if (!backgroundMusic) return;

                  if (backgroundMusic.paused) {
                    backgroundMusic.play();

                    if (musicToggle) {
                      musicToggle.innerHTML =
                        '<i class="fas fa-volume-up"></i>';

                      musicToggle.setAttribute(
                        "data-playing",
                        "true"
                      );
                    }

                  } else {
                    backgroundMusic.pause();

                    if (musicToggle) {
                      musicToggle.innerHTML =
                        '<i class="fas fa-volume-mute"></i>';

                      musicToggle.setAttribute(
                        "data-playing",
                        "false"
                      );
                    }
                  }
                });
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });

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
  const mealPreferenceGroup = document.getElementById("mealPreferenceGroup");
  const guestMessage = document.getElementById("guest_message");
  const relationshipGroup = document.getElementById("relationshipGroup");
  const relationshipSelect = document.getElementById("relationship");
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
  const statusSearch = document.getElementById("statusSearch");
  const statusSuggestions = document.getElementById("statusSuggestions");
  const rsvpModal = document.getElementById("rsvpModal");
  const rsvpModalDetails = document.getElementById("rsvpModalDetails");
  const closeRsvpModal = document.getElementById("closeRsvpModal");
  const deadlineMessage = document.getElementById("deadlineMessage");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const footerQuote = document.getElementById("footerQuote");
  const scrollProgress = document.querySelector(".scroll-progress");

  if (!scrollProgress) return;

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true,
  });

  updateScrollProgress();


  // Wedding Date
  const weddingDate = new Date("2027-03-26T13:00:00");

  // Secondary Countdown
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
    if (minutesSec)
      minutesSec.textContent = minutes.toString().padStart(2, "0");
    if (secondsSec)
      secondsSec.textContent = seconds.toString().padStart(2, "0");
  }

  const guestInput = document.getElementById("guest_name");
  const guestSuggestions = document.getElementById("guestSuggestions");

  const guestList = [
    "Allan Tijulan",
    "Lovelyn Tijulan",
    "Arlyn Malic",
    "Raquel Castillo",
    "Jowelyn Tijulan",
    "Robert Castillo",
    "Jesus Geronimo",
    "Rico Malic",
    "Annjane Tijulan",
    "Allen Jay Tijulan",
    "Karenne Tijulan",
    "John William Malic",
    "John Paul Malic",
    "John Kyle Malic",
    "Razey Cielo Castillo",
    "Heaven Geronimo",
    "Magnus Geronimo",
    "Luke Malic",
    "Annalyn Soriano",
    "Anacleto Basilio",
    "Cecilia Basilio",
    "Mary Grace Basilio",
    "Anna Grace Basilio",
    "Mark Caliv Basilio",
    "Noeme Grace Basilio",
    "Mark Ezekiel Basilio",
    "Lea Raquel Grace Basilio",
    "Realita Basilio",
    "Conception Basilio",
    "Ageline Basilio",
    "Benny Basilio",
    "Bebeth Basilio",
    "Nicole Basilio",
    "Elvira Ravino",
    "Mervin Ravino",
    "Elmelie Ravino",
    "Ugo Ravino",
    "Hanna Ravino",
    "Rebecca Ravino",
    "Joseph Ravino",
    "Abraham Ravino",
    "BonBon Ravino",
    "Sanghyun Kim",
    "Helen Ines",
    "Elly Ines",
    "Jerome Ines",
    "Maggie Ines",
    "Ian Ines",
    "Markus Ines",
    "Rochelle Ines",
    "Mikaela Carandang",
    "Matmat Carandang",
    "Ronniel Carandang",
    "Lovelyn Fabellar",
    "Irish Sagbang",
    "Dame Pagsuyuin",
    "Ricky Mae Coaching",
    "EJ Malapajo",
    "Felson Maestro",
    "Arvin Gado",
    "Quirino Tamayo",
    "Ma. Jeanette De Luna",
    "Saffiya Yusuf",
    "Fozia Yusuf",
    "Marie Glainess Gemperoso",
    "Rosa Mwangonde",
    "Ludivico Gaa",
    "Angela Takano",
    "Sachi Takano",
    "Sarah Monsalve",
    "Harmony Monsalve",
    "Rosalita Fabic",
    "Hansel Fabic",
    "Vincent Agbayani",
    "Evalyn Agbayani",
    "Ishmylene Fernando",
    "Alrey C. Maning",
    "Samuel Ruga",
    "Haide Ruga",
    "Lea Ruga",
    "Linda Ruga",
    "Josephine Bolor",
    "Bilog Bolor",
    "Jennifer Bolor",
    "Susan Oracion",
    "Felipino Oracion",
    "Clifford Oracion",
    "Rodelyn Gupit",
    "Larz Ricafranca",
    "Ehlyn Ricafranca",
    "Richard Llanto",
    "Mark Madolora",
    "Ian Ogayon",
    "Jay Abayabay",
    "Joshua Manoto",
    "Ping Espela",
    "Ramil Alzate",
    "Erly Silanga",
    "Jemma Fajutnao",
    "Giselle Gamol",
    "Beejay Jalipa",
    "Maurice Jalipa",
    "Joemer Prada",
    "Justin Tamboong",
    "Rejie Padua",
    "Rhinjie Yson",
    "Rynette Husana",
    "Nora Nemoto",
    "Ai Nemoto",
    "Yu Nemoto",
    "Wendy Mae Gadon",
    "Yuka Aotake",
    "Lovely Mendoza",
    "Eliboy Mendoza"
  ];

  if (guestInput) {
    guestInput.addEventListener("input", function () {
      const value = this.value.toLowerCase().trim();

      guestSuggestions.innerHTML = "";

      if (!value) {
        guestSuggestions.style.display = "none";
        return;
      }

      const matches = guestList.filter((guest) =>
        guest.toLowerCase().includes(value)
      );

      if (matches.length === 0) {
        guestSuggestions.style.display = "none";
        return;
      }

      matches.forEach((guest) => {
        const item = document.createElement("div");
        item.className = "guest-suggestion-item";
        item.textContent = guest;

        item.addEventListener("click", () => {
          guestInput.value = guest;
          guestSuggestions.style.display = "none";
        });

        guestSuggestions.appendChild(item);
      });

      guestSuggestions.style.display = "block";
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".guest-search-wrapper")) {
        guestSuggestions.style.display = "none";
      }
    });
  }
  // Conditional form fields
  if (attendanceSelect) {
    attendanceSelect.addEventListener("change", function () {
      const isAttending = this.value === "Accepts with pleasure";

      if (isAttending) {
        if (mealPreferenceGroup) mealPreferenceGroup.style.display = "block";

        // Make fields required
        const mealPrefSelect = document.getElementById("meal_preference");

        if (mealPrefSelect) mealPrefSelect.required = true;
      } else {
        if (mealPreferenceGroup) mealPreferenceGroup.style.display = "none";

        // Remove required attribute when hidden
        const mealPrefSelect = document.getElementById("meal_preference");

        if (mealPrefSelect) mealPrefSelect.required = false;
      }
    });
  }

  if (guestMessage && relationshipGroup && relationshipSelect) {
    guestMessage.addEventListener("input", () => {
      const hasMessage = guestMessage.value.trim() !== "";

      relationshipGroup.style.display = hasMessage ? "block" : "none";
      relationshipSelect.required = hasMessage;

      if (!hasMessage) {
        relationshipSelect.value = "";
      }
    });
  }
  if (footerQuote) {
    const text = footerQuote.dataset.text;
    let index = 0;
    let deleting = false;

    function typeFooterQuote() {
      if (!deleting) {
        footerQuote.textContent = text.substring(0, index);
        index++;

        if (index > text.length) {
          deleting = true;
          setTimeout(typeFooterQuote, 1800);
          return;
        }
      } else {
        footerQuote.textContent = text.substring(0, index);
        index--;

        if (index < 0) {
          deleting = false;
          index = 0;
        }
      }

      setTimeout(typeFooterQuote, deleting ? 35 : 70);
    }

    typeFooterQuote();
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

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      const data = {
        guest_name: formData.get("guest_name"),
        attendance: formData.get("attendance"),
        meal_preference:
          formData.get("attendance") === "Accepts with pleasure"
            ? formData.get("meal_preference")
            : null,
        message: formData.get("guest_message") || "",
        relationship: formData.get("relationship") || null
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
          showToast(
            data.message
              ? "Thank you for your RSVP and warm wishes ✨"
              : "Your RSVP has been received with love ✨",
            "success"
          );

          rsvpForm.reset();

          mealPreferenceGroup.classList.remove("visible");

          if (relationshipGroup) {
            relationshipGroup.style.display = "none";
          }

          await loadMessages();

          if (adminPanel && adminPanel.style.display === "block") {
            await loadAdminData();
          }
        } else {
          showToast(result.error || "An error occurred", "error");
        }
        } catch (error) {
          console.error("RSVP submission error:", error);
          showToast("Something went wrong. Please try again.", "error");
        }finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  function showRsvpModal(guest) {

    rsvpModalDetails.innerHTML = `
      <p><strong>Name:</strong> ${guest.guest_name}</p>
      <p><strong>Attendance:</strong> ${guest.attendance}</p>
      <p><strong>Meal Preference:</strong>
        ${guest.meal_preference || "N/A"}
      </p>
  
      <div class="rsvp-thank-you">
        <h3>🎉 Thank You for Confirming!</h3>
        <p>We can't wait to celebrate with you.</p>
        <p>See you on our special day ❤️</p>
      </div>
    `;

    rsvpModal.classList.add("show");

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { x: 1 }
    });

    confetti({
      particleCount: 150,
      spread: 140,
      origin: { y: 0.7 }
    });
  }

  // Search RSVP confirmation
  if (statusSearch && statusSuggestions) {
  statusSearch.addEventListener("input", async function () {
    const name = this.value.trim();

    statusSuggestions.innerHTML = "";

    if (name.length < 2) {
      statusSuggestions.style.display = "none";
      return;
    }

    try {
      const response = await fetch(`/api/check-rsvp?name=${encodeURIComponent(name)}`);
      const data = await response.json();

      if (!data.success || data.results.length === 0) {
        statusSuggestions.style.display = "none";
        return;
      }

      data.results.forEach((guest) => {
        const item = document.createElement("div");
        item.className = "status-suggestion";
        item.textContent = guest.guest_name;

        item.addEventListener("click", function (e) {

          e.preventDefault();
          e.stopPropagation();

          statusSearch.value = guest.guest_name;
          statusSuggestions.style.display = "none";

          showRsvpModal(guest);
        });

        statusSuggestions.appendChild(item);
      });

      statusSuggestions.style.display = "block";

    } catch (error) {
      console.error("RSVP status check error:", error);
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".status-search-wrapper")) {
      statusSuggestions.style.display = "none";
      }
    });
  }
  if (closeRsvpModal) {

    closeRsvpModal.addEventListener("click", (e) => {
      e.stopPropagation();
      rsvpModal.classList.remove("show");
    });

    rsvpModal.addEventListener("click", (e) => {
      e.stopPropagation();

      if (e.target === rsvpModal) {
        rsvpModal.classList.remove("show");
      }
    });

  }

  document
    .querySelector(".rsvp-modal-content")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
    });
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

  const cubeGallery = document.getElementById("cubeGallery");
  const cubeTrack = document.getElementById("cubeTrack");
  const cubePrev = document.getElementById("cubePrev");
  const cubeNext = document.getElementById("cubeNext");
  const cubeDots = document.getElementById("cubeDots");
  const cubeFaces = document.querySelectorAll(".cube-face");

  let cubeIndex = 0;
  let cubeStartX = 0;
  let cubeStartY = 0;
  let cubeStartTransform = 0;
  let cubeCurrentTransform = 0;
  let cubeIsDragging = false;
  let cubeIsMoving = false;
  let cubeDragThreshold = 60;
  const cubeTotal = cubeFaces.length;

  function createCubeDots() {
    if (!cubeDots) return;

    cubeDots.innerHTML = "";

    cubeFaces.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "cube-dot";
      dot.setAttribute("aria-label", `Go to photo ${index + 1}`);

      dot.addEventListener("click", function () {
        goToCube(index);
      });

      cubeDots.appendChild(dot);
    });
  }

  function updateCube(instant = false) {
    if (!cubeTrack) return;

    if (instant && cubeTrack) {
      cubeTrack.style.transition = "none";
      cubeTrack.style.transform = `rotateY(${-cubeIndex * 90}deg)`;
      // Force reflow
      void cubeTrack.offsetHeight;
      cubeTrack.style.transition = "";
    } else {
      cubeTrack.style.transform = `rotateY(${-cubeIndex * 90}deg)`;
    }

    document.querySelectorAll(".cube-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === cubeIndex);
    });
  }

  function goToCube(index, useTransition = true) {
    if (cubeIsMoving || index === cubeIndex) return;

    cubeIsMoving = true;
    cubeIndex = index;

    if (!useTransition && cubeTrack) {
      cubeTrack.style.transition = "none";
      updateCube();
      void cubeTrack.offsetHeight;
      cubeTrack.style.transition = "";
    } else {
      updateCube();
    }

    setTimeout(() => {
      cubeIsMoving = false;
    }, 600);
  }

  function nextCube() {
    if (cubeTotal === 0) return;
    goToCube((cubeIndex + 1) % cubeTotal);
  }

  function prevCube() {
    if (cubeTotal === 0) return;
    goToCube((cubeIndex - 1 + cubeTotal) % cubeTotal);
  }

  if (cubeNext) {
    cubeNext.addEventListener("click", nextCube);
  }

  if (cubePrev) {
    cubePrev.addEventListener("click", prevCube);
  }

  // ========== SMOOTH DRAG TO SWIPE IMPLEMENTATION ==========
  if (cubeGallery) {
    // Touch start - begin dragging
    cubeGallery.addEventListener("touchstart", function (e) {
      if (cubeIsMoving) return;

      cubeStartX = e.touches[0].clientX;
      cubeStartY = e.touches[0].clientY;
      cubeIsDragging = true;

      // Store the current transform angle
      cubeStartTransform = -cubeIndex * 90;
      cubeCurrentTransform = cubeStartTransform;

      // Remove transition during drag for instant response
      if (cubeTrack) {
        cubeTrack.style.transition = "none";
      }

      // Add dragging class for visual feedback
      cubeGallery.classList.add("dragging");

      e.preventDefault();
    }, { passive: false });

    // Touch move - follow finger in real-time
    cubeGallery.addEventListener("touchmove", function (e) {
      if (!cubeIsDragging || cubeIsMoving) return;

      const currentX = e.touches[0].clientX;
      const diffX = currentX - cubeStartX;

      // Calculate new angle based on drag distance
      // The divisor controls sensitivity (lower = more sensitive)
      let dragAngle = diffX / 2.2;
      let newAngle = cubeStartTransform + dragAngle;

      // Apply the transform immediately (follows finger)
      if (cubeTrack) {
        cubeTrack.style.transform = `rotateY(${newAngle}deg)`;
        cubeCurrentTransform = newAngle;
      }

      e.preventDefault();
    });

    // Touch end - snap to nearest face
    cubeGallery.addEventListener("touchend", function (e) {
      if (!cubeIsDragging || cubeIsMoving) {
        cubeIsDragging = false;
        cubeGallery.classList.remove("dragging");
        return;
      }

      cubeIsDragging = false;
      cubeGallery.classList.remove("dragging");

      // Calculate how far we dragged
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - cubeStartX;

      // Determine if we should change slides
      let newIndex = cubeIndex;

      if (Math.abs(diffX) > cubeDragThreshold) {
        if (diffX > 0) {
          // Dragged right - go to previous
          newIndex = (cubeIndex - 1 + cubeTotal) % cubeTotal;
        } else {
          // Dragged left - go to next
          newIndex = (cubeIndex + 1) % cubeTotal;
        }
      }

      // Re-enable transition for smooth snap back
      if (cubeTrack) {
        cubeTrack.style.transition = "transform 500ms cubic-bezier(0.2, 0.9, 0.4, 1.1)";
      }

      // If we're not changing slides, we need to snap back
      if (newIndex === cubeIndex) {
        // Snap back to current position smoothly
        if (cubeTrack) {
          cubeTrack.style.transform = `rotateY(${-cubeIndex * 90}deg)`;
        }
        setTimeout(() => {
          if (cubeTrack) {
            cubeTrack.style.transition = "";
          }
        }, 500);
      } else {
        // Change to new slide
        cubeIsMoving = true;
        cubeIndex = newIndex;
        updateCube();

        setTimeout(() => {
          cubeIsMoving = false;
          if (cubeTrack) {
            cubeTrack.style.transition = "";
          }
        }, 600);
      }
    });

    // Optional: Mouse support for desktop
    let mouseIsDragging = false;
    let mouseStartX = 0;
    let mouseStartTransform = 0;

    cubeGallery.addEventListener("mousedown", function (e) {
      if (e.button !== 0 || cubeIsMoving) return;

      mouseIsDragging = true;
      mouseStartX = e.clientX;
      mouseStartTransform = -cubeIndex * 90;

      if (cubeTrack) {
        cubeTrack.style.transition = "none";
      }

      cubeGallery.classList.add("dragging");
      e.preventDefault();
    });

    window.addEventListener("mousemove", function (e) {
      if (!mouseIsDragging || cubeIsMoving) return;

      const diffX = e.clientX - mouseStartX;
      let dragAngle = diffX / 2.2;
      let newAngle = mouseStartTransform + dragAngle;

      if (cubeTrack) {
        cubeTrack.style.transform = `rotateY(${newAngle}deg)`;
      }
    });

    window.addEventListener("mouseup", function (e) {
      if (!mouseIsDragging) return;

      mouseIsDragging = false;
      cubeGallery.classList.remove("dragging");

      const diffX = e.clientX - mouseStartX;
      let newIndex = cubeIndex;

      if (Math.abs(diffX) > cubeDragThreshold) {
        if (diffX > 0) {
          newIndex = (cubeIndex - 1 + cubeTotal) % cubeTotal;
        } else {
          newIndex = (cubeIndex + 1) % cubeTotal;
        }
      }

      if (cubeTrack) {
        cubeTrack.style.transition = "transform 500ms cubic-bezier(0.2, 0.9, 0.4, 1.1)";
      }

      if (newIndex === cubeIndex) {
        if (cubeTrack) {
          cubeTrack.style.transform = `rotateY(${-cubeIndex * 90}deg)`;
        }
        setTimeout(() => {
          if (cubeTrack) {
            cubeTrack.style.transition = "";
          }
        }, 500);
      } else {
        cubeIsMoving = true;
        cubeIndex = newIndex;
        updateCube();

        setTimeout(() => {
          cubeIsMoving = false;
          if (cubeTrack) {
            cubeTrack.style.transition = "";
          }
        }, 600);
      }
    });
  }

  createCubeDots();
  updateCube();
  const openFullGalleryBtn = document.getElementById("openFullGallery");

  if (openFullGalleryBtn) {
    openFullGalleryBtn.addEventListener("click", function () {
      window.location.href = "full-gallery.html";
    });
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
        backgroundMusic
          .play()
          .then(() => {
            updateMusicIcon();
          })
          .catch((error) => {
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
  
  function showToast(message, type = "success") {
    let toast = document.querySelector(".toast-notification");
  
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }
  
    const icon =
      type === "success"
        ? '<i class="fas fa-heart"></i>'
        : '<i class="fas fa-exclamation-circle"></i>';
  
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `${icon}<span>${message}</span>`;
  
    setTimeout(() => {
      toast.classList.add("show");
    }, 50);
  
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
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

  setInterval(updateSecondaryCountdown, 1000);
  updateSecondaryCountdown();

  // Check RSVP deadline on load
  checkRSVPDeadline();

  // Admin Panel Functions
  if (adminLink) {
    // Override default behavior to scroll to home AND show admin panel
    adminLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Scroll to home section smoothly
      const homeSection = document.querySelector("#home");
      if (homeSection) {
        window.scrollTo({
          top: homeSection.offsetTop - 80,
          behavior: "smooth"
        });
      }

      // Then show admin panel
      showAdminPanel();
    });
  }

  async function showAdminPanel() {
    if (!adminPanel) return;

    adminPanel.style.display = "block";

    // Check if already logged in from localStorage
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");

    if (token && user) {
      // Already logged in, load data directly
      await loadAdminData();
    } else {
      // Show login form
      document.getElementById("loginFormContainer").style.display = "block";
      document.getElementById("adminContent").style.display = "none";
    }
  }

  // LOGIN
  adminLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      loadAdminData();
    } else {
      alert("Login failed");
    }
  });

  // LOAD ADMIN DATA
  async function loadAdminData() {
    const token = localStorage.getItem("adminToken");

    const res = await fetch("/api/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert("Unauthorized");
      return;
    }

    const data = await res.json();

    updateStats(data.stats);
    updateRSVPTable(data.stats.recent_rsvps);

    document.getElementById("loginFormContainer").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
  }

  // Update admin login form
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = {
        username: formData.get("username"),
        password: formData.get("password")
      };

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Logging in...';

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Store token in localStorage
          localStorage.setItem("adminToken", result.token);
          localStorage.setItem("adminUser", result.username);

          // Load admin data
          await loadAdminData();
          showMessage("Login successful!", "success");
        } else {
          showMessage(result.error || "Login failed", "error");
        }
      } catch (error) {
        console.error("Login error:", error);
        showMessage("Network error. Please try again.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Update logout function
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      document.getElementById("loginFormContainer").style.display = "block";
      document.getElementById("adminContent").style.display = "none";

      showMessage("Logged out successfully", "success");
    });
  }

  // EXPORT
  exportBtn.addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("/api/export", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Manila Time Filename
      const now = new Date();

      const timestamp = now.toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
      .replace(/[/:]/g, "-")
      .replace(", ", "_");

      const a = document.createElement("a");
      a.href = url;
      a.download = `rsvps_${timestamp}.csv`;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      showMessage("RSVP export downloaded successfully!", "success");

    } catch (error) {
      console.error("Export error:", error);
      showMessage("Failed to export RSVP data", "error");
    }
  });

  // Update stats display
  function updateStats(data) {
    if (!statsContainer || !data) return;

    statsContainer.innerHTML = `
                <div class="stat-card">
                    <span class="stat-number">${
                      data.total_responses || 0
                    }</span>
                    <span>Total Responses</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${data.total_guests || 0}</span>
                    <span>Total Guests</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${
                      data.attending_count || 0
                    }</span>
                    <span>Attending</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${
                      data.declining_count || 0
                    }</span>
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
          // Disable ALL input fields
          const allInputs = rsvpForm.querySelectorAll('input, select, textarea, button');
          allInputs.forEach(el => {
            el.disabled = true;
          });

          // Specifically disable and update submit button
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "RSVP Closed";
            submitBtn.style.opacity = "0.6";
            submitBtn.style.cursor = "not-allowed";
          }

          // Also disable the name input and suggestions
          if (guestInput) {
            guestInput.disabled = true;
            guestInput.placeholder = "RSVP is now closed";
          }

          // Hide suggestions if visible
          if (guestSuggestions) {
            guestSuggestions.style.display = "none";
          }

          // Disable attendance select
          if (attendanceSelect) {
            attendanceSelect.disabled = true;
          }

          // Disable meal preference group fields
          if (mealPreferenceGroup) {
            const mealFields = mealPreferenceGroup.querySelectorAll('select, input');
            mealFields.forEach(field => {
              field.disabled = true;
            });
          }

          // Disable message textarea
          if (guestMessage) {
            guestMessage.disabled = true;
            guestMessage.placeholder = "RSVP is now closed";
          }

          // Disable relationship select
          if (relationshipSelect) {
            relationshipSelect.disabled = true;
          }

          // Hide search/suggestions if needed
          if (statusSearch) {
            statusSearch.disabled = true;
            statusSearch.placeholder = "RSVP is closed";
          }

          console.log("RSVP deadline passed - all form fields disabled");
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
                    <tr><td>${escapeHtml(rsvp.guest_name || "")}</td>
                    <td>${escapeHtml(rsvp.attendance || "")}</td>
                    <td>${escapeHtml(rsvp.meal_preference || "-")}</td>
                    <td>${escapeHtml(rsvp.message || "-")}</td>
                    <td>${new Date(
                      rsvp.submission_date
                    ).toLocaleDateString()}</td>
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

  async function loadMessages() {
    const messagesGrid = document.getElementById("messagesGrid");
    if (!messagesGrid) return;

    try {
      const response = await fetch("/api/messages");
      const data = await response.json();

      messagesGrid.innerHTML = "";

      data.forEach((msg) => {
        addMessageToGrid(msg);
      });
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return Math.floor(diff / 60) + " min ago";
    if (diff < 86400) return Math.floor(diff / 3600) + " hrs ago";
    if (diff < 604800) return Math.floor(diff / 86400) + " days ago";

    return past.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function addMessageToGrid(message) {
    const messagesGrid = document.getElementById("messagesGrid");
    if (!messagesGrid) return;

    const messageCard = document.createElement("div");
    messageCard.className = "message-card";

    const shortDate = timeAgo(message.date);

    const fullDate = new Date(message.date).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    messageCard.innerHTML = `
                <div class="message-header">
                    <div class="message-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="message-author">
                    <h4>${escapeHtml(message.name)}</h4>
                  
                    <span class="message-relation">
                      ${escapeHtml(message.relationship || "Guest")}
                    </span>
                  
                    <span class="message-date">
                      ${shortDate} • ${fullDate}
                    </span>
                  </div>
                </div>
                <div class="message-content">
                    <p>${escapeHtml(message.content)}</p>
                </div>
            `;

    messagesGrid.insertBefore(messageCard, messagesGrid.firstChild);

    if (messagesGrid.children.length > 20) {
      messagesGrid.removeChild(messagesGrid.lastChild);
    }
  }

  // Message Form
  function initMessageForm() {
    const messageForm = document.getElementById("messageForm");

    if (!messageForm) return;

    messageForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("messageName").value.trim();
      const relationship = document.getElementById("messageRelation").value;
      const content = document.getElementById("messageContent").value.trim();

      if (!name || !relationship || !content) {
        showToast("Please fill in all fields before sharing your message.", "error");
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            relationship,
            content
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to post message");
        }

        showToast("Thank you for your message! Your love has been shared.", "success");
        this.reset();
        await loadMessages();

      } catch (error) {
        console.error("Message post error:", error);
        showToast("Message not posted. Please check your API or Supabase table.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
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
      const navMenu = document.getElementById("navMenu");
      const navToggle = document.getElementById("navToggle");
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
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
  loadMessages();
  setInterval(() => {
    loadMessages();
  }, 60000);

  // Enhanced scroll animations for cards
  const enhancedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    {
      threshold: 0.1
    }
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
      {
        threshold: 0.3
      }
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

  document.addEventListener("click", async function (e) {
    const button = e.target.closest(".copy-btn");
    if (!button) return;

    e.preventDefault();

    const textToCopy =
      button.getAttribute("data-copy-text") ||
      document
        .getElementById(button.getAttribute("data-copy"))
        ?.textContent.trim();

    if (!textToCopy) {
      alert("No address found to copy.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const tempInput = document.createElement("textarea");
        tempInput.value = textToCopy;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      button.style.background = "linear-gradient(135deg, #28a745, #1e7e34)";
      button.style.color = "white";

      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = "";
        button.style.color = "";
      }, 2000);
    } catch (err) {
      alert("Please copy manually: " + textToCopy);
    }
  });

  // ========== GIFT GRID TOGGLE FUNCTIONALITY ==========
  const toggleBtn = document.getElementById("toggleGiftGridBtn");
  const giftGridWrapper = document.getElementById("giftGridWrapper");
  const giftGrid = document.getElementById("giftGrid");
  const emptyMessage = document.getElementById("emptyGiftMessage");

  let toggleIcon = null;
  let toggleText = null;

  if (toggleBtn) {
    toggleIcon = toggleBtn.querySelector("i");
    toggleText = toggleBtn.querySelector("span");
  }

  // Load saved preference from localStorage
  function loadGridPreference() {
      const savedState = localStorage.getItem("giftGridHidden");
      const isHidden = savedState === null ? true : savedState === "true";

      if (isHidden) {
        if (giftGridWrapper) giftGridWrapper.style.display = "none";
        if (emptyMessage) emptyMessage.style.display = "block";

        if (toggleIcon) {
          toggleIcon.className = "fas fa-eye";
        }

        if (toggleText) {
          toggleText.textContent = "Show Gift Registry";
        }
      } else {
        if (giftGridWrapper) giftGridWrapper.style.display = "block";
        if (emptyMessage) emptyMessage.style.display = "none";

        if (toggleIcon) {
          toggleIcon.className = "fas fa-eye-slash";
        }

        if (toggleText) {
          toggleText.textContent = "Hide Gift Registry";
        }
      }
    }

  // Toggle grid visibility with animation
  function toggleGiftGrid() {
    const savedState = localStorage.getItem("giftGridHidden");
    const isHidden = savedState === null || savedState === "true";

    if (isHidden) {
      // Show grid
      if (giftGridWrapper) {
        giftGridWrapper.style.display = "block";
        // Add animation class to cards
        const cards = document.querySelectorAll(".gift-card");
        cards.forEach((card, index) => {
          card.style.animation = "none";
          setTimeout(() => {
            card.style.animation = "cardFadeIn 0.6s ease forwards";
          }, 10);
        });
      }
      if (emptyMessage) emptyMessage.style.display = "none";
      if (toggleIcon) toggleIcon.className = "fas fa-eye-slash";
      if (toggleText) toggleText.textContent = "Hide Gift Registry";
      localStorage.setItem("giftGridHidden", "false");
    } else {
      // Hide grid
      if (giftGridWrapper) {
        giftGridWrapper.style.display = "none";
      }
      if (emptyMessage) emptyMessage.style.display = "block";
      if (toggleIcon) toggleIcon.className = "fas fa-eye";
      if (toggleText) toggleText.textContent = "Show Gift Registry";
      localStorage.setItem("giftGridHidden", "true");
    }

    // Add button click animation
    toggleBtn.style.transform = "scale(0.98)";
    setTimeout(() => {
      toggleBtn.style.transform = "";
    }, 150);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleGiftGrid);
    loadGridPreference();
  }
  initVideoParallax();
  startWeatherRefresh();
  console.log("Wedding RSVP App initialized");

  // Secret: Tap the S&J logo 5 times quickly to access admin panel
  let tapCount = 0;
  let tapTimer;

  const secretLogo = document.querySelector('.nav-monogram-img');
  if (secretLogo) {
    secretLogo.addEventListener('click', function(e) {
      e.stopPropagation();
      tapCount++;

      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 800); // Reset after 800ms

      if (tapCount >= 3) {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
          adminPanel.style.display = 'block';
          showToast('🔓 Admin Access Granted', 'success');
        }
        tapCount = 0;
      }
    });
  }
});
