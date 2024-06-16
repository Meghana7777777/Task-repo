function repoAdd(studentName, sreamOfEduc, joiningDate, con){
    var sql = "INSERT INTO tblStudent (studentName, sreamOfEduc, joiningDate) VALUES (?, ?, ?)";
    con.query(sql, [studentName, sreamOfEduc, joiningDate], (err, result) => {
        if (err) {
            console.error("Error inserting record:", err);
            return;
        }
    });
}

function repoReadAll(con,callback){
    var sql = 'SELECT * FROM tblStudent';
    con.query(sql, (err, result) => {
        if (err) {
            console.log('Error retrieving items:', err);
            if(callback) callback(err);
            return;
        }
        if(callback) callback(null, result);
    });
}

function repoDelete(studentId, con){
    var sql = 'DELETE FROM tblStudent WHERE studentId = ?';
    con.query(sql,[studentId]);
}

function repoUpdate(studentId, sreamOfEduc, con, callback){
    const sql = "UPDATE tblStudent SET sreamOfEduc = ? WHERE studentId = ?";
    con.query(sql, [sreamOfEduc, studentId], (err, result) => {
        if (err) {
            console.error('Error updating record:', err);
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

module.exports = {repoAdd, repoReadAll, repoDelete, repoUpdate}
