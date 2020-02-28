#version 130

#define beatDecay 0.02

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(fragCoord.x<1 && fragCoord.y<1) {
        fragColor.a=1;
        if(iBeat>0)
            fragColor.r=1;
        else
            fragColor.r=texture(iChannel2, vec2(0,0)).r-beatDecay ;
    }
}
