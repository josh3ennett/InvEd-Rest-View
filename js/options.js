// Saves options to localStorage.
function save_options() {

    localStorage["private-key"] = document.getElementById("private-key").value;
    localStorage["public-key"] = document.getElementById("public-key").value;
    localStorage["user-key"] = document.getElementById("user-key").value;
    localStorage["user-name"] = document.getElementById("user-name").value;
    localStorage["base-url"] = document.getElementById("base-url").value;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    document.getElementById("save").setAttribute("class", "btn btn-success");
    status.innerHTML = "Options Saved. Close your browser and re-open";
}

// Restores select box state to saved value from localStorage.
function restore_options() {

    document.getElementById("private-key").value = exists(localStorage["private-key"]) ? localStorage["private-key"] : "";
    document.getElementById("public-key").value = exists(localStorage["public-key"]) ? localStorage["public-key"] : "";
    document.getElementById("user-key").value = exists(localStorage["user-key"]) ? localStorage["user-key"] : "";
    document.getElementById("user-name").value = exists(localStorage["user-name"]) ? localStorage["user-name"] : "";
    document.getElementById("base-url").value = exists(localStorage["base-url"]) ? localStorage["base-url"] : "";

}

function exists(object){
    return typeof object !== "undefined" && object !== null;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);