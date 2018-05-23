var apiURL = 'http://localhost:50792/api/timesheet';
var currentdt = new Date;
var projectTask = [{ projectId: 0, taskId: 0 }];
var projectDetails = [];
var dates = [];
var defaultValue = 8;
$("#imgloader").hide();

setWeek((new Date));
getProjects();


function onchange() {
    currentdt = new Date($("#datepicker").val());
    setWeek(currentdt);
}

function setWeek(selectedDate) {
    var curr = selectedDate == undefined ? new Date : selectedDate;
    var Monday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
    var Tuesday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 2));
    var Wednesday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 3));
    var Thursday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 4));
    var Friday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 5));
    var Saturday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    var Sunday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));

    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    $("#MonDate").html(MONTH_NAMES[Monday.getMonth()] + " " + Monday.getDate());
    $("#TueDate").html(MONTH_NAMES[Tuesday.getMonth()] + " " + Tuesday.getDate());
    $("#WedDate").html(MONTH_NAMES[Wednesday.getMonth()] + " " + Wednesday.getDate());
    $("#ThuDate").html(MONTH_NAMES[Thursday.getMonth()] + " " + Thursday.getDate());
    $("#FriDate").html(MONTH_NAMES[Friday.getMonth()] + " " + Friday.getDate());
    $("#SatDate").html(MONTH_NAMES[Saturday.getMonth()] + " " + Saturday.getDate());
    $("#SunDate").html(MONTH_NAMES[Sunday.getMonth()] + " " + Sunday.getDate());

    $("#selectedWeek").html(MONTH_NAMES[Monday.getMonth()] + "-" + Monday.getDate() + "-" + Monday.getFullYear() + " to " +
        MONTH_NAMES[Sunday.getMonth()] + "-" + Sunday.getDate() + "-" + Sunday.getFullYear()
    );
}

function UpdateWeek(val) {
    var newDt = new Date(currentdt);
    newDt.setDate(newDt.getDate() + val);
    currentdt = new Date(newDt);
    setWeek(newDt);
}

function getProjects() {
    $(".user_name").html(user[0]);
    $("#imgloader").show();

    $.ajax(apiURL + "/getprojects/" + user[1], {
        type: "GET",
        contentType: "application/json",
    }).done(function (projects) {
        var projectOptions = '<option value="0">Select Project</option>';
        for (var i = 0; i < projects.length; i++) {
            projectOptions += '<option value="' + projects[i].Id + '">' + projects[i].Name + '</option>';
        }

        $('#projects').html(projectOptions);
        $("#imgloader").hide();

    }).fail(function (xhr, status, error) {
        $("#imgloader").hide();
        alert("Could not reach the API: " + error);
    });

}

$(document).on('change', '#projects', function () {
    $("#imgloader").show();
    $.ajax(apiURL + "/gettasks", {
        type: "GET",
        data: { projectId: this.value },
        contentType: "application/json",
    }).done(function (tasks) {
        $("#imgloader").hide();
        var taskOptions = '<option value="0">Select Task</option>';
        for (var i = 0; i < tasks.length; i++) {
            taskOptions += '<option value="' + tasks[i].Id + '">' + tasks[i].Name + '</option>';
        }

        $('#tasks').html(taskOptions);

    }).fail(function (xhr, status, error) {
        $("#imgloader").hide();
        alert("Could not reach the API: " + error);
    });
});


$(document).on('click', '.delete', function () {
    $(this).parent().parent().remove();
    CalculateTotal();
});

var counter = 1;
$(document).on('click', '#addRow', function () {
    event.preventDefault();

    if ($("#projects").val() == "0" || $("#tasks option:selected").val() == "0" || $("#tasks option:selected").val() == null) {
        alert("Please select Project and its task !!!");
        return;
    }

    var rec = projectTask.filter(function (el) {
        return el.projectId == $("#projects option:selected").val() &&
            el.taskId == $("#tasks option:selected").val();
    });
    if (rec.length == 0)
        projectTask.push({ projectId: $("#projects option:selected").val(), taskId: $("#tasks option:selected").val() });
    else {
        alert("error in adding new project and task, as they are already exists !!! ");
        return;
    }

    var newRow = $('<tr>\
                    <td><a href="#" class="delete" >X</a></td>\
                    <td><span class="ProjectCntr' + counter + '">' + $("#projects option:selected").text() + '</span>\
                    <input type="hidden" class="ProjectIdCntr' + counter + '" value="' + $("#projects option:selected").val() + '"/></td >\
                    <td><span class="TaskCntr' + counter + '">' + $("#tasks option:selected").text() + '</span>\
                    <input type="hidden" class="TaskIdCntr' + counter + '" value="' + $("#tasks option:selected").val() + '"/></td >\
                    <td><input type="text" onkeyup="CalculateTotal();" class="value Mon rowCntr' + counter + '" value="' + defaultValue + '"></td>\
                    <td><input type="text" onkeyup="CalculateTotal();" class="value Tue rowCntr' + counter + '" value="' + defaultValue + '"></td>\
                    <td><input type="text" onkeyup="CalculateTotal();" class="value Wed rowCntr' + counter + '" value="' + defaultValue + '"></td>\
                    <td><input type="text" onkeyup="CalculateTotal();" class="value Thu rowCntr' + counter + '" value="' + defaultValue + '"></td>\
                    <td><input type="text" onkeyup="CalculateTotal();" class="value Fri rowCntr' + counter + '" value="' + defaultValue + '"></td>\
                    <td><input type="text" onkeyup="CalculateTotal();" class="value weekend Sat rowCntr' + counter + '" value="' + defaultValue + '"></td>\
                    <td><input type="text" onkeyup="CalculateTotal();" class="value weekend Sun rowCntr' + counter + '" value="' + defaultValue + '"></td>\
                    <td><strong><span class="value RowTotal' + counter + '">0</span></strong></td>\
                    <td><span class="value CommentsCntr' + counter + '">comments</span></td>\
                </tr>');
    counter++;
    $('#tblweek').append(newRow);
    CalculateTotal();

});


function CalculateTotal() {
    var sumR = 0;
    var tot = 0;

    ColumnTotal("Mon");
    ColumnTotal("Tue");
    ColumnTotal("Wed");
    ColumnTotal("Thu");
    ColumnTotal("Fri");
    ColumnTotal("Sat");
    ColumnTotal("Sun");

    for (var i = 1; i <= counter; i++) {
        sumR = 0;
        $('.rowCntr' + i).each(function () {
            sumR += parseInt($(this).val())
        });
        if (sumR > 0) {
            $(".RowTotal" + i).text(sumR);
            tot += sumR;
        }
    }

    $("#TOT").text(tot);


}

function ColumnTotal(day) {
    var sumC = 0;
    $('.value.' + day).each(function () {
        sumC += parseFloat($(this).val())
    });
    if (sumC > 0)
        $("#" + day + "Total").text(sumC);
}

$(document).on('click', '.save', function () {
    $("#imgloader").show();
    projectDetails = [];
    createJson();
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: apiURL + "/SaveTimeSheet",
        data: JSON.stringify(projectDetails),
        dataType: "json",
        success: function (result) {
            $("#imgloader").hide();
            alert("Data Saved Successfully");
        },
        error: function (jqXHR, exception) {
            alert(exception);
            alert("Could not reach the API: " + error);

        }
    });
    $("#imgloader").hide();

});

$(document).on('click', '#btnSubmit', function () {
    $("#imgloader").show();
    projectDetails = [];
    createJson();
    projectDetails.forEach(function (element) {
        element.IsSubmitted = true;
    });
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: apiURL + "/SubmitTimeSheet",
        data: JSON.stringify(projectDetails),
        dataType: "json",
        success: function (result) {
            $("#imgloader").hide();
            alert("Data Saved Successfully");
        },
        error: function (jqXHR, exception) {
            alert(exception);
            alert("Could not reach the API: " + error);

        }
    });

    $("#imgloader").hide();
});

function createJson() {

    dates = [$("#MonDate").html() + ', 2018',
    $("#TueDate").html() + ', 2018',
    $("#WedDate").html() + ', 2018',
    $("#ThuDate").html() + ', 2018',
    $("#FriDate").html() + ', 2018',
    $("#SatDate").html() + ', 2018',
    $("#SunDate").html() + ', 2018'];


    for (var i = 1; i < counter; i++) {
        var pd = {
            UserId: parseInt(user[1]),
            ProjectId: parseInt($(".ProjectIdCntr" + i).val()),
            TaskId: parseInt($(".TaskIdCntr" + i).val()),
            FillDates: dates,
            DatesHrs: []
        }

        var inputs = $('.rowCntr' + i);
        for (var datesCntr = 0; datesCntr < dates.length; datesCntr++) {
            pd.DatesHrs.push(parseInt($(inputs[datesCntr]).val()));
        }

        projectDetails.push(pd);
    }
}