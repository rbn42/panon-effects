#version 130

#define PI 3.141592653589793

#define N1 $N1
#define N2 $N2
#define N3 $N3
#define N4 $N4
#define N5 $N5


// adapted from <https://www.shadertoy.com/view/XdlSDs> by @dynamite

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 p = (2.*fragCoord.xy - iResolution.xy) / iResolution.y;
    vec2 uv = (fragCoord.xy/iResolution.xy -vec2(N1,N2)) *vec2(N3,N4) ;
	
	// get the color
	float xCol = 3. * mod(uv.x, 1.);
	vec3 horColour = vec3(0.25, 0.25, 0.25);
	
	if (xCol < 1.0) {
		horColour.r += 1. - fract(xCol);
		horColour.g += fract(xCol);
	} else if (xCol < 2.0) {
		horColour.g += 1. - fract(xCol);
		horColour.b += fract(xCol);
	} else {
		horColour.b += 1. - fract(xCol);
		horColour.r += fract(xCol);
	}

	// draw color beam
	uv = 2.*uv - 1.;
	float beamWidth = 1./abs(150.*uv.y);
    
    int cur_note = int(2.5*uv.x + 5.);

    float s_x= ((cur_note-5.)/2.5+1 )/2 /N3+N1;
    
    float u = 0.;

    vec4 sample1= texture(iChannel1, vec2(s_x,0)) ;
    u+=sample1.r*N5;
    
    
    beamWidth *= 1. + 2.5*u*(1. - cos(5.*PI*uv.x));
	fragColor.xyz = beamWidth * horColour;
    fragColor.w = 1.;
}
