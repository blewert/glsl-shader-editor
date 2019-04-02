
class ShaderEditorApp
{
    /**
     * Constructs a new shader editing app.
     */
    constructor(material)
    {
        this.material = material;
        window.addEventListener("load", this.onLoad.bind(this));
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

        //Set stuff up
        this.setupScene();
        this.setupRenderer();
        this.setupCamera(this.scene);
        
        //Build object
        this.buildObject();

        //And call animate
        this.animate();
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
        let geometry = new THREE.SphereGeometry(1, 32, 32);
        let light = new THREE.PointLight(0xffffff, 1, 10);

        light.position.set(0, 2, 0);

        let mesh = new THREE.Mesh(geometry, this.material);
        
        this.scene.add(mesh);
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

    render()
    {
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