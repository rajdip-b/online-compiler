let codeEditor = null;

let defaultJavaText = null;
let defaultCPPText = null;
let defaultCCode = null;
let defaultPythonCode = null;

let existingJavaCode = null;
let existingCCode = null;
let existingCPPCode = null;
let existingPythonCode = null;

// Initializer(Main method)

$(document).ready(function(){
    configureAce();
    initializeDefaultTexts();
    initializeElements();
    loadCodeFromTag();
});

// Helper methods

function getCodeTag(){
    var results = new RegExp('[\?&]' + 'codeTag' + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}

function initializeElements(){
    $('#listLanguage').val('java');
    $('#listTheme').val('light');
    $('#codeInput').val('');
    $(".loading-card").hide();
    $(".error-card").hide();
    $(".success-card").hide();
    $("#btnViewDescription").hide();
    $("#sectionUpdateCode").hide();
    codeEditor.session.setMode("ace/mode/java");
}

function configureAce(){
    codeEditor = ace.edit("codeEditor");
    ace.require("ace/ext/language_tools");
    let editorLib = {
        init(){
            codeEditor.setTheme("ace/theme/dawn");
            codeEditor.setOptions({
                enableBasicAutocompletion: true,
                fontSize: '12pt'
            });
        }
    }
    codeEditor.session.setMode("ace/mode/java");
    editorLib.init();
}

function hideDescriptionModal(){
    $("#descriptionModal").modal('toggle');
}

function hideSaveCodeModal(){
    $("#saveCodeModal").modal('toggle');
}

function showDescriptionModal(){
    $("#descriptionModal").modal('show');
}

function hideCodeSavedInfoModal(){
    $("#savedCodeInfoModal").modal('toggle');
}

function showSaveForCommunityModal(){
    $("#saveForCommunityModal").modal('show');
}

function hideSaveForCommunityModal(){
    $("#saveForCommunityModal").modal('toggle');
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
    if ($("#statusUpdatedCode").is(":visible")){
        $("#statusUpdatedCode").fadeOut();
    }
    if ($("#statusUpdatingCodeFailed").is(":visible")){
        $("#statusUpdatingCodeFailed").fadeOut();
    }
}

// AJAX Methods

function loadCodeFromTag(){
    
    let codeTag = getCodeTag();
    if (codeTag != null){
        $("#btnLoadCode").prop("disabled", true);
        hideStatusMessages();
        $("#statusLoadingCode").fadeIn();
        $.ajax({
            url: '/code?tag='+codeTag,
            type: 'GET',
            success: function(data){
                if (data != ""){
                    codeTag = data.codeTag;
                    $("#statusLoadedCode").fadeIn();
                    codeEditor.setValue(data.code, 1);
                    $("#listLanguage").val(data.codeLanguage);
                    $("#codeInput").val(data.codeInput);
                    onLanguageSelectionClicked();
                    onLanguageChanged({value: data.codeLanguage});
                    $("#modalDesc").text(data.codeDescription);
                    $("#modalCodeTitle").text(data.codeTitle+" by "+data.author);
                    $("#btnViewDescription").fadeIn();
                    $("#sectionUpdateCode").fadeIn();
                    showDescriptionModal();
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
    }
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

// Event Handlers

function onLoadCodeClicked(){
    let tag = $("#txtCodeTag").val();
    if (tag != ""){
        window.location.href='/compiler?codeTag='+tag;
    }else{
        alert("Can't load empty tags!");
        $("#statusLoadingCode").fadeOut();
        $("#txtCodeTag").val("");
    }
}

function onSaveCodeToMachineClicked(){
    hideSaveCodeModal();
    var blob = new Blob([codeEditor.getValue()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, $("#txtCodeName").val()+"."+$("#listLanguage").val());
    $("#savedCodeInfoModal").modal('show');
}

function onDownloadClicked(){
    $("#txtCodeExtention").text("."+$("#listLanguage").val());
    $("#saveCodeModal").modal('show');
}

function onCloseClicked(e){
    $(e).parent().fadeOut();
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

function onSaveForSelfClicked(){
    let author = $("#txtAuthor").val();
    if (author == ''){
        alert("You need to specify your name!");
        return;
    }
    let codeTitle = $("#txtTitle").val();
    if (codeTitle == ''){
        alert("Code title can't be null!");
        return;
    }
    $("#btnSaveForSelf").prop("disabled", true);
    hideStatusMessages();
    $("#statusSavingCode").fadeIn();
    let code = codeEditor.getValue();
    let codeLanguage = $("#listLanguage").val();
    let codeDescription = $("#txtDescription").val();
    let input = $("#codeInput").val();
    $.ajax({
        url: '/saveForSelf',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            'code': code,
            'codeLanguage': codeLanguage,
            'codeDescription': codeDescription,
            'codeInput': input,
            'author': author,
            'codeTitle': codeTitle
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
            $("#txtTitle").val("");
            $("#txtAuthor").val("");
            $("#btnSaveForSelf").prop("disabled", false);
        }
    });
}

function onSaveForCommunityClicked(){
    let author = $("#txtAuthor").val();
    if (author == ''){
        alert("You need to specify your name!");
        return;
    }
    let codeTitle = $("#txtTitle").val();
    if (codeTitle == ''){
        alert("Code title can't be null!");
        return;
    }
    hideSaveForCommunityModal();
    $("#btnSaveForCommunity").prop("disabled", true);
    hideStatusMessages();
    $("#statusSavingCode").fadeIn();
    let code = codeEditor.getValue();
    let codeLanguage = $("#listLanguage").val();
    let codeDescription = $("#txtDescription").val();
    let input = $("#codeInput").val();
    $.ajax({
        url: '/saveForCommunity',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            'code': code,
            'codeLanguage': codeLanguage,
            'codeDescription': codeDescription,
            'codeInput': input,
            'author': author,
            'codeTitle': codeTitle
        }),
        success: function(data){
            $("#statusCodeSavedTxt").text("Your code was saved successfully. Here is your code tag: "+data+". Also, your code is globally visible! :)");
            $("#statusCodeSaved").fadeIn();
        },
        error: function(){
            $("#statusCodeSaveFailed").fadeIn();
        },
        complete: function(){
            $("#statusSavingCode").fadeOut();
            $("#txtDescription").val("");
            $("#txtTitle").val("");
            $("#txtAuthor").val("");
            $("#btnSaveForCommunity").prop("disabled", false);
        }
    });
}

function onResetClicked(){
    // $("#btnViewDescription").hide();
    // $("#sectionUpdateCode").hide();
    // hideStatusMessages();
    // $("#codeOutput").text("Run the code for an output.");
    // let language = $("#listLanguage").find(":selected").text();
    // codeTag = null;
    // switch(language){
    //     case "Java": existingJavaCode = defaultJavaText; codeEditor.setValue(existingJavaCode, 1); break;
    //     case "C++": existingCPPCode = defaultCPPCode; codeEditor.setValue(existingCPPCode, 1); break;
    //     case "C": existingCCode = defaultCCode; codeEditor.setValue(existingCCode, 1); break;
    //     case "Python": existingPythonCode = existingPythonCode; codeEditor.setValue(existingPythonCode, 1); break;
    //     default: break;
    // }
    window.location.href = '/compiler';
}

function onUpdateCodeClicked(){
    hideStatusMessages();
    $("#statusUpdatingCode").fadeIn();
    $("#btnUpdateCode").prop('disabled', true);
    let code = codeEditor.getValue();
    let input = $("#codeInput").val();
    let codeTag = getCodeTag();
    $.ajax({
        url: '/updateCode',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            'code': code,
            'codeInput': input,
            'codeTag': codeTag
        }),
        success: function(data){
            if (data == true){
                $("#statusUpdatedCode").fadeIn();
            }else{
                $("#statusUpdatingCodeFailed").fadeIn();
            }
        },
        error: function(jqxhr){
            console.log(jqxhr);
            $("#statusUpdatingCodeFailed").fadeIn();
        },
        complete: function(){
            $("#statusUpdatingCode").fadeOut();
            $("#btnUpdateCode").prop("disabled", false);
        }
    });
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
    showDescriptionModal();
}

function onThemeChanged(e){
    if (e.value == "dark"){
        codeEditor.setTheme("ace/theme/one_dark");

        $("body").removeClass("text-dark bg-white");
        $("body").addClass("text-light bg-dark");

        $("#btnRun, #btnSaveForCommunity, #btnSaveForSelf, #btnLoadCode").removeClass("btn-outline-success");
        $("#btnRun, #btnSaveForCommunity, #btnSaveForSelf, #btnLoadCode").addClass("btn-success");

        $("#btnViewDescription, #btnDownload").removeClass("btn-outline-primary");
        $("#btnViewDescription, #btnDownload").addClass("btn-primary");

        $("#btnReset").removeClass("btn-outline-danger");
        $("#btnReset").addClass("btn-danger");

        $("select").removeClass("text-black bg-white");
        $("select").addClass("text-white bg-dark");

        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag, #txtTitle, #txtAuthor").removeClass("text-black");
        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag, #txtTitle, #txtAuthor").addClass("text-white bg-dark");

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

        $("#btnRun, #btnSaveForCommunity, #btnSaveForSelf, #btnLoadCode").removeClass("btn-success");
        $("#btnRun, #btnSaveForCommunity, #btnSaveForSelf, #btnLoadCode").addClass("btn-outline-success");

        $("#btnViewDescription, #btnDownload").removeClass("btn-primary");
        $("#btnViewDescription, #btnDownload").addClass("btn-outline-primary");

        $("#btnReset").removeClass("btn-danger");
        $("#btnReset").addClass("btn-outline-danger");

        $("select").removeClass("text-white bg-dark");
        $("select").addClass("text-black bg-white");

        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag, #txtTitle, #txtAuthor").removeClass("text-white bg-dark");
        $("#codeInput, #codeOutput, #txtDescription, #txtCodeTag, #txtTitle, #txtAuthor").addClass("text-black");

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