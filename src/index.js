import ChartClip from "./Incidents/Clip";
import { name, version } from "../package.json";

export default {
  npm_name: name,
  version: version,
  incidents: [],
  Clip: {
    exportable: ChartClip,
  },
};
