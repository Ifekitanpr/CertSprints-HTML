(() => {
  const TAU = Math.PI * 2;
  const BAR_TRACK_H = 214;

  function strokeRing(svg, { cx, cy, r, stroke, width, dash, offset = 0, track }) {
    if (track) {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      t.setAttribute("cx", cx);
      t.setAttribute("cy", cy);
      t.setAttribute("r", r);
      t.setAttribute("fill", "none");
      t.setAttribute("stroke", track);
      t.setAttribute("stroke-width", width);
      svg.appendChild(t);
    }
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", r);
    c.setAttribute("fill", "none");
    c.setAttribute("stroke", stroke);
    c.setAttribute("stroke-width", width);
    c.setAttribute("stroke-linecap", "round");
    const circ = TAU * r;
    const len = (dash / 100) * circ;
    c.setAttribute("stroke-dasharray", `${len} ${circ - len}`);
    c.setAttribute("stroke-dashoffset", String(-offset * circ));
    c.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
    svg.appendChild(c);
  }

  function steppedPath(values, xScale, yScale) {
    let d = `M ${xScale(0).toFixed(1)} ${yScale(values[0]).toFixed(1)}`;
    for (let i = 1; i < values.length; i += 1) {
      d += ` H ${xScale(i).toFixed(1)} V ${yScale(values[i]).toFixed(1)}`;
    }
    return d;
  }

  window.ProgressCharts = {
    mountSingleRing(container, percent, { size = 75, stroke = 8, color = "#007bff" } = {}) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("aria-hidden", "true");
      const cx = size / 2;
      const r = (size - stroke) / 2;
      strokeRing(svg, { cx, cy: cx, r, stroke: "#f1f5f9", width: stroke, dash: 100, track: null });
      strokeRing(svg, { cx, cy: cx, r, stroke: color, width: stroke, dash: percent, track: "#f1f5f9" });
      container.innerHTML = "";
      container.appendChild(svg);
    },

    mountVelocityRing(container, segments) {
      const size = 82;
      const stroke = 10;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("aria-hidden", "true");
      const cx = size / 2;
      const r = (size - stroke) / 2;
      const total = segments.reduce((s, x) => s + x.weight, 0);
      let offset = 0;
      segments.forEach((seg) => {
        const dash = (seg.weight / total) * 100;
        strokeRing(svg, {
          cx,
          cy: cx,
          r,
          stroke: seg.color,
          width: stroke,
          dash,
          offset,
          track: offset === 0 ? "#f1f5f9" : null,
        });
        offset += dash / 100;
      });
      container.innerHTML = "";
      container.appendChild(svg);
    },

    mountStudyBars(container, days) {
      container.innerHTML = days
        .map((d) => {
          const fillH = Math.round((d.percent / 100) * BAR_TRACK_H);
          const top = d.missed
            ? `<span class="progress-bar-missed" aria-hidden="true"><img src="assets/progress/missed-day.svg" alt="" width="16" height="16" /></span>`
            : d.mins
              ? `<span class="progress-bar-mins">${d.mins}</span>`
              : `<span class="progress-bar-mins progress-bar-mins--empty" aria-hidden="true"></span>`;
          const fill =
            d.percent > 0
              ? `<div class="progress-bar-fill" style="height:${fillH}px"></div>`
              : "";
          const pctBottom = d.percent > 0 ? fillH + 4 : 38;
          return `<div class="progress-bar-col">
            ${top}
            <div class="progress-bar-track" style="--bar-track-h:${BAR_TRACK_H}px">
              ${fill}
              <span class="progress-bar-pct" style="bottom:${pctBottom}px">${d.percent}%</span>
            </div>
            <span class="progress-bar-day">${d.label.replace("\n", "<br>")}</span>
          </div>`;
        })
        .join("");
    },

    mountBurnDown(container, data) {
      const w = 339;
      const h = 316;
      const pad = { l: 40, r: 8, t: 8, b: 32 };
      const plotW = w - pad.l - pad.r;
      const plotH = h - pad.t - pad.b;
      const yScale = (v) => pad.t + plotH - (v / data.yMax) * plotH;
      const xScale = (i) => pad.l + (i / (data.actual.length - 1)) * plotW;

      const actualStepped = steppedPath(data.actual, xScale, yScale);
      const idealStepped = steppedPath(data.ideal, xScale, yScale);
      const splitAt = Math.max(0, data.actual.length - 4);
      let predictedPath = `M ${xScale(splitAt).toFixed(1)} ${yScale(data.actual[splitAt]).toFixed(1)}`;
      for (let i = splitAt + 1; i < data.predicted.length; i += 1) {
        predictedPath += ` H ${xScale(i).toFixed(1)} V ${yScale(data.predicted[i]).toFixed(1)}`;
      }

      const areaPath = `${actualStepped} V ${yScale(0).toFixed(1)} H ${xScale(0).toFixed(1)} Z`;

      const gridLines = data.yTicks
        .map(
          (tick) =>
            `<line x1="${pad.l}" y1="${yScale(tick)}" x2="${w - pad.r}" y2="${yScale(tick)}" class="progress-burndown-grid"/>`,
        )
        .join("");

      container.innerHTML = `<svg class="progress-burndown-svg" viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Burn down chart">
        <defs>
          <linearGradient id="burndownFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#007bff" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#007bff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${gridLines}
        ${data.yTicks
          .map(
            (tick) =>
              `<text x="${pad.l - 8}" y="${yScale(tick) + 4}" text-anchor="end" class="progress-chart-axis">${tick}</text>`,
          )
          .join("")}
        ${data.xLabels
          .map(
            (lbl, i) =>
              `<text x="${xScale(i)}" y="${h - 8}" text-anchor="middle" class="progress-chart-axis">${lbl}</text>`,
          )
          .join("")}
        <path class="progress-burndown-area" d="${areaPath}" fill="url(#burndownFill)" stroke="none"/>
        <path class="progress-burndown-ideal" d="${idealStepped}" fill="none" stroke-width="2" stroke-dasharray="6 4"/>
        <path class="progress-burndown-predicted" d="${predictedPath}" fill="none" stroke-width="2" stroke-dasharray="3 4"/>
        <path class="progress-burndown-actual" d="${actualStepped}" fill="none" stroke-width="2.5"/>
      </svg>
      <div class="progress-burndown-legend">
        <span><i class="actual"></i>Actual</span>
        <span><i class="ideal"></i>Ideal</span>
        <span><i class="predicted"></i>Predicted</span>
      </div>`;
    },
  };
})();
