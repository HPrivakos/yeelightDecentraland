import * as WebSocket from "ws";
import * as Yeelight from "yeelight2";

let light: Yeelight.Light;

interface IBulbState {
  power: "on" | "off";
  bright: number;
  rgb: number[];
}

const bulbState: IBulbState = {
  power: "on",
  bright: 100,
  rgb: [255, 255, 255],
};
getLight().then(async (yeelight) => {
  const data = await yeelight.get_prop("power", "rgb", "bright");
  const { power, rgb, bright } = data;
  console.log(rgb);
  const rgbArray = hexToRgb("#" + (+rgb).toString(16));

  bulbState.power = power;
  if (rgbArray) bulbState.rgb = rgbArray;
  bulbState.bright = bright;
});
const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", function connection(ws) {
  ws.send(JSON.stringify(bulbState));
  ws.on("message", function incoming(message) {
    try {
      const msg = JSON.parse(message.toString());
      changeState(msg);
    } catch (error) {}
  });
});

async function changeState(state: IBulbState) {
  const yeelight = await getLight();

  yeelight.set_power(state.power);
  yeelight.set_rgb(rgbToHex(state.rgb), "smooth", 500);
  yeelight.set_bright(state.bright);

  bulbState.power = state.power;
  bulbState.rgb = state.rgb;
  bulbState.bright = state.bright;
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(bulbState));
    }
  });
}

async function getLight(): Promise<Yeelight.Light> {
  return new Promise((res, rej) => {
    if (light) res(light);
    else {
      Yeelight.discover(function (ylight) {
        light = ylight;
        res(ylight);
      });
    }
  });
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(colors: number[]) {
  const hex = `${componentToHex(colors[0])}${componentToHex(
    colors[1]
  )}${componentToHex(colors[2])}`;
  return parseInt(hex, 16);
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result)
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
}
