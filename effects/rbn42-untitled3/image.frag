#version 130

#define bcolor $background_color_and_opacity

#define min_arc $min_arc
#define max_arc $max_arc
#define strength1 $strength

#define dual_channel $dual_channel


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    //fragCoord.y+=1;
    if(dual_channel)
        fragCoord.y-=iResolution.y/2;
    bool updown=(fragCoord.y>=0);
    if(updown)
        fragColor.y+=2;
    else
        fragColor.y-=2;

    fragColor.rgb=bcolor.rgb*bcolor.a;
    fragColor.a=bcolor.a;

    if(abs(fragCoord.y)<1)return;

    ivec2 p1;
    int max_radius=dual_channel? int(iResolution.y/2):int(iResolution.y);
    for(int x=-max_radius;x<max_radius+1;x++){
        p1.x=int(fragCoord.x)+x;
        int y=int(pow(fragCoord.y*fragCoord.y+x*x,0.5));
        for(p1.y=y-3;p1.y<y+4;p1.y++){
            if(p1.y>iResolution.y)continue;
            //vec4 samplev= texelFetch(iChannel2,ivec2(p1.x,int(p1.y*p1.y/iResolution.y)), 0);
            vec4 samplev= texelFetch(iChannel2,p1, 0);
            float arc=((max_arc-min_arc)*samplev.b+min_arc)/180*3.14;
            float samplef;
            if(dual_channel)
                samplef=updown?samplev.r:samplev.g;
            else
                samplef=(samplev.r+samplev.g)/2;
            vec2 p2=vec2(p1.x,0)+(updown?1:-1)*p1.y*vec2(cos(arc),sin(arc));

            float dist=length(fragCoord-p2);
            //float alpha= samplef* max(1-dist,0);
            //float alpha= samplef/ pow(dist,strength2)*strength1;
            float alpha= samplef *(dist<1?1:(dist<1.2?5*(1.2-dist):0))*strength1; // pow(dist,strength2)*strength1;
            if(alpha>fragColor.a){
                fragColor.rgb=getRGB(p1.x/iResolution.x)*alpha; 
                fragColor.a=alpha;
            }
            //fragColor.rgb+=getRGB(p1.x/iResolution.x)*alpha; 
            //fragColor.a+=alpha;
        }

    }
}
