import express from "express";
import { promisify } from 'util';
import redis from 'redis'


const app = express();
const PORT = 1245;
app.use(express.json())


const listProducts = [
    { Id: 1, name: 'Suitcase 250', price: 50, stock: 4},
    { Id: 2, name: 'Suitcase 450', price: 100, stock: 10},
    { Id: 3, name: 'Suitcase 650', price: 350, stock: 2},
    { Id: 4, name: 'Suitcase 1050', price: 550, stock: 5}
];

function getItemById(Id) {
    // It will return the item from listProducts with the same id

    return listProducts.find(product => product.Id === parseInt(Id));
};

const client = redis.createClient();

client.on('error', (err) => {
    console.error('Redis client error:', err);
});

client.on('connect', () => {
    console.log('Redis client connected');
});

function reserveStockById(itemId, stock) {

    // It will set in Redis the stock for the key item.ITEM_ID
    client.set(itemId, stock);
};


// promisify the client in the function
// const promiseClient = promisify(client.get).bind(client);


async function getCurrentReservedStockById(itemId) {
    // It will return the reserved stock for a specific item

    return new Promise((resolve, reject)=> {

        client.get(itemId, (err, reply)=> {
            if (err){
                reject(err)
            }
            else {
                resolve(reply)
            }
        })

        

    })
};

app.get('/list_products', (req, res)=> {

    const products = listProducts.map(product => ({

        itemId: product.Id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock,
    }))
    res.json(products);
});

app.post('/list_products/:itemId', async (req, res)=> {

    try {
        const itemId = req.params.itemId;
        const product = getItemById(itemId);
    
        if (!product) {
            res.status(400).json({"status": "Product Not found"})
        }
    
        const currentAvailableStock = await getCurrentReservedStockById(itemId);
        const currentQuantity = product.stock - (currentAvailableStock || 0 )
    
        res.status(200).json({
            itemId: product.Id,
            itemName: product.name,
            price: product.price,
            initialAvailableQuantity: product.stock,
            currentQuantity: currentQuantity
        })
    } catch (error) {
        console.error(error)
    }
});

// reserve a stock route
app.get('/reserve_product/:itemId', async (req, res)=> {
    const itemId = req.params.itemId
    const product = getItemById(itemId);

    if (!product) {
        res.status(400).json({
            "status": "Product not found"
        });
    }
    try {
        const productStock = await getCurrentReservedStockById(itemId)
        const reservedStock = parseInt(productStock) || 0;

        const availableStock = product.stock - reservedStock

        if (availableStock <= 0) {
            return res.status(400).json({
                "status":"Not enough stock available",
                "itemId": product.Id
            })
        }

        const newReserveStock = reservedStock + 1
        reserveStockById(itemId, newReserveStock)
        
        return res.status(200).json({
            "status":"Reservation confirmed",
            "itemId": product.Id
            })
    } catch (error) {
        console.error(error)
    }
    
})


app.listen(PORT, (error)=> {
    if (!error) {
        console.log(`APP is running on port ${PORT}`)
    }
    else {
        console.log("Error occurred, server can't start", error)
    }
});
