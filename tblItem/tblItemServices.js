const {repoAdd, checkItemExists, repoDelete, repoReadAll, repoReadById, repoUpdate} = require('./ItemRepository')

function add(ItemDesc, UnitPrice, StockQty, con, callback) {
    checkItemExists(ItemDesc, con, (checkErr, checkResult) => {
        if (checkErr) {
            console.log('Error checking for existing description:', checkErr);
            if (callback) callback('Error checking for existing description');
            return;
        }
        if (checkResult.length > 0) {
            console.log('Description already exists.');
            if (callback) callback('Description already exists');
            return;
        }
        // Proceed to insert item if it doesn't exist
        repoAdd(ItemDesc, UnitPrice, StockQty, con, callback);
    });
}

function deleteItem(ItemId, con){
    repoDelete(ItemId, con) ;
}

async function showallItem(con) {
    try {
        const result = await repoReadAll(con);
        console.log('All items:', result);
        return result;
    } catch (error) {
        console.error('Error fetching all items:', error);
        throw error;
    }
}

async function showAllById(con, ItemId) {
    try {
        const result = await repoReadById(ItemId, con);
        console.log('Successfully showed item by ID:', ItemId);
        return result;
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        throw error;
    }
}

function updateItem (ItemId, ItemDesc, con) {
    repoUpdate(ItemId, ItemDesc, con)
}

module.exports = {add, deleteItem, showallItem, showAllById, updateItem};

// , deleteItem, showallItem, showAllById, updateItem