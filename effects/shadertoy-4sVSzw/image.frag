#version 130
#define WAVES 3.0

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uvNorm = fragCoord.xy / iResolution.xy;
	vec2 uv = -1.0 + 2.0 * uvNorm;
    float time = iTime * 10.3;
       
  	vec4 color = vec4(0.0);    
    vec3 colorLine = vec3(1.0, 1.0, 1.0);
    float epaisLine = 0.002;     

    for(float i=0.0; i<WAVES; i++){
		float sizeDif = (i * 4.0);
        colorLine = vec3(1.0 - (i*0.2));
        
        
		//SiriWave	
        float K = 4.0;
        float B = 10.0;//Nb waves
        float x = uv.x * 2.5;
        float att = (1.0 - (i*0.2)) * 0.3;//Force waves
        float posOnde = uv.y + (att*pow((K/(K+pow(x, K))), K) * cos((B*x)-(time+(i*2.5))));
      
        //Line
        float difEpais = epaisLine + ((epaisLine/WAVES)*i);
        vec3 line = smoothstep( 0.0, 1.0, abs(epaisLine / posOnde)) * colorLine;
        color += vec4(line, smoothstep( 0.0, 1., abs(epaisLine / posOnde)) * colorLine );
    }


    
    fragColor = color;
}
