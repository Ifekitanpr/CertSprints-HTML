(() => {
  const params = new URLSearchParams(window.location.search);
  const durationUplifts = { 30: 0, 60: 100, 90: 200 };
  const plans = {
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

  const currentPlan = () => params.get("plan") || "advanced";
  const currentDuration = () => params.get("duration") || "30";
  const currentUrl = (path) => {
    const url = new URL(path, document.baseURI);
    params.forEach((value, key) => url.searchParams.set(key, value));
    return url;
  };
  const planPrice = (id, duration) => {
    const plan = plans[id] || plans.advanced;
    if (!plan.basePrice) return 0;
    return plan.basePrice + (durationUplifts[duration] || 0);
  };

  const finishSetup = document.querySelector(".finish-setup");
  if (finishSetup) {
    const paid = currentPlan() !== "free";
    finishSetup.textContent = paid ? "Continue to Payment" : "Finish Setup";
    finishSetup.addEventListener("click", () => {
      if (!paid) {
        window.location.href = currentUrl("account/auth/index.html").href;
        return;
      }
      window.location.href = currentUrl("commerce/checkout.html").href;
    });
  }

  const checkoutView = document.querySelector(".checkout-view");
  if (checkoutView) {
    const planId = currentPlan();
    const duration = currentDuration();
    const plan = plans[planId] || plans.advanced;
    document.querySelector("[data-checkout-plan-name]").textContent = plan.name;
    document.querySelector("[data-checkout-duration]").textContent = duration;
    document.querySelector("[data-checkout-price]").textContent = `$${planPrice(planId, duration)}`;
    document.querySelector("[data-checkout-subtitle]").textContent = plan.subtitle;
    document.querySelector("[data-checkout-features]").innerHTML = plan.features.map((feature) => `<li>${feature}</li>`).join("");

    const overlay = document.querySelector(".change-plan-overlay");
    const grid = document.querySelector("[data-change-plan-grid]");
    const confirm = document.querySelector(".change-plan-confirm");
    const durationTabs = Array.from(document.querySelectorAll("[data-checkout-duration-option]"));
    let draftPlan = planId;
    let draftDuration = duration;

    const updateConfirmLabel = () => {
      const selected = plans[draftPlan] || plans.advanced;
      confirm.textContent = `Continue with ${selected.name}`;
    };

    const updateCheckoutSummary = () => {
      const selected = plans[draftPlan] || plans.advanced;
      document.querySelector("[data-checkout-plan-name]").textContent = selected.name;
      document.querySelector("[data-checkout-duration]").textContent = draftDuration;
      document.querySelector("[data-checkout-price]").textContent = `$${planPrice(draftPlan, draftDuration)}`;
      document.querySelector("[data-checkout-subtitle]").textContent = selected.subtitle;
      document.querySelector("[data-checkout-features]").innerHTML = selected.features
        .map((feature) => `<li>${feature}</li>`)
        .join("");
      updateConfirmLabel();
    };

    const renderGrid = () => {
      grid.innerHTML = Object.entries(plans)
        .map(([id, option]) => `
          <button class="change-plan-card${id === draftPlan ? " selected" : ""}" type="button" data-change-plan="${id}">
            <small>${option.name}</small>
            <strong>$${planPrice(id, draftDuration)}</strong>
            <p>${option.subtitle}</p>
            <ul>${option.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
          </button>
        `)
        .join("");
      grid.querySelectorAll("[data-change-plan]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          draftPlan = button.dataset.changePlan || "advanced";
          renderGrid();
          updateConfirmLabel();
        });
      });
    };

    const syncDurationTabs = () => {
      durationTabs.forEach((button) => {
        button.classList.toggle("active", button.dataset.checkoutDurationOption === String(draftDuration));
      });
    };

    renderGrid();
    syncDurationTabs();
    updateConfirmLabel();

    durationTabs.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (overlay.classList.contains("hidden")) return;
        draftDuration = button.dataset.checkoutDurationOption || "30";
        syncDurationTabs();
        renderGrid();
      });
    });

    document.querySelector(".checkout-change-plan").addEventListener("click", () => {
      draftPlan = currentPlan();
      draftDuration = currentDuration();
      renderGrid();
      syncDurationTabs();
      updateConfirmLabel();
      overlay.classList.remove("hidden");
      overlay.setAttribute("aria-hidden", "false");
    });
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
      }
    });
    document.querySelector(".change-plan-modal")?.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    confirm.addEventListener("click", () => {
      const url = currentUrl("commerce/checkout.html");
      url.searchParams.set("plan", draftPlan);
      url.searchParams.set("duration", draftDuration);
      window.location.href = url.href;
    });
    document.querySelector(".checkout-back")?.addEventListener("click", () => {
      window.location.href = currentUrl("account/auth/personal-details.html").href;
    });
    document.querySelector(".checkout-continue")?.addEventListener("click", () => {
      window.location.href = currentUrl("commerce/payment-success.html").href;
    });
  }

  const successPlan = document.querySelector("[data-success-plan]");
  if (successPlan) {
    successPlan.textContent = (plans[currentPlan()] || plans.advanced).name;
    document.querySelector(".payment-success-back")?.addEventListener("click", () => {
      window.location.href = currentUrl("commerce/checkout.html").href;
    });
    document.querySelector(".start-learning")?.addEventListener("click", () => {
      window.location.href = currentUrl("app/dashboard.html").href;
    });
  }
})();
