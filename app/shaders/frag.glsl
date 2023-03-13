precision highp float;
precision highp int;

uniform sampler2D uTexture;
varying vec2 vUv;
uniform vec2 uOffset;
uniform float uAlpha;

uniform vec2 uPlaneSizes;
uniform vec2 uImageSizes;

void main(){
     vec2 ratio = vec2(
        min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
        min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );
    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 color = texture2D(uTexture, uv);

    gl_FragColor = color;
    gl_FragColor.a *= uAlpha;
}
