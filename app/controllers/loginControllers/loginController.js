const { response } = require("express");

const formId = ["my-form", "my-form-changes-password"];
const modalId = "my-modal";
const preloadId = "preloadId";
const classEdit = "edit-input";
const textConfirm = "Press a button!\nEither OK or Cancel.";
const mainApp = new Main(modalId, formId, classEdit, preloadId);

/* */
const objFormLogin = mainApp.getForm(0);
const objFormLoginChanges = mainApp.getForm(1);
/* */

var url = "";
var method = "";
var data = "";
var resultFetch = null;

/* */

function add() {
    mainApp.enableFormAll(1);
    mainApp.resetForm(1);
    mainApp.hiddenMessageError();
    mainApp.showModal();
}

/* */

objFormLogin.addEventListener("submit", function (e) {
    e.preventDefault();
    if (mainApp.setValidateForm(0)) {
        data = mainApp.getDataFormJson(0);
        method = "POST";
        url = URL + URI_LOGIN;
        resultFetch = getData(data, method, url);
        resultFetch.then(response => {
            return response.json();            
        }).then(data => {
            console.log(data);
            if (data.status == 200) {
                mainApp.hiddenMessageError();
                mainApp.resetForm(0);
                mainApp.setLocationPage("../home/home_view.html")
            }

        }).catch(error => {
            mainApp.hiddenMessageError();
        }).finally(() => {
            mainApp.hiddenPreload();
            mainApp.hiddenMessageError();
        });
        mainApp.resetForm(0);        
    }
});

/* */
objFormLoginChanges.addEventListener('submit', function (e) {
    e.preventDefault();
    if (mainApp.setValidateForm(1)) {
        data = mainApp.getDataFormJson(1);
        method = 'PUT';
        url = URL + URI_LOGIN;
        resultFetch = getData(data, method, url);
        resultFetch.then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.status == 200) {
                mainApp.hiddenMessageError();
                mainApp.resetForm(1);
                mainApp.hiddenPreload();
            }
        }).catch(error => {
            mainApp.hiddenMessageError();
        }).finally(() => {
            mainApp.hiddenPreload();
            mainApp.hiddenMessageError();
            mainApp.hiddenModal();
        });
    }
});

 /* */
 async function getData(data, method, url) {
    var parameters;
    //Show Preload
    mainApp.showPreload();
    if (method == "GET") {
        parameters = {
            method: method,
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }
    } else {
        parameters = {
            method: method,
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }
        if (data != "") {
            parameters.body = JSON.stringify(data);
        }
    }
    return await fetch(url, parameters);
}

/* */


