#version 130

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    fragColor=texture(iChannel3,fragCoord.xy/iResolution.xy); 
}
