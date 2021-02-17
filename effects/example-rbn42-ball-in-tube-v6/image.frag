#version 130

#define opacity $opacity

#define radius $radius
#define strength3 $strength
#define pow_exp $pow_exp
#define speed $speed
#define center_x $center_x
#define center_y $center_y

#define maxlife $maxlife

float fun2(float x,float _min,float _max,float n){
    _min=fract(_min/n);
    _max=fract(_max/n);
    x=fract(x/n);
    float x1=fract(x-_min);
    float x2=fract(_max-_min);
    return x1/x2;
}


vec4 fun1(float x,float y,bool lr){
    if(x>=1)return vec4(0);
    if(y>0)
        y=acos(1-y)/acos(0.0);
    if(y<0)
        y=-y/speed;
    vec3 color=getRGB(x);
    y=y*maxlife/iResolution.y;
    vec4 fragColor= texture(iChannel2, vec2( x, y  ));
    fragColor.r=pow(fragColor.r,pow_exp);
    fragColor.g=pow(fragColor.g,pow_exp);
    fragColor.rgb=color*(lr?fragColor.r:fragColor.g)*strength3;
    return fragColor;
 
}
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float circle_radius=min(iResolution.x,iResolution.y)/2;

    fragCoord=fragCoord-iResolution.xy*vec2(center_x,center_y);
    bool lr=fragCoord.x<0;

    float point_radius=length(fragCoord);
    float y=(1-point_radius/circle_radius/radius/2);

    float arc=asin(fragCoord.y/point_radius);  // -pi/2 ~ pi/2
    if(fragCoord.x<0)
        arc=2*asin(1.0)-arc;
    float x1=fun2(arc,asin(-1.0),asin(-1.0)-0.01,asin(1.0)*4);
    float x2=fun2(arc,asin(1.0),asin(1.0)-0.01,asin(1.0)*4);

    fragColor=fun1(x1,y,false)+fun1(x2,y,true);

    fragColor.a=opacity+ max(max(fragColor.r,fragColor.g),fragColor.b);
    fragColor.a=opacity;
    
}
