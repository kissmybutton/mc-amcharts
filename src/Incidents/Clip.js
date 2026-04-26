import { BrowserClip } from "@donkeyclip/motorcortex";

/**
 * ChartClip — a BrowserClip that renders amCharts 5 charts.
 * TODO: implement onAfterRender, renderCustomEntity, hideEntity
 */
export default class ChartClip extends BrowserClip {
  onAfterRender() {
    // TODO: initialize amCharts root here
    this.contextLoaded();
  }
}
