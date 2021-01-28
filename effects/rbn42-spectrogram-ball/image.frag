#version 130

#define opacity $opacity

#define color_left $color_left
#define color_right $color_right

#define opacity $opacity
#define radius $radius
#define strength3 $strength
#define pow_exp $pow_exp
#define speed $speed
#define center_x $center_x
#define center_y $center_y

#define maxlife $maxlife
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float circle_radius=min(iResolution.x,iResolution.y)/2;

    fragCoord=fragCoord-iResolution.xy*vec2(center_x,center_y);
    bool lr=fragCoord.x<0;

    float point_radius=length(fragCoord);
    float arc=asin(fragCoord.y/point_radius);

    float x=0.5-arc/asin(1.0)/2;
    float y=(1-point_radius/circle_radius/radius/2);

    float x2=(2-x)/2;
    x2=lr?x2:(1-x2);
    vec3 color=x2*color_left.rgb+(1-x2)*color_right.rgb;


    if(y>0)
        y=acos(1-y)/acos(0.0);
    if(y<0)
        y=-y/speed;

    y=y*maxlife/iResolution.y;

    fragColor= texture(iChannel2, vec2( x, y  ));
    fragColor.r=pow(fragColor.r,pow_exp);
    fragColor.g=pow(fragColor.g,pow_exp);

    fragColor.rgb=color*(lr?fragColor.r:fragColor.g)*strength3;
    fragColor.a=opacity+ max(fragColor.r,fragColor.g);
    
}
