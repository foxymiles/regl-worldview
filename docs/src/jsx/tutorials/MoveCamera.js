//  Copyright (c) 118-present, GM Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

// #BEGIN EXAMPLE
import { useAnimationFrame } from "@cruise-automation/hooks";
import Worldview, { Spheres, Axes, GLTFScene } from "@foxglove/regl-worldview";
import React, { useState } from "react";

import duckModel from "~/common/fixtures/Duck.glb"; // Webpack magic: we actually import a URL pointing to a .glb file

// #BEGIN EDITABLE
function Example() {
  const steps = 500; // total amount of objects
  const cameraMoveSpeed = 1 / 50;
  // use count to derive camera phi and thetaOffset values
  const [count, setCount] = useState(0);
  useAnimationFrame(
    () => {
      // update count before each browser repaint
      const newCount = (count + 1) % steps;
      setCount(newCount);
    },
    false,
    []
  );

  // map a number/index to a specific color
  function numberToColor(number, max, a = 1) {
    const i = (number * 255) / max;
    const r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128) / 255;
    const g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128) / 255;
    const b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128) / 255;
    return { r, g, b, a };
  }

  // the object index needs to multiple by this scale so it's evenly distributed in the space
  const scale = (Math.PI * 2) / steps;
  const sphereMarker = {
    pose: {
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      position: { x: 0, y: 0, z: 0 },
    },
    scale: { x: 1, y: 1, z: 1 },
    colors: [],
    points: [],
  };

  new Array(steps)
    .fill()
    .map((_, idx) => [
      // generate x, y, z coordinates based on trefoil equation
      Math.sin(idx * scale) + 2 * Math.sin(2 * idx * scale),
      Math.cos(idx * scale) - 2 * Math.cos(2 * idx * scale),
      -Math.sin(3 * idx * scale),
    ])
    .forEach(([x, y, z], idx) => {
      // add individual point and color to the single sphere object
      sphereMarker.colors.push(numberToColor(idx, steps));
      sphereMarker.points.push({ x: x * 20, y: y * 20, z: z * 20 });
    });

  return (
    <Worldview
      cameraState={{
        phi: count * cameraMoveSpeed,
        thetaOffset: count * cameraMoveSpeed,
      }}>
      <Spheres>{[sphereMarker]}</Spheres>
      <Axes />
      {/* Download model: https://github.com/cruise-automation/webviz/blob/master/common/fixtures/Duck.glb  */}
      <GLTFScene model={duckModel}>
        {{
          pose: {
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0, w: 1 },
          },
          scale: { x: 3, y: 3, z: 3 },
        }}
      </GLTFScene>
    </Worldview>
  );
}
// #END EXAMPLE
export default Example;
