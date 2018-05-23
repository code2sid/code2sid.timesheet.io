window.apiURL = 'http://localhost:50792/api/timesheet';
function getSavedTimesheets() {
    $("#imgloader").show();


    $.ajax({
        type: "GET",
        url: apiURL + "/GetSavedTimeSheets/",
        contentType: 'application/json',
        data: { isSubmitted: false, UserId: parseInt(user[1]) },
        dataType: "json",
        success: function (result) {
            if (result) {
                alert("TimeSheet(s) Submitted Successfully");
                $(".removeRow").remove();
            }
        },
        error: function (jqXHR, exception) {
            alert("Could not reach the API: " + error);

        }
    });

     $.ajax(apiURL + "/GetSavedTimeSheets/", {
        type: "GET",
        data: JSON.stringify({ isSubmitted: false, UserId: parseInt(user[1]) }),
        contentType: "application/json",
    }).done(function (savedTimesheets) {
        $(".removeRow").remove();
        var counter = 1;
        var results = '';
        for (var i = 0; i < savedTimesheets.length; i++) {
            results = '<tr class="removeRow">\
                            <td><input type="checkbox" class="chkRow" data-id=' + savedTimesheets[i].TimeSheetId + ' /></td>\
                            <td><span>' + savedTimesheets[i].WeekRange + '</span></td>\
                            <td><span>' + savedTimesheets[i].TotalHours + ' Hours</span></td>\
                            <td><span>' + savedTimesheets[i].UserName + '</span></td>\
                            <td><span>' + savedTimesheets[i].Status + '</span></td>\
                        </tr >';
            $("#tblresults").append(results);
            counter++;
        }

        $("#imgloader").hide();

    }).fail(function (xhr, status, error) {
        $("#imgloader").hide();
        alert("Could not reach the API: " + error);
    });
}

$(document).on('click', '#chkAll', function () {
    $(".chkRow").prop('checked', $(this).prop('checked'));
});

$(document).on('click', '#btnSubmit', function () {

    var tsIds = [];
    $(".chkRow:checkbox:checked").each(function () {
        tsIds.push(parseInt($(this).attr("data-id")));
    });
    $("#imgloader").show();
    var actiontype = "BulkSubmitTimeSheets";
    var approvalURL = "{0}/{1}?actionType={3}"
    approvalURL = approvalURL.replace("{0}", apiURL).replace("{1}", actiontype).replace("{2}", JSON.stringify(tsIds)).replace("{3}", actiontype);

    $.ajax({
        type: "POST",
        url: approvalURL,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(tsIds),
        dataType: "json",
        success: function (result) {
            if (result) {
                alert("TimeSheet(s) Submitted Successfully");
                $(".removeRow").remove();
                getSavedTimesheets();
            }
        },
        error: function (jqXHR, exception) {
            alert("Could not reach the API: " + error);

        }
    });

    $("#imgloader").hide();
});