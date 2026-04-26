import { BrowserClip } from "@donkeyclip/motorcortex";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";

/**
 * ChartClip — a BrowserClip that renders an amCharts 5 chart.
 *
 * One chart per clip instance. The chart type and data are defined in attrs.
 * addCustomEntity is NOT supported — the chart IS the clip.
 *
 * Attrs:
 *   type: "bar" | "column" | "line" | "area" | "pie" | "donut"
 *   data: [{ label: string, value: number, ... }, ...]
 *   categoryField: string (default "label")
 *   valueField: string (default "value")
 *   title: string (optional)
 *   colors: string[] (optional — palette override)
 */
export default class ChartClip extends BrowserClip {
  get html() {
    return '<div style="width:100%;height:100%;position:relative;"><div id="chartroot" style="width:100%;height:100%;"></div></div>';
  }

  onAfterRender() {
    const attrs = this.attrs;
    const chartType = attrs.type || "bar";
    const data = attrs.data || [];
    const categoryField = attrs.categoryField || "label";
    const valueField = attrs.valueField || "value";

    // Create amCharts root inside the clip's DOM
    const container = this.context.rootElement.querySelector("#chartroot");
    if (!container) {
      console.error("[ChartClip] #chartroot not found in rootElement");
      this.contextLoaded();
      return;
    }
    const root = am5.Root.new(container);

    // Store references
    this._chartRoot = root;
    this._chartType = chartType;
    this._originalData = data;
    this._categoryField = categoryField;
    this._valueField = valueField;

    // Build the chart based on type
    if (chartType === "pie" || chartType === "donut") {
      this._buildPieChart(root, attrs);
    } else {
      this._buildXYChart(root, attrs);
    }

    // Register a single custom entity so Effects can target !#chart
    this.context.setCustomEntity(
      "chart",
      {
        root: this._chartRoot,
        chart: this._chart,
        series: this._series,
        xAxis: this._xAxis,
        yAxis: this._yAxis,
        chartType: this._chartType,
        originalData: this._originalData,
        categoryField: this._categoryField,
        valueField: this._valueField,
      },
      ["chart"],
    );

    this.contextLoaded();
  }

  _buildXYChart(root, attrs) {
    const categoryField = attrs.categoryField || "label";
    const valueField = attrs.valueField || "value";
    const data = attrs.data || [];
    const chartType = attrs.type || "bar";

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 10,
      }),
    );

    // Category axis (X for bar/column, Y for horizontal bar)
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField,
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      }),
    );
    xAxis.data.setAll(data);

    // Value axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        min: 0,
        interpolationDuration: 0,
      }),
    );

    // Series
    let series;
    if (chartType === "line" || chartType === "area") {
      series = chart.series.push(
        am5xy.LineSeries.new(root, {
          xAxis,
          yAxis,
          valueYField: valueField,
          categoryXField: categoryField,
          interpolationDuration: 0,
        }),
      );
      if (chartType === "area") {
        series.fills.template.setAll({ visible: true, fillOpacity: 0.3 });
      }
      series.strokes.template.setAll({ strokeWidth: 2 });
    } else {
      // bar / column — disable amCharts interpolation so MC drives values directly
      series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          xAxis,
          yAxis,
          valueYField: valueField,
          categoryXField: categoryField,
          interpolationDuration: 0,
        }),
      );
      series.columns.template.setAll({
        cornerRadiusTL: 4,
        cornerRadiusTR: 4,
        strokeOpacity: 0,
        tooltipText: "{categoryX}: {valueY}",
      });
    }

    // Apply colors if provided
    if (attrs.colors) {
      series.set(
        "colors",
        am5.ColorSet.new(root, {
          colors: attrs.colors.map((c) => am5.color(c)),
        }),
      );
    }

    // Set full data — dataProgress effect will scale columns from 0→1
    series.data.setAll(data);

    // Start with chart hidden — the dataProgress Effect reveals it
    chart.set("opacity", 0);

    // Title
    if (attrs.title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: attrs.title,
          fontSize: 18,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 10,
        }),
      );
    }

    this._chart = chart;
    this._series = series;
    this._xAxis = xAxis;
    this._yAxis = yAxis;
  }

  _buildPieChart(root, attrs) {
    const categoryField = attrs.categoryField || "label";
    const valueField = attrs.valueField || "value";
    const data = attrs.data || [];
    const chartType = attrs.type;

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: chartType === "donut" ? am5.percent(40) : 0,
      }),
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField,
        categoryField,
        endAngle: 0, // start collapsed — entrance effect animates to 360
      }),
    );

    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
      tooltipText: "{category}: {value}",
    });

    // Apply colors if provided
    if (attrs.colors) {
      series.set(
        "colors",
        am5.ColorSet.new(root, {
          colors: attrs.colors.map((c) => am5.color(c)),
        }),
      );
    }

    series.data.setAll(data);

    // Title
    if (attrs.title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: attrs.title,
          fontSize: 18,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 10,
        }),
      );
    }

    this._chart = chart;
    this._series = series;
    this._xAxis = null;
    this._yAxis = null;
  }
}
