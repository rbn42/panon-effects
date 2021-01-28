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
    /*
    if(pos2.z>0)return vec3(0,0,0);
    if(pos2.x<0)return vec3(0,0,0);
    return vec3(-pos2.z/3,0,0);
    */
    float depth=0.05-pos2.z/speed;
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
}

float arc(vec3 v1,vec3 v2){
    return acos(dot(v1,v2)/length(v2)/length(v1));
}
float spin_speed=1;

vec3 intersect_tube(vec3 p1,vec3 p2,bool neg){

    //ro,rd+ro的延长线，和x*x+y*y=C的交点，就是tube，要解开这个方程式
    vec3 rd=p1-p2;
    vec3 point_tube;
    //X*X+Y*Y=R*R
    float formula_a=rd.x*rd.x+rd.y*rd.y;
    float formula_b=2*(-p2.z*rd.x*rd.x+p2.x*rd.z*rd.x-p2.z*rd.y*rd.y+p2.y*rd.z*rd.y);
    float formula_c= -tube_radius*tube_radius*rd.z*rd.z;
    formula_c+=(-p2.z*rd.x+p2.x*rd.z)*(-p2.z*rd.x+p2.x*rd.z);
    formula_c+=(-p2.z*rd.y+p2.y*rd.z)*(-p2.z*rd.y+p2.y*rd.z);
    //if(formula_b*formula_b-4*formula_a*formula_c<0)
    //    return vec3(0,0,0);

    point_tube.z=(-formula_b+(neg?-1:1)*sqrt(formula_b*formula_b-4*formula_a*formula_c))/2/formula_a;
    point_tube.x=p2.x+(point_tube.z-p2.z)/rd.z*rd.x;
    point_tube.y=p2.y+(point_tube.z-p2.z)/rd.z*rd.y;
    return point_tube;

}

vec3 intersect_ball(vec3 p1,vec3 p2,bool neg){
    //ro,rd+ro的延长线，和x*x+y*y=C的交点，就是tube，要解开这个方程式
    vec3 rd=p1-p2;
    vec3 point_tube;
    //(X-bx)*(X-bx)+(Y-by)*(Y-by)+(Z-bz)*(Z-bz)=R*R
    float xa=rd.x;
    float xb=-p2.z*rd.x+p2.x*rd.z-ball_x*rd.z;
    float ya=rd.y;
    float yb=-p2.z*rd.y+p2.y*rd.z-ball_y*rd.z;
    float za=rd.z;
    float zb=-p2.z*rd.z+p2.z*rd.z-ball_z*rd.z;

    float formula_a=rd.x*rd.x+rd.y*rd.y+rd.z*rd.z;
    float formula_b=2*(xa*xb+ya*yb+za*zb);
    float formula_c=  -ball_radius*ball_radius*rd.z*rd.z;
    formula_c+=xb*xb+yb*yb+zb*zb;
    //if(formula_b*formula_b-4*formula_a*formula_c<0)
    //    return vec3(0,0,0);

    point_tube.z=(-formula_b+(neg?-1:1)*sqrt(formula_b*formula_b-4*formula_a*formula_c))/2/formula_a;
    point_tube.x=p2.x+(point_tube.z-p2.z)/rd.z*rd.x;
    point_tube.y=p2.y+(point_tube.z-p2.z)/rd.z*rd.y;
    return point_tube;

}




void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    vec3 ball_center=vec3(ball_x,ball_y,ball_z);

    vec2 uv=fragCoord / min(iResolution.x,iResolution.y) -0.5;
    
    //ray origin, camera,相对uv屏幕中心0,0
    vec3 ro=vec3(sin(iTime*spin_speed)/8,cos(iTime*spin_speed)/20,camera_z);
    //ro=vec3(0,0,camera_z);
    //rd=vec3(uv,screen)-ro,透过uv到camera的射线
    vec3 lookat = vec3(0,0,0);
    
    float zoom = 1.;
    
    vec3 f = normalize(lookat-ro);
    vec3 r = cross(vec3(0., 1., 0.), f);
    vec3 u = cross(f, r);
    
    vec3 c = ro + f*zoom;
    vec3 i = c + uv.x*r + uv.y*u;
    vec3 rd = i-ro;
    
    float ball_radius_arc=asin( ball_radius / length(ro-ball_center));
    bool in_ball=arc(rd,ball_center-ro)<ball_radius_arc;
    if (in_ball){
        fragColor.r=1;
        fragColor.a=1;
        vec3 point_ball1=intersect_ball(ro,rd+ro,false);
        vec3 point_ball2=intersect_ball(ro,rd+ro,true);
        vec3 point_ball;
        if(dot(ro-point_ball1,ball_center-point_ball1)<0){
            point_ball=point_ball1;
        }else{
            point_ball=point_ball2;
        }
        vec3 refl=reflect(ro-point_ball,normalize(ball_center-point_ball));
        vec3 point_tube1=intersect_tube( point_ball,point_ball+refl,true); //,point_ball);
        vec3 point_tube2=intersect_tube( point_ball,point_ball+refl,false); //,point_ball);

        vec3 point_tube;
        if( dot(ro-point_ball,ball_center-point_ball)*dot(point_tube1-point_ball,ball_center-point_ball)>0){
            point_tube=point_tube1;
        }else{
            point_tube=point_tube2;
        }
        //point_tube=intersect_tube( ball_center,point_ball,false);
        fragColor.rgb=tube(point_tube);
        //fragColor.rgb=(ball_center-point_ball)/ball_radius;
        //fragColor.rg=(point_tube.xy)/ball_radius;
    }else{
        vec3 point_tube=intersect_tube(ro,rd+ro,true);
        fragColor.rgb=tube(point_tube);
        fragColor.a=1;
    }
}
