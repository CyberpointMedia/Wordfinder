// dataTable
$(document).ready(function() {
    $('#example').DataTable();

});

// select all input in datatable
$(document).ready(function() {
    $(".selectAll").click(function() {
        $("table tr input:checkbox").prop('checked', $(this).prop('checked'));
    });

    $("table tr input:checkbox").change(function() {
        if (!$(this).prop("checked")) {
            $(".selectAll").prop("checked", false);
        }
    });
});

$(document).ready(function() {
    // show hide password
    $('.toggle-password').click(function() {
        $(this).toggleClass("show-password");
        var input = $("#password");
        input.attr('type') === 'password' ? input.attr('type', 'text') : input.attr('type', 'password')
    });

    // generate user password:
    $("#generate-pw").click(function() {
        $(this).next("#show-generate-pw").removeClass("hidden");
    });
    $("#cancelBtn").click(function() {
        $(this).parent("#show-generate-pw").addClass("hidden");
        $(".toggle-password").removeClass("show-password");
    });
});

// add profile picture
var loadFile = function(event) {

    var input = event.target;
    var file = input.files[0];
    var type = file.type;

    var output = document.getElementById('preview_img');


    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
};



// add title on add new page 
jQuery(function($) {
    $("#title").focusout(function() {
        var element = $(this);
        if (!element.text().replace(" ", "").length) {
            element.empty();
        }
    });
});

$("#title").keypress(function(event) {
    // if (event.which === 13) {
    //     performSearch();
    // }
    // alert("hello");
    $("#top-bttns").children("button").removeClass("cursor-not-allowed");
    $("#top-bttns").children("button").removeClass("opacity-25");
});


// featured image set in add new page start
const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Set featured image";
pictureImage.innerHTML = pictureImageTxt;

inputFile.addEventListener("change", function(e) {
    const inputTarget = e.target;
    const file = inputTarget.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function(e) {
            const readerTarget = e.target;

            const img = document.createElement("img");
            img.src = readerTarget.result;
            img.classList.add("picture__img");

            pictureImage.innerHTML = "";
            pictureImage.appendChild(img);
        });

        reader.readAsDataURL(file);
    } else {
        pictureImage.innerHTML = pictureImageTxt;
    }
});
// featured image set in add new page end

// datetimepicker calendar start 
flatpickr("#datetimePicker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    onClose: function(selectedDates, dateStr, instance) {
        // Close the calendar after selecting a date
        instance.close("#datetimePicker");
    },
    onChange: function(selectedDates, dateStr, instance) {
        // Update the text of the button with the chosen date
        document.getElementById("datetimePicker").innerText = dateStr;
    },
});
// datetimepicker calendar end


$(document).ready(function() {
    $('#mySelect').select2({
        width: '100%', // Adjust the width as needed
        placeholder: 'Select one or more options',
        allowClear: true, // Enable option to clear selection
        //multiple: true, // Enable multiple selection
    });
});