#version 130

#define pixel_fill $bar_width
#define pixel_empty $gap_width

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    int pixel_x= int( fragCoord.x);
    int pixel_y= int( fragCoord.y);

    float h=fragCoord.y/iResolution.y;


    fragColor=vec4(0,0,0,0);
    if(pixel_x%(pixel_fill+pixel_empty)<pixel_fill) {
        float x=pixel_x/(pixel_fill+pixel_empty) /1.0/iResolution.x*(pixel_fill+pixel_empty) ;
        vec3 rgb=getRGB(x);

        vec4 sample1= texture(iChannel1, vec2(x,0)) ;
        float max_=sample1.g*.5+sample1.r*.5;
        if(h<=max_)
            fragColor=vec4(rgb*1.,1.);

    }
}
