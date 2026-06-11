import * as THREE from 'three';

export function initWebGLBackground() {
  const canvas = document.querySelector('#webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  // Create a cinematic luxury fluid shader
  const geometry = new THREE.PlaneGeometry(2, 2, 128, 128);

  // We mix Navy (#0A1128) and Gold (#CA8A04) using a fluid noise shader
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollOffset: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScrollOffset;
      
      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vUv = uv;
        
        vec3 pos = position;
        
        // Add smooth wave effect based on time and scroll
        float noiseFreq = 2.0;
        float noiseAmp = 0.15;
        vec2 noisePos = vec2(pos.x * noiseFreq + uTime * 0.1, pos.y * noiseFreq + uScrollOffset * 0.001);
        pos.z += snoise(noisePos) * noiseAmp;
        
        gl_Position = vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      varying vec2 vUv;

      void main() {
        // Deep Navy Background
        vec3 colorBg = vec3(0.039, 0.067, 0.157); // #0A1128
        // Luxury Gold Highlights
        vec3 colorGold = vec3(0.792, 0.541, 0.016); // #CA8A04
        
        // Fluid gradients
        float distToMouse = distance(vUv, uMouse * 0.5 + 0.5);
        
        // Subtle moving highlight
        float highlight = sin(vUv.x * 5.0 + uTime * 0.5) * cos(vUv.y * 5.0 + uTime * 0.3) * 0.5 + 0.5;
        
        vec3 finalColor = mix(colorBg, colorBg * 1.5, highlight);
        
        // Add gold glow near mouse/interactions
        float mouseGlow = smoothstep(0.4, 0.0, distToMouse);
        finalColor = mix(finalColor, colorGold, mouseGlow * 0.15);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Use a simple OrthographicCamera since we render a full-screen shader
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Mouse interaction
  const mouse = new THREE.Vector2();
  let targetMouse = new THREE.Vector2();

  window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    // Smoothly interpolate mouse position for fluid feel
    mouse.lerp(targetMouse, 0.05);
    material.uniforms.uMouse.value = mouse;

    renderer.render(scene, camera);
  }

  animate();

  return {
    material // Return material so we can update scroll offset from main.js
  };
}
