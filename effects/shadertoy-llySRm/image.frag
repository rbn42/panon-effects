#version 130

//#define SYMMETRIC

#define WAVES 8.0

vec4 sinWave(vec4 under, vec4 over, float amp, float freq, float x, float y){
	float sinx = sin(x * freq);
    #ifdef SYMMETRIC
    if(abs(y / amp) < abs(sinx) + 0.2){
       	return under;
    }
    #else
    if((y / amp) < sinx + 0.2){
       	return under;
    }
    #endif
    return over;
}

vec3 hsv2rgb_2(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float sampleFreq(float freq){
    return texture(iChannel0, vec2(freq, 0.0)).x;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
    uv.y = uv.y * 10.0 - 5.0;
    
    vec4 col = vec4(0.0);
    
    for(float i = 0.0; i < WAVES; i += 1.0){
        
        //Red Colour Scheme
        //vec4 wavecol = vec4(0.1 + 0.05 * i, 0.0, 0.0, 0.5);
        
        //Blue Colour Scheme
        //vec4 wavecol = vec4(0.0, 0.0, 0.1 + 0.05 * i, 0.5);
        
        //HSV Colour Scheme
        vec4 wavecol = vec4(hsv2rgb_2(vec3((1.0 / WAVES) * i, 1.0, 0.6)), 0.5);
        
    	vec4 wave = sinWave(wavecol, vec4(0.0), sampleFreq((1.0 / WAVES) * i + 0.1) * 5.0, i * 3.0, uv.x + iTime / (1.0 + i), uv.y);
        col += wave * wave.a;
    }
    
    col = vec4(pow(col.xyz, vec3(0.4545)),col.a);
        
	fragColor = col;
}
