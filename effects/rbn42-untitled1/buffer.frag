#version 130

/*
 * 要点,确保稀疏
 * 在xy方向,确保一个点的生成是稀疏的.
 */

#define energy_speed 0.1

#define exclude_neighbour 5
#define exclude_hist 50
float rand(vec2 co) {
    return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    //不指望alpha能记录数据
    fragColor.a=1;

    //新数据
    vec4 new = texture(iChannel1, vec2(fragCoord.x/iResolution.x,0));
    //历史数据
    vec4 t=texelFetch(iChannel2,ivec2(fragCoord.x,0) , 0);
    //混合计算积累energy
    float new_energy= (new.r+new.g)/2.0  ;
    float acc_energy= t.r+ new_energy/10. ;

    float rand_threshold=rand(vec2(fragCoord.x/1000.0,fract(iFrame/10000.0)));

    bool move=false;
    move=(acc_energy *.5+new_energy*.5) > (rand_threshold*.5+.5);
    for(int offset_x=-exclude_neighbour ;offset_x<exclude_neighbour+1;offset_x++){
        if(offset_x==0)continue;
        vec4 neighbour= texture(iChannel1, vec2((fragCoord.x+offset_x)/iResolution.x,0));
        float neighbour_energy=(neighbour.r+neighbour.g)/2.;
        //必须用等号,不然会出现同时达到最高值的
        if(new_energy<=neighbour_energy){
            move=false;
            break;
        }
    }
    for(int offset_x=-exclude_neighbour ;offset_x<exclude_neighbour+1;offset_x++){
        vec4 hist_neighbour=texelFetch(iChannel2,ivec2(fragCoord.x+offset_x,1) , 0);
        if(hist_neighbour.g*255.0<exclude_hist){
            move=false;
            break;
        }
    }

    if(fragCoord.y<1){
        //历史数据更新
        fragColor.r= move ? 0: acc_energy;
        return;
    }
    if(fragCoord.y<2)
        if(move){
            //强度
            fragColor.r=new_energy;
            //生命
            fragColor.g=0;
            //随机数
            fragColor.b=rand(2+vec2(fragCoord.x/1000.0,fract(iFrame/10000.0)));
            return;
        }
    //位移
    if(move){
        fragColor= texelFetch(iChannel2,ivec2(fragCoord.x,fragCoord.y-1) , 0);
    }else{
        fragColor= texelFetch(iChannel2,ivec2(fragCoord.x,fragCoord.y) , 0);
    }
    fragColor.g+=1/255.0;
}
