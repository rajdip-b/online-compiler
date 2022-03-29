let codeEditor = null;

let existingJavaCode = null;
let existingCCode = null;
let existingCPPCode = null;
let existingPythonCode = null;

$(document).ready(function(){
    configureAce();
    initializeDefaultTexts();
    initializeElements();
});

function initializeElements(){
    $('#listLanguage').val('java');
    $('#listTheme').val('light');
    $('#codeInput').val('');
    codeEditor.session.setMode("ace/mode/java");
}

function initializeDefaultTexts(){
    // Initialize java text
    $.ajax({
        url: '/text/java',
        type: 'GET',
        success: function(data){
            existingJavaCode = data;
            codeEditor.setValue(existingJavaCode);
        },
        error: function(jqXHR, status){
            console.log(status);
        }
    });

    // Initialize c text
    $.ajax({
        url: '/text/c',
        type: 'GET',
        success: function(data){
            existingCCode = data;
        },
        error: function(jqXHR, status){
            console.log(status);
        }
    });

    // Initialize c++ text
    $.ajax({
        url: '/text/cpp',
        type: 'GET',
        success: function(data){
            existingCPPCode = data;
        },
        error: function(jqXHR, status){
            console.log(status);
        }
    });

    // Initialize python text
    $.ajax({
        url: '/text/python',
        type: 'GET',
        success: function(data){
            existingPythonCode = data;
        },
        error: function(jqXHR, status){
            console.log(status);
        }
    });
}

function configureAce(){
    codeEditor = ace.edit("codeEditor");
    let editorLib = {
        init(){
            codeEditor.setTheme("ace/theme/clouds");
            codeEditor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: false,
                fontSize: '12pt'
            });
        }
    }
    editorLib.init();
}

function onRunClicked(){
    let language = $("#listLanguage").find(":selected").text();
    let code = codeEditor.getValue();
    let input = $("#codeInput").val();
    $.ajax({
        type: 'POST',
        url: '/run',
        data: JSON.stringify({
            'language': language,
            'code': code,
            'input': input
        }),
        contentType: 'application/json',
        success: function (data) { 
            $("#codeOutput").text(data.output);
        },
        error: function (jqXHR, status, thrown) {
            console.log(jqXHR+" "+status+" "+thrown);
            alert(jqXHR.data);
        }
    });
}

function onResetClicked(){
    codeEditor.setValue("");
}

function onLanguageSelectionClicked(e){
    let language = $("#listLanguage").find(":selected").text();

    switch(language){
        case "Java": existingJavaCode = codeEditor.getValue(); break;
        case "C++": existingCPPCode = codeEditor.getValue(); break;
        case "C": existingCCode = codeEditor.getValue(); break;
        case "Python": existingPythonCode = codeEditor.getValue(); break;
        default: break;
    }
}

function onLanguageChanged(e){
    switch(e.value){
        case "java": codeEditor.setValue(existingJavaCode); codeEditor.session.setMode("ace/mode/java"); break;
        case "cpp": codeEditor.setValue(existingCPPCode); codeEditor.session.setMode("ace/mode/c_cpp"); break;
        case "c": codeEditor.setValue(existingCCode); codeEditor.session.setMode("ace/mode/c_cpp"); break;
        case "python": codeEditor.setValue(existingPythonCode); codeEditor.session.setMode("ace/mode/python"); break;
        default: break;
    }
}

function onThemeChanged(e){
    if (e.value == "dark"){
        codeEditor.setTheme("ace/theme/dracula");

        $("body").removeClass("text-dark bg-white");
        $("body").addClass("text-light bg-dark");

        $("#btnRun").removeClass("btn-outline-success");
        $("#btnRun").addClass("btn-success");

        $("#btnReset").removeClass("btn-outline-danger");
        $("#btnReset").addClass("btn-danger");

        $("select").removeClass("text-black bg-white");
        $("select").addClass("text-white bg-dark");

        $("#codeInput").removeClass("text-black bg-light");
        $("#codeInput").addClass("text-white bg-secondary");

        $("#codeOutput").removeClass("text-black bg-light");
        $("#codeOutput").addClass("text-white bg-secondary");
    }else{
        codeEditor.setTheme("ace/theme/clouds");

        $("body").removeClass("text-light bg-dark");
        $("body").addClass("text-dark bg-white");

        $("#btnRun").removeClass("btn-success");
        $("#btnRun").addClass("btn-outline-success");

        $("#btnReset").removeClass("btn-danger");
        $("#btnReset").addClass("btn-outline-danger");

        $("select").removeClass("text-white bg-dark");
        $("select").addClass("text-black bg-white");


        $("#codeInput").removeClass("text-white bg-secondary");
        $("#codeInput").addClass("text-black bg-light");

        $("#codeOutput").removeClass("text-white bg-secondary");
        $("#codeOutput").addClass("text-black bg-light");
    }
}