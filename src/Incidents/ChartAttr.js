import { Effect } from "@donkeyclip/motorcortex";

/**
 * ChartAttr — MC Effect for animating amCharts properties.
 *
 * Animatable attrs:
 *   dataProgress: 0→1 — entrance animation (bars grow, pie fans in)
 *   highlightIndex: number — highlight a specific data point (set fill color)
 *   opacity: 0→1 — chart-level opacity
 *
 * For dataProgress:
 *   - XY charts (bar/column/line/area): interpolates data values from 0 → original
 *   - Pie/donut: interpolates endAngle from 0 → 360
 */
export default class ChartAttr extends Effect {
  getScratchValue() {
    const key = this.attributeKey;
    const entity = this.element?.entity;

    if (key === "dataProgress") {
      return 0;
    }
    if (key === "opacity") {
      return entity?.chart?.get("opacity") ?? 1;
    }
    if (key.startsWith("chartItemOpacity_")) {
      return 1; // items start fully visible
    }
    return 0;
  }

  onProgress(millisecond) {
    const fraction = this.getFraction(millisecond);
    const entity = this.element?.entity;
    if (!entity) return;

    // eslint-disable-next-line no-unused-vars
    const { chart, series, originalData, valueField, chartType } = entity;
    if (!chart || !series) return;

    const key = this.attributeKey;
    const target = this.targetValue;
    const initial = this.initialValue ?? 0;
    const current = initial + (target - initial) * fraction;

    if (key === "dataProgress") {
      if (chartType === "pie" || chartType === "donut") {
        // Fade in gradually while fan-in progresses
        chart.set("opacity", current);
        series.set("endAngle", -90 + 360 * current);
      } else if (chartType === "line" || chartType === "area") {
        // Line/area: fade in via opacity
        chart.set("opacity", current);
      } else {
        // Vertical column: grow height from bottom
        if (!this._columnState && series.columns) {
          this._columnState = [];
          series.columns.each((col) => {
            const h = col.height();
            const y = col.y();
            this._columnState.push({ col, fullHeight: h, baseY: y + h });
          });
          if (this._columnState.length === 0) {
            this._columnState = null;
          } else {
            for (const s of this._columnState) {
              s.col.set("height", 0);
              s.col.set("y", s.baseY);
            }
          }
        }
        // Fade chart in gradually (labels + bars together)
        chart.set("opacity", current);
        if (this._columnState) {
          for (const s of this._columnState) {
            const h = s.fullHeight * current;
            s.col.set("height", h);
            s.col.set("y", s.baseY - h);
          }
        }
      }
    } else if (key === "opacity") {
      chart.set("opacity", current);
    } else if (key.startsWith("chartItemOpacity_")) {
      // Animate opacity on a single chart item (bar/slice).
      // The index is encoded in the attribute key: chartItemOpacity_0, chartItemOpacity_1, etc.
      const idx = parseInt(key.split("_").pop(), 10);
      const columns = series.columns;
      const slices = series.slices;

      if (columns) {
        let count = 0;
        columns.each((col, i) => {
          if (i === idx) col.set("opacity", current);
          count++;
        });
        if (count === 0) return;
      } else if (slices) {
        let count = 0;
        slices.each((slice, i) => {
          if (i === idx) slice.set("opacity", current);
          count++;
        });
        if (count === 0) return;
      }
    }
  }
}
