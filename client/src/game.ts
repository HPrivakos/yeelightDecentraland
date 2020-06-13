const socket = new WebSocket("ws://localhost:3000");

socket.onmessage = function (event) {
  try {
    const parsed = JSON.parse(event.data);
    log(parsed);
    bulbState = parsed;
    const color = new Color3(
      (parsed.rgb[0] / 255) * (parsed.bright / 100),
      (parsed.rgb[1] / 255) * (parsed.bright / 100),
      (parsed.rgb[2] / 255) * (parsed.bright / 100)
    );
    log(color)
    material.albedoColor = color
    if (parsed.power == "off") material.albedoColor = Color3.Black();
  } catch (error) {
    log(error);
  }
};

function spawnCube(x: number, y: number, z: number, scale?: number) {
  const cube = new Entity();
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }));
  if (scale)
    cube.getComponent(Transform).scale = new Vector3(scale, scale, scale);
  cube.addComponent(new BoxShape());
  engine.addEntity(cube);
  return cube;
}

const cube = spawnCube(8, 1, 8);
const material = new Material();
cube.addComponent(material);

let bulbState = {
  power: "on",
  bright: 100,
  rgb: [255, 255, 255],
};

cube.addComponent(
  new OnClick(() => {
    bulbState.power == "on"
      ? (bulbState.power = "off")
      : (bulbState.power = "on");
    socket.send(JSON.stringify(bulbState));
  })
);

const cubeRed = spawnCube(3, 1, 8, 0.5);
cubeRed.addComponent(
  new OnClick(() => {
    bulbState.rgb = [255, 1, 1];
    socket.send(JSON.stringify(bulbState));
  })
);
cubeRed.addComponent(new Material());
cubeRed.getComponent(Material).albedoColor = Color3.Red();
const cubeBlue = spawnCube(4, 1, 8, 0.5);
cubeBlue.addComponent(
  new OnClick(() => {
    bulbState.rgb = [1, 1, 255];
    socket.send(JSON.stringify(bulbState));
  })
);
cubeBlue.addComponent(new Material());
cubeBlue.getComponent(Material).albedoColor = Color3.Blue();
const cubeGreen = spawnCube(5, 1, 8, 0.5);
cubeGreen.addComponent(
  new OnClick(() => {
    bulbState.rgb = [1,255,1];
    socket.send(JSON.stringify(bulbState));
  })
);
cubeGreen.addComponent(new Material());
cubeGreen.getComponent(Material).albedoColor = Color3.Green();
const cubeWhite = spawnCube(6, 1, 8, 0.5);
cubeWhite.addComponent(
  new OnClick(() => {
    bulbState.rgb = [255,255,255];
    socket.send(JSON.stringify(bulbState));
  })
);
cubeWhite.addComponent(new Material());
cubeWhite.getComponent(Material).albedoColor = Color3.White();
