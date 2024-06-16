function checkItemExists(ItemDesc, con, callback) {
    const checkQuery = 'SELECT * FROM tblItem WHERE ItemDesc = ?';
    con.query(checkQuery, [ItemDesc], callback);
}

function repoAdd(ItemDesc, UnitPrice, StockQty, con, callback) {
    const sql = "INSERT INTO tblItem (ItemDesc, UnitPrice, StockQty) VALUES (?, ?, ?)";
    con.query(sql, [ItemDesc, UnitPrice, StockQty], function (err, result) {
        if (err) {
            console.log('Error inserting item:', err);
            if (callback) callback(err);
            return;
        }
        console.log('1 row inserted.');
        if (callback) callback(null, result);
    });
}

function repoDelete(ItemId, con) {
    return new Promise((resolve, reject) => {
        var sql = 'DELETE FROM tblItem WHERE ItemId = ?';
        con.query(sql,[ItemId], (err, result) => {
            if (err) {
                reject (err);
            } else {
                resolve(result)
            }
        return;
        });
    })
}

function repoReadAll(con) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT * FROM tblItem';
        con.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function repoReadById(ItemId, con) {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT * FROM tblItem WHERE ItemId = ?';
        con.query(sql, [ItemId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function repoUpdate(ItemId, ItemDesc, con){
    const sql = "UPDATE tblItem SET ItemDesc = ? WHERE ItemId = ?";
    con.query(sql, [ItemDesc, ItemId], (err, result) => {
        if (err) throw err
        console.log('1 record updated.');
    });
}

module.exports = {checkItemExists, repoAdd, repoDelete, repoReadAll, repoReadById, repoUpdate}
