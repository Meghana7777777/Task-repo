const {repoAdd, repoReadAll, repoDelete, repoUpdate} = require('./studentRepository')

function add(studentName, sreamOfEduc, joiningDate, con){
    repoAdd(studentName, sreamOfEduc, joiningDate, con);
    console.log("1 Record inserted");
};

function deleteItem(studentId, con){
    repoDelete(studentId, con, (err, result) => {
        if (err) {
            console.log('Error deleting record:', err);
            return
        }
        console.log("1 Record deleted");
    });
}

function updateItem (studentId, sreamOfEduc, con, callback) {
    repoUpdate(studentId, sreamOfEduc, con, (err, result) => {
        if (err) {
            console.error('Error updating record:', err);
            callback(err, null);
            return;
        }
        console.log("1 Record updated");
        callback(null, result);
    });
}

function showallItem(con, callback){
    repoReadAll(con,callback)
}

module.exports = {add, deleteItem, updateItem, showallItem}