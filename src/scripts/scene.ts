import * as THREE from 'three';

export function mountHumanScene(host: HTMLElement): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 720px)').matches;

  let renderer: THREE.WebGLRenderer;

  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobile,
      powerPreference: 'low-power',
    });
  } catch {
    throw new Error('WebGL is unavailable.');
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.setAttribute('aria-hidden', 'true');

  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0.05, 7.9);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xc2c8af, 1.1));

  const key = new THREE.DirectionalLight(0xe7ead5, 4.5);
  key.position.set(-3, 5, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xc0d78f, 5);
  rim.position.set(3, 2, -3);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xa3b0bc, 2);
  fill.position.set(2, -1, 4);
  scene.add(fill);

  const figure = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.add(figure);
  scene.add(pivot);

  const metal = new THREE.MeshStandardMaterial({
    color: 0x8d9381,
    metalness: 0.65,
    roughness: 0.34,
  });

  const dark = new THREE.MeshStandardMaterial({
    color: 0x292d26,
    metalness: 0.5,
    roughness: 0.45,
  });

  const accent = new THREE.MeshStandardMaterial({
    color: 0xc9d49a,
    metalness: 0.4,
    roughness: 0.3,
    emissive: 0x515d2b,
    emissiveIntensity: 0.18,
  });

  const segments = mobile ? 20 : 32;

  function ellipsoid(
    position: [number, number, number],
    scale: [number, number, number],
    material: THREE.Material = metal,
    parent: THREE.Object3D = figure,
  ) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, segments, segments),
      material,
    );
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }

  function limb(
    start: [number, number, number],
    end: [number, number, number],
    radius: number,
    material: THREE.Material = metal,
  ) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = b.clone().sub(a);
    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        radius,
        Math.max(0.01, direction.length() - radius * 2),
        8,
        segments,
      ),
      material,
    );

    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    figure.add(mesh);
    return mesh;
  }

  // Head, face, neck, torso, and pelvis.
  ellipsoid([0, 1.3, 0], [0.29, 0.37, 0.27]);
  ellipsoid([0, 1.2, 0.21], [0.21, 0.22, 0.09]);
  ellipsoid([0, 1.3, 0.295], [0.045, 0.07, 0.055]);
  ellipsoid([-0.285, 1.3, 0], [0.045, 0.09, 0.055]);
  ellipsoid([0.285, 1.3, 0], [0.045, 0.09, 0.055]);

  limb([0, 0.82, 0], [0, 1.02, 0], 0.13, dark);
  ellipsoid([0, 0.52, 0], [0.52, 0.47, 0.27]);
  ellipsoid([0, 0.09, 0], [0.35, 0.29, 0.23], dark);
  ellipsoid([0, -0.24, 0], [0.38, 0.28, 0.25]);

  // A narrow chest detail acts as the sculpture's signature.
  const chestMark = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.018, 0.025),
    accent,
  );
  chestMark.position.set(-0.2, 0.64, 0.258);
  figure.add(chestMark);

  // Left arm.
  ellipsoid([-0.5, 0.73, 0], [0.2, 0.21, 0.2]);
  limb([-0.53, 0.65, 0], [-0.68, 0.12, 0.06], 0.14);
  ellipsoid([-0.68, 0.1, 0.06], [0.135, 0.135, 0.135], dark);
  limb([-0.68, 0.08, 0.06], [-0.59, -0.37, 0.25], 0.115);
  ellipsoid([-0.58, -0.47, 0.28], [0.1, 0.17, 0.08]);

  // Right arm rests in a slightly more open pose.
  ellipsoid([0.5, 0.73, 0], [0.2, 0.21, 0.2]);
  limb([0.53, 0.65, 0], [0.72, 0.15, -0.03], 0.14);
  ellipsoid([0.72, 0.13, -0.03], [0.135, 0.135, 0.135], dark);
  limb([0.72, 0.1, -0.03], [0.8, -0.32, 0.09], 0.115);
  ellipsoid([0.81, -0.43, 0.11], [0.1, 0.17, 0.08]);

  // Legs use an asymmetric stance rather than a rigid T-pose.
  limb([-0.2, -0.4, 0], [-0.25, -0.99, 0.03], 0.19);
  ellipsoid([-0.25, -1.02, 0.03], [0.16, 0.15, 0.16], dark);
  limb([-0.25, -1.09, 0.03], [-0.29, -1.62, 0.07], 0.13);
  ellipsoid([-0.29, -1.72, 0.17], [0.16, 0.105, 0.3], dark);

  limb([0.2, -0.4, 0], [0.3, -0.97, -0.1], 0.19);
  ellipsoid([0.3, -1.0, -0.1], [0.16, 0.15, 0.16], dark);
  limb([0.3, -1.08, -0.1], [0.43, -1.61, -0.04], 0.13);
  ellipsoid([0.44, -1.72, 0.07], [0.16, 0.105, 0.3], dark);

  // Static plinth and technical orbit.
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.94, 1.04, 0.12, 64),
    dark,
  );
  plinth.position.y = -1.89;
  scene.add(plinth);

  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(1.53, 0.007, 6, 100),
    accent,
  );
  orbit.rotation.x = Math.PI / 2;
  orbit.position.y = -1.81;
  scene.add(orbit);

  figure.rotation.z = -0.025;

  let targetRotation = -0.32;
  let velocity = 0;
  let activePointer: number | null = null;
  let lastX = 0;
  let inView = true;
  let frame = 0;
  let disposed = false;
  let lastTime = 0;

  pivot.rotation.y = targetRotation;

  const events = new AbortController();
  const options = { signal: events.signal };

  function draw() {
    renderer.render(scene, camera);
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 0.7 ? 9.1 : 7.9;
    camera.updateProjectionMatrix();
    draw();
  }

  function loop(time: number) {
    frame = 0;
    if (disposed || !inView || document.hidden || reduced.matches) return;

    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = time;

    if (activePointer === null) {
      targetRotation += velocity * delta * 60;
      velocity *= Math.pow(0.93, delta * 60);
    }

    pivot.rotation.y +=
      (targetRotation - pivot.rotation.y) * (1 - Math.exp(-9 * delta));

    figure.position.y = Math.sin(time * 0.0008) * 0.028;
    orbit.rotation.z = Math.sin(time * 0.0002) * 0.12;

    draw();
    frame = requestAnimationFrame(loop);
  }

  function syncLoop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;

    if (reduced.matches) {
      figure.position.y = 0;
      pivot.rotation.y = targetRotation;
      draw();
    } else if (inView && !document.hidden && !disposed) {
      frame = requestAnimationFrame(loop);
    }
  }

  function updateRotation(amount: number) {
    targetRotation += amount;
    if (reduced.matches) {
      pivot.rotation.y = targetRotation;
      draw();
    }
  }

  host.addEventListener(
    'pointerdown',
    (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      activePointer = event.pointerId;
      lastX = event.clientX;
      velocity = 0;
      host.setPointerCapture(event.pointerId);
      host.classList.add('dragging');
    },
    options,
  );

  host.addEventListener(
    'pointermove',
    (event) => {
      if (activePointer !== event.pointerId) return;
      const delta = event.clientX - lastX;
      velocity = THREE.MathUtils.clamp(delta * 0.008, -0.12, 0.12);
      updateRotation(delta * 0.008);
      lastX = event.clientX;
    },
    options,
  );

  function endDrag(event: PointerEvent) {
    if (activePointer !== event.pointerId) return;
    if (host.hasPointerCapture(event.pointerId)) {
      host.releasePointerCapture(event.pointerId);
    }
    activePointer = null;
    host.classList.remove('dragging');
  }

  host.addEventListener('pointerup', endDrag, options);
  host.addEventListener('pointercancel', endDrag, options);
  host.addEventListener('lostpointercapture', endDrag, options);

  document
    .querySelectorAll<HTMLButtonElement>('[data-rotate]')
    .forEach((button) => {
      button.addEventListener(
        'click',
        () => {
          velocity = 0;
          updateRotation((Number(button.dataset.rotate) * Math.PI) / 6);
        },
        options,
      );
    });

  document.getElementById('reset-scene')?.addEventListener(
    'click',
    () => {
      velocity = 0;
      targetRotation = -0.32;
      if (reduced.matches) {
        pivot.rotation.y = targetRotation;
        draw();
      }
    },
    options,
  );

  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(host);

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false;
    syncLoop();
  });
  visibilityObserver.observe(host);

  document.addEventListener('visibilitychange', syncLoop, options);
  reduced.addEventListener('change', syncLoop, options);

  resize();
  host.classList.add('ready');
  syncLoop();

  return () => {
    disposed = true;
    events.abort();
    cancelAnimationFrame(frame);
    sizeObserver.disconnect();
    visibilityObserver.disconnect();

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      const list = Array.isArray(object.material)
        ? object.material
        : [object.material];
      list.forEach((material) => materials.add(material));
    });

    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    renderer.domElement.remove();
    host.classList.remove('ready');
  };
}
