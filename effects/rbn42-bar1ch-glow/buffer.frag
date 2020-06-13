#version 130

#define pixel_fill $bar_width
#define pixel_empty $gap_width

vec4 mean(float _from,float _to) {

    if(_from>1.0)
        return vec4(0);

    _from=iChannelResolution[1].x*_from;
    _to=iChannelResolution[1].x*_to;

    vec4 v=texelFetch(iChannel1, ivec2(_from,0),0) * (1.0-fract(_from)) ;

    for(float i=ceil(_from); i<floor(_to); i++)
        v+=texelFetch(iChannel1, ivec2(i,0),0) ;

    if(floor(_to)>floor(_from))
        v+=texelFetch(iChannel1,ivec2(_to,0),0)* fract(_to);
    else
        v-=texelFetch(iChannel1,ivec2(_to,0),0)*(1.0- fract(_to));

    return v/(_to-_from);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    if(fragCoord.y<1.0) {
        float unit_size=pixel_empty+pixel_fill;
        fragColor=mean(fragCoord.x*unit_size/iResolution.x,
                       (1.0+fragCoord.x)*unit_size/iResolution.x);
        fragColor.a=1.0;
    }
}
