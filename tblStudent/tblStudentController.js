const {add, deleteItem, updateItem, showallItem} = require('./tblStudentServices')

function studentCruds(app, con){
    app.get('/students/delete/:studentId', (req, res) => {
        const studentId = req.params.studentId;
        deleteItem(studentId, con)
        res.send(`Record with Id: ${studentId} deleted successfully.`);
    });

    app.post('/students/create', (req, res) => {
        var data = req.body;
        var studentName = data.studentName;
        var sreamOfEduc = data.sreamOfEduc; 
        var joiningDate = data.joiningDate;
        add(studentName, sreamOfEduc, joiningDate, con)
        console.log(req.body)
        res.send(`Record inserted with studentName: ${studentName}`);
    });

    app.get('/students/update/:studentId/:sreamOfEduc', (req, res) => {
        const { studentId, sreamOfEduc } = req.params;
        updateItem(studentId, sreamOfEduc, con, (err, result) => {
            if (err) {
                res.status(500).send('Error updating record');
                return;
            }
            res.send(`Record with Id: ${studentId} updated successfully.`);
        });
    });

    app.get('/students/showall', (req, res) => {
        showallItem(con, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    console.log("Successfully showed all records.")
    });
}

module.exports = {studentCruds}