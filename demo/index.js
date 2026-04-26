import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import MyPluginDefinition from "../dist/bundle.esm.js";
const MyPlugin = loadPlugin(MyPluginDefinition);

const clip = new HTMLClip({
  html: `<div class="container">
        <div id="effect"></div>
        <div id="htmlclip"></div>
        <div id="combo"></div>
        <div id="myclip"></div>
    </div>`,
  css: `
        .container{
            width: 600px,
            height: 400px
        }
        .container>div{
            width: 50%;
            height: 50%;
        }
    `,
  host: document.getElementById("clip"),
  containerParams: {
    width: "600px",
    height: "400px",
  },
});

const newEffect = new MyPlugin.MyEffect(
  {
    animatedAttrs: {
      attr: "finalvalue",
    },
  },
  {
    selector: "#effect",
    duration: 1000,
  },
);

const newCombo = new MyPlugin.MyCombo(
  {
    // here goes your attrs
  },
  {
    selector: "#combo",
  },
);

const newHTMLClip = new MyPlugin.MyHTMLClip(
  {
    // here goes your attrs
  },
  {
    selector: "#htmlclip",
  },
);

const newCustomClip = new MyPlugin.Clip({
  selector: "#myclip",
});

clip.addIncident(newEffect, 0);
clip.addIncident(newCombo, 0);
clip.addIncident(newHTMLClip, 0);
clip.addIncident(newCustomClip, 0);

new Player({ clip });
