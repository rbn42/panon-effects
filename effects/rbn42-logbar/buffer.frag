#version 130

#define decay $decay

#define N1 $N1

#define N2 $N2

#define N3 $N3

#define E 2.7182818284 


float fun1(float x){
    x=x*N3;
    return (pow(E,1+x*N1)/E-1)/ N1   ;
}

vec4 fun(float x){
    float _from=fun1(x); 
    if(_from>iChannelResolution[1].x)
        return vec4(0);
    float _to=fun1(x+1); 
    vec4 v=texelFetch(iChannel1, ivec2(_from ,0),0) * (1-fract(_from)) ;

    for(float i=ceil(_from);i<min(100+ceil(_from),floor(_to));i++)
        v+=texelFetch(iChannel1, ivec2(i,0),0) ;

    if(floor(_to)>floor(_from))
        v+=texelFetch(iChannel1,ivec2(_to,0),0)* fract(_to);
    else
        v-=texelFetch(iChannel1,ivec2(_to,0),0)*(1- fract(_to));

    return v; 
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(fragCoord.y<1){
        vec4 ch1=fun(fragCoord.x)*N2; 
        vec4 ch2=texelFetch(iChannel2,ivec2(fragCoord.x,0),0);
        fragColor=ch2*(1-decay)+ch1*decay;
        fragColor.a=1;
    }
}
