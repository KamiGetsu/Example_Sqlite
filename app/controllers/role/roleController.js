const formId = 'my-form';
const modalId = 'my-modal';
const model = 'users';
const tableId = '#table-index';
const preloadId = 'preloadId';
const classEdit = 'edit-input';
const textConfirm = 'Press a button!\nEither OK or Cancel.';
const btnSubmit = document.getElementById('btnSubmit');
const mainApp = new Main(modalId, formId, classEdit, preloadId);
const myId = "Role_id";
google.charts.load("current", {packages:["corechart"]});

var insertUpdate = true;
var url = "";
var method = "";
var data = "";
var resultFetch = null;

window.addEventListener('load', (event) => {
    show();
});

function showId(id) {
    mainApp.disabledFormAll();
    mainApp.resetForm();
    btnEnabled(true);
    getDataId(id);
}

function show() {
    getUserRoles();
    getRoles();
}

function add() {
    mainApp.enableFormAll();
    mainApp.resetForm();
    insertUpdate = true;
    btnEnabled(false);
    mainApp.showModal();
}

function edit(id) {
    mainApp.disabledFormEdit();
    mainApp.resetForm();
    insertUpdate = false;
    btnEnabled(false);
    getDataId(id);
}

async function delete_(id) {
    if (confirm(textConfirm) == true) {
        method = 'DELETE';
        url = URL + URI_ROLE + id;
        data = "";
        resultFetch = getData(data, method, url);
        resultFetch.then(response => response.json())
        .then(data => {
            console.log(data);
            reloadPage();
            mainApp.hiddenPreload();
        })
        .catch(error => {
            console.error(error);
            mainApp.hiddenPreload();
        })
        .finally();
    } else {
    }
}

async function getDataId(id) {
    method = 'GET';
    url = URL + URI_ROLE + id;
    data = "";
    resultFetch = getData(data, method, url);
    resultFetch.then(response => response.json())
        .then(data => {
        mainApp.setDataFormJson(data);
        mainApp.showModal();
        mainApp.hiddenPreload();
        })
        .catch(error => {
        console.error(error);
        mainApp.hiddenPreload();
        })
        .finally();
}

async function getRoles() {
    method = 'GET';
    url = URL + URI_ROLE;
    data = mainApp.getDataFormJson();
    resultFetch = getData(data, method, url);
    resultFetch.then(response => response.json())
        .then(data => {
        mainApp.createTable(data, "tbody", true);
        refreshTable();
        mainApp.hiddenPreload();
        })
        .catch(err => {
        mainApp.hiddenPreload();
        })
        .finally();
}

async function getUserRoles() {
    method = 'GET';
    url = URL + URI_ROLE_USER;
    data = mainApp.getDataFormJson();
    resultFetch = getData(data, method, url);
    resultFetch.then(response => response.json())
        .then(data => {
        let getData=data;
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            let setData=[ ['Task', 'Hours per Day']];
            for(let i=0;i<getData.length;i++){
            let getValues=Object.values(getData[i]);
            setData.push([getValues[0],getValues[1]]);
            }
            var data = google.visualization.arrayToDataTable(setData);
            var options = {
            title: 'Application Roles vs Users',
            is3D: true,
            };
            var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
            chart.draw(data, options);
            mainApp.hiddenPreload();
        }
        })
        .catch(err => {
        mainApp.hiddenPreload();
        })
        .finally();
    }

function refreshTable() {
    $(tableId).DataTable();
}

function btnEnabled(type) {
    btnSubmit.disabled = type;
}

async function getData(data, method, url) {
    var parameters;
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

mainApp.getForm().addEventListener('submit', async function (event) {
    event.preventDefault();
    if (mainApp.setValidateForm()) {
        mainApp.showPreload();
        if (insertUpdate) {
        method = 'POST';
        url = URL + URI_ROLE;
        data = mainApp.getDataFormJson();
        resultFetch = getData(data, method, url);
        resultFetch.then(response => response.json())
            .then(data => {
            console.log(data);
            mainApp.hiddenModal();
            reloadPage();
            })
            .catch(error => {
            console.error(error);
            mainApp.hiddenPreload();
            })
            .finally();
        } else {
        method = 'PUT';
        data = mainApp.getDataFormJson();
        url = URL + URI_ROLE + data[myId];
        resultFetch = getData(data, method, url);
        resultFetch.then(response => response.json())
            .then(data => {
            mainApp.hiddenModal();
            reloadPage();
            })
            .catch(error => {
            console.error(error);
            mainApp.hiddenPreload();
            })
            .finally();
        }
    } else {
        alert("Data Validate");
        mainApp.resetForm();
    }
    });

    function reloadPage() {
    setTimeout(function () {
        mainApp.hiddenPreload();
        location.reload();
    }, 500);
}