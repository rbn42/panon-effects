#version 130

/*
 * 目标是在尽可能小的空间,显示尽可能多的信息. 展示方式是倾向.
 * 信息展示位, 就是光源.
 *
 * 对于当前像素来说,需要遍历周边的光源像素, 
 * 这里需要一个高效的遍历,不能浪费计算资源.
 * 简单点的算法,是从当前像素出发,在周边的一个正方形中,
 * 找到光源
 *
 * 首先,我们需要确定,哪些点是光源,
 * 然后,确定它们对应到频谱的位置
 *
 * 比如说, 
 * 第一行,横向,30px 一条斜线, 
 * 第二行,同样,30px,一条斜线,但是和第一行差10px位移
 * 第三行,同样如此,再位移10px
 * 第四行,对比第一行1px位移. 
 * 这样的话,第一条斜线的纵向点距就是3px, 而斜线间距是10px
 * 
 * 公式是 
 * y=0, x % gap_x ==0
 * y=1, x % gap_x ==gap_line *y
 * y=3, x % gap_x ==gap_line *(y%gap_y)+ y // gap_y
 *
 * 遍历是
 * for y=0, y<Y, y++
 *   for x=gap_line *(y%gap_y)+ y // gap_y,x<X,x+=gap_x
 *
 * xy转换频谱? 要么换一个x向的遍历或许更容易一些?也不会. 
 * 需要一个遍历频谱,转换到xy的.
 * for line=0,line<X/gap_line,line++
 *   for y=line%gap_y, y<Y,y+=gap_y
 *     x=line*gap_line+y/gap_y
 * 这样的话, 总的光源数目就是 X/gap_line * Y/gap_Y ,
 * 总共需要的数目大概接近500,假如高宽是200 *40,那么
 *
 * 下一个问题是,我们不能全局遍历, 而要在当前像素点周边遍历,
 * 所以需要根据当前像素,设定line和y的起点终点
 */

#define gap_y $gap_height
#define gap_line $gap_line
#define gap_x gap_y*gap_line

#define background_opacity $background_opacity 
#define glow_radius      $glow_radius     
#define glow_strength    $glow_strength 
#define glow_strength2   $glow_strength2 



void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    fragColor=vec4(0,0,0,background_opacity);

    ivec2 rect_start=ivec2(fragCoord)-100;
    ivec2 rect_end=rect_start+200;

    for(int line=int(fragCoord.x-glow_radius)/gap_line ;
            line<int(fragCoord.x+glow_radius)/gap_line ;
            line++){
        for(int y=line%gap_y +int(fragCoord.y-glow_radius)/gap_y*gap_y ;
                y<fragCoord.y+glow_radius;
                y+=gap_y){
            int x=line*gap_line+y/gap_y;
            float l=length(vec2(x,iResolution.y-y)-fragCoord);

            float index_=(line*gap_line+y*1./iResolution.y)/iResolution.x;
            vec3 rgb=getRGB(index_);
            vec4 sample1= texture(iChannel1, vec2(index_,0)) ;
            float a=sample1.r/ pow(l ,glow_strength2) *glow_strength;
            fragColor+=vec4(rgb*a,a);
        }
    }


   
}
