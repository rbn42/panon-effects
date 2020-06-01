#version 130



vec4 fun1(int start,int end,int channel){
    float maxvalue=0;
    int maxindex=0;
    float avgvalue=0;

    for(int i=start;i<end;i++){
        vec4 c= texelFetch(iChannel1,ivec2(i,0), 0);
        float cv=channel>0?c.r:c.g;
        if(cv>maxvalue){
            maxvalue=cv;
            maxindex=i;
        }
        avgvalue+=cv/(end-start);
    }
    return vec4(maxvalue, (maxindex-start) /1.0/(end-start) ,avgvalue,1);

}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    if(fragCoord.y>1)
        return;

    int _step=int(0.1*iChannelResolution[1].x);
    int overlap=int(0.05*iChannelResolution[1].x);

    int start=int(fragCoord.x*_step);

    if(start>iChannelResolution[1].x)
        return;

    int end=start+_step+overlap;

    fragColor=fun1(start,end,int(fragCoord.y));
}
