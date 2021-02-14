#version 130

#define opacity $opacity

#define color_left $color_left
#define color_right $color_right

#define radius $radius
#define strength3 $strength
#define pow_exp $pow_exp
#define speed $speed
#define center_x $center_x
#define center_y $center_y

#define maxlife $maxlife

vec3 fun1(vec2 pos){
    float speed2=40;
    vec4 c= texture(iChannel2,vec2(1,1/speed2)* pos/iResolution.xy);
    c.r=pow(c.r,pow_exp);
    c.g=pow(c.g,pow_exp);
    return c.rgb*strength3;
}

vec3 fun2(vec2 pos){
    vec4 c= texture(iChannel2,pos/iResolution.xy);
    return c.rgb*0.3;
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec3 c=fun1(fragCoord)+fun2(fragCoord);

    /*
    y=y*maxlife/iResolution.y;

    fragColor= texture(iChannel2, vec2( x, y  ));
    */

    fragColor.rgb=c; //color*(lr?fragColor.r:fragColor.g)*strength3;
    fragColor.a=opacity+ max(max(fragColor.r,fragColor.g),fragColor.b);
    fragColor.a=opacity;
    
}
