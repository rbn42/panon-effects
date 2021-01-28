#version 130

#define opacity $opacity

#define color_left $color_left
#define color_right $color_right

#define opacity $opacity
#define strength3 $strength
#define pow_exp $pow_exp
#define speed $speed
#define ball_x $ball_x
#define ball_y $ball_y
#define ball_z $ball_z
#define camera_z $camera_z

#define maxlife $maxlife

#define ball_radius $ball_radius
#define tube_radius $tube_radius
//设定视角到球心距离是1

//屏幕大小，影响tube的能见范围，和实际的球大小，以及球心和管心

/*
映射到tube的位置
x 是arc， y是depth ， 
y=0的位置是当前音频， 和球不是一个位置，而是从视角出发，切过球面触及tube的位置
因为视角到球心是1，所以视角到y=0是tube_radius/ball_radius
*/

/*
 * 旋转球和管，还是旋转视角原点
 * 如果旋转视角，那么球放在0,0,0
 * 不然，视角放在0,0,0
 *
 */

vec3 tube(vec3 pos2){
    float depth=0.702-pos2.z/3;
    //if (depth<0)return vec3(0,0,0);
    //if (depth>1)return vec3(0,0,0);
    vec2 pos=pos2.xy/tube_radius;
    float x=0.5-asin(pos.y)/asin(1.0)/2; // 0~1
    bool lr=pos.x<0;
    float x2=(2-x)/2;
    x2=lr?x:(1-x2);
    vec3 color=x2*color_left.rgb+(1-x2)*color_right.rgb;

    vec4 s= texture(iChannel2, vec2( x,depth  ));
    s.r=pow(s.r,pow_exp);
    s.g=pow(s.g,pow_exp);
    s.rgb=color*(lr?s.r:s.g)*strength3;
    return s.rgb;

    /*


    if(y>0){
        y=acos(1-y)/acos(0.0);

    }
    if(y<0)
        y=-y/speed;


    y=y


    s.a=opacity+ max(fragColor.r,fragColor.g);
    */

}

float arc(vec3 v1,vec3 v2){
    return acos(dot(v1,v2)/length(v2)/length(v1));
}
float spin_speed=1;

vec3 intersect_tube(vec3 p1,vec3 p2){
    //ro,rd+ro的延长线，和x*x+y*y=C的交点，就是tube，要解开这个方程式
    // x-ro / rd = y-ro/rd=z-ro/rd
    // x-ro=y-ro /rd.y*rd.x
    // x*rd.y=ro.x*rd.y+(y-ro.y)*rd.x
    // x*rd.z=z*rd.x+ ro.x*rd.z-ro.z*rd.x
    // (ro.x+(y-ro.y)/rd.y*rd.x)^2 + y^2=R^2
    // (rd.x/rd.y*y-ro.y/rd.y*rd.x+ro.x)^2+y^2=R^2
    // (y-ro.y+ro.x*/rd.x*rd.y)^2+y^2=R^2
    // (p-p2)/(p1-p2)=C
    vec3 rd=p1-p2;
    vec3 point_tube;
    //float formula_a=2;
    //float formula_b=2*(-ro.y+ro.x/rd.x*rd.y);
    //float formula_c=(-ro.y+ro.x/rd.x*rd.y)*(-ro.y+ro.x/rd.x*rd.y)-tube_radius*tube_radius/rd.x/rd.x*rd.y*rd.y;
    //point_tube.x=ro.x+(point_tube.y-ro.y)/rd.y*rd.x;
    //point_tube.z=ro.z+(point_tube.y-ro.y)/rd.y*rd.z;

    //p.x-p2.x / rd.x = p.z-p2.z/rd.z
    //p.x*rd.z -p2.x*rd.z=p.x*rd.x-p2.z*rd.x
    //x*x+y*y=C
    //(p.z*rd.x-p2.z*rd.x+p2.x*rd.z) + () = C*rd.z*rd.z
    float formula_a=rd.x*rd.x+rd.y*rd.y;
    float formula_b=2*(-p2.z*rd.x*rd.x+p2.x*rd.z*rd.x-p2.z*rd.y*rd.y+p2.y*rd.z*rd.y);
    float formula_c= -tube_radius*tube_radius*rd.z*rd.z;
    formula_c+=(-p2.z*rd.x+p2.x*rd.z)*(-p2.z*rd.x+p2.x*rd.z);
    formula_c+=(-p2.z*rd.y+p2.y*rd.z)*(-p2.z*rd.y+p2.y*rd.z);

    point_tube.z=(-formula_b+sqrt(formula_b*formula_b-4*formula_a*formula_c))/2/formula_a;
    point_tube.x=p2.x+(point_tube.z-p2.z)/rd.z*rd.x;
    point_tube.y=p2.x+(point_tube.z-p2.z)/rd.z*rd.y;
    return point_tube;

}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    vec3 ball_pos=vec3(ball_x,ball_y,ball_z);

    vec2 uv=fragCoord / min(iResolution.x,iResolution.y) -0.5;
    
    //ray origin, camera,相对uv屏幕中心0,0
    vec3 ro=vec3(sin(iTime*spin_speed)/8,cos(iTime*spin_speed)/8,camera_z);
    ro=vec3(0,0,camera_z);
    //rd=vec3(uv,screen)-ro,透过uv到camera的射线
    vec3 lookat = vec3(0,0,0);
    
    float zoom = 1.;
    
    vec3 f = normalize(lookat-ro);
    vec3 r = cross(vec3(0., 1., 0.), f);
    vec3 u = cross(f, r);
    
    vec3 c = ro + f*zoom;
    vec3 i = c + uv.x*r + uv.y*u;
    vec3 rd = i-ro;
    
    float ball_radius_arc=asin( ball_radius / length(ro-ball_pos));
    bool in_ball=arc(rd,ball_pos-ro)<ball_radius_arc;
    if (in_ball){
        fragColor.r=1;
        fragColor.a=1;
        return;
    }
    vec3 point_tube=intersect_tube(ro,rd+ro);
    fragColor.rgb=tube(point_tube);
    fragColor.a=1;
   
    return;

    float circle_radius=min(iResolution.x,iResolution.y)/2;

    fragCoord=fragCoord-iResolution.xy; //*vec2(center_x,center_y);

    float point_radius=length(fragCoord);
}
