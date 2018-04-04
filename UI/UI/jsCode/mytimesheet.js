﻿var apiURL = 'http://localhost:50792/api/timesheet';
var currentdt = new Date;

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

function getProjects(userId) {

    $.ajax(apiURL + "/getprojects", {
        type: "GET",
        data: userId,
        contentType: "application/json",
    }).done(function (projects) {
        var projectOptions = '<option value="0">Select Project</option>';
        for (var i = 0; i < projects.length; i++) {
            projectOptions += '<option value="' + projects[i].Id + '">' + projects[i].Name + '</option>';
        }

        $('#projects').html(projectOptions);

    }).fail(function (xhr, status, error) {
        alert("Could not reach the API: " + error);
    });

}

$(document).on('change', '#projects', function () {
    $.ajax(apiURL + "/gettasks", {
        type: "GET",
        data: { projectId: this.value },
        contentType: "application/json",
    }).done(function (tasks) {
        var taskOptions = '<option value="0">Select Task</option>';
        for (var i = 0; i < tasks.length; i++) {
            taskOptions += '<option value="' + tasks[i].Id + '">' + tasks[i].Name + '</option>';
        }

        $('#tasks').html(taskOptions);

    }).fail(function (xhr, status, error) {
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

    if ($("#projects").val() == "0" && ($("#tasks").val() == "0" || $("#tasks").val() == null)) {
        alert("Please select Project and its task");
        return;
    }

    var newRow = $('<tr>\
                    <td>' + $("#projects option:selected").text() + '</td>\
                    <td>' + $("#tasks option:selected").text() + '</td>\
                    <td><span class="value Mon rowCntr' + counter + '">8.00</span></td>\
                    <td><span class="value Tue rowCntr'+ counter + '">8.00</span></td>\
                    <td><span class="value Wed rowCntr' + counter + '">8.00</span></td>\
                    <td><span class="value Thu rowCntr' + counter + '"">8.00</span></td>\
                    <td><span class="value Fri rowCntr' + counter + '"">8.00</span></td>\
                    <td><span class="value weekend Sat rowCntr' + counter + '"">2.00</span></td>\
                    <td><span class="value weekend Sun rowCntr' + counter + '">2.00</span></td>\
                    <td><strong><span class="value RowTotal' + counter + '"></span></strong></td>\
                    <td><a href="#" class="delete" >X</a></td>\
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
            sumR += parseInt($(this).text())
        });
        $(".RowTotal" + i).text(sumR);
        tot += sumR;
    }

    $("#TOT").text(tot);


}

function ColumnTotal(day) {
    var sumC = 0;
    $('.value.' + day).each(function () {
        sumC += parseFloat($(this).text())
    });
    $("#" + day + "Total").text(sumC);
}