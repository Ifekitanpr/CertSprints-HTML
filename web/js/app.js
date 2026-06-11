(() => {
        const screen = document.querySelector(".screen");
        const artSlides = Array.from(document.querySelectorAll(".art-slide"));
        const copySlides = Array.from(document.querySelectorAll(".copy-slide"));
        const dots = Array.from(document.querySelectorAll(".pagination span"));
        const params = new URLSearchParams(window.location.search);
        const startButton = document.querySelector(".start-sprint");
        const signInEntry = document.querySelector(".sign-in-entry");
        const certBack = document.querySelector(".cert-view .cert-back");
        const planBack = document.querySelector(".plan-back");
        const certSearch = document.querySelector(".cert-search");
        const certInput = document.querySelector(".cert-search input");
        const certLabel = document.querySelector(".cert-list-label");
        const exploreButton = document.querySelector(".cert-explore");
        const sheetOverlay = document.querySelector(".sheet-overlay");
        const bottomSheet = document.querySelector(".bottom-sheet");
        const sheetNav = document.querySelector(".sheet-nav");
        const sheetBack = document.querySelector(".sheet-back");
        const sheetInfo = document.querySelector(".sheet-info");
        const sheetClose = document.querySelector(".sheet-close");
        const categoryPanel = document.querySelector(".sheet-categories");
        const coursePanel = document.querySelector(".sheet-courses");
        const detailPanel = document.querySelector(".sheet-detail");
        const configureButton = document.querySelector(".configure-btn");
        const courseLabel = document.querySelector(".sheet-course-label");
        const courseItems = document.querySelector(".sheet-course-items");
        const categoryButtons = Array.from(document.querySelectorAll(".category-tile"));
        const directCourseCards = Array.from(document.querySelectorAll(".cert-list .cert-card"));
        const durationTabs = Array.from(document.querySelectorAll(".duration-tabs button"));
        const planCards = Array.from(document.querySelectorAll(".plan-grid .plan-card"));
        const planCta = document.querySelector(
          ".plan-view .start-free:not(.timeline-confirm):not(.habits-confirm)",
        );
        const timelineTabs = Array.from(document.querySelectorAll("[data-timeline-tab]"));
        const timelinePanels = Array.from(document.querySelectorAll("[data-timeline-panel]"));
        const timelineBack = document.querySelector(".timeline-back");
        const timelineConfirm = document.querySelector(".timeline-confirm");
        const calendarGrid = document.querySelector(".calendar-grid");
        const calendarTitle = document.querySelector("[data-calendar-title]");
        const dateDay = document.querySelector("[data-date-day]");
        const dateMonth = document.querySelector("[data-date-month]");
        const dateYear = document.querySelector("[data-date-year]");
        const monthPrev = document.querySelector(".month-prev");
        const monthNext = document.querySelector(".month-next");
        const tentativeOptions = Array.from(document.querySelectorAll("[data-tentative]"));
        const habitsBack = document.querySelector(".habits-back");
        const habitsConfirm = document.querySelector(".habits-confirm");
        const hoursSlider = document.querySelector(".hours-slider");
        const hoursOutput = document.querySelector(".hours-output");
        const focusOptions = Array.from(document.querySelectorAll("[data-focus]"));
        const restOptions = Array.from(document.querySelectorAll("[data-rest]"));
        const mappingBack = document.querySelector(".mapping-back");
        const mappingTypedEl = document.querySelector(".mapping-badge-typed");
        const mappingProgressFill = document.querySelector(".mapping-progress-fill");
        const planPreviewOverlay = document.querySelector(".plan-preview-overlay");
        const planPreviewSheet = document.querySelector(".plan-preview-sheet");
        const planPreviewPrimary = document.querySelector(".plan-preview-primary");
        const planPreviewSecondary = document.querySelector(".plan-preview-secondary");
        const sprintCards = Array.from(document.querySelectorAll(".sprint-card"));
        const accountSwitchButtons = Array.from(document.querySelectorAll("[data-account-mode]"));
        const accountContinueButtons = Array.from(document.querySelectorAll(".account-continue"));
        const authBack = document.querySelector(".auth-back");
        const codeInputs = Array.from(document.querySelectorAll(".code-inputs input"));
        const verifyPrimary = document.querySelector(".verify-primary");
        const verifyEmail = document.querySelector("[data-verify-email]");
        const resendButton = document.querySelector(".verify-resend");
        const finishSetup = document.querySelector(".finish-setup");
        const signinModeButtons = Array.from(document.querySelectorAll("[data-signin-mode]"));
        const signinContinueButtons = Array.from(document.querySelectorAll(".signin-continue"));
        const signinPasswordSubmit = document.querySelector(".signin-password-submit");
        const forgotPasswordLink = document.querySelector(".forgot-password-link");
        const backToSigninButtons = Array.from(document.querySelectorAll(".back-to-signin"));
        const sendResetCode = document.querySelector(".send-reset-code");
        const changeEmail = document.querySelector(".change-email");
        const resetPasswordSubmit = document.querySelector(".reset-password-submit");
        const resetSuccessOverlay = document.querySelector(".reset-success-overlay");
        const passwordToggles = Array.from(document.querySelectorAll(".password-toggle"));
        const resetNewPassword = document.querySelector(".reset-new-password");
        const resetConfirmPassword = document.querySelector(".reset-confirm-password");
        const passwordRules = {
          length: document.querySelector('[data-password-rule="length"]'),
          mix: document.querySelector('[data-password-rule="mix"]'),
          match: document.querySelector('[data-password-rule="match"]'),
        };
        const checkoutBack = document.querySelector(".checkout-back");
        const checkoutContinue = document.querySelector(".checkout-continue");
        const checkoutChangePlan = document.querySelector(".checkout-view .checkout-change-plan");
        const changePlanOverlay = document.querySelector(".change-plan-overlay");
        const changePlanGrid = document.querySelector("[data-change-plan-grid]");
        const changeDurationTabs = Array.from(document.querySelectorAll("[data-checkout-duration-option]"));
        const changePlanConfirm = document.querySelector(".change-plan-confirm");
        const startLearning = document.querySelector(".start-learning");
        const paymentSuccessBack = document.querySelector(".payment-success-back");
        const paymentConfettiCanvas = document.querySelector(".payment-confetti-canvas");
        const durationUplifts = { "30": 0, "60": 100, "90": 200 };
        const planLabels = {
          free: "Free",
          essentials: "Essentials",
          advanced: "Advanced",
          elite: "Elite",
        };
        const planCatalog = {
          free: {
            name: "Free",
            basePrice: 0,
            subtitle: "Start with the basics",
            features: ["Readiness Forecast™", "5 Mindset Sprint Drills", "Study Heatmap"],
          },
          essentials: {
            name: "Essentials",
            basePrice: 199,
            subtitle: "Everything in Pro, plus:",
            features: ["Video Teach-Back Feedback", "Weekly 1-on-1 Logic Audits", "24h Priority Logic Support", "All Practice Games"],
          },
          advanced: {
            name: "Advanced",
            basePrice: 299,
            subtitle: "Best for full exam prep",
            features: ["Full 14-Day Velocity Path", "35-Hour Official Certificate", "All 4 Mock Exam Levels", "Logic Sniper Elimination Game"],
          },
          elite: {
            name: "Elite",
            basePrice: 499,
            subtitle: "All Pro features, plus:",
            features: ["Video Teach-Back Feedback", "Weekly 1-on-1 Logic Audits", "24h Priority Logic Support", "All Practice Games"],
          },
        };
        const courseCatalog = {
          "Project Management": [
            {
              title: "Project Management<br />Professional (PMP)®",
              description: "Globally recognized. Industry standard for project managers",
              badge: "Most Popular",
              asset: "assets/pmp.png",
              tall: true,
            },
            {
              title: "Certified Associate in Project<br />Management (CAPM)®",
              description: "Perfect for beginners. Start your project management career.",
              asset: "assets/capm.png",
              alt: true,
            },
            {
              title: "PRINCE2 (Projects IN<br />Controlled Environments)",
              description: "Structured methodology for effective project delivery.",
              asset: "assets/prince2.png",
            },
          ],
          "Agile and Scrum": [
            { title: "Certified ScrumMaster® (CSM)", description: "Build facilitation and delivery confidence for Scrum teams.", badge: "Popular", initials: "CSM", tall: true },
            { title: "Professional Scrum Master™ I", description: "Validate core Scrum knowledge and team practices.", initials: "PSM" },
            { title: "PMI Agile Certified Practitioner<br />(PMI-ACP)®", description: "A broad agile credential for cross-functional delivery.", initials: "ACP", alt: true },
          ],
          "Business Analysis": [
            { title: "Certified Business Analysis<br />Professional (CBAP)®", description: "For senior analysts leading requirements and strategy.", badge: "Advanced", initials: "CBAP", tall: true },
            { title: "Entry Certificate in Business<br />Analysis (ECBA)™", description: "A strong starting point for business analysis careers.", initials: "ECBA", alt: true },
            { title: "PMI Professional in Business<br />Analysis (PMI-PBA)®", description: "For project-focused business analysis work.", initials: "PBA" },
          ],
          "Change Management": [
            { title: "Prosci Change Management<br />Certification", description: "Apply structured change practices across teams.", badge: "Popular", initials: "PRO", tall: true },
            { title: "Certified Change Management<br />Professional (CCMP)™", description: "Recognized credential for enterprise change leaders.", initials: "CCMP", alt: true },
            { title: "APMG Change Management", description: "Foundation and practitioner paths for change delivery.", initials: "APMG" },
          ],
          "Cloud Computing & DevOps": [
            { title: "AWS Certified Cloud Practitioner", description: "Foundational AWS cloud knowledge for any role.", badge: "Starter", initials: "AWS", tall: true },
            { title: "Microsoft Azure Fundamentals<br />(AZ-900)", description: "Core Azure services, pricing, security, and governance.", initials: "AZ", alt: true },
            { title: "Certified Kubernetes<br />Administrator (CKA)", description: "Hands-on Kubernetes operations and cluster management.", initials: "CKA" },
          ],
          "IT Service & Architecture": [
            { title: "ITIL® 4 Foundation", description: "Service management fundamentals for modern IT teams.", badge: "Popular", initials: "ITIL", tall: true },
            { title: "TOGAF® Enterprise Architecture", description: "Architecture methods for business and technology alignment.", initials: "TOG", alt: true },
            { title: "COBIT® Foundation", description: "Governance and controls for enterprise technology.", initials: "COB" },
          ],
          "Data Science & Business Analytics": [
            { title: "Google Data Analytics<br />Professional Certificate", description: "Practical analytics workflow, SQL, and dashboards.", badge: "Starter", initials: "GDA", tall: true },
            { title: "Microsoft Power BI Data Analyst", description: "Model, visualize, and publish business insights.", initials: "PBI", alt: true },
            { title: "Certified Analytics Professional<br />(CAP)®", description: "Advanced analytics process and decision support.", initials: "CAP" },
          ],
          "Finance & Accounting": [
            { title: "Certified Management Accountant<br />(CMA)", description: "Management accounting, planning, and decision analysis.", badge: "Popular", initials: "CMA", tall: true },
            { title: "ACCA Qualification", description: "Global accounting path across finance and audit.", initials: "ACCA", alt: true },
            { title: "Financial Modeling & Valuation<br />Analyst (FMVA)®", description: "Modeling, valuation, and finance career skills.", initials: "FMVA" },
          ],
          "HR & People": [
            { title: "SHRM Certified Professional<br />(SHRM-CP)", description: "People operations, policy, and HR practice.", badge: "Popular", initials: "SHRM", tall: true },
            { title: "Professional in Human Resources<br />(PHR)", description: "Technical and operational HR knowledge.", initials: "PHR", alt: true },
            { title: "Associate Professional in Talent<br />Development (APTD)", description: "Talent development and workplace learning foundations.", initials: "APTD" },
          ],
          "Facility Management": [
            { title: "Certified Facility Manager<br />(CFM)", description: "Operations, maintenance, and workplace strategy.", badge: "Popular", initials: "CFM", tall: true },
            { title: "Facility Management Professional<br />(FMP)", description: "Foundational FM competencies for practical teams.", initials: "FMP", alt: true },
            { title: "Sustainability Facility Professional<br />(SFP)", description: "Sustainable facility operations and reporting.", initials: "SFP" },
          ],
          "Supply Chain Management": [
            { title: "Certified Supply Chain<br />Professional (CSCP)", description: "End-to-end supply chain strategy and execution.", badge: "Popular", initials: "CSCP", tall: true },
            { title: "Certified in Planning and<br />Inventory Management (CPIM)", description: "Planning, inventory, and operations management.", initials: "CPIM", alt: true },
            { title: "Certified Logistics, Transportation<br />and Distribution (CLTD)", description: "Logistics, distribution, and transportation flows.", initials: "CLTD" },
          ],
          "Health, Safety & Environment": [
            { title: "NEBOSH International General<br />Certificate", description: "Health and safety management for global workplaces.", badge: "Popular", initials: "NEB", tall: true },
            { title: "IOSH Managing Safely", description: "Practical safety leadership for managers and supervisors.", initials: "IOSH", alt: true },
            { title: "Certified Safety Professional<br />(CSP)", description: "Advanced safety practice and risk management.", initials: "CSP" },
          ],
          "Nursing": [
            { title: "NCLEX-RN", description: "Licensure preparation for registered nursing practice.", badge: "Popular", initials: "RN", tall: true },
            { title: "NCLEX-PN", description: "Licensure preparation for practical nursing roles.", initials: "PN", alt: true },
            { title: "Certified Nursing Assistant<br />(CNA)", description: "Foundational patient care and clinical support skills.", initials: "CNA" },
          ],
        };
        const intervalMs = 4800;
        let active = 0;
        let timerId;
        let startX = 0;
        let startY = 0;
        let tracking = false;
        let sheetDragStartY = 0;
        let sheetDragY = 0;
        let sheetDragging = false;
        let currentCategory = params.get("category") || "Project Management";
        let currentCourseIndex = Number(params.get("course") || 0);
        let selectedDuration = params.get("duration") || "30";
        let selectedPlan = params.get("plan");
        let selectedTimelineTab = params.get("timelineType") || "specific";
        const incomingDate = params.get("examDate");
        let selectedDate = incomingDate ? new Date(`${incomingDate}T00:00:00`) : new Date(2026, 9, 12);
        let visibleCalendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        let selectedTentative = params.get("tentative") || "1 - 3 months";
        let selectedHours = params.get("hours") || "1";
        let selectedFocus = params.get("focus") || "60";
        let selectedRest = params.get("rest") || "Sun";

        function navigateTo(url) {
          const targetUrl = new URL(url, document.baseURI).href;
          const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (document.startViewTransition && !reduceMotion) {
            document.startViewTransition(() => {
              window.location.href = targetUrl;
            });
            return;
          }
          document.body.classList.add("route-exiting");
          window.setTimeout(() => {
            window.location.href = targetUrl;
          }, 90);
        }

        function restartTimer() {
          if (!artSlides.length) return;
          window.clearInterval(timerId);
          timerId = window.setInterval(() => showSlide(active + 1), intervalMs);
        }

        function resetProgress(dot) {
          const clone = dot.cloneNode(false);
          dot.replaceWith(clone);
          dots[dots.indexOf(dot)] = clone;
        }

        function showSlide(index) {
          if (!artSlides.length) return;
          const next = (index + artSlides.length) % artSlides.length;
          if (next === active) return;
          artSlides[active].classList.remove("active");
          copySlides[active].classList.remove("active");
          dots[active].classList.remove("active");
          active = next;
          artSlides[active].classList.add("active");
          copySlides[active].classList.add("active");
          resetProgress(dots[active]);
          dots[active].classList.add("active");
        }

        dots.forEach((dot, index) => {
          dot.addEventListener("click", () => {
            showSlide(index);
            restartTimer();
          });
        });

        if (screen && artSlides.length) {
          screen.addEventListener("pointerdown", (event) => {
            if (sheetOverlay?.classList.contains("open")) return;
            tracking = true;
            startX = event.clientX;
            startY = event.clientY;
          });
          screen.addEventListener("pointerup", (event) => {
            if (!tracking) return;
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            tracking = false;
            if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
            showSlide(active + (dx < 0 ? 1 : -1));
            restartTimer();
          });
          screen.addEventListener("pointercancel", () => {
            tracking = false;
          });
        }

        function updateCertificationState(mode) {
          if (!certInput || !certSearch || !certLabel) return;
          const value = certInput.value.trim();
          certSearch.classList.toggle("active", mode === "active");

          if (!value) {
            certLabel.textContent = "Trending Certifications";
            return;
          }

          certLabel.textContent = mode === "results" ? "Results for “PMP”" : "Suggested Matches";
        }

        function showCategoryPanel() {
          categoryPanel?.classList.add("active");
          coursePanel?.classList.remove("active");
          detailPanel?.classList.remove("active");
          sheetBack?.classList.add("hidden");
          sheetInfo?.classList.add("hidden");
          sheetNav?.classList.remove("with-back");
        }

        function renderCourses(category) {
          const courses = courseCatalog[category] || courseCatalog["Project Management"];
          if (!courseItems) return;
          courseItems.innerHTML = courses
            .map((course, index) => {
              const logo = course.asset
                ? `<div class="cert-logo"><img src="${course.asset}" alt="" /></div>`
                : `<div class="cert-logo text-logo">${course.initials}</div>`;
              const badge = course.badge ? `<div class="cert-badge">${course.badge}</div>` : "";
              return `
                <article class="cert-card interactive${course.tall ? " tall" : ""}${course.alt ? " alt" : ""}" data-course-index="${index}">
                  ${logo}
                  <div>
                    ${badge}
                    <h3 class="cert-name">${course.title}</h3>
                    <p class="cert-desc">${course.description}</p>
                  </div>
                </article>`;
            })
            .join("");

          Array.from(courseItems.querySelectorAll(".cert-card")).forEach((card) => {
            card.addEventListener("click", () => {
              const index = Number(card.dataset.courseIndex || 0);
              showDetailPanel(category, index);
            });
          });
        }

        function showCoursePanel(category) {
          currentCategory = category;
          if (courseLabel) courseLabel.textContent = category;
          renderCourses(category);
          categoryPanel?.classList.remove("active");
          coursePanel?.classList.add("active");
          detailPanel?.classList.remove("active");
          sheetBack?.classList.remove("hidden");
          sheetInfo?.classList.add("hidden");
          sheetNav?.classList.add("with-back");
        }

        function plainTitle(title) {
          return title.replaceAll("<br />", " ").replace(/\s+/g, " ").trim();
        }

        function showDetailPanel(category, index) {
          if (!detailPanel) return;
          currentCategory = category;
          currentCourseIndex = index;
          const courses = courseCatalog[category] || courseCatalog["Project Management"];
          const course = courses[index] || courses[0];
          const initials = course.initials || plainTitle(course.title).split(/\s+/).map((word) => word[0]).join("").slice(0, 4);

          detailPanel.querySelector(".detail-title").textContent = plainTitle(course.title);
          detailPanel.querySelector(".detail-description").textContent = course.description;
          detailPanel.querySelector(".detail-initials").textContent = initials;
          detailPanel.querySelector(".detail-modules").textContent = category === "Project Management" ? "12 Prep Modules" : "8 Prep Modules";

          categoryPanel?.classList.remove("active");
          coursePanel?.classList.remove("active");
          detailPanel?.classList.add("active");
          sheetBack?.classList.add("hidden");
          sheetInfo?.classList.remove("hidden");
          sheetNav?.classList.add("with-back");
        }

        function openExploreSheet(options = {}) {
          if (!sheetOverlay || !bottomSheet) return;
          if (options.panel === "detail") {
            showDetailPanel(currentCategory, currentCourseIndex);
          } else {
            showCategoryPanel();
          }
          bottomSheet.style.transform = "";
          sheetOverlay.classList.remove("hidden");
          window.requestAnimationFrame(() => sheetOverlay.classList.add("open"));
          sheetOverlay.setAttribute("aria-hidden", "false");
        }

        function closeExploreSheet() {
          if (!sheetOverlay || !bottomSheet) return;
          bottomSheet.classList.remove("dragging");
          bottomSheet.style.transform = "";
          sheetOverlay.classList.remove("open");
          sheetOverlay.setAttribute("aria-hidden", "true");
          window.setTimeout(() => {
            if (!sheetOverlay.classList.contains("open")) {
              sheetOverlay.classList.add("hidden");
            }
          }, 280);
        }

        if (sheetNav && bottomSheet) {
          sheetNav.addEventListener("pointerdown", (event) => {
            if (event.target instanceof Element && event.target.closest(".sheet-icon-btn")) return;
            sheetDragging = true;
            sheetDragStartY = event.clientY;
            sheetDragY = 0;
            bottomSheet.classList.add("dragging");
            sheetNav.setPointerCapture(event.pointerId);
          });
          sheetNav.addEventListener("pointermove", (event) => {
            if (!sheetDragging) return;
            sheetDragY = Math.max(0, event.clientY - sheetDragStartY);
            bottomSheet.style.transform = `translateY(${sheetDragY}px)`;
          });
          function finishSheetDrag() {
            if (!sheetDragging) return;
            sheetDragging = false;
            bottomSheet.classList.remove("dragging");
            if (sheetDragY > 100) {
              closeExploreSheet();
              return;
            }
            bottomSheet.style.transform = "";
          }
          sheetNav.addEventListener("pointerup", finishSheetDrag);
          sheetNav.addEventListener("pointercancel", finishSheetDrag);
        }

        function goToPlan() {
          const url = new URL("onboarding/plan.html", document.baseURI);
          url.searchParams.set("category", currentCategory);
          url.searchParams.set("course", String(currentCourseIndex));
          navigateTo(url.href);
        }
        function backToCertificationDetail() {
          const url = new URL("commerce/certification.html", document.baseURI);
          url.searchParams.set("sheet", "detail");
          url.searchParams.set("category", currentCategory);
          url.searchParams.set("course", String(currentCourseIndex));
          navigateTo(url.href);
        }
        function currentFlowUrl(path) {
          const url = new URL(path, document.baseURI);
          params.forEach((value, key) => {
            url.searchParams.set(key, value);
          });
          return url;
        }
        function goToTimeline() {
          if (!selectedPlan) return;
          const url = currentFlowUrl("app/timeline.html");
          url.searchParams.set("category", currentCategory);
          url.searchParams.set("course", String(currentCourseIndex));
          url.searchParams.set("plan", selectedPlan);
          url.searchParams.set("duration", selectedDuration);
          navigateTo(url.href);
        }
        function goBackToPlan() {
          const url = currentFlowUrl("onboarding/plan.html");
          navigateTo(url.href);
        }
        function goBackToTimeline() {
          const url = currentFlowUrl("app/timeline.html");
          navigateTo(url.href);
        }
        function goBackToHabits() {
          const url = currentFlowUrl("app/habits.html");
          navigateTo(url.href);
        }
        function goToAccount(path = "account/auth/account-code.html") {
          const url = currentFlowUrl(path);
          navigateTo(url.href);
        }
        function goToSignIn(path = "account/auth/signin-code.html") {
          const url = currentFlowUrl(path);
          navigateTo(url.href);
        }
        function goToVerifyEmail() {
          const url = currentFlowUrl("account/auth/verify-email.html");
          const email = document.querySelector(".account-email")?.value.trim();
          if (email) url.searchParams.set("email", email);
          navigateTo(url.href);
        }
        function goToSignInVerify() {
          const url = currentFlowUrl("account/auth/signin-check-email.html");
          const email = document.querySelector(".signin-email")?.value.trim();
          if (email) url.searchParams.set("email", email);
          navigateTo(url.href);
        }
        function goToForgotVerify() {
          const url = currentFlowUrl("account/auth/forgot-check-email.html");
          const email = document.querySelector(".forgot-email")?.value.trim();
          if (email) url.searchParams.set("email", email);
          navigateTo(url.href);
        }
        function goToPersonalDetails() {
          const url = currentFlowUrl("account/auth/personal-details.html");
          navigateTo(url.href);
        }
        function isPaidPlan(plan = selectedPlan) {
          return Boolean(plan && plan !== "free");
        }
        function planPrice(planId, duration = selectedDuration) {
          const plan = planCatalog[planId] || planCatalog.advanced;
          if (!plan.basePrice) return 0;
          return plan.basePrice + (durationUplifts[String(duration)] || 0);
        }
        function currentPlanId() {
          return params.get("plan") || selectedPlan || "advanced";
        }
        function goToCheckout() {
          const url = currentFlowUrl("commerce/checkout.html");
          if (!url.searchParams.get("plan")) url.searchParams.set("plan", currentPlanId());
          if (!url.searchParams.get("duration")) url.searchParams.set("duration", selectedDuration);
          navigateTo(url.href);
        }
        function goToPaymentSuccess() {
          const url = currentFlowUrl("commerce/payment-success.html");
          navigateTo(url.href);
        }
        function goBackFromAuth() {
          const path = window.location.pathname;
          if (path.endsWith("account/auth/signin-password.html")) {
            goToSignIn("account/auth/signin-code.html");
            return;
          }
          if (path.endsWith("account/auth/signin-check-email.html")) {
            goToSignIn(params.get("signinMode") === "password" ? "account/auth/signin-password.html" : "account/auth/signin-code.html");
            return;
          }
          if (path.endsWith("account/auth/forgot-password.html")) {
            goToSignIn("account/auth/signin-password.html");
            return;
          }
          if (path.endsWith("account/auth/forgot-check-email.html")) {
            const url = currentFlowUrl("account/auth/forgot-password.html");
            navigateTo(url.href);
            return;
          }
          if (path.endsWith("account/auth/reset-password.html")) {
            const url = currentFlowUrl("account/auth/forgot-check-email.html");
            navigateTo(url.href);
            return;
          }
          if (path.endsWith("account/auth/account-password.html")) {
            goToAccount("account/auth/account-code.html");
            return;
          }
          if (path.endsWith("account/auth/verify-email.html")) {
            goToAccount(params.get("authMode") === "password" ? "account/auth/account-password.html" : "account/auth/account-code.html");
            return;
          }
          if (path.endsWith("account/auth/personal-details.html")) {
            const url = currentFlowUrl("account/auth/verify-email.html");
            navigateTo(url.href);
            return;
          }
          if (path.endsWith("commerce/checkout.html")) {
            const url = currentFlowUrl("account/auth/personal-details.html");
            navigateTo(url.href);
            return;
          }
          const url = currentFlowUrl("onboarding/mapping.html");
          navigateTo(url.href);
        }
        function goHomeAfterAuth() {
          navigateTo("app/dashboard.html");
        }
        function updateTimelineTabs(nextTab) {
          selectedTimelineTab = nextTab;
          timelineTabs.forEach((tab) => {
            const isActive = tab.dataset.timelineTab === nextTab;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
          });
          timelinePanels.forEach((panel) => {
            panel.classList.toggle("active", panel.dataset.timelinePanel === nextTab);
          });
        }
        function syncDateSummary() {
          if (!dateDay || !dateMonth || !dateYear) return;
          dateDay.textContent = String(selectedDate.getDate()).padStart(2, "0");
          dateMonth.textContent = selectedDate.toLocaleString("en", { month: "short" }).toUpperCase();
          dateYear.textContent = String(selectedDate.getFullYear());
        }
        function renderCalendar() {
          if (!calendarGrid || !calendarTitle) return;
          const year = visibleCalendarMonth.getFullYear();
          const month = visibleCalendarMonth.getMonth();
          calendarTitle.textContent = visibleCalendarMonth.toLocaleString("en", { month: "long", year: "numeric" });
          calendarGrid.innerHTML = "";
          ["S", "M", "T", "W", "T", "F", "S"].forEach((day) => {
            const label = document.createElement("span");
            label.textContent = day;
            calendarGrid.append(label);
          });

          const firstWeekday = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const daysInPrevious = new Date(year, month, 0).getDate();
          const cells = 35;

          for (let index = 0; index < cells; index += 1) {
            const dayNumber = index - firstWeekday + 1;
            const button = document.createElement("button");
            button.type = "button";
            let buttonDate;
            if (dayNumber < 1) {
              const day = daysInPrevious + dayNumber;
              button.textContent = String(day);
              button.classList.add("outside");
              buttonDate = new Date(year, month - 1, day);
            } else if (dayNumber > daysInMonth) {
              const day = dayNumber - daysInMonth;
              button.textContent = String(day);
              button.classList.add("outside");
              buttonDate = new Date(year, month + 1, day);
            } else {
              button.textContent = String(dayNumber);
              buttonDate = new Date(year, month, dayNumber);
            }
            const sameDate = buttonDate.toDateString() === selectedDate.toDateString();
            button.classList.toggle("selected", sameDate);
            button.setAttribute("aria-pressed", String(sameDate));
            button.addEventListener("click", () => {
              selectedDate = buttonDate;
              visibleCalendarMonth = new Date(buttonDate.getFullYear(), buttonDate.getMonth(), 1);
              syncDateSummary();
              renderCalendar();
            });
            calendarGrid.append(button);
          }
        }
        function goToHabits() {
          const url = currentFlowUrl("app/habits.html");
          if (selectedTimelineTab === "specific") {
            url.searchParams.set("timelineType", "specific");
            url.searchParams.set("examDate", selectedDate.toISOString().slice(0, 10));
          } else {
            url.searchParams.set("timelineType", "tentative");
            url.searchParams.set("tentative", selectedTentative);
          }
          navigateTo(url.href);
        }
        function selectTentative(option) {
          selectedTentative = option.dataset.tentative || selectedTentative;
          tentativeOptions.forEach((item) => {
            const isSelected = item === option;
            item.classList.toggle("selected", isSelected);
            item.setAttribute("aria-checked", String(isSelected));
          });
        }
        function updateHours() {
          if (!hoursSlider || !hoursOutput) return;
          selectedHours = hoursSlider.value;
          hoursOutput.textContent = `${selectedHours}h`;
        }
        function selectFocus(option) {
          selectedFocus = option.dataset.focus || selectedFocus;
          focusOptions.forEach((item) => {
            const isSelected = item === option;
            item.classList.toggle("selected", isSelected);
            item.setAttribute("aria-checked", String(isSelected));
          });
        }
        function selectRest(option) {
          selectedRest = option.dataset.rest || selectedRest;
          restOptions.forEach((item) => {
            const isSelected = item === option;
            item.classList.toggle("selected", isSelected);
            item.setAttribute("aria-checked", String(isSelected));
          });
        }
        function goToMapping() {
          const url = currentFlowUrl("onboarding/mapping.html");
          url.searchParams.set("hours", selectedHours);
          url.searchParams.set("focus", selectedFocus);
          url.searchParams.set("rest", selectedRest);
          navigateTo(url.href);
        }
        function planPrice(card) {
          const basePrice = Number(card.dataset.basePrice || 0);
          if (basePrice === 0) return 0;
          return basePrice + (durationUplifts[selectedDuration] || 0);
        }
        function renderPlanState() {
          durationTabs.forEach((tab) => {
            const isActive = tab.dataset.duration === selectedDuration;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
          });

          planCards.forEach((card) => {
            const isSelected = card.dataset.plan === selectedPlan;
            const price = card.querySelector(".plan-price");
            card.classList.toggle("selected", isSelected);
            card.setAttribute("aria-pressed", String(isSelected));
            if (price) price.textContent = `$${planPrice(card)}`;
          });

          if (!planCta) return;
          const hasSelection = Boolean(selectedPlan);
          planCta.disabled = !hasSelection;
          const label = selectedPlan === "free"
            ? "Start for free"
            : selectedPlan
              ? `Continue with ${planLabels[selectedPlan]}`
              : "Select a plan";
          const icon = planCta.querySelector("img");
          planCta.textContent = label;
          if (icon) {
            planCta.append(" ");
            planCta.append(icon);
          }
        }
        startButton?.addEventListener("click", () => { navigateTo("commerce/certification.html"); });
        certBack?.addEventListener("click", () => { navigateTo("account/auth/index.html"); });
        planBack?.addEventListener("click", backToCertificationDetail);
        planCta?.addEventListener("click", goToTimeline);
        timelineBack?.addEventListener("click", goBackToPlan);
        timelineConfirm?.addEventListener("click", goToHabits);
        habitsBack?.addEventListener("click", goBackToTimeline);
        habitsConfirm?.addEventListener("click", goToMapping);
        mappingBack?.addEventListener("click", goBackToHabits);

        let planPreviewOpened = false;

        function formatPlanDate(date) {
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }

        function normalizeRestDay(value) {
          const key = (value || "Sun").toLowerCase();
          const map = {
            mon: "monday",
            monday: "monday",
            tue: "tuesday",
            tuesday: "tuesday",
            wed: "wednesday",
            wednesday: "wednesday",
            thu: "thursday",
            thursday: "thursday",
            fri: "friday",
            friday: "friday",
            sat: "saturday",
            saturday: "saturday",
            sun: "sunday",
            sunday: "sunday",
          };
          return map[key] || "sunday";
        }

        function renderPlanPreviewData() {
          const startEl = document.querySelector("[data-plan-start]");
          const examEl = document.querySelector("[data-plan-exam]");
          const durationEl = document.querySelector("[data-plan-duration]");
          const studyDaysEl = document.querySelector("[data-plan-study-days]");
          if (!startEl || !examEl || !durationEl || !studyDaysEl) return;

          const today = new Date();
          const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          let examDate = params.get("examDate")
            ? new Date(params.get("examDate"))
            : new Date(startDate.getFullYear(), startDate.getMonth() + 2, 20);

          if (Number.isNaN(examDate.getTime())) {
            examDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 20);
          }

          const durationDays = Math.max(
            7,
            Math.round((examDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
          );
          const durationWeeks = Math.max(1, Math.round(durationDays / 7));

          startEl.textContent = formatPlanDate(startDate);
          examEl.textContent = formatPlanDate(examDate);
          durationEl.textContent = `${durationWeeks} weeks`;

          const restDay = normalizeRestDay(params.get("rest") || selectedRest);
          const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
          const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

          studyDaysEl.innerHTML = dayLabels
            .map((label, index) => {
              const isRest = dayKeys[index] === restDay;
              return `<span class="study-day${isRest ? " rest" : " active"}">${label}</span>`;
            })
            .join("");
        }

        let planPreviewTimer = null;

        function openPlanPreviewSheet() {
          if (!planPreviewOverlay || planPreviewOpened) return;
          planPreviewOpened = true;
          renderPlanPreviewData();
          planPreviewOverlay.classList.remove("hidden");
          window.requestAnimationFrame(() => {
            planPreviewOverlay.classList.add("open");
            planPreviewOverlay.setAttribute("aria-hidden", "false");
          });
        }

        function markPlanPreviewReady() {
          if (planPreviewOpened) return;
          if (planPreviewTimer) window.clearTimeout(planPreviewTimer);
          planPreviewTimer = window.setTimeout(openPlanPreviewSheet, 500);
        }

        function closePlanPreviewSheet() {
          if (!planPreviewOverlay || !planPreviewSheet) return;
          planPreviewOverlay.classList.remove("open");
          planPreviewOverlay.setAttribute("aria-hidden", "true");
          window.setTimeout(() => {
            if (!planPreviewOverlay.classList.contains("open")) {
              planPreviewOverlay.classList.add("hidden");
              planPreviewOpened = false;
            }
          }, 280);
        }

        function toggleSprintCard(card) {
          const toggle = card.querySelector(".sprint-card-toggle");
          const willOpen = !card.classList.contains("is-open");
          sprintCards.forEach((item) => {
            item.classList.remove("is-open");
            item.querySelector(".sprint-card-toggle")?.setAttribute("aria-expanded", "false");
          });
          if (willOpen) {
            card.classList.add("is-open");
            toggle?.setAttribute("aria-expanded", "true");
          }
        }

        function renderCheckoutPlan() {
          const planId = currentPlanId();
          const duration = params.get("duration") || selectedDuration;
          const plan = planCatalog[planId] || planCatalog.advanced;
          const nameEl = document.querySelector("[data-checkout-plan-name]");
          const durationEl = document.querySelector("[data-checkout-duration]");
          const priceEl = document.querySelector("[data-checkout-price]");
          const subtitleEl = document.querySelector("[data-checkout-subtitle]");
          const successPlanEl = document.querySelector("[data-success-plan]");
          const featuresEl = document.querySelector("[data-checkout-features]");
          if (nameEl) nameEl.textContent = plan.name;
          if (durationEl) durationEl.textContent = duration;
          if (priceEl) priceEl.textContent = `$${planPrice(planId, duration)}`;
          if (subtitleEl) subtitleEl.textContent = plan.subtitle;
          if (successPlanEl) successPlanEl.textContent = plan.name;
          if (featuresEl) {
            featuresEl.innerHTML = plan.features.map((feature) => `<li>${feature}</li>`).join("");
          }
          if (changePlanConfirm) changePlanConfirm.textContent = `Continue with ${plan.name}`;
        }

        let changePlanModalPlan = null;
        let changePlanModalDuration = null;

        function changePlanModalSelection() {
          return {
            plan: changePlanModalPlan ?? currentPlanId(),
            duration: changePlanModalDuration ?? params.get("duration") ?? selectedDuration,
          };
        }

        function updateChangePlanConfirmLabel() {
          if (!changePlanConfirm) return;
          const { plan: planId } = changePlanModalSelection();
          const plan = planCatalog[planId] || planCatalog.advanced;
          changePlanConfirm.textContent = `Continue with ${plan.name}`;
        }

        function renderChangePlanGrid() {
          if (!changePlanGrid) return;
          const { plan: selected, duration } = changePlanModalSelection();
          changePlanGrid.innerHTML = Object.entries(planCatalog)
            .map(([id, plan]) => {
              const isSelected = id === selected;
              return `
                <button class="change-plan-card${isSelected ? " selected" : ""}" type="button" data-change-plan="${id}">
                  <small>${plan.name}</small>
                  <strong>$${planPrice(id, duration)}</strong>
                  <p>${plan.subtitle}</p>
                  <ul>${plan.features.slice(0, 4).map((feature) => `<li>${feature}</li>`).join("")}</ul>
                </button>
              `;
            })
            .join("");
          changePlanGrid.querySelectorAll("[data-change-plan]").forEach((button) => {
            button.addEventListener("click", (event) => {
              event.stopPropagation();
              changePlanModalPlan = button.dataset.changePlan || "advanced";
              renderChangePlanGrid();
              updateChangePlanConfirmLabel();
            });
          });
        }

        function renderPersonalDetailsCta() {
          if (!finishSetup) return;
          finishSetup.textContent = isPaidPlan(params.get("plan")) ? "Continue to Payment" : "Finish Setup";
        }

        function openChangePlanModal() {
          if (!changePlanOverlay) return;
          changePlanModalPlan = currentPlanId();
          changePlanModalDuration = params.get("duration") || selectedDuration;
          renderChangePlanGrid();
          changeDurationTabs.forEach((tab) => {
            tab.classList.toggle(
              "active",
              tab.dataset.checkoutDurationOption === String(changePlanModalDuration),
            );
          });
          updateChangePlanConfirmLabel();
          changePlanOverlay.classList.remove("hidden");
          changePlanOverlay.setAttribute("aria-hidden", "false");
        }

        function closeChangePlanModal() {
          changePlanOverlay?.classList.add("hidden");
          changePlanOverlay?.setAttribute("aria-hidden", "true");
        }

        sprintCards.forEach((card) => {
          card.querySelector(".sprint-card-toggle")?.addEventListener("click", () => {
            toggleSprintCard(card);
          });
        });

        planPreviewPrimary?.addEventListener("click", () => goToAccount("account/auth/account-code.html"));
        planPreviewSecondary?.addEventListener("click", goBackToTimeline);
        planPreviewOverlay?.addEventListener("click", (event) => {
          if (event.target === planPreviewOverlay) closePlanPreviewSheet();
        });
        signInEntry?.addEventListener("click", () => goToSignIn("account/auth/signin-code.html"));
        accountSwitchButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const mode = button.dataset.accountMode || "code";
            const target = mode === "password" ? "account/auth/account-password.html" : "account/auth/account-code.html";
            const url = currentFlowUrl(target);
            url.searchParams.set("authMode", mode);
            navigateTo(url.href);
          });
        });
        accountContinueButtons.forEach((button) => button.addEventListener("click", goToVerifyEmail));
        signinModeButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const mode = button.dataset.signinMode || "code";
            const target = mode === "password" ? "account/auth/signin-password.html" : "account/auth/signin-code.html";
            const url = currentFlowUrl(target);
            url.searchParams.set("signinMode", mode);
            navigateTo(url.href);
          });
        });
        signinContinueButtons.forEach((button) => button.addEventListener("click", goToSignInVerify));
        signinPasswordSubmit?.addEventListener("click", goHomeAfterAuth);
        forgotPasswordLink?.addEventListener("click", () => {
          const url = currentFlowUrl("account/auth/forgot-password.html");
          const email = document.querySelector(".signin-email")?.value.trim();
          if (email) url.searchParams.set("email", email);
          navigateTo(url.href);
        });
        backToSigninButtons.forEach((button) =>
          button.addEventListener("click", () => {
            resetSuccessOverlay?.classList.add("hidden");
            resetSuccessOverlay?.setAttribute("aria-hidden", "true");
            goToSignIn("account/auth/signin-password.html");
          }),
        );
        sendResetCode?.addEventListener("click", goToForgotVerify);
        changeEmail?.addEventListener("click", () => {
          const url = currentFlowUrl("account/auth/forgot-password.html");
          navigateTo(url.href);
        });
        resetPasswordSubmit?.addEventListener("click", () => {
          if (resetPasswordSubmit.disabled) return;
          resetSuccessOverlay?.classList.remove("hidden");
          resetSuccessOverlay?.setAttribute("aria-hidden", "false");
        });
        passwordToggles.forEach((button) => {
          button.addEventListener("click", () => {
            const input = button.closest(".password-input")?.querySelector("input");
            if (!input) return;
            const willShow = input.type === "password";
            input.type = willShow ? "text" : "password";
            button.setAttribute("aria-label", willShow ? "Hide password" : "Show password");
            button.classList.toggle("is-visible", willShow);
          });
        });
        function updatePasswordRules() {
          if (!resetNewPassword || !resetConfirmPassword) return;
          const password = resetNewPassword.value;
          const confirmation = resetConfirmPassword.value;
          const checks = {
            length: password.length >= 8,
            mix: /[A-Za-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
            match: password.length > 0 && password === confirmation,
          };
          Object.entries(checks).forEach(([key, isValid]) => {
            passwordRules[key]?.classList.toggle("is-valid", isValid);
          });
          if (resetPasswordSubmit) {
            resetPasswordSubmit.disabled = !Object.values(checks).every(Boolean);
          }
        }
        resetNewPassword?.addEventListener("input", updatePasswordRules);
        resetConfirmPassword?.addEventListener("input", updatePasswordRules);
        updatePasswordRules();
        authBack?.addEventListener("click", goBackFromAuth);
        if (verifyEmail && params.get("email")) {
          verifyEmail.textContent = params.get("email");
        }
        function syncVerifyButton() {
          if (!verifyPrimary || !codeInputs.length) return;
          const isComplete = codeInputs.every((input) => input.value.trim().length === 1);
          verifyPrimary.disabled = !isComplete;
        }
        codeInputs.forEach((input, index) => {
          input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "").slice(0, 1);
            if (input.value && codeInputs[index + 1]) codeInputs[index + 1].focus();
            syncVerifyButton();
          });
          input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && !input.value && codeInputs[index - 1]) {
              codeInputs[index - 1].focus();
            }
          });
        });
        verifyPrimary?.addEventListener("click", () => {
          const path = window.location.pathname;
          if (path.endsWith("account/auth/signin-check-email.html")) {
            goHomeAfterAuth();
            return;
          }
          if (path.endsWith("account/auth/forgot-check-email.html")) {
            const url = currentFlowUrl("account/auth/reset-password.html");
            navigateTo(url.href);
            return;
          }
          goToPersonalDetails();
        });
        finishSetup?.addEventListener("click", () => {
          if (isPaidPlan(params.get("plan"))) {
            goToCheckout();
            return;
          }
          navigateTo("app/dashboard.html");
        });
        checkoutBack?.addEventListener("click", () => {
          const url = currentFlowUrl("account/auth/personal-details.html");
          navigateTo(url.href);
        });
        checkoutContinue?.addEventListener("click", goToPaymentSuccess);
        checkoutChangePlan?.addEventListener("click", openChangePlanModal);
        document.addEventListener("click", (event) => {
          if (event.target.closest(".checkout-view .checkout-change-plan")) {
            openChangePlanModal();
          }
        });
        changePlanOverlay?.addEventListener("click", (event) => {
          if (event.target === changePlanOverlay) closeChangePlanModal();
        });
        changeDurationTabs.forEach((tab) => {
          tab.addEventListener("click", (event) => {
            event.stopPropagation();
            const durationValue = tab.dataset.checkoutDurationOption || "30";
            if (changePlanOverlay && !changePlanOverlay.classList.contains("hidden")) {
              changePlanModalDuration = durationValue;
              changeDurationTabs.forEach((item) => {
                item.classList.toggle(
                  "active",
                  item.dataset.checkoutDurationOption === durationValue,
                );
              });
              renderChangePlanGrid();
              return;
            }
            const url = currentFlowUrl("commerce/checkout.html");
            url.searchParams.set("duration", durationValue);
            url.searchParams.set("plan", currentPlanId());
            navigateTo(url.href);
          });
        });
        changePlanConfirm?.addEventListener("click", () => {
          const { plan, duration } = changePlanModalSelection();
          const url = currentFlowUrl("commerce/checkout.html");
          url.searchParams.set("plan", plan);
          url.searchParams.set("duration", duration);
          navigateTo(url.href);
        });
        document.querySelector(".change-plan-modal")?.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        paymentSuccessBack?.addEventListener("click", () => {
          const url = currentFlowUrl("commerce/checkout.html");
          navigateTo(url.href);
        });
        startLearning?.addEventListener("click", () => navigateTo("app/dashboard.html"));
        initPaymentConfetti();
        syncVerifyButton();
        renderPersonalDetailsCta();
        renderCheckoutPlan();
        renderChangePlanGrid();

        let resendTimer = null;
        function startResendCooldown(seconds = 60) {
          if (!resendButton) return;
          if (resendTimer) window.clearInterval(resendTimer);
          let remaining = seconds;
          const originalLabel = "Resend";
          resendButton.disabled = true;
          resendButton.textContent = `${originalLabel} in ${remaining}s`;
          resendTimer = window.setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
              window.clearInterval(resendTimer);
              resendTimer = null;
              resendButton.disabled = false;
              resendButton.textContent = originalLabel;
              return;
            }
            resendButton.textContent = `${originalLabel} in ${remaining}s`;
          }, 1000);
        }

        resendButton?.addEventListener("click", () => startResendCooldown(60));
        if (resendButton) startResendCooldown(60);

        renderPlanPreviewData();
        durationTabs.forEach((tab) => {
          tab.addEventListener("click", () => {
            selectedDuration = tab.dataset.duration || "30";
            renderPlanState();
          });
        });
        planCards.forEach((card) => {
          function selectPlan() {
            selectedPlan = card.dataset.plan || null;
            renderPlanState();
          }
          card.addEventListener("click", selectPlan);
          card.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            selectPlan();
          });
        });
        timelineTabs.forEach((tab) => {
          tab.addEventListener("click", () => updateTimelineTabs(tab.dataset.timelineTab || "specific"));
        });
        monthPrev?.addEventListener("click", () => {
          visibleCalendarMonth = new Date(visibleCalendarMonth.getFullYear(), visibleCalendarMonth.getMonth() - 1, 1);
          renderCalendar();
        });
        monthNext?.addEventListener("click", () => {
          visibleCalendarMonth = new Date(visibleCalendarMonth.getFullYear(), visibleCalendarMonth.getMonth() + 1, 1);
          renderCalendar();
        });
        tentativeOptions.forEach((option) => option.addEventListener("click", () => selectTentative(option)));
        hoursSlider?.addEventListener("input", updateHours);
        focusOptions.forEach((option) => option.addEventListener("click", () => selectFocus(option)));
        restOptions.forEach((option) => option.addEventListener("click", () => selectRest(option)));
        if (hoursSlider) hoursSlider.value = selectedHours;
        updateTimelineTabs(selectedTimelineTab);
        const initialTentative = tentativeOptions.find((option) => option.dataset.tentative === selectedTentative);
        if (initialTentative) selectTentative(initialTentative);
        const initialFocus = focusOptions.find((option) => option.dataset.focus === selectedFocus);
        if (initialFocus) selectFocus(initialFocus);
        const initialRest = restOptions.find((option) => option.dataset.rest === selectedRest);
        if (initialRest) selectRest(initialRest);
        syncDateSummary();
        renderCalendar();
        updateHours();

        function initPaymentConfetti() {
          if (!paymentConfettiCanvas) return;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const ctx = paymentConfettiCanvas.getContext("2d");
          if (!ctx) return;

          const particles = Array.from({ length: 90 }, (_, i) => ({
            angle: (i / 90) * Math.PI * 2,
            radius: 0,
            speed: 1.7 + Math.random() * 2.6,
            spin: (Math.random() - 0.5) * 0.16,
            gravity: 0.08 + Math.random() * 0.09,
            x: 0,
            y: 0,
            vy: -1.6 - Math.random() * 1.2,
            w: 3 + Math.random() * 4,
            h: 5 + Math.random() * 7,
            life: Math.random(),
            hue: i % 6,
          }));
          const palette = ["#007bff", "#ff6b35", "#22c55e", "#9333ea", "#06b6d4", "#f59e0b"];
          let rafId = null;
          let width = 0;
          let height = 0;

          function resize() {
            width = paymentConfettiCanvas.clientWidth;
            height = paymentConfettiCanvas.clientHeight;
            paymentConfettiCanvas.width = width * window.devicePixelRatio;
            paymentConfettiCanvas.height = height * window.devicePixelRatio;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
          }

          function resetParticle(p) {
            p.angle = Math.random() * Math.PI * 2;
            p.radius = 12 + Math.random() * 26;
            p.speed = 1.6 + Math.random() * 2.8;
            p.gravity = 0.08 + Math.random() * 0.11;
            p.vy = -1.6 - Math.random() * 1.5;
            p.w = 3 + Math.random() * 4;
            p.h = 5 + Math.random() * 8;
            p.spin = (Math.random() - 0.5) * 0.18;
            p.life = 0;
          }

          function tick() {
            ctx.clearRect(0, 0, width, height);
            const cx = width * 0.5;
            const cy = height * 0.46;
            for (const p of particles) {
              p.life += 0.01;
              p.radius += p.speed;
              p.vy += p.gravity * 0.06;
              p.x = cx + Math.cos(p.angle) * p.radius;
              p.y = cy + Math.sin(p.angle) * p.radius + p.vy * 40;
              const alpha = Math.max(0, 1 - p.life);

              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.life * 9 + p.spin * 40);
              ctx.fillStyle = `${palette[p.hue]}${Math.round(alpha * 255)
                .toString(16)
                .padStart(2, "0")}`;
              ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
              ctx.restore();

              if (p.life > 1 || p.y > height + 22 || p.x < -22 || p.x > width + 22) {
                resetParticle(p);
              }
            }
            rafId = window.requestAnimationFrame(tick);
          }

          resize();
          particles.forEach(resetParticle);
          rafId = window.requestAnimationFrame(tick);
          window.addEventListener("resize", resize, { passive: true });
          window.addEventListener(
            "pagehide",
            () => {
              if (rafId) window.cancelAnimationFrame(rafId);
            },
            { once: true },
          );
        }
        exploreButton?.addEventListener("click", () => openExploreSheet());
        [sheetBack, sheetInfo, sheetClose].forEach((button) => {
          button?.addEventListener("pointerdown", (event) => event.stopPropagation());
        });
        sheetClose?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          closeExploreSheet();
        });
        sheetBack?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          showCategoryPanel();
        });
        configureButton?.addEventListener("click", goToPlan);
        sheetOverlay?.addEventListener("click", (event) => {
          if (event.target === sheetOverlay) closeExploreSheet();
        });
        categoryButtons.forEach((button) => {
          button.addEventListener("click", () => {
            showCoursePanel(button.dataset.category || "Project Management");
          });
        });
        directCourseCards.forEach((card) => {
          card.addEventListener("click", () => {
            const category = card.dataset.courseCategory || "Project Management";
            const index = Number(card.dataset.courseIndex || 0);
            currentCategory = category;
            currentCourseIndex = index;
            openExploreSheet({ panel: "detail" });
          });
        });
        renderCourses("Project Management");
        if (params.get("sheet") === "detail") {
          openExploreSheet({ panel: "detail" });
        }
        if (certInput) {
          certInput.addEventListener("focus", () => updateCertificationState("active"));
          certInput.addEventListener("input", () => updateCertificationState("active"));
          certInput.addEventListener("blur", () => {
            if (!certInput.value.trim()) updateCertificationState("default");
          });
          certInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              certInput.blur();
              updateCertificationState("results");
            }
          });
        }

        renderPlanState();

        if (mappingTypedEl && mappingProgressFill) {
          const mappingMessages = [
            "Mapping the most efficient route to your success...",
            "Prioritizing the high-impact topics that drive your score...",
            "Fitting tactical study sessions into your actual daily rhythm...",
            "Finalizing your custom path to peak exam readiness...",
          ];
          const charDelayMs = 42;
          const pauseBetweenMs = 2800;
          const loopPauseMs = 3200;
          const totalChars = mappingMessages.reduce((sum, message) => sum + message.length, 0);
          const ringDurationMs =
            totalChars * charDelayMs +
            (mappingMessages.length - 1) * pauseBetweenMs;
          const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          let ringRafId = null;

          function setRingProgress(progress) {
            const clamped = Math.min(1, Math.max(0, progress));
            mappingProgressFill.style.strokeDashoffset = String(1 - clamped);
          }

          function stopRingAnimator() {
            if (ringRafId !== null) {
              window.cancelAnimationFrame(ringRafId);
              ringRafId = null;
            }
          }

          function startRingAnimator() {
            stopRingAnimator();
            const startedAt = performance.now();
            const tick = (now) => {
              const progress = Math.min(1, (now - startedAt) / ringDurationMs);
              setRingProgress(progress);
              if (progress < 1) {
                ringRafId = window.requestAnimationFrame(tick);
              } else {
                ringRafId = null;
                markPlanPreviewReady();
              }
            };
            setRingProgress(0);
            ringRafId = window.requestAnimationFrame(tick);
          }

          function runMappingSequence() {
            if (reducedMotion) {
              mappingTypedEl.textContent = mappingMessages[mappingMessages.length - 1];
              setRingProgress(1);
              markPlanPreviewReady();
              return;
            }

            let messageIndex = 0;
            let charIndex = 0;
            mappingTypedEl.textContent = "";
            startRingAnimator();

            function step(afterHold) {
              const currentMessage = mappingMessages[messageIndex];

              if (charIndex < currentMessage.length) {
                charIndex += 1;
                mappingTypedEl.textContent = currentMessage.slice(0, charIndex);
                window.setTimeout(() => step(false), charDelayMs);
                return;
              }

              // Message fully typed — keep it on screen while we wait to read.
              if (!afterHold) {
                const isLast = messageIndex === mappingMessages.length - 1;
                if (isLast && !planPreviewOpened) markPlanPreviewReady();
                const holdMs = isLast ? loopPauseMs : pauseBetweenMs;
                window.setTimeout(() => step(true), holdMs);
                return;
              }

              if (messageIndex < mappingMessages.length - 1) {
                messageIndex += 1;
                charIndex = 0;
                step(false);
                return;
              }

              messageIndex = 0;
              charIndex = 0;
              startRingAnimator();
              step(false);
            }

            step(false);
          }

          runMappingSequence();
        }

        const dailyOverlay = document.querySelector("[data-daily-challenge]");
        if (dailyOverlay && dailyOverlay.getAttribute("data-daily-managed") !== "standalone") {
          const dailyViews = Array.from(dailyOverlay.querySelectorAll("[data-daily-view]"));
          const dailyStarts = Array.from(dailyOverlay.querySelectorAll("[data-daily-start]"));
          const dailySkip = dailyOverlay.querySelector("[data-daily-skip]");
          const dailyClose = dailyOverlay.querySelector("[data-daily-close]");
          const dailyCancelSkip = dailyOverlay.querySelector("[data-daily-cancel-skip]");
          const dailyCountdown = dailyOverlay.querySelector("[data-daily-countdown]");
          const dailyDone = dailyOverlay.querySelector("[data-daily-done]");
          const dailyPreviewButtons = Array.from(document.querySelectorAll("[data-daily-preview]"));
          const questionCategory = dailyOverlay.querySelector("[data-daily-category]");
          const questionText = dailyOverlay.querySelector("[data-daily-question]");
          const optionsWrap = dailyOverlay.querySelector("[data-daily-options]");
          const feedback = dailyOverlay.querySelector("[data-daily-feedback]");
          const continueButton = dailyOverlay.querySelector("[data-daily-continue]");
          const resultTitle = dailyOverlay.querySelector("[data-daily-result-title]");
          const resultMeta = dailyOverlay.querySelector("[data-daily-result-meta]");
          const resultNote = dailyOverlay.querySelector("[data-daily-result-note]");
          const scoreRing = dailyOverlay.querySelector("[data-daily-score-ring]");
          const dailyStorageKey = "certsprints.dailyQuickWin.lastSeen";
          const todayKey = new Date().toISOString().slice(0, 10);
          const forceDaily = params.get("daily") === "1";
          const previewDaily = forceDaily || window.location.protocol === "file:";
          let activeQuestion = 0;
          let selectedAnswer = null;
          let correctCount = 0;
          let skipTimer = null;
          let skipSeconds = 5;

          const dailyQuestions = [
            {
              category: "Risk Management",
              prompt:
                "Your project has an identified risk with a 40% probability and $50,000 impact. What is the expected monetary value (EMV)?",
              options: ["$20,000", "$50,000", "$90,000", "$10,000"],
              answer: 0,
            },
            {
              category: "Stakeholder Engagement",
              prompt:
                'A key stakeholder is classified as "resistant" in the stakeholder engagement assessment matrix. What is the BEST next step?',
              options: [
                "Escalate to the project sponsor immediately",
                "Develop targeted communication and engagement strategies",
                "Remove them from the stakeholder register",
                "Proceed without their input",
              ],
              answer: 1,
            },
          ];

          function showDailyView(name) {
            dailyViews.forEach((view) => {
              view.hidden = view.getAttribute("data-daily-view") !== name;
            });
          }

          function openDailyChallenge() {
            window.clearInterval(skipTimer);
            skipTimer = null;
            dailyOverlay.hidden = false;
            showDailyView("intro");
          }

          function closeDailyChallenge(markSeen = true) {
            window.clearInterval(skipTimer);
            skipTimer = null;
            if (markSeen && !previewDaily) {
              window.localStorage.setItem(dailyStorageKey, todayKey);
            }
            dailyOverlay.hidden = true;
          }

          function renderDailyQuestion() {
            const question = dailyQuestions[activeQuestion];
            selectedAnswer = null;
            if (questionCategory) questionCategory.textContent = question.category;
            if (questionText) questionText.textContent = question.prompt;
            if (feedback) {
              feedback.hidden = true;
              feedback.className = "daily-feedback";
              feedback.textContent = "";
            }
            if (continueButton) continueButton.disabled = true;
            if (!optionsWrap) return;
            optionsWrap.innerHTML = "";
            question.options.forEach((option, index) => {
              const button = document.createElement("button");
              button.className = "daily-option";
              button.type = "button";
              button.innerHTML = `
                <span class="daily-option-dot"></span>
                <span class="daily-option-letter">${String.fromCharCode(65 + index)}.</span>
                <span class="daily-option-text"></span>
              `;
              button.querySelector(".daily-option-text").textContent = option;
              button.addEventListener("click", () => chooseDailyAnswer(index));
              optionsWrap.appendChild(button);
            });
          }

          function chooseDailyAnswer(index) {
            const question = dailyQuestions[activeQuestion];
            selectedAnswer = index;
            const isCorrect = index === question.answer;
            const optionButtons = Array.from(optionsWrap.querySelectorAll(".daily-option"));
            optionButtons.forEach((button, optionIndex) => {
              button.classList.toggle("correct", optionIndex === question.answer && (isCorrect || selectedAnswer !== null));
              button.classList.toggle("wrong", optionIndex === selectedAnswer && !isCorrect);
            });
            if (feedback) {
              feedback.hidden = false;
              feedback.className = `daily-feedback ${isCorrect ? "correct" : "wrong"}`;
              feedback.textContent = isCorrect
                ? "Correct! Active recall reinforced."
                : "Not quite. The right answer is highlighted for review.";
            }
            if (continueButton) continueButton.disabled = false;
          }

          function startDailyDrill() {
            window.clearInterval(skipTimer);
            skipTimer = null;
            correctCount = 0;
            activeQuestion = 0;
            renderDailyQuestion();
            showDailyView("question");
          }

          function continueDailyDrill() {
            if (selectedAnswer === null) return;
            if (selectedAnswer === dailyQuestions[activeQuestion].answer) correctCount += 1;
            if (activeQuestion < dailyQuestions.length - 1) {
              activeQuestion += 1;
              renderDailyQuestion();
              return;
            }
            renderDailyResult();
          }

          function renderDailyResult() {
            const percent = Math.round((correctCount / dailyQuestions.length) * 100);
            const perfect = correctCount === dailyQuestions.length;
            if (resultTitle) resultTitle.textContent = perfect ? "Perfect Score!" : correctCount === 0 ? "Well Done!" : "Streak Protected!";
            if (resultMeta) resultMeta.textContent = `${correctCount} of ${dailyQuestions.length} correct · ${percent}%`;
            if (resultNote) {
              resultNote.textContent = perfect
                ? "Streak protected. Daily commitment confirmed."
                : correctCount === 0
                  ? "Commitment made - attempts strengthen recall."
                  : "Streak protected. Review the miss and keep momentum.";
            }
            if (scoreRing) {
              scoreRing.classList.toggle("zero", !perfect);
              const icon = scoreRing.querySelector("img");
              if (icon) icon.src = perfect ? "assets/daily-challenge/award.svg" : "assets/daily-challenge/tick.svg";
            }
            if (!previewDaily) {
              window.localStorage.setItem(dailyStorageKey, todayKey);
            }
            showDailyView("result");
          }

          function startSkipCountdown() {
            showDailyView("skipped");
            skipSeconds = 5;
            if (dailyCountdown) dailyCountdown.textContent = "5s";
            window.clearInterval(skipTimer);
            skipTimer = window.setInterval(() => {
              skipSeconds -= 1;
              if (dailyCountdown) dailyCountdown.textContent = `${Math.max(skipSeconds, 0)}s`;
              if (skipSeconds <= 0) {
                closeDailyChallenge(true);
              }
            }, 1000);
          }

          dailyStarts.forEach((button) => button.addEventListener("click", startDailyDrill));
          dailySkip?.addEventListener("click", startSkipCountdown);
          dailyClose?.addEventListener("click", () => {
            window.clearInterval(skipTimer);
            skipTimer = null;
            showDailyView("intro");
          });
          dailyCancelSkip?.addEventListener("click", () => {
            window.clearInterval(skipTimer);
            skipTimer = null;
            showDailyView("intro");
          });
          continueButton?.addEventListener("click", continueDailyDrill);
          dailyDone?.addEventListener("click", () => closeDailyChallenge(true));
          dailyPreviewButtons.forEach((button) => button.addEventListener("click", openDailyChallenge));

          if (previewDaily || window.localStorage.getItem(dailyStorageKey) !== todayKey) {
            window.setTimeout(openDailyChallenge, 280);
          }
        }

        document.querySelector("[data-notification-trigger]")?.addEventListener("click", () => {
          window.location.href = new URL("app/notifications.html", document.baseURI).href;
        });

        restartTimer();
      })();
