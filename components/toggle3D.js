import * as THREE from "three";

let phase = 0,
  ready = false,
  PROJECTS = [],
  IMAGES = [],
  cam,
  css,
  glRenderer,
  glScene,
  cards = [],
  tunnelGroups = [],
  edgeObjects = [],
  edgeByCard = [],
  portalEl,
  exitEl,
  rY = 0,
  rX = 0,
  tRY = 0,
  tRX = 0,
  camR = 1800,
  tCamR = 1800,
  blend = 0,
  tBlend = 0,
  splineT = 0,
  rollAngle = 0,
  portalTimer,
  cardTimers = [];

const SPHERE_R = 850,
  STAGGER_MS = 500,
  MAX_LINKS = 3,
  PANEL = 160,
  HALF = PANEL / 2,
  RING_GAP = 250,
  POOL = 20,
  FLY_SPEED = 310,
  clock = new THREE.Clock(),
  _sp = new THREE.Vector3(),
  _ah = new THREE.Vector3(),
  _tan = new THREE.Vector3(),
  _qR = new THREE.Quaternion(),
  $ = (id) => document.getElementById(id),
  SPLINE = new THREE.CatmullRomCurve3(
    Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return new THREE.Vector3(
        Math.sin(a * 2.3) * 210 + Math.sin(a * 5.7) * 75,
        Math.cos(a * 1.9) * 140 + Math.cos(a * 4.3) * 50,
        -i * ((POOL * RING_GAP) / 24),
      );
    }),
    true,
    "catmullrom",
    0.5,
  );

class CSS3DRenderer {
  constructor(el) {
    this.dom = el;
    this.objs = [];
  }
  add(el) {
    el.classList.add("c3d-node");
    this.dom.appendChild(el);
    this.objs.push(el);
  }
  render(cam) {
    const fs =
        this.dom.clientHeight /
        (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov * 0.5))),
      V = cam.matrixWorldInverse.elements;
    for (const el of this.objs) {
      if (!el._show) {
        el.style.display = "none";
        continue;
      }
      const { x, y, z } = el.pos,
        cx = x * V[0] + y * V[4] + z * V[8] + V[12],
        cy = x * V[1] + y * V[5] + z * V[9] + V[13],
        cz = x * V[2] + y * V[6] + z * V[10] + V[14];
      if (cz > -60) {
        el.style.display = "none";
        continue;
      }

      el.style.display = "";
      const s = fs / -cz;
      if (el._rot) {
        const R = el._rot.elements,
          m = (r, c) =>
            (V[r] * R[c] + V[r + 4] * R[c + 1] + V[r + 8] * R[c + 2]) * s;
        el.style.transform = `translate(-50%,-50%) matrix3d(${m(0, 0)},${-m(1, 0)},${m(2, 0)},0,${m(0, 4)},${-m(1, 4)},${m(2, 4)},0,${m(0, 8)},${-m(1, 8)},${m(2, 8)},0,${cx * s},${-cy * s},0,1)`;
      } else
        el.style.transform = `translate(-50%,-50%) translate3d(${cx * s}px,${-cy * s}px,0) scale(${s})`;
      el.style.zIndex = (100000 - cz * 10) | 0;
    }
  }
}

async function loadData() {
  const d = await fetch("../projects.json").then((r) => r.json());
  PROJECTS = d.projects || [];
  IMAGES = d.images || [];
}

function initStars() {
  const N = PROJECTS.length,
    edgeSet = new Set(),
    pos = PROJECTS.map((_, i) =>
      new THREE.Vector3().setFromSphericalCoords(
        SPHERE_R,
        Math.acos(-1 + (2 * i) / N),
        Math.sqrt(N) * Math.acos(-1 + (2 * i) / N),
      ),
    );
  edgeByCard = PROJECTS.map(() => []);

  pos.forEach((a, i) =>
    pos
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, MAX_LINKS)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([a, pos[j]]),
            new THREE.LineBasicMaterial({}),
          );
          line.visible = false;
          glScene.add(line);
          const ei = edgeObjects.push(line) - 1;
          edgeByCard[i].push(ei);
          edgeByCard[j].push(ei);
        }
      }),
  );

  cards = PROJECTS.map((p, i) => {
    const el = document.createElement("a");
    el.className = "c3d-card";
    el.href = p.url;
    el.innerHTML = `<div class="c3d-cat">${p.category}</div><div class="c3d-title">${p.title}</div>`;
    el.pos = pos[i];
    el._show = false;
    css.add(el);
    return el;
  });

  portalEl = document.createElement("div");
  portalEl.className = "portal-btn";
  portalEl.innerHTML = "click to pass through";
  portalEl.pos = new THREE.Vector3(0, 0, 0);
  portalEl._show = false;
  portalEl.addEventListener("click", () => {
    if (phase !== 1) return;
    phase = 2;
    tBlend = 1;
    cards.forEach((c) => (c._show = false));
    edgeObjects.forEach((l) => (l.visible = false));
    portalEl._show = false;
    portalEl.classList.remove("visible");
    exitEl.classList.add("visible");
    tunnelGroups.forEach((g) => g.panels.forEach((p) => (p._show = true)));
  });
  css.add(portalEl);
}

function initTunnel() {
  const W = [
      [HALF, 0, 0, -Math.PI / 2],
      [-HALF, 0, 0, Math.PI / 2],
      [0, HALF, Math.PI / 2, 0],
      [0, -HALF, -Math.PI / 2, 0],
    ],
    imgSeq = [];
  while (imgSeq.length < POOL * 4 && IMAGES.length)
    imgSeq.push(...[...IMAGES].sort(() => Math.random() - 0.5));

  for (let r = 0; r < POOL; r++) {
    const panels = W.map(([ox, oy, rx, ry], wi) => {
      const el = document.createElement("div"),
        src = imgSeq[r * 4 + wi]?.url;
      el.className = "c3d-tunnel-panel";
      el.style.background = `hsl(${(r * 37 + wi * 90) % 360},35%,12%)`; // Only Inline style left
      if (src) el.innerHTML = `<img src="${src}" loading="lazy">`;
      el.pos = new THREE.Vector3(ox, oy, 0);
      el._off = el.pos.clone();
      el._rot = new THREE.Matrix4()
        .makeRotationX(rx)
        .multiply(new THREE.Matrix4().makeRotationY(ry));
      el._show = false;
      css.add(el);
      return el;
    });
    tunnelGroups.push({ panels, ringZ: -r * RING_GAP });
  }
}

function init() {
  cam = new THREE.PerspectiveCamera(76, innerWidth / innerHeight, 1, 25000);
  css = new CSS3DRenderer($("css3d-layer"));
  glScene = new THREE.Scene();

  glRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  glRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  glRenderer.setSize(innerWidth, innerHeight);
  glRenderer.domElement.className = "c3d-canvas";
  $("threeD-scene").appendChild(glRenderer.domElement);

  exitEl = document.createElement("div");
  exitEl.className = "exit-label";
  exitEl.innerHTML = "click anywhere to exit";
  $("threeD-scene").appendChild(exitEl);

  initStars();
  initTunnel();

  let drag = false,
    lx = 0,
    ly = 0;
  $("threeD-scene").addEventListener("mousedown", (e) => {
    if (phase === 2) {
      phase = 1;
      tBlend = 0;
      tunnelGroups.forEach((g) => g.panels.forEach((p) => (p._show = false)));
      cards.forEach((c) => (c._show = true));
      edgeObjects.forEach((l) => (l.visible = true));
      portalEl._show = true;
      portalEl.classList.add("visible");
      exitEl.classList.remove("visible");
    } else if (phase === 1 && !e.target.closest("a, button, .portal-btn")) {
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
    }
  });

  window.addEventListener("mouseup", () => (drag = false));
  window.addEventListener("mousemove", (e) => {
    if (drag) {
      tRY += (e.clientX - lx) * 0.004;
      tRX += (e.clientY - ly) * 0.004;
      lx = e.clientX;
      ly = e.clientY;
    }
  });
  window.addEventListener("wheel", (e) => {
    if (phase === 1)
      tCamR = THREE.MathUtils.clamp(tCamR + e.deltaY * 0.5, 1000, 3000);
  });
  window.addEventListener("resize", () => {
    cam.aspect = innerWidth / innerHeight;
    cam.updateProjectionMatrix();
    glRenderer.setSize(innerWidth, innerHeight);
  });

  loop();
}

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05),
    tZ = POOL * RING_GAP;
  blend += (tBlend - blend) * 0.055;

  rY += (tRY - rY) * 0.05;
  rX += (tRX - rX) * 0.05;
  camR += (tCamR - camR) * 0.07;
  splineT = (splineT + (FLY_SPEED * dt) / tZ) % 1;

  SPLINE.getPoint(splineT, _sp);
  SPLINE.getPoint((splineT + 0.02) % 1, _ah);
  SPLINE.getTangent(splineT, _tan);
  rollAngle += (_tan.x * 0.4 - rollAngle) * 0.035;
  _qR.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rollAngle);

  const cZ = _sp.z;
  tunnelGroups.forEach((rg) => {
    if (rg.ringZ > cZ + RING_GAP * 2) rg.ringZ -= tZ;
    if (rg.ringZ < cZ - RING_GAP * (POOL - 1)) rg.ringZ += tZ;
    SPLINE.getPoint((((rg.ringZ / -tZ) % 1) + 1) % 1, _sp);
    rg.panels.forEach((p) =>
      p.pos.set(_sp.x + p._off.x, _sp.y + p._off.y, rg.ringZ),
    );
  });

  SPLINE.getPoint(splineT, _sp);
  cam.position
    .set(
      Math.sin(rY) * Math.cos(rX) * camR,
      Math.sin(rX) * camR,
      Math.cos(rY) * Math.cos(rX) * camR,
    )
    .lerp(_sp, blend);
  cam.lookAt(_tan.set(0, 0, 0).lerp(_ah, blend));

  if (blend > 0.05) cam.quaternion.multiply(_qR);
  cam.updateMatrixWorld();
  cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
  css.render(cam);
  glRenderer.render(glScene, cam);
}

window.toggle3D = async () => {
  const scene = $("threeD-scene"),
    isDark = document.body.classList.contains("dark-mode");
  if (!ready) {
    await loadData();
    init();
    ready = true;
  }

  if (scene.classList.contains("active")) {
    scene.classList.remove("active");
    $("projects-container").style.display = $("about").style.display = "";
    clearTimeout(portalTimer);
    cardTimers.forEach(clearTimeout);
    cardTimers = [];
  } else {
    scene.classList.add("active");
    $("projects-container").style.display = $("about").style.display = "none";

    phase = 1;
    blend = tBlend = 0;
    camR = 6000;
    tCamR = 1800;
    rY = Math.PI;
    tRY = 0;
    tunnelGroups.forEach((g) => g.panels.forEach((p) => (p._show = false)));

    edgeObjects.forEach((l) => {
      l.visible = false;
      l.material.color.setHex(isDark ? 0xf2f2f2 : 0x030405);
    });

    portalEl._show = true;
    portalEl.classList.remove("visible");
    exitEl.classList.remove("visible");

    cards.forEach((c, i) => {
      c._show = true;
      c.classList.remove("visible");
      cardTimers.push(
        setTimeout(() => {
          if (phase === 1) {
            c.classList.add("visible");
            edgeByCard[i].forEach((ei) => (edgeObjects[ei].visible = true));
          }
        }, i * STAGGER_MS),
      );
    });

    portalTimer = setTimeout(
      () => {
        if (phase === 1) portalEl.classList.add("visible");
      },
      PROJECTS.length * STAGGER_MS + 500,
    );
  }
};
