
class ShaderEditorApp
{
    /**
     * Constructs a new shader editing app.
     */
    constructor(material)
    {
        //Build a new shader factory
        this.factory = new ShaderFactory(this);

        //this.material = material;
        window.addEventListener("load", this.onLoad.bind(this));
    }


    get fragment()
    {
        return document.querySelector("#fragment").innerText;
    }

    get vertex()
    {
        return document.querySelector("#vertex").innerText;
    }

    /**
     * Alias for document.querySelector("canvas")
     */
    get canvas() 
    {
        return document.querySelector("canvas");
    }


    /**
     * Called when the window and DOM loads.
     */
    onLoad()
    {
        //Set up the canvas
        this.setupCanvas();
        this.setupEditor();

        //Set stuff up
        this.setupRenderer();
        
        //Set up more stuff
        this.setupScene();
        this.setupCamera(this.scene);
    
        //Set up material
        this.material = this.buildMaterial(0, 0);

        //Build object
        this.buildObject();

        //And call animate
        this.animate();
    }


    setupEditor()
    {
        //Make the editor, attach to #editor
        this.editor = ace.edit("editor");

        //Set the editor's theme
        this.editor.setTheme("ace/theme/monokai");

        //And set the mode to glsl syntax highlighting
        this.editor.session.setMode("ace/mode/glsl");

        //Set the options
        this.editor.setOptions
        ({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });

        //Now, set the value to the default frag
        this.editor.setValue(this.fragment);

        //When the editor has changed.. recompile
        this.editor.on("change", this.recompile.bind(this));
    }

    recompile()
    {
        //set #vertex and #fragment
        document.querySelector("#fragment").innerText = this.editor.getValue();

        this.factory.createProgram(this.fragment, this.vertex);

        //this.material = mat;
        //this.mesh.material = mat;

        //let mat = this.buildMaterial(this.fragment, 0);
        //this.material = mat;
        //this.mesh.material = this.material;
    }

    buildMaterial(fragment, vertex)
    {
        if(fragment == 0)
            fragment = this.fragment;

        if(vertex == 0)
            vertex = this.vertex;

        let mat = null;

        mat = new THREE.ShaderMaterial
        ({
            uniforms:
            {
                time: { type:'f', value: performance.now() },
                resolution: { value: new THREE.Vector2() }
            },

            vertexShader: vertex,
            fragmentShader: fragment
        });

        return mat;
    }

    setupCanvas()
    {
        /// get computed style for image
        var img = this.canvas;
        var cs = getComputedStyle(img);

        /// these will return dimensions in *pixel* regardless of what
        /// you originally specified for image:
        var width = parseInt(cs.getPropertyValue('width'), 10);
        var height = parseInt(cs.getPropertyValue('height'), 10);

        /// now use this as width and height for your canvas element:
        var canvas = document.getElementById('myCanvasId');

        this.canvas.width = width;
        this.canvas.height = height;
    }

    buildObject()
    {
        this.geometry = new THREE.SphereGeometry(1, 32, 32);
        this.light = new THREE.PointLight(0xffffff, 1, 10);

        this.light.position.set(0, 2, 0);

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        this.scene.add(this.mesh);
    }

    /**
     * Sets up the renderer
     */
    setupRenderer() 
    {
        //Make a new renderer, set the pixel ratio
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);

        //And set the renderer size to the canvas size
        this.renderer.setSize(this.canvas.width, this.canvas.height);
    }

    /**
     * Sets up the scene
     */
    setupScene() 
    {
        //Make a new scene and set the background color
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x333333);
    }

    /**
     * Sets up the camera
     */
    setupCamera(scene) 
    {
        //Get the aspect ratio
        let ratio = this.canvas.width / this.canvas.height;

        //Make a camera with 30deg fov, the aspect ratio and clipping planes in [1, 10000]
        //then, add it to the scene
        this.camera = new THREE.PerspectiveCamera(30, ratio, 1, 10000);
        this.camera.translateX(10);
        this.camera.lookAt(0, 0, 0);

        //Add the camera to the scene
        scene.add(this.camera);
    }

    updateUniforms()
    {
        this.material.uniforms.time.value = performance.now();
    }

    render()
    {
        this.updateUniforms();
        this.renderer.render(this.scene, this.camera);
    }

    animate()
    {
        //Call next animate thing
        requestAnimationFrame(this.animate.bind(this));

        //Call render
        this.render();
    }
}