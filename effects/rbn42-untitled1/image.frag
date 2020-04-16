#version 130

#define background_opacity $background_opacity
#define max_life_time 100
#define glow_strength $glow_strength
#define bar_strength $bar_strength
#define particle_strength $particle_strength
#define pixel_fill $bar_width
#define pixel_empty $gap_width
#define height_ratio $height_ratio

vec4 drawSnow(vec2 fragCoord ) {
    vec4 fragColor=vec4(0,0,0,0);
    for(int j=-40; j<40; j++) {
        vec2 fragCoord2=fragCoord;
        fragCoord2.x+=j;
        vec3 rgb=getRGB(fragCoord2.x/iResolution.x);
        for(int i=1; i<iResolution.y; i++) {
            vec4 data= texelFetch(iChannel2,ivec2(fragCoord2.x,i), 0);
            if(data.g*255.>max_life_time )break;
            float speed_y=(data.r*2+1)/3.;
            float speed_x=80*(2*data.b-1);
            float h=data.g*speed_y;
            h=pow(0.000001, h)*iResolution.y*1.4;
            float dist=length(fragCoord-vec2(fragCoord2.x+data.g*speed_x,h));
            float alpha= (data.r)*(1-data.g*255./max_life_time)*1.0 /pow(dist,glow_strength ) ;
            fragColor+=  vec4(rgb*alpha,alpha);
        }
    }
    return fragColor;
}

float drawBar( vec2 fragCoord ) {
    int pixel_x= int( fragCoord.x);
    int pixel_y= int( fragCoord.y);

    float h=fragCoord.y/iResolution.y;


    if(pixel_x%(pixel_fill+pixel_empty)<pixel_fill) {
        float x=pixel_x/(pixel_fill+pixel_empty) /1.0/iResolution.x*(pixel_fill+pixel_empty) ;
        vec3 rgb=getRGB(x);

        vec4 sample1= texture(iChannel1, vec2(x,0)) ;
        float max_=sample1.g*.5+sample1.r*.5;
        if(h<max_*height_ratio)
            return 1.0;
    }
    return 0.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    fragColor=drawSnow(fragCoord)*particle_strength +drawBar(fragCoord)*bar_strength ;//+drawLine(fragCoord);
    fragColor.a+=background_opacity;
}
