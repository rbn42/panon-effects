#version 130

#define avg $avg

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(fragCoord.y<1) {
        float x=fragCoord.x/iResolution.x;
        int n=avg;
        fragColor=vec4(0);
        for(int i=0; i<n; i++)
            fragColor=max(fragColor, texelFetch(iChannel1,ivec2(i+n*fragCoord.x,0), 0));
            //fragColor+= texelFetch(iChannel1,ivec2(i+n*fragCoord.x,0), 0)/n;
        fragColor.a=1;
        return;
    }

    fragColor= texelFetch(iChannel2,ivec2(fragCoord.x,fragCoord.y-1), 0);
    fragColor.a=1;
}
