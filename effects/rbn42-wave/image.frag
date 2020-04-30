#version 130

#define line_color $line_color

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    vec4 sample1=texelFetch(iChannel2,ivec2(fragCoord.x,0), 0);

    if(int(sample1.r*iResolution.y)-1==fragCoord.y)
        fragColor=line_color;
    else
        fragColor=vec4(0,0,0,0);
}
