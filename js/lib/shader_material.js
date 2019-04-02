

class ShaderMaterial
{
    constructor()
    {
        this.fragmentCode = "uniform float time; uniform vec2 resolution; void main()	{ float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.; float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.; gl_FragColor = vec4(vec3(min(x, y)), 1.); }";
        this.vertexCode = "uniform float time; uniform vec2 resolution; void main()	{ gl_Position = vec4(position, 1.0); }";

        this.material = new THREE.ShaderMaterial
        ({
            uniforms: 
            {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() }
            },

            vertexShader: this.vertexCode,
            fragmentShader: this.fragmentCode
        });
    }
}