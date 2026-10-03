"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uAspect;
  uniform vec2  uPointer;
  uniform float uPointerEnergy;
  uniform vec3  uColorDeep;
  uniform vec3  uColorGlow;
  uniform float uIntensity;

  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Four octaves only: more than that turns the flow into speckle at this scale.
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p);
      p *= 1.9;
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    // Aspect-corrected coordinates centred on the viewport.
    vec2 p = (vUv - 0.5) * uAspect;
    float t = uTime * 0.06;

    // Pointer swirl: the ether is dragged around the cursor and decays with distance.
    vec2 toPointer = p - uPointer;
    float dist = length(toPointer);
    float pull = uPointerEnergy * exp(-dist * 2.6);
    float angle = pull * 1.8;
    float cs = cos(angle);
    float sn = sin(angle);
    p = uPointer + mat2(cs, -sn, sn, cs) * toPointer;
    p -= normalize(toPointer + 1e-5) * pull * 0.18;

    // Domain-warped fbm: each layer displaces the next, which is what reads as liquid.
    // Frequencies stay low on purpose — broad slow currents, not grain.
    vec2 q = vec2(fbm(p * 0.55 + t), fbm(p * 0.55 + vec2(4.3, 1.7) - t));
    vec2 r = vec2(
      fbm(p * 0.7 + 1.3 * q + vec2(1.7, 9.2) + t * 1.3),
      fbm(p * 0.7 + 1.3 * q + vec2(8.3, 2.8) - t * 1.0)
    );
    float f = fbm(p * 0.6 + 1.6 * r);

    // Broad soft body of the flow.
    float ether = smoothstep(-0.6, 0.7, f);

    // Wide ridge running through the densest part of the current.
    float filament = 1.0 - abs(f * 1.1);
    filament = pow(clamp(filament, 0.0, 1.0), 3.0);

    vec3 color = mix(uColorDeep, uColorGlow, clamp(length(r) * 0.5 + filament * 0.8, 0.0, 1.0));

    // Cursor lifts the local brightness so the interaction is felt, not just seen.
    float wake = uPointerEnergy * exp(-dist * 2.2);
    color += uColorGlow * wake * 0.6;

    float alpha = (ether * 0.7 + filament * 0.35 + wake * 0.45) * uIntensity;

    // Radial falloff keeps the edges of the canvas from banding against the page.
    float vignette = smoothstep(1.35, 0.15, length((vUv - 0.5) * vec2(1.6, 1.2)));
    alpha *= vignette;

    gl_FragColor = vec4(color * alpha, alpha);
  }
`

// Brand-red ether, tuned separately per theme: light needs far less energy to stay
// behind readable text, dark can carry the full glow.
const THEMES = {
  dark: {
    deep: new THREE.Color(0.28, 0.02, 0.06),
    glow: new THREE.Color(0.95, 0.12, 0.18),
    intensity: 0.7,
  },
  light: {
    deep: new THREE.Color(0.9, 0.62, 0.63),
    glow: new THREE.Color(0.86, 0.18, 0.22),
    intensity: 0.16,
  },
}

export function LiquidEther({ className = "" }) {
  const containerRef = useRef(null)
  const renderFrameRef = useRef(null)
  const { resolvedTheme } = useTheme()
  const themeRef = useRef(resolvedTheme)
  themeRef.current = resolvedTheme

  // Repaint on theme change so the reduced-motion single frame is never stale.
  useEffect(() => {
    renderFrameRef.current?.()
  }, [resolvedTheme])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" })
    } catch {
      return // No WebGL: the section keeps its CSS background and loses nothing essential.
    }

    renderer.setClearColor(0x000000, 0)
    const maxDpr = window.innerWidth < 768 ? 1 : 1.5
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr))
    container.appendChild(renderer.domElement)
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const palette = THEMES[themeRef.current === "light" ? "light" : "dark"]
    const uniforms = {
      uTime: { value: 0 },
      uAspect: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerEnergy: { value: 0 },
      uColorDeep: { value: palette.deep.clone() },
      uColorGlow: { value: palette.glow.clone() },
      uIntensity: { value: palette.intensity },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    scene.add(mesh)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container
      if (!w || !h) return
      renderer.setSize(w, h, false)
      const aspect = w / h
      uniforms.uAspect.value.set(Math.max(aspect, 1) * 2.2, Math.max(1 / aspect, 1) * 2.2)
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    // Pointer state is smoothed so the ether trails the cursor instead of snapping to it.
    const target = new THREE.Vector2(0, 0)
    let targetEnergy = 0
    let lastMoveAt = 0

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * uniforms.uAspect.value.x
      const y = (0.5 - (event.clientY - rect.top) / rect.height) * uniforms.uAspect.value.y
      target.set(x, y)
      targetEnergy = 1
      lastMoveAt = performance.now()
    }

    const onPointerLeave = () => {
      targetEnergy = 0
    }

    if (!reducedMotion) {
      container.addEventListener("pointermove", onPointerMove, { passive: true })
      container.addEventListener("pointerleave", onPointerLeave, { passive: true })
    }

    let frame = 0
    let visible = true
    let lastFrameAt = performance.now()

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0 }
    )
    intersectionObserver.observe(container)

    const applyTheme = () => {
      const next = THEMES[themeRef.current === "light" ? "light" : "dark"]
      uniforms.uColorDeep.value.copy(next.deep)
      uniforms.uColorGlow.value.copy(next.glow)
      uniforms.uIntensity.value = next.intensity
    }

    const renderFrame = () => {
      applyTheme()
      renderer.render(scene, camera)
    }
    renderFrameRef.current = renderFrame

    if (reducedMotion) {
      // Still render one composed frame so the section is not visually empty.
      uniforms.uTime.value = 12
      renderFrame()
    } else {
      const animate = () => {
        frame = requestAnimationFrame(animate)
        const now = performance.now()
        const delta = (now - lastFrameAt) / 1000
        lastFrameAt = now
        if (!visible || document.hidden) return

        // Clamp so a backgrounded tab does not jump the flow on return.
        uniforms.uTime.value += Math.min(delta, 0.05)

        // Energy decays once the cursor rests, so the wake dissipates like a real fluid.
        if (performance.now() - lastMoveAt > 140) targetEnergy = 0
        uniforms.uPointerEnergy.value += (targetEnergy - uniforms.uPointerEnergy.value) * 0.045
        uniforms.uPointer.value.lerp(target, 0.06)

        renderFrame()
      }
      animate()
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      container.removeEventListener("pointermove", onPointerMove)
      container.removeEventListener("pointerleave", onPointerLeave)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} aria-hidden="true" className={className} />
}

export default LiquidEther
