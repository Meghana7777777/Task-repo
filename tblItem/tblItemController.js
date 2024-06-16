const {add, deleteItem, showallItem, showAllById, updateItem} = require('./tblItemServices')

function itemCruds(app,con){
    // CREATE
    app.post('/Item/create', (req, res) => {
        const { ItemDesc, UnitPrice, StockQty } = req.body;
    if (!ItemDesc) {
        return res.status(400).json({ message: 'Description cannot be null' });
    }
        add(ItemDesc, UnitPrice, StockQty, con, (err, result) => {
            if (err) {
                if (err === 'Description already exists') {
                    return res.status(409).json({status:"true", message: 'Description already exists' });
                } else {
                    return res.status(500).json({status:"true", message: 'Error adding item' });
                }
            }
            return res.status(201).json({status:"true", message: 'Item added successfully', itemId: result.insertId });
        })
    });

    // DELETE
    app.get('/Item/delete/:ItemId', (req, res) => {
        const ItemId = req.params.ItemId;
        deleteItem(ItemId, con);
        res.send({status:"true" , message: `Record with Id: ${ItemId} deleted successfully.`});
        console.log('1 record deleted successfully.');
    });

    // READ ALL
    app.get('/Item/showall', (req, res) => {
        showallItem(con)
            .then(result => {
                res.status(200).json({ status: "true", message: "All records shown", data: result });
            })
            .catch(error => {
                console.error('Error fetching all items:', error);
                res.status(500).json({ status: "false", message: "Error fetching items" });
            });
    });

    // READ BY ID
    app.get('/Item/showall/:ItemId', async (req, res) => {
        const ItemId = req.params.ItemId;
        try {
            const result = await showAllById(con, ItemId);
            if (result.length === 0) {
                res.status(404).json({ status: "false", message: "Item not found" });
            } else {
                res.status(200).json({ status: "true", message: "Item found", data: result });
            }
        } catch (error) {
            console.error('Error fetching item by ID:', error);
            res.status(500).json({ status: "false", message: "Error fetching item by ID" });
        }
    });

    // UPDATE
    app.get('/Item/update/:ItemId/:ItemDesc', (req, res) => {
    const { ItemId, ItemDesc } = req.params;
        updateItem (ItemId, ItemDesc, con);
        res.send(`Updated record with ID: ${ItemId}`);
        console.log('1 record updated.');
    });
}

module.exports = {itemCruds};