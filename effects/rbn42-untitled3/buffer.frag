#version 130

#define laser_threshold $laser_threshold

#define N1 $N1
#define N2 $N2
#define N3 $N3

float rand(vec2 co) {
    return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(fragCoord.y<1){
        fragColor= texture(iChannel1, vec2(fragCoord.x/iResolution.x,0));
        vec4 old= texelFetch(iChannel2,ivec2(fragCoord.x,0) , 0);
        if(old.r+old.g>laser_threshold *2)
            fragColor.b=old.b;
        else{
            fragColor.b=fract(-iFrame*1.0/N1-fragCoord.x/N2);
        }
        if(fragColor.r+fragColor.g<laser_threshold*2){
            fragColor.rg*=N3;
        }
    }else{
        fragColor= texelFetch(iChannel2,ivec2(fragCoord.x,fragCoord.y-1) , 0);
    }
}
