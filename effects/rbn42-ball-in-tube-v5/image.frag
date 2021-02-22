#version 130

#define leaf_opacity $leaf_opacity
#define center_opacity $center_opacity
#define avg $avg
#define radius $radius
#define strength3 $strength
#define pow_exp $pow_exp
#define speed $speed
#define center_x $center_x
#define center_y $center_y

#define maxlife $maxlife

vec4 fun1(float x,float y,bool lr) {
    if(x>=1)return vec4(0);
    if(y>0)
        y=acos(1-y)/acos(0.0);
    if(y<0)
        y=-y/speed;

    vec3 color=getRGB(x);

    y=y*maxlife; 
    if(x>0.5){
        x=x*iChannelResolution[1].x/avg; 
        x-=fract(0.5*iChannelResolution[1].x/avg);
    }else{
        x=x*iChannelResolution[1].x/avg;
    }
    
    vec4 c00= texelFetch(iChannel2, ivec2(floor(x),floor(y)  ),0);
    vec4 c01= texelFetch(iChannel2, ivec2(floor(x),ceil(y)  ),0);
    vec4 c10= texelFetch(iChannel2, ivec2(ceil(x),floor(y)  ),0);
    vec4 c11= texelFetch(iChannel2, ivec2(ceil(x),ceil(y)  ),0);
    float fx=fract(x);
    float fy=fract(y);
    fx=pow(fx,20);
    fy=pow(fy,20);
    vec4 fragColor=(fx*c10+(1-fx)*c00)*(1-fy)+fy*(fx*c11+(1-fx)*c01);

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
        arc=2*asin(1.0)-arc; // -1/2 pi ~ 3/2 pi
    float x1=fract(arc/4/asin(1.0)+0.25); 
    float x2=fract(arc/4/asin(1.0)-0.25);

    fragColor=fun1(x1,y,false)+fun1(x2,y,true);

    fragColor.a= max(max(fragColor.r,fragColor.g),fragColor.b);
    fragColor.a=fragColor.a>0.05?leaf_opacity:0;
    fragColor.a=y>0?center_opacity:fragColor.a;
}
