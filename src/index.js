import ChartClip from "./Incidents/Clip.js";
import ChartAttr from "./Incidents/ChartAttr.js";
import pkg from "../package.json" with { type: "json" };
const { name, version } = pkg;

export default {
  npm_name: name,
  version: version,
  incidents: [
    {
      exportable: ChartAttr,
      name: "ChartAttr",
    },
  ],
  Clip: {
    exportable: ChartClip,
  },
};
