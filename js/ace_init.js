
/**
 * Called when the window loads
 */
window.addEventListener("load", function () 
{
    //Make the editor, attach to #editor
    let editor = ace.edit("editor");

    //Set the editor's theme
    editor.setTheme("ace/theme/monokai");

    //And set the mode to glsl syntax highlighting
    editor.session.setMode("ace/mode/glsl");

    editor.setOptions
    ({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });



});