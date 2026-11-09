/*
 * Port of Kyant0/AndroidLiquidGlass (Apache License 2.0)
 * Upstream: https://github.com/Kyant0/AndroidLiquidGlass
 * Copyright 2025 Kyant
 *
 * Direct JavaScript / TypeScript & GLSL port for Vpple Notes
 */

export const KYANT_ROUNDED_RECT_SDF = `
float radiusAt(vec2 coord, vec4 radii) {
    if (coord.x >= 0.0) {
        if (coord.y <= 0.0) return radii.y;
        else return radii.z;
    } else {
        if (coord.y <= 0.0) return radii.x;
        else return radii.w;
    }
}

float sdRoundedRect(vec2 coord, vec2 halfSize, float radius) {
    vec2 cornerCoord = abs(coord) - (halfSize - vec2(radius));
    float outside = length(max(cornerCoord, 0.0)) - radius;
    float inside = min(max(cornerCoord.x, cornerCoord.y), 0.0);
    return outside + inside;
}

vec2 gradSdRoundedRect(vec2 coord, vec2 halfSize, float radius) {
    vec2 cornerCoord = abs(coord) - (halfSize - vec2(radius));
    if (cornerCoord.x >= 0.0 || cornerCoord.y >= 0.0) {
        return sign(coord) * normalize(max(cornerCoord, 0.0));
    } else {
        float gradX = step(cornerCoord.y, cornerCoord.x);
        return sign(coord) * vec2(gradX, 1.0 - gradX);
    }
}

float circleMap(float x) {
    return 1.0 - sqrt(max(0.0, 1.0 - x * x));
}
`;

export const KYANT_REFRACTION_SHADER = `
precision highp float;
uniform sampler2D uContent;
uniform vec2 uSize;
uniform vec2 uOffset;
uniform vec4 uCornerRadii;
uniform float uRefractionHeight;
uniform float uRefractionAmount;
uniform float uDepthEffect;
uniform float uAngle;
uniform float uFalloff;
uniform vec4 uHighlightColor;

${KYANT_ROUNDED_RECT_SDF}

void main() {
    vec2 coord = gl_FragCoord.xy;
    vec2 halfSize = uSize * 0.5;
    vec2 centeredCoord = (coord + uOffset) - halfSize;
    float radius = radiusAt(coord, uCornerRadii);
    
    float sd = sdRoundedRect(centeredCoord, halfSize, radius);
    if (-sd >= uRefractionHeight) {
        gl_FragColor = texture2D(uContent, coord / uSize);
        return;
    }
    sd = min(sd, 0.0);
    
    float d = circleMap(1.0 - -sd / uRefractionHeight) * uRefractionAmount;
    float gradRadius = min(radius * 1.5, min(halfSize.x, halfSize.y));
    vec2 grad = normalize(gradSdRoundedRect(centeredCoord, halfSize, gradRadius) + uDepthEffect * normalize(centeredCoord));
    
    vec2 refractedCoord = (coord + d * grad) / uSize;
    vec4 contentColor = texture2D(uContent, refractedCoord);
    
    // Directional specular highlight from Kyant0 DefaultHighlightShaderString
    vec2 normal = vec2(cos(uAngle), sin(uAngle));
    float dotProduct = dot(grad, normal);
    float highlightIntensity = pow(abs(dotProduct), uFalloff) * step(0.0, dotProduct);
    vec4 highlight = uHighlightColor * highlightIntensity;
    
    gl_FragColor = contentColor + highlight;
}
`;

// Pure mathematical helper to compute Kyant0 specular highlight for CSS styles
export function computeKyantHighlight(
  elementWidth: number,
  elementHeight: number,
  cursorX: number,
  cursorY: number,
  falloff: number = 2.0
): { angleRad: number; angleDeg: number; intensity: number; insetBoxShadow: string } {
  const halfW = elementWidth * 0.5;
  const halfH = elementHeight * 0.5;
  const dx = cursorX - halfW;
  const dy = cursorY - halfH;

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Normal vector facing light
  const nx = Math.cos(angleRad);
  const ny = Math.sin(angleRad);

  // Surface top rim normal is (0, -1)
  const dotTop = -(ny);
  const intensity = Math.pow(Math.max(0, dotTop), falloff);

  const shadowX = -nx * 1.5;
  const shadowY = -ny * 1.5;

  const insetBoxShadow = `inset ${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 0 rgba(255, 255, 255, ${(0.18 + intensity * 0.22).toFixed(2)})`;

  return { angleRad, angleDeg, intensity, insetBoxShadow };
}
