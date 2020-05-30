#version 130

#define color1 $color1
#define color2 $color2
#define color3 $color3
#define color4 $color4
#define color5 $color5
#define color6 $color6
#define color7 $color7
#define color8 $color8
#define color9 $color9

#define N1 $N1
#define N2 $dot_size
#define N3 $N3

vec4[] colors=vec4[](color1,color2,color3,color4,color5,color6,color7,color8,color9);

float fun1(vec4 _sample,vec2 fragCoord){
    vec2 p=vec2(_sample.g,_sample.b/_sample.r*2.0)*iResolution.xy;
    return 1/pow(length(fragCoord-p )*N3, N1)*_sample.r;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    for(int i=0;i<100;i++){
        vec4 c0=texelFetch(iChannel2,ivec2(i,0), 0);
        vec4 c1=texelFetch(iChannel2,ivec2(i,1), 0);
        if((c0.a+c1.a)==0)break;
        vec4 color_base=colors[i%9]*N2;
        fragColor+=color_base* fun1(c0,vec2(iResolution.x/2.0-fragCoord.x,fragCoord.y));
        fragColor+=color_base* fun1(c1,vec2(fragCoord.x-iResolution.x/2.0,fragCoord.y));
    }

    fragColor.a=1;
}
