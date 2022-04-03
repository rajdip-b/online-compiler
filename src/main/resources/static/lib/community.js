let currentPage = 1;
let sortBy = 1;
let sortOrder = 1;
let searchString = ' ';

let tempDeleteCodeTag=null;

function searchCodes(){
    disableNextLinks();
    disablePreviousLinks();
    
    $("#code-views").html("<div class='text-center h5'>Fetching data...</div>");
    if (searchString == '')
        searchString = ' ';

    $.ajax({
        url: '/searchCommunityCodes/'+searchString+'/'+currentPage+'?sortBy='+sortBy+'&sortOrder='+sortOrder,
        type: 'GET',
        success: function(data){
            $("#code-views").html("");
            if (data.numberOfElements != 0){
                for (let x=0;x<data.numberOfElements; x++){
                    appendToCodeView(generateCodeView(data.content[x]));
                }
            }else{
                $("#code-views").html("<div class='text-center h5'>Looks like there isn't much of a result here... :( </div>");
            }
            $("#linkCurrentPage").text(currentPage);
            if (data.last != true){
                enableNextLinks();
                setNextLinks(currentPage+1);
            }
            if (data.first != true){
                enablePreviousLinks();
                setPrevLinks(currentPage-1);
            }
        },
        error: function(jqXHR){
            $("#code-views").html("<div class='text-center h5'>Error fetching data!</div>");
        }
    });
}

function setNextLinks(page){
    $("#linkNextPage").children().text(page);
}

function setPrevLinks(page){
    $("#linkPreviousPage").children().text(page);
}

function onLinkPrevPageClicked(){
    currentPage--;
    searchCodes();
}

function onLinkNextPageClicked(){
    currentPage++;
    searchCodes();
}

function disablePreviousLinks(){
    $("#linkPreviousPage").hide();
    $("#btnPrev").addClass('disabled');
    $("#linkPreviousPage").addClass('disabled');
}

function disableNextLinks(){
    $("#linkNextPage").hide();
    $("#btnNext").addClass('disabled');
    $("#linkNextPage").addClass('disabled');
}

function enablePreviousLinks(){
    $("#linkPreviousPage").show();
    $("#btnPrev").removeClass('disabled');
    $("#linkPreviousPage").removeClass('disabled');
}

function enableNextLinks(){
    $("#linkNextPage").show();
    $("#btnNext").removeClass('disabled');
    $("#linkNextPage").removeClass('disabled');
}

function onSearchTextChanged(){
    searchString = $("#txtSearch").val();
    searchCodes();
}

function onSortByChanged(){
    sortBy = $("#listSortBy").val();
    searchCodes();
}

function onSortOrderChanged(){
    sortOrder = $("#listSortOrder").val();
    searchCodes();
}

function getDate(date){
    let d = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return (d.toLocaleDateString('en-IN', options));
}

function generateCodeView(data){
    switch(data.codeLanguage){
        case 'java': data.codeLanguage = 'Java'; break;
        case 'c': data.codeLanguage = 'C'; break;
        case 'cpp': data.codeLanguage = 'C++'; break;
        case 'python': data.codeLanguage = 'Python'; break;
    }
    return '<div data-code="'+data.codeTag+'" class="code-view row border justify-content-center border-grey p-3 m-2">'+
                '<div class="col-6 col-md-3 h5 text-secondary">'+data.codeTitle+'</div>'+
                '<div class="col-6 col-md-4">'+data.codeDescription+'</div>'+
                '<div class="col-2 col-md-1">'+data.codeLanguage+'</div>'+
                '<div class="col-6 col-md-2">'+
                    '<span class="row m-1">'+data.author+'</span>'+
                    '<span class="row m-1">'+getDate(data.expiresOn)+'</span>'+
                '</div>'+
                '<div class="col-4 col-md-2">'+
                    '<button class="row m-1 btn btn-success w-100" onclick="redirectToCodeEditor(this)">View</button>'+
                    '<button class="row m-1 btn btn-danger w-100" onclick="onDeleteCodeClicked(this)">Delete</button>'+
                '</div>'+
            '</div>';
}

function redirectToCodeEditor(e){
    window.location.href = '/compiler?codeTag='+$(e).parent().parent().data("code");
}

function onDeleteCodeClicked(e){
    tempDeleteCodeTag = $(e).parent().parent().data("code");
    toggleDeleteConfirmationModal();
}

function deleteCode(){
    toggleDeleteConfirmationModal();
    $.ajax({
        url: '/deleteCode/'+tempDeleteCodeTag,
        type: 'DELETE',
        success: function(data){
            if (data == true){
                $("#deleteStatus").text("Successfully deleted the code!");
                searchCodes();
            }else{
                $("#deleteStatus").text("Error while deleting that code!");
            }
        },
        error: function(data){
            console.log(data);
            $("#deleteStatus").text("Error while deleting that code!");
        },
        complete: function(){
            tempDeleteCodeTag = null;
            toggleDeleteStatusModal();
        }
    });
}

function toggleDeleteConfirmationModal(){
    $("#deleteConfirmationModal").modal('toggle');
}

function toggleDeleteStatusModal(){
    $("#deleteStatusModal").modal('toggle');
}

function appendToCodeView(data){
    $("#code-views").append(data);
}

$(document).ready(function(){
    searchCodes();
});