
const data = JSON.parse(document.getElementById('data').innerHTML);

const renderData = Object.keys(data).map(key => {
    return `<tr>
        <td>${data[key].id}</td>
        <td>${data[key].id}</td>
        <td>${data[key].registration.id}</td>
        <td>${data[key].certificateNo}</td>
        <td>${data[key].interestRate}%</td>
        </tr>`;
}).join('');

// console.log(data);
// document.getElementById("dataTable").innerHTML = "test";

// document.querySelector("#dataTable").innerHTML = renderData;