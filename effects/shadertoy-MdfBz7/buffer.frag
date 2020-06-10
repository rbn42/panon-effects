#version 130

#define speed $speed

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    if(fragCoord.y>0)return;

    float x=fragCoord.x/iResolution.x;

    if (1-x >= speed) {
        x=x+speed;
        fragColor=texelFetch(iChannel2,ivec2(x*iResolution.x,0), 0);
    } else {
        x= (1- (1-x)/speed);
        fragColor= texture(iChannel0, vec2(x,0)) ;
    }

}
