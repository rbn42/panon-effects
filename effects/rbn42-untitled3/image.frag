#version 130

#define bcolor $background_color_and_opacity

#define min_arc $min_arc
#define max_arc $max_arc
#define strength1 $strength1
#define strength2 $strength2

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    fragCoord.y+=1;

    fragColor.rgb=bcolor.rgb*bcolor.a;
    fragColor.a=bcolor.a;

    ivec2 p1;
    for(int x=-int(iResolution.y);x<iResolution.y+1;x++){
        p1.x=int(fragCoord.x)+x;
        int y=int(pow(fragCoord.y*fragCoord.y+x*x,0.5));
        for(p1.y=y-3;p1.y<y+4;p1.y++){
            if(p1.y>iResolution.y)continue;
            vec4 samplev= texelFetch(iChannel2,p1, 0);
            float samplef=(samplev.r+samplev.g)/2;
            float arc=((max_arc-min_arc)*samplev.b+min_arc)/180*3.14;
            vec2 p2=vec2(p1.x,0)+p1.y*vec2(cos(arc),sin(arc));

            float dist=length(fragCoord-p2);
            //float alpha= samplef* max(1-dist,0);
            float alpha= samplef/ pow(dist,strength2)*strength1;
            fragColor.rgb+=getRGB(p1.x/iResolution.x)*alpha; 
            fragColor.a+=alpha;
        }

    }
}
