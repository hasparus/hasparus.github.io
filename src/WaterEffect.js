import React, { useRef, useEffect } from 'react';
import { apply, useThree, useRender } from 'react-three-fiber';
import * as resources from './resources';

apply(resources);

export function WaterEffect() {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  useEffect(() => {
    composer.current.setSize(size.width, size.height);
  }, [size]);
  useRender(() => composer.current.render(), true);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <waterPass attachArray="passes" factor={0.4} />
      <shaderPass
        attachArray="passes"
        args={[resources.FXAAShader]}
        material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
        renderToScreen
      />
    </effectComposer>
  );
}
