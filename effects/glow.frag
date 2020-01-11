#version 130
/*
 * Designed for dark background
 */

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    fragCoord=fragCoord/iResolution.xy;
    vec4 sample1=texture(iChannel1, vec2(fragCoord.x,0)) ;
    float h=fragCoord.y;

    fragColor.a=.5*(h>.5?sample1.r/(h-.5):sample1.g/(.5-h));

    fragColor.rgb=getRGB(fragCoord.x)*fragColor.a;
}
