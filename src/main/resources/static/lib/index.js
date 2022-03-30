let codeEditor = null;

let defaultJavaText = null;
let defaultCPPText = null;
let defaultCCode = null;
let defaultPythonCode = null;

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
    $("#execStatus").hide();
    $("#compilationSuccess").hide();
    $("#compilationFailed").hide();
    codeEditor.session.setMode("ace/mode/java");
}

function initializeDefaultTexts(){
    // Initialize java text
    $.ajax({
        url: '/text/java',
        type: 'GET',
        success: function(data){
            defaultJavaText = data;
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
            defaultCCode = data;
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
            defaultCPPText = data;
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
            defaultPythonCode = data;
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

function onCloseClicked(e){
    $(e).parent().fadeOut();
}

function onRunClicked(){
    hideCompilationMessages();
    $("#execStatus").fadeIn();
    $("#btnRun").prop("disabled", true);
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
            if (data.status == 'success'){
                $("#compilationSuccess").fadeIn();
            }else{
                $("#compilationFailed").fadeIn();
            }
            $("#codeOutput").text(data.output);
        },
        error: function (jqXHR, status, thrown) {
            alert("Error connecting to the server!");
            $("#compilationFailed").fadeIn();
        },
        complete: function(){
            $("#execStatus").fadeOut();
            $("#btnRun").prop("disabled", false);
        }
    });
}

function onResetClicked(){
    let language = $("#listLanguage").find(":selected").text();
    switch(language){
        case "Java": existingJavaCode = defaultJavaText; codeEditor.setValue(existingJavaCode); break;
        case "C++": existingCPPCode = defaultCPPCode; codeEditor.setValue(existingCPPCode); break;
        case "C": existingCCode = defaultCCode; codeEditor.setValue(existingCCode); break;
        case "Python": existingPythonCode = existingPythonCode; codeEditor.setValue(existingPythonCode); break;
        default: break;
    }
    hideCompilationMessages();
}

function hideCompilationMessages(){
    if ($("#compilationFailed").is(":visible")){
        $("#compilationFailed").fadeOut();
    }
    if ($("#compilationSuccess").is(":visible")){
        $("#compilationSuccess").fadeOut();
    }
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
    $("#codeOutput").val('Run the code for an output.');
    hideCompilationMessages();
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

        $("#execStatus").removeClass("text-primary");
        $("#execStatus").addClass("text-white bg-primary");

        $("#compilationSuccess").removeClass("text-success");
        $("#compilationSuccess").addClass("bg-success text-white");

        $("#compilationFailed").removeClass("text-danger");
        $("#compilationFailed").addClass("bg-danger text-white");

        $("#btnClose").removeClass("btn-close-black");
        $("#btnClose").addClass("btn-close-white");
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

        $("#execStatus").removeClass("text-white bg-primary");
        $("#execStatus").addClass("text-primary");

        $("#compilationSuccess").removeClass("bg-success text-white");
        $("#compilationSuccess").addClass("text-success");

        $("#compilationFailed").removeClass("bg-danger text-white");
        $("#compilationFailed").addClass("text-danger");
        
        $("#btnClose").removeClass("btn-close-white");
        $("#btnClose").addClass("btn-close-black");
    }
}