#version 130

#define pixel_fill $bar_width
#define pixel_empty $gap_width


#define color1 $color1
#define color2 $color2

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    int pixel_x= int( fragCoord.x);
    int pixel_y= int( fragCoord.y);

    float h=fragCoord.y/iResolution.y;

    fragColor=vec4(0,0,0,0);
    if(pixel_x%(pixel_fill+pixel_empty)<pixel_fill) {

        vec4 sample1= texelFetch(iChannel2, ivec2(fragCoord.x/(pixel_fill+pixel_empty),0),0) ;
        float max_=sample1.g*.5+sample1.r*.5;
        vec3 rgb=color2.rgb*max_+color1.rgb*(1-max_); 
        if(h<=max_)
            fragColor=vec4(rgb*1.,1.);

    }
}
