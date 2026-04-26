import { Effect } from "@donkeyclip/motorcortex";
import * as am5 from "@amcharts/amcharts5";

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
    if (key === "highlightIndex") {
      return -1; // no highlight initially
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
        series.set("endAngle", -90 + 360 * current);
      } else {
        // XY charts: directly set column heights from 0 → full
        // Capture full-size state on first call
        if (!this._columnState && series.columns) {
          this._columnState = [];
          series.columns.each((col) => {
            const h = col.height();
            const y = col.y();
            this._columnState.push({ col, fullHeight: h, baseY: y + h });
          });
          if (this._columnState.length === 0) {
            this._columnState = null; // retry next frame
          } else {
            // Make chart visible now that we control column heights
            chart.set("opacity", 1);
            // Immediately collapse columns to 0
            for (const s of this._columnState) {
              s.col.set("height", 0);
              s.col.set("y", s.baseY);
            }
          }
        }
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
    } else if (key === "highlightIndex") {
      const idx = Math.round(target);
      const highlightColor = this.attrs.highlightColor || "#e76f51";
      const columns = series.columns;
      const slices = series.slices;

      // Capture original colors on first call
      if (!this._originalColors) {
        this._originalColors = [];
        const items = columns || slices;
        if (items) {
          items.each((item, i) => {
            this._originalColors.push(
              item.get("fill") || series.get("colors")?.getIndex(i),
            );
          });
        }
        if (this._originalColors.length === 0) {
          this._originalColors = null; // retry next frame
        }
      }

      if (columns) {
        columns.each((col, i) => {
          const origColor = this._originalColors[i];
          if (fraction < 0.01) {
            // Fully reversed — restore everything
            if (origColor) col.set("fill", origColor);
            col.set("opacity", 1);
          } else if (i === idx) {
            col.set("fill", am5.color(highlightColor));
            col.set("opacity", 1);
          } else {
            if (origColor) col.set("fill", origColor);
            col.set("opacity", 1 - 0.7 * fraction);
          }
        });
      } else if (slices) {
        slices.each((slice, i) => {
          const origColor = this._originalColors[i];
          if (fraction < 0.01) {
            if (origColor) slice.set("fill", origColor);
            slice.set("opacity", 1);
            slice.set("scale", 1);
          } else if (i === idx) {
            slice.set("fill", am5.color(highlightColor));
            slice.set("scale", 1 + 0.1 * fraction);
          } else {
            if (origColor) slice.set("fill", origColor);
            slice.set("opacity", 1 - 0.7 * fraction);
          }
        });
      }
    }
  }
}
