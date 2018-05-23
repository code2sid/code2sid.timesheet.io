window.apiURL = 'http://localhost:50792/api/timesheet';
var jsonresponse;

$(document).on('click', '#GetData', function () {
    loadData();
});

function loadData() {
    $("#imgloader").show();
    $.ajax(apiURL + "/GetEntitiesData", {
        type: "GET",
        contentType: "application/json",
    }).done(function (de) {

        var row = "";

        for (var i = 0; i < de.Users.length; i++) {
            row = "<tr> \
                <td>" + de.Users[i].Id + "</td>\
                <td>" + de.Users[i].Name + "</td>\
                <td>" + de.Users[i].RoleId + "</td>\
                <td>"+ de.Users[i].Password + "</td>\
            </tr>"
            $("#tblUsers").append(row);
        }
        row = "";
        for (var i = 0; i < de.Projects.length; i++) {
            row = "<tr> \
                <td>" + de.Projects[i].Id + "</td>\
                <td>" + de.Projects[i].Name + "</td>\
            </tr>"
            $("#tblProjects").append(row);
        }

        row = "";
        for (var i = 0; i < de.UserProjects.length; i++) {
            row = "<tr> \
                <td>" + de.UserProjects[i].Id + "</td>\
                <td>" + de.UserProjects[i].ProjectId + "</td>\
                <td>" + de.UserProjects[i].UserId + "</td>\
            </tr>"
            $("#tblUserProjects").append(row);
        }
        row = "";
        for (var i = 0; i < de.Tasks.length; i++) {
            row = "<tr> \
                <td>" + de.Tasks[i].Id + "</td>\
                <td>" + de.Tasks[i].Name + "</td>\
                <td>" + de.Tasks[i].TaskTypeId + "</td>\
            </tr>"
            $("#tblTasks").append(row);
        }

        row = "";
        for (var i = 0; i < de.ProjectTasks.length; i++) {
            row = "<tr> \
                <td>" + de.ProjectTasks[i].Id + "</td>\
                <td>" + de.ProjectTasks[i].ProjectId + "</td>\
                <td>" + de.ProjectTasks[i].TaskId + "</td>\
            </tr>"
            $("#tblProjectTasks").append(row);
        }

        row = "";
        for (var i = 0; i < de.TaskTypes.length; i++) {
            row = "<tr> \
                <td>" + de.TaskTypes[i].Id + "</td>\
                <td>" + de.TaskTypes[i].Name + "</td>\
            </tr>"
            $("#tblTaskTypes").append(row);
        }
        alert("Data Load Complete");
    }).fail(function (xhr, status, error) {
        alert("Could not reach the API: " + error);
    });

    $("#imgloader").hide();
}

$(document).on('click', '#AddData', function () {
    $("#imgloader").show();

    $.ajax({
        type: "POST",
        url: apiURL + "/InsertEntitiesData",
        contentType: 'application/json',
        type: 'POST',
        data: jsonresponse,
        dataType: "json",
        success: function (result) {
            if (result) {
                alert("Data Saved Successfully");
                loadData();
            }
        },
        error: function (jqXHR, exception) {
            alert(exception);
            alert("Could not reach the API: " + error);

        }
    });

    $("#imgloader").hide();

});
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'src/assets/DataEntries.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

loadJSON(function (response) {
    jsonresponse = response;

});