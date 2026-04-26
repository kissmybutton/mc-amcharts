import { HTMLClip, CSSEffect, loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import chartsDef from "../src/index.js";

const McCharts = loadPlugin(chartsDef);

// ─── Master clip with two scenes ────────────────────────────────────────────
const master = new HTMLClip({
  html: `<div style="position:relative;width:100%;height:100%;">
    <div id="scene1" style="position:absolute;inset:0;width:100%;height:100%;"></div>
    <div id="scene2" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;"></div>
  </div>`,
  host: document.getElementById("clip"),
  containerParams: { width: "800px", height: "500px" },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — Bar chart with entrance + highlight
// ═══════════════════════════════════════════════════════════════════════════════

const barChart = new McCharts.Clip(
  {
    type: "bar",
    title: "Test Scores by Subject",
    data: [
      { label: "Math", value: 85 },
      { label: "Science", value: 72 },
      { label: "English", value: 91 },
      { label: "History", value: 65 },
      { label: "Art", value: 88 },
    ],
    colors: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
  },
  {
    selector: "#scene1",
    containerParams: { width: "800px", height: "500px" },
  },
);

// Add incidents to the chart clip BEFORE adding it as CAsI to the master.
// After addIncident(barChart, 0), barChart becomes the descriptive wrapper
// and no longer has access to the chart's internal context.
barChart.addIncident(
  new McCharts.ChartAttr(
    { animatedAttrs: { dataProgress: 1 } },
    { selector: "!#chart", duration: 2000 },
  ),
  500,
);

barChart.addIncident(
  new McCharts.ChartAttr(
    {
      animatedAttrs: { highlightIndex: 2 },
      highlightColor: "#e76f51",
    },
    { selector: "!#chart", duration: 2000 },
  ),
  3000,
);

master.addIncident(barChart, 0);

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITION at 6s
// ═══════════════════════════════════════════════════════════════════════════════

master.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 0 } },
    { selector: "#scene1", duration: 500 },
  ),
  6000,
);
master.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 1 } },
    { selector: "#scene2", duration: 500 },
  ),
  6000,
);

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — Pie chart with entrance
// ═══════════════════════════════════════════════════════════════════════════════

const pieChart = new McCharts.Clip(
  {
    type: "pie",
    title: "Market Share",
    data: [
      { label: "Product A", value: 40 },
      { label: "Product B", value: 25 },
      { label: "Product C", value: 20 },
      { label: "Product D", value: 15 },
    ],
    colors: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261"],
  },
  {
    selector: "#scene2",
    containerParams: { width: "800px", height: "500px" },
  },
);

// Add incidents before adding as CAsI
pieChart.addIncident(
  new McCharts.ChartAttr(
    { animatedAttrs: { dataProgress: 1 } },
    { selector: "!#chart", duration: 2000 },
  ),
  500,
);

pieChart.addIncident(
  new McCharts.ChartAttr(
    {
      animatedAttrs: { highlightIndex: 0 },
      highlightColor: "#e76f51",
    },
    { selector: "!#chart", duration: 2000 },
  ),
  3000,
);

master.addIncident(pieChart, 6600);

// ─── Player ─────────────────────────────────────────────────────────────────
new Player({ clip: master });
