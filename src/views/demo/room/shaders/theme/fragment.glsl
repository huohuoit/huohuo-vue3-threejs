uniform sampler2D uDayTexture1;
uniform sampler2D uNightTexture1;
uniform sampler2D uDayTexture2;
uniform sampler2D uNightTexture2;
uniform sampler2D uDayTexture3;
uniform sampler2D uNightTexture3;
uniform sampler2D uDayTexture4;
uniform sampler2D uNightTexture4;
uniform float uMixRatio;
uniform int uTextureSet;

varying vec2 vUv;

void main() {
    vec3 dayColor;
    vec3 nightColor;
    
    if(uTextureSet == 1) {
        dayColor = texture2D(uDayTexture1, vUv).rgb;
        nightColor = texture2D(uNightTexture1, vUv).rgb;
    } else if(uTextureSet == 2) {
        dayColor = texture2D(uDayTexture2, vUv).rgb;
        nightColor = texture2D(uNightTexture2, vUv).rgb;
    } else if(uTextureSet == 3) {
        dayColor = texture2D(uDayTexture3, vUv).rgb;
        nightColor = texture2D(uNightTexture3, vUv).rgb;
    } else {
        dayColor = texture2D(uDayTexture4, vUv).rgb;
        nightColor = texture2D(uNightTexture4, vUv).rgb;
    }
    
    vec3 finalColor = mix(dayColor, nightColor, uMixRatio);
    finalColor = pow(finalColor, vec3(1.0/2.2));
    gl_FragColor = vec4(finalColor, 1.0);
}