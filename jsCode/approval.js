var apiURL = 'http://localhost:50792/api/timesheet';
function getPendingApprovals() {
    $("#imgloader").show();

    var approvalURL = apiURL + "/GetPendingApprovals?from={0}&to={1}&includeApproved={2}";
    approvalURL = approvalURL.replace("{0}", $("#txtFrom").val()).replace("{1}", $("#txtTo").val()).replace("{2}", $("#chkIncApproved").prop('checked'));

    $.ajax(approvalURL, {
        type: "GET",
        contentType: "application/json",
    }).done(function (pendingApprovals) {
        $(".removeRow").remove();
        var counter = 1;
        var results = '';
        for (var i = 0; i < pendingApprovals.length; i++) {
            results = '<tr class="removeRow">\
                            <td><input type="checkbox" class="chkRow" data-id=' + pendingApprovals[i].TimeSheetId + ' /></td>\
                            <td><span>' + pendingApprovals[i].WeekRange + '</span></td>\
                            <td><span>' + pendingApprovals[i].TotalHours + ' Hours</span></td>\
                            <td><span>' + pendingApprovals[i].UserName + '</span></td>\
                            <td><span>' + pendingApprovals[i].Status + '</span></td>\
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
$(document).on('click', '#btnReset', function () {
    $("#txtFrom").val("");
    $("#txtTo").val("");
});

$(document).on('click', '#btnSearch', function () {
    getPendingApprovals();
});


$(document).on('click', '#chkAll', function () {
    $(".chkRow").prop('checked', $(this).prop('checked'));
});

$(document).on('click', '#btnApprove', function () {
    ApproveReject("ApproveTimeSheets");
});

$(document).on('click', '#btnReject', function () {
    ApproveReject("RejectTimeSheets");
});

function ApproveReject(actiontype) {
    var tsIds = [];
    $(".chkRow:checkbox:checked").each(function () {
        tsIds.push(parseInt($(this).attr("data-id")));
    });
    $("#imgloader").show();

    var approvalURL = "{0}/{1}?actionType={2}"
    approvalURL = approvalURL.replace("{0}", apiURL).replace("{1}", actiontype).replace("{2}", actiontype);

    $.ajax({
        type: "POST",
        url: approvalURL,
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(tsIds),
        dataType: "json",
        success: function (result) {
            if (result) {
                alert("TimeSheet Updated Successfully");
                $(".removeRow").remove();
                getPendingApprovals();
            }
        },
        error: function (jqXHR, exception) {
            alert("Could not reach the API: " + error);

        }
    });

    $("#imgloader").hide();
}