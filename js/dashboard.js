// Tạo lớp chứa các thông tin danh mục 
class TableKanban {
    constructor(id,arr) {
        this.id = id,
        this.arr = arr
    }
}
let simpleKanban = [];
runProgram();
// Tạo hàm lưu trữ thông tin
function init(){
    if(getLocalStorage("Huu_Kanban") == null){
        simpleKanban = [new TableKanban("Công việc hiện tại", setListWork()),
        new TableKanban("Công việc đang làm", setListWork()) 
    ]

        saveLocalStorage("Huu_Kanban", simpleKanban);
    }
    else{
        simpleKanban = getLocalStorage("Huu_Kanban");
    }
}
// Hàm lấy thông tin từ Local Storage
function getLocalStorage(key){
    return JSON.parse(window.localStorage.getItem(key));
}
// Hàm lưu thông tin đến Local Storage
function saveLocalStorage(key, data){
    window.localStorage.setItem(key, JSON.stringify(data));
}
// Hàm tạo mảng list công việc trống
function setListWork() {
let todoListArr = [];
let doingListArr = [];
let doneListArr = [];
let totalArr = [todoListArr, doingListArr, doneListArr];
return totalArr;
}


// Hàm khởi tạo liên kết thẻ trên hàng quản lý bảng
function startProgram() {
    let listWork = document.getElementById("list-work");
    listWork.innerHTML = null;
    for (let i = 0; i < simpleKanban.length; i++) {
        listWork.innerHTML += `<option value="${simpleKanban[i].id}">${simpleKanban[i].id}</option>`;
        
    }

    document.getElementById("name_Kanban").value = listWork.value;
}
// // Hàm thêm danh mục mới
function addNewKanban() {
    let newKanban = document.getElementById("add-New-Kaban").value; 
    simpleKanban.unshift(new TableKanban(newKanban,setListWork()));
    // let index = findIndex(newKanban);
    // let listWork = document.getElementById("list-work");
    // listWork.innerHTML += `<option value="${simpleKanban[index].id}">${simpleKanban[index].id}</option>`;
    startProgram();
    document.getElementById("add-New-Kaban").value = "";
    showTotalList();
    saveLocalStorage("Huu_Kanban", simpleKanban);
}

// Hàm onchane bắt sự kiện thay đổi của thẻ select
function selectKanban() {
    let selectValue = document.getElementById("list-work").value;
    document.getElementById("name_Kanban").value = selectValue;
    for (let i = 0; i < 3; i++) {
        let tb = document.getElementById(`tb_wl_${i}`);
        tb.children[2].children[0].children[0].innerHTML = `<a href="javascript:;" onclick="addWork(${i})" id="add-work-${i}">+ Thêm công việc</a>`  
    }
    showTotalList();
    saveLocalStorage("Huu_Kanban", simpleKanban);

}
// //  Hàm update cập nhật thay đổi tên của bảng hiện tại
function updateList() {
    let thisValue = document.getElementById("name_Kanban").value;
    let listWork = document.getElementById("list-work").value;
    // let select = document.getElementById("list-work");
    let index = findIndex(listWork);
    if (thisValue == "") {
        alert('Bạn chưa nhập tên bảng');
    } else if (thisValue != listWork) { 
        let array = simpleKanban[index].arr;
        simpleKanban.splice(index,1);
        simpleKanban.unshift(new TableKanban(thisValue,array));
        // select.children[index].innerHTML = `<option value="${simpleKanban[index].id}">${simpleKanban[index].id}</option>`;
        startProgram();
        
    }
    saveLocalStorage("Huu_Kanban", simpleKanban);
}
// Hàm xóa list danh mục hiện tại
 function deleteThisKanban() {
    let as = confirm('Bạn có chắc chắn xóa bảng này không');
    if (as) {
    let thisValue = document.getElementById("name_Kanban").value;
    let index = findIndex(thisValue);;
        simpleKanban.splice(index, 1);
        startProgram();
    }
    if (simpleKanban.length == 0) {
        let listDefault = new TableKanban("Không gian làm việc", setListWork());
        simpleKanban.push(listDefault);
        startProgram();
    }
    showTotalList();
    saveLocalStorage("Huu_Kanban", simpleKanban);
 }
//  Hàm tìm kiếm chỉ số của danh mục
function findIndex(value) {
    return simpleKanban.findIndex(function(item, index){ 
        return item.id ==  value});
}

// Hàm hiển thị các list công việc
function showList(index) {
    let todoList = document.getElementById(`tb_wl_${index}`);
    todoList.children[1].innerHTML = "";
    simpleKanban[findIndexThisList()].arr[index].forEach(function (value, index1) {
        todoList.children[1].innerHTML += `
                                                        <tr id="tr_${index}_${index1}" >
                                                                    <td id ="td_${index}_${index1}" draggable="true" ondragstart="drag(event,${index},${index1})">
                                                                    <div id = "di_${index}_${index1}" onclick = "editWork(${index},${index1})" >${value}</div>
                                                                    </td> 
                                                        </tr>
        
                                                    `
    })
    saveLocalStorage("Huu_Kanban", simpleKanban);
}
// Hàm hiển thị tất cả các list công việc
function showTotalList() {
    showList(0);
    showList(1);
    showList(2);
}
// Hàm thêm công việc mới
function addWork(index) {
    let tb = document.getElementById(`tb_wl_${index}`);
    tb.children[2].children[0].children[0].innerHTML = `
                                            <td> 
                                            <input type='text' id="ip_${index}" placeholder="Thêm công việc" class = "tf-ip">
                                            <input type="button" value="Add" class="btn-edit-work" id="btn_add_${index}"
                                            onclick="addButton(${index})" align = "right"> 
                                            </td> 
                                            `
    
}
// Hàm thao tác onclick nút nhấn Add
function addButton(index) {
    let addWorkToArr = document.getElementById(`ip_${index}`).value;
    let tb = document.getElementById(`tb_wl_${index}`);
    if (addWorkToArr == "") {
        tb.children[2].children[0].children[0].innerHTML = `
                                            <td> 
                                            <a href="javascript:;" onclick="addWork(${index})" id="add-work-${index}">+ Thêm công việc</a>
                                            </td> 
                                            `
    } else {
        simpleKanban[findIndexThisList()].arr[index].push(addWorkToArr);
        document.getElementById(`ip_${index}`).value = "";
        let worklist = document.getElementById(`tb_wl_${index}`);
        worklist.children[1].innerHTML = "";
        tb.children[2].children[0].children[0].innerHTML = `
                                            <td> 
                                            <a href="javascript:;" onclick="addWork(${index})" id="add-work-${index}">+ Thêm công việc</a>
                                            </td> 
                                            `
        showTotalList();
    }
    saveLocalStorage("Huu_Kanban", simpleKanban);
}
// Hàm edit công việc
function editWork(index, index1) {
    let tb = document.getElementById(`tb_wl_${index}`);
    tb.children[1].children[index1].children[0].innerHTML = `<input type='text' id="pn_${index}_${index1}" value ='${simpleKanban[findIndexThisList()].arr[index][index1]}' class = "tf-ip">
                                                            <input type="button" value="Update" class="btn-update-work" onclick = "updateWork(${index},${index1})">
                                                            <input type="button" value="Remove" class="btn-remove-work" onclick = "removeWork(${index},${index1})">
                                                            `;
}
// Hàm update sau khi thay đổi tên công việc
function updateWork(index, index1) {
    let tb = document.getElementById(`tb_wl_${index}`);
    let td = tb.children[1].children[`${index1}`].children[0].children[0].value;
    if (td == "") {
        alert('Bạn chưa nhập tên công việc');
    } else {
        simpleKanban[findIndexThisList()].arr[index][index1] = td;
        let worklist = document.getElementById(`tb_wl_${index}`);
        worklist.children[1].innerHTML = "";
        saveLocalStorage("Huu_Kanban", simpleKanban);
        showTotalList();
    }

}
// Hàm remove xóa công việc ra khỏi list
function removeWork(index, index1) {
    let tb = document.getElementById(`tb_wl_${index}`);
    simpleKanban[findIndexThisList()].arr[index].splice(index1, 1)
    let worklist = document.getElementById(`tb_wl_${index}`);
    worklist.children[1].innerHTML = "";
    saveLocalStorage("Huu_Kanban", simpleKanban);
    showTotalList();
}
// Hàm khởi chạy chương trình
function runProgram() {
    init();
    startProgram()
    showTotalList();
}
// Hàm bắt sự kiện kéo 
function drag(ev,index, index1) {
    ev.dataTransfer.setData("td", ev.target.id);
    simpleKanban[findIndexThisList()].arr[index].splice(index1, 1);
}
// Hàm bắt sự kiện thả
function drop(ev,index) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("td");
    let value = document.getElementById(data).innerText;  
    simpleKanban[findIndexThisList()].arr[index].push(value);
    saveLocalStorage("Huu_Kanban", simpleKanban);
    showTotalList();
}
function allowDrop(ev) {
    ev.preventDefault();
}
function findIndexThisList() {
    let thisValue =  document.getElementById("list-work").value;
    let i = findIndex(thisValue);
    return i;
}
function selectColor() {
    let color = document.getElementById("color-backgroud").value;
    document.getElementsByClassName('container')[0].style.backgroundColor = color;
    for (let i = 0; i < 3; i++) {
        document.getElementsByTagName('th')[i].style.backgroundColor = color;
        
    }
    

}
