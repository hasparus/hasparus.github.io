import * as THREE from 'three';
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Canvas } from 'react-three-fiber';
import { a, useSpring } from 'react-spring/three';

import './styles.css';

function vecs(vertices) {
  return vertices.map(v => new THREE.Vector3(...v));
}

function randomColor() {
  const colors = ['#ff0000', '#ffff00', '#0000ff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function Trigger({ size, onClick }) {
  const vertices = useMemo(
    () => vecs([[-1, 0, 0], [0, 1, 0], [1, 0, 0], [0, -1, 0], [-1, 0, 0]]),
    []
  );
  const [hovered, setHovered] = useState(false);
  const { rotation } = useSpring(
    {
      rotation: hovered ? Math.PI * 1.5 : 0,
      config: { mass: 10, tension: 300, friction: 50 },
    },
    [hovered]
  );
  const { color } = useSpring({ color: randomColor() }, [hovered]);

  const scale = [size / 2, size / 2, 1];

  return (
    <group position={[size, size, 0]}>
      <a.group scale={scale} rotation-x={rotation}>
        <line>
          <geometry
            attach="geometry"
            vertices={vertices}
            onUpdate={self => (self.verticesNeedUpdate = true)}
          />
          <lineBasicMaterial attach="material" color="black" />
        </line>
        <mesh>
          <octahedronGeometry attach="geometry" />
          <a.meshToonMaterial
            attach="material"
            color={color}
            opacity={0.5}
            transparent
          />
        </mesh>
      </a.group>
      <mesh
        scale={scale}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry attach="geometry" />
        <meshBasicMaterial
          attach="material"
          color="black"
          opacity={0}
          transparent
        />
      </mesh>
    </group>
  );
}

function Lines({ step, size }) {
  const [clicks, setClicks] = useState(0);
  const vertices = useMemo(() => {
    const points = [];
    for (let x = 0; x < size; x += step) {
      for (let y = 0; y < size; y += step) {
        const leftToRight = Math.random() >= 0.5;
        if (leftToRight) {
          points.push([x, y, 0], [x + step, y + step, 0]);
        } else {
          points.push([x + step, y, 0], [x, y + step, 0]);
        }
      }
    }
    return vecs(points);
    //eslint-disable-next-line react-hooks/exhaustive-deps (clicks)
  }, [step, size, clicks]);

  return (
    <>
      <lineSegments>
        <geometry
          attach="geometry"
          vertices={vertices}
          onUpdate={self => (self.verticesNeedUpdate = true)}
        />
        <lineBasicMaterial attach="material" color="black" />
      </lineSegments>
      <Trigger size={size / 2} onClick={() => setClicks(clicks + 1)} />
    </>
  );
}

function Main() {
  return (
    <>
      <Canvas
        invalidateFrameLoop /* remove for post processing */
        pixelRatio={window.devicePixelRatio}
        camera={{
          near: 0.1,
          far: 1000,
          position: [50, 50, 65],
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.5} position={[50, 50, 1000]} />
        <Lines step={5} size={100} />
      </Canvas>
      <span className="center-prompt">click me</span>
    </>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));
