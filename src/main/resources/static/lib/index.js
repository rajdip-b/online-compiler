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
    $(".loading-card").hide();
    $(".error-card").hide();
    $(".success-card").hide();
    $("#btnViewDescription").hide();
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
            codeEditor.setValue(existingJavaCode, 1);
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
            codeEditor.setTheme("ace/theme/dawn");
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

function hideModal(){
    $("#exampleModal").modal('toggle');
}

function showModal(){
    $("#exampleModal").modal('show');
}

function onRunClicked(){
    hideStatusMessages();
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

function onLoadCodeClicked(){
    $("#btnLoadCode").prop("disabled", true);
    hideStatusMessages();
    $("#statusLoadingCode").fadeIn();
    let tag = $("#txtCodeTag").val();
    if (tag != ""){
        $.ajax({
            url: '/code?tag='+tag,
            type: 'GET',
            success: function(data){
                if (data != ""){
                    $("#statusLoadedCode").fadeIn();
                    codeEditor.setValue(data.code, 1);
                    $("#listLanguage").val(data.codeLanguage);
                    $("#codeInput").val(data.codeInput);
                    onLanguageSelectionClicked();
                    onLanguageChanged({value: data.codeLanguage});
                    $("#modalDesc").text(data.codeDescription);
                    $("#btnViewDescription").fadeIn();
                    showModal();
                }else{
                    $("#statusCodeDoesntExist").fadeIn();
                }
            },
            error: function(){
                $("#statusLoadingCodeFailed").fadeIn();
            },
            complete: function(){
                $("#statusLoadingCode").fadeOut();
                $("#txtCodeTag").val("");
                $("#btnLoadCode").prop("disabled", false);
            }
        });
    }else{
        alert("Can't load empty tags!");
        $("#statusLoadingCode").fadeOut();
        $("#txtCodeTag").val("");
    }
}

function onSaveCodeClicked(){
    $("#btnSaveCode").prop("disabled", true);
    hideStatusMessages();
    $("#statusSavingCode").fadeIn();
    let code = codeEditor.getValue();
    let codeLanguage = $("#listLanguage").val();
    let codeDescription = $("#txtDescription").val();
    let input = $("#codeInput").val();
    $.ajax({
        url: '/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            'code': code,
            'codeLanguage': codeLanguage,
            'codeDescription': codeDescription,
            'codeInput': input
        }),
        success: function(data){
            $("#statusCodeSavedTxt").text("Your code was saved successfully. Here is your code tag: "+data);
            $("#statusCodeSaved").fadeIn();
        },
        error: function(){
            $("#statusCodeSaveFailed").fadeIn();
        },
        complete: function(){
            $("#statusSavingCode").fadeOut();
            $("#txtDescription").val("");
            $("#btnSaveCode").prop("disabled", false);
        }
    });
}

function onResetClicked(){
    hideStatusMessages();
    let language = $("#listLanguage").find(":selected").text();
    switch(language){
        case "Java": existingJavaCode = defaultJavaText; codeEditor.setValue(existingJavaCode, 1); break;
        case "C++": existingCPPCode = defaultCPPCode; codeEditor.setValue(existingCPPCode, 1); break;
        case "C": existingCCode = defaultCCode; codeEditor.setValue(existingCCode, 1); break;
        case "Python": existingPythonCode = existingPythonCode; codeEditor.setValue(existingPythonCode, 1); break;
        default: break;
    }
}

function hideStatusMessages(){
    if ($("#compilationFailed").is(":visible")){
        $("#compilationFailed").fadeOut();
    }
    if ($("#compilationSuccess").is(":visible")){
        $("#compilationSuccess").fadeOut();
    }
    if ($("#statusCodeSaved").is(":visible")){
        $("#statusCodeSaved").fadeOut();
    }
    if ($("#statusCodeSaveFailed").is(":visible")){
        $("#statusCodeSaveFailed").fadeOut();
    }
    if ($("#statusLoadedCode").is(":visible")){
        $("#statusLoadedCode").fadeOut();
    }
    if ($("#statusLoadingCodeFailed").is(":visible")){
        $("#statusLoadingCodeFailed").fadeOut();
    }
    if ($("#statusCodeDoesntExist").is(":visible")){
        $("#statusCodeDoesntExist").fadeOut();
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
        case "java": codeEditor.setValue(existingJavaCode, 1); codeEditor.session.setMode("ace/mode/java"); break;
        case "cpp": codeEditor.setValue(existingCPPCode, 1); codeEditor.session.setMode("ace/mode/c_cpp"); break;
        case "c": codeEditor.setValue(existingCCode, 1); codeEditor.session.setMode("ace/mode/c_cpp"); break;
        case "python": codeEditor.setValue(existingPythonCode, 1); codeEditor.session.setMode("ace/mode/python"); break;
        default: break;
    }
    $("#codeOutput").val('Run the code for an output.');
    hideStatusMessages();
}

function onViewDescriptionClicked(){
    showModal();
}

function onThemeChanged(e){
    if (e.value == "dark"){
        codeEditor.setTheme("ace/theme/one_dark");

        $("body").removeClass("text-dark bg-white");
        $("body").addClass("text-light bg-dark");

        $("#btnRun, #btnSaveCode, #btnLoadCode").removeClass("btn-outline-success");
        $("#btnRun, #btnSaveCode, #btnLoadCode").addClass("btn-success");

        $("#btnViewDescription").removeClass("btn-outline-primary");
        $("#btnViewDescription").addClass("btn-primary");

        $("#btnReset").removeClass("btn-outline-danger");
        $("#btnReset").addClass("btn-danger");

        $("select").removeClass("text-black bg-white");
        $("select").addClass("text-white bg-dark");

        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag").removeClass("text-black");
        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag").addClass("text-white bg-dark");

        $(".loading-card").removeClass("text-primary");
        $(".loading-card").addClass("text-white bg-primary");

        $(".success-card").removeClass("text-success");
        $(".success-card").addClass("bg-success text-white");

        $(".error-card").removeClass("text-danger");
        $(".error-card").addClass("bg-danger text-white");

        $("#btnClose").removeClass("btn-close-black");
        $("#btnClose").addClass("btn-close-white");

        $("#btnSave").removeClass("btn-outline-primary");
        $("#btnSave").addClass("btn-primary");

        $("#txtCodeTag").removeClass("text-black bg-white");
        $("#txtCodeTag").addClass("text-white bg-dark");        
    }else{
        codeEditor.setTheme("ace/theme/dawn");

        $("body").removeClass("text-light bg-dark");
        $("body").addClass("text-dark bg-white");

        $("#btnRun, #btnSaveCode, #btnLoadCode").removeClass("btn-success");
        $("#btnRun, #btnSaveCode, #btnLoadCode").addClass("btn-outline-success");

        $("#btnViewDescription").removeClass("btn-primary");
        $("#btnViewDescription").addClass("btn-outline-primary");

        $("#btnReset").removeClass("btn-danger");
        $("#btnReset").addClass("btn-outline-danger");

        $("select").removeClass("text-white bg-dark");
        $("select").addClass("text-black bg-white");

        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag").removeClass("text-white bg-dark");
        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag").addClass("text-black");

        $("#execStatus").removeClass("text-white bg-primary");
        $("#execStatus").addClass("text-primary");

        $("#compilationSuccess").removeClass("bg-success text-white");
        $("#compilationSuccess").addClass("text-success");

        $("#compilationFailed").removeClass("bg-danger text-white");
        $("#compilationFailed").addClass("text-danger");
        
        $("#btnClose").removeClass("btn-close-white");
        $("#btnClose").addClass("btn-close-black");

        $("#btnSave").removeClass("btn-primary");
        $("#btnSave").addClass("btn-outline-primary");

        $("#txtCodeTag").removeClass("text-white bg-dark");
        $("#txtCodeTag").addClass("text-black bg-white");
    }
}