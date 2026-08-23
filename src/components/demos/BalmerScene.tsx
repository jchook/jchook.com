import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Bohr-model hydrogen atom. The electron sits on shell n, drops to n=2,
 * and the emitted photon is drawn in the color of the corresponding
 * Balmer line — the same lines as the wallpaper (and the site footer).
 */

const GRUV = {
  bg: "#1d1d1d",
  fg: "#ebdbb2",
  faint: "#4e4e4e",
  proton: "#d75f5f",
  electron: "#ffaf00",
};

// n=3..6 → H-alpha, H-beta, H-gamma, H-delta (gruvbox-ified)
const BALMER: Record<number, { color: string; name: string; nm: number }> = {
  3: { color: "#d75f5f", name: "H-α", nm: 656 },
  4: { color: "#85ad85", name: "H-β", nm: 486 },
  5: { color: "#83adad", name: "H-γ", nm: 434 },
  6: { color: "#d485ad", name: "H-δ", nm: 410 },
};

const radius = (n: number) => 0.55 * n;

function Orbits() {
  const rings = useMemo(
    () =>
      [2, 3, 4, 5, 6].map((n) => {
        const pts = [];
        for (let i = 0; i <= 96; i++) {
          const t = (i / 96) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(t) * radius(n), Math.sin(t) * radius(n), 0));
        }
        return { n, geo: new THREE.BufferGeometry().setFromPoints(pts) };
      }),
    [],
  );
  return (
    <>
      {rings.map(({ n, geo }) => (
        <line key={n}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial color={n === 2 ? GRUV.fg : GRUV.faint} transparent opacity={n === 2 ? 0.5 : 0.6} />
        </line>
      ))}
    </>
  );
}

function Atom({ onJump }: { onJump: (n: number) => void }) {
  const electron = useRef<THREE.Mesh>(null);
  const photon = useRef<THREE.Mesh>(null);
  const state = useRef({
    shell: 3, // shell we're orbiting on / about to drop from
    phase: "orbit" as "orbit" | "drop" | "rise",
    r: radius(3),
    theta: 0,
    t: 0,
    photonT: -1,
    photonColor: new THREE.Color(BALMER[3]!.color),
    photonDir: new THREE.Vector3(1, 0, 0),
  });

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    // Kepler-ish: inner shells orbit faster.
    s.theta += dt * (2.2 / Math.sqrt(s.r));

    if (s.phase === "orbit") {
      s.t += dt;
      if (s.t > 2.4) {
        s.t = 0;
        s.phase = "drop";
      }
    } else if (s.phase === "drop") {
      s.r = Math.max(radius(2), s.r - dt * 2.2);
      if (s.r <= radius(2)) {
        // Photon away! Colored by the shell we fell from.
        s.photonT = 0;
        s.photonColor.set(BALMER[s.shell]!.color);
        s.photonDir.set(Math.cos(s.theta), Math.sin(s.theta), 0);
        onJump(s.shell);
        // Next cycle climbs (absorption) to the next shell in the series.
        s.shell = s.shell >= 6 ? 3 : s.shell + 1;
        s.phase = "rise";
        s.t = 0;
      }
    } else {
      s.t += dt;
      if (s.t > 1.6) {
        s.r = Math.min(radius(s.shell), s.r + dt * 1.6);
        if (s.r >= radius(s.shell)) {
          s.phase = "orbit";
          s.t = 0;
        }
      }
    }

    electron.current?.position.set(Math.cos(s.theta) * s.r, Math.sin(s.theta) * s.r, 0);

    if (photon.current) {
      if (s.photonT >= 0) {
        s.photonT += dt;
        const d = radius(2) + s.photonT * 6;
        photon.current.visible = d < 7;
        photon.current.position.copy(s.photonDir).multiplyScalar(d);
        (photon.current.material as THREE.MeshBasicMaterial).color = s.photonColor;
        (photon.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - s.photonT / 1.1);
      } else {
        photon.current.visible = false;
      }
    }
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color={GRUV.proton} />
      </mesh>
      <mesh ref={electron}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={GRUV.electron} />
      </mesh>
      <mesh ref={photon} visible={false}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial transparent />
      </mesh>
      <Orbits />
    </>
  );
}

export default function BalmerScene() {
  const [n, setN] = useState(3);
  const line = BALMER[n]!;
  return (
    <figure className="demo-frame">
      <div style={{ height: "20rem" }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, -2.2, 5.2], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => gl.setClearColor(GRUV.bg)}
        >
          <Atom onJump={setN} />
        </Canvas>
      </div>
      <figcaption className="demo-caption">
        e⁻ falling n={n}→2 · emits <span style={{ color: line.color }}>{line.name}</span> at{" "}
        {line.nm} nm — one of the wallpaper's lines
      </figcaption>
    </figure>
  );
}
