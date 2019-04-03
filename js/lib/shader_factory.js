

class ShaderFactory
{
    constructor(app)
    {
        //Set the app
        this.app = app;
    }

    createProgram(frag = 0, vert = 0)
    {
        if (frag == 0)
            frag = this.app.fragment;

        if (vert == 0)
            vert = this.vertex;

        /*let mat = new THREE.ShaderMaterial
        ({
            uniforms:
            {
                time: { value: +new Date() },
                resolution: { value: new THREE.Vector2() }
            },

            vertexShader: vert,
            fragmentShader: frag
        });*/

        this.app.material.vertexShader = vert;
        this.app.material.fragmentShader = frag;
        this.app.material.needsUpdate = true;

        //call render to update the material prior to retrieving the compilation state
        this.app.render();

        let errors = this.getErrors();

        if(Object.keys(errors).length == 0)
        {
            this.setErrors(0);
            return;
        }

        this.setErrors(errors);
    }

    getErrors()
    {
        let renderer = this.app.renderer;
        let programs = renderer.info.programs;

        let program = programs[0];

        let errors = {
            
        };

        if("diagnostics" in program)
        {
            let diagnostics = program.diagnostics;

            if("fragmentShader" in diagnostics && diagnostics.fragmentShader.log != "")
                errors.fragment = this.extractErrorsFromLog(diagnostics.fragmentShader.log);

            if ("vertexShader" in diagnostics && diagnostics.vertexShader.log != "")
                errors.vertex = this.extractErrorsFromLog(diagnostics.vertexShader.log); 
        }

        return errors;
    }

    extractErrorsFromLog(string)
    {
        let errors = string.split("\n");

        document.querySelector("pre").innerText = "";

        let foundErrors = [];

        for(let error of errors)
        {
            let match = error.match(/ERROR:\s*\d:(\d+):\s*(.+)/);

            if(match == null)
                continue;

            let errorLine = +match[1] - 99;
            let errorMsg  = match[2];

            foundErrors.push({
                line: errorLine,
                msg: errorMsg
            });

            //this.setError(errorLine, errorMsg);
            //document.querySelector("pre").innerText += "[error on line " + errorLine + "] " + errorMsg + ", ";
        }

        return foundErrors;
    }

    setErrors(errors)
    {
        if(errors == 0)
        {
            this.app.editor.getSession().setAnnotations([]);
            return;
        }

        let fragErrors = errors.fragment;

        let notifications = fragErrors.map(function(error)
        {
            let line = error.line;
            let msg = error.msg;

            return {
                row: line,
                column: 0,
                text: msg,
                type: "error"
            };
        });

        this.app.editor.getSession().setAnnotations(notifications);
    }
}