# @kissmybutton/mc-amcharts

amCharts 5 plugin for MotorCortex -- timeline-controlled animated charts.

## Installation

```bash
npm install @kissmybutton/mc-amcharts
```

Peer dependency: `@donkeyclip/motorcortex >= 9.24.0`

## Supported chart types

| Type    | Description                              |
| ------- | ---------------------------------------- |
| `bar`   | Vertical bar (column) chart              |
| `line`  | Line chart with data-point bullets       |
| `area`  | Area chart (filled line) with bullets    |
| `pie`   | Pie chart with fan-in entrance animation |
| `donut` | Donut chart (pie with inner radius)      |

## Quick start

```js
import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import chartsDef from "@kissmybutton/mc-amcharts";

const McCharts = loadPlugin(chartsDef);

const master = new HTMLClip({
  html: '<div id="scene" style="width:100%;height:100%;"></div>',
  host: document.getElementById("clip"),
  containerParams: { width: "800px", height: "500px" },
});

const chart = new McCharts.Clip(
  {
    type: "bar",
    title: "Test Scores",
    data: [
      { label: "Math", value: 85 },
      { label: "Science", value: 72 },
      { label: "English", value: 91 },
    ],
  },
  {
    selector: "#scene",
    containerParams: { width: "800px", height: "500px" },
  },
);

// Entrance animation -- bars grow from 0 to full height
chart.addIncident(
  new McCharts.ChartAttr(
    { animatedAttrs: { dataProgress: 1 } },
    { selector: "!#chart", duration: 2000 },
  ),
  500,
);

master.addIncident(chart, 0);
new Player({ clip: master });
```

## Clip attrs

| Attr            | Type     | Default   | Description                           |
| --------------- | -------- | --------- | ------------------------------------- |
| `type`          | string   | `"bar"`   | Chart type (see table above)          |
| `data`          | array    | `[]`      | Array of `{ label, value }` objects   |
| `title`         | string   | --        | Optional chart title                  |
| `colors`        | string[] | --        | Optional color palette (hex strings)  |
| `categoryField` | string   | `"label"` | Key in data objects for category axis |
| `valueField`    | string   | `"value"` | Key in data objects for value axis    |

## ChartAttr (Effect)

Animatable attributes via `animatedAttrs`:

| Attribute            | Range | Description                                        |
| -------------------- | ----- | -------------------------------------------------- |
| `dataProgress`       | 0--1  | Entrance animation (bars grow, pie fans in)        |
| `opacity`            | 0--1  | Chart-level opacity                                |
| `chartItemOpacity_N` | 0--1  | Opacity of data item at index N (for highlighting) |
| `chartItemScale_N`   | 0--2  | Scale of data item at index N (for pulse effects)  |

### Highlighting a specific bar/slice

```js
// Blink the 3rd bar (index 2) by animating its opacity
chart.addIncident(
  new McCharts.ChartAttr(
    { animatedAttrs: { chartItemOpacity_2: 0.3 } },
    { selector: "!#chart", duration: 300 },
  ),
  3000,
);
chart.addIncident(
  new McCharts.ChartAttr(
    { animatedAttrs: { chartItemOpacity_2: 1 } },
    { selector: "!#chart", duration: 300 },
  ),
  3300,
);
```

## How it works

- `ChartClip` extends `BrowserClip` and renders an amCharts 5 chart inside its DOM.
- The chart starts with `opacity: 0` -- the `dataProgress` Effect reveals it gradually.
- For bar charts, `dataProgress` grows column heights from zero. For pie/donut, it animates `endAngle` from 0 to 360.
- Per-item attributes (`chartItemOpacity_N`, `chartItemScale_N`) target individual bars, slices, or line bullets by index.
- The chart registers a single custom entity `!#chart` so Effects can target it.

## License

MIT
