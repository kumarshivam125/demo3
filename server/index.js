const axios = require('axios');
const express = require('express');
const app = express();
const PORT = 4000;
const https = require('https');

// If using Express.js
// const cors = require('cors');
// app.use(cors({
//   origin: '*', 
//   credentials: true
// }));

const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');

app.use(express.json());

const agent = new https.Agent({
    rejectUnauthorized: false
});

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // path to your downloaded key
const { auth } = require('./middleware/auth');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
let arr = [];
async function getProducts() {
    try {
        const inventory = [];
        const querySnapshot = await db.collection('inventory').get();
        for (let doc of querySnapshot.docs) {
            // console.log(doc.id,"->",doc.data());
            inventory.push({ ...doc.data() });
        }
        const response = await axios.get('https://fakestoreapi.com/products', { httpsAgent: agent });
        arr = response.data.map(x => ({ ...x, qty: 0, color: 0, count: Number(inventory?.find(y => y.id == x.id)?.count) }));
    }
    catch (error) {
        console.error('Error fetching products:', error.message);
    }
}
app.get('/getData', async (req, resp) => {
    await getProducts();
    return resp.status(200).json(arr)
})


app.post('/checkout', auth, async (req, resp) => {
    const { cart, docId, originalTotal, discountedTotal } = req.body;
    // console.log("IN checkout-",req.body)
    const { email } = req.user.email;
    // console.log("IN backend--",cart);
    //id,qty,color,status-->pending

    const today = new Date();
    const day = String(today.getDate());
    const month = String(today.getMonth() + 1); // Get month (0-based)
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    // console.log("Cart-", cart)

    let orderCart = cart.map(x => ({ id: x.id, color: x.color, qty: x.qty, status: 'Pending', discountedPrice: x.discountedPrice }));
    // orderCart = JSON.stringify(orderCart);
    db.collection('orders').add({ orderDate: formattedDate, products: orderCart, userId: docId, originalTotal, discountedTotal })
        .then(docRef => {
            console.log('Document written with ID:', docRef.id)
        })
        .catch(error => console.error('Error adding document:', error));

    async function demo() {
        try {
            const querySnapshot = await db.collection('users').get();
            for (const doc of querySnapshot.docs) {
                if (doc.id === docId) {
                    await doc.ref.update({ cart: [] });
                    break;
                }
            }
        }
        catch (error) {
            console.error('Error getting documents:', error);
        }
    }
    await demo();
    return resp.json({
        success: true,
        message: "Order Placed Successfully..",
    })
})

app.post('/signup', async (req, resp) => {
    // console.log("API CALLED-",req.body);
    const { name, email, password, role } = req.body;
    async function demo() {
        try {
            const querySnapshot = await db.collection('users').get();
            for (const doc of querySnapshot.docs) {
                if (doc.data().email === email) return true;
            }
        }
        catch (error) {
            console.error('Error getting documents:', error);
        }
        return false;
    }
    const result = await demo();
    if (result == true) {
        return resp.json({
            success: false,
            message: "Email Already Exist"
        })
    }
    db.collection('users').add({ name, email, password, cart: [], role })
        .then(docRef => {
            console.log('Document written with ID:', docRef.id)
        })
        .catch(error => console.error('Error adding document:', error));

    return resp.json({
        success: true,
        message: "Account Created Successfully",
    })
})


app.post('/login', async (req, resp) => {
    // console.log("LOGIN API Working---")
    const { email, password } = req.body;
    let flg1 = 0, flg2 = 0;
    let user;
    let docId;
    async function demo() {
        try {
            const querySnapshot = await db.collection('users').get();
            for (const doc of querySnapshot.docs) {
                console.log("Doc ID-", doc.id)
                if (doc.data().email === email) {
                    flg1 = 1;
                    if (doc.data().password == password) flg2 = 1;
                    user = doc.data();
                    docId = doc.id;
                }
                // console.log(doc.id, '=>', doc.data());
            }
        }
        catch (error) {
            console.error('Error getting documents:', error);
        }
    }
    const result = await demo();
    if (flg1 == 0) {
        return resp.json({
            success: false,
            message: "You are Not Registered With Us"
        })
    }
    if (flg2 == 0) {
        return resp.json({
            success: false,
            message: "Password is Wrong"
        })
    }
    const data = jwt.sign(user, "HELLO", { expiresIn: '1d' });
    return resp.json({
        success: true,
        message: "Logged In Successfully",
        user,
        token: data,
        docId: docId
    })
})

app.get('/getInventoryData', async (req, resp) => {
    const inventory = [];
    const querySnapshot = await db.collection('inventory').get();
    for (let doc of querySnapshot.docs) {
        // console.log(doc.id,"->",doc.data());
        inventory.push({ ...doc.data() });
    }
    return resp.json({
        succes: true,
        message: "Full Inventory Fetched",
        inventory
    })
})
app.post('/updateInventoryData', async (req, resp) => {
    const { id, count } = req.body;
    // console.log("R-",req.body)
    const querySnapshot = await db.collection('inventory').get();
    for (let doc of querySnapshot.docs) {
        if (doc.data().id == id) {
            await doc.ref.update({ count: Number(count) });
            break;
        }
    }
    return resp.json({
        succes: true,
        message: "Inventory Updated",
    })
})

app.post('/updateCart', auth, async (req, resp) => {
    const email = req.user.email;
    const { data } = req.body;
    const obj = data.map(x => JSON.stringify(x));
    async function demo() {
        try {
            const querySnapshot = await db.collection('users').get();
            for (const doc of querySnapshot.docs) {
                if (doc.data().email === email) {
                    await doc.ref.update({ cart: obj });
                    break;
                }
            }
        }
        catch (error) {
            console.error('Error getting documents:', error);
        }
    }
    await demo();
    return resp.json({
        succes: true,
        msg: "Cart Updated"
    })
})
app.get('/getAllorders/:id', async (req, resp) => {
    console.log("Started--getAllOrdes");
    let orders = [];
    async function demo() {
        try {
            const querySnapshot = await db.collection('orders').get();
            for (const doc of querySnapshot.docs) {
                if (doc.data().userId === req.params.id) {
                    const newOrder = doc.data().products;
                    orders = [...orders,
                    {
                        orderId: doc.id,
                        date: doc.data().orderDate, order: newOrder,
                        discountedTotal: doc.data().discountedTotal,
                        originalTotal: doc.data().originalTotal
                    }
                    ];
                }
            }
        }
        catch (error) {
            console.error('Error getting documents:', error);
        }

    }
    const result = await demo();
    return resp.json({
        success: true,
        message: "All orders Fetched",
        orders
    })
})

app.get('/getOrderDetails', async (req, resp) => {
    let orders = [];
    async function demo() {
        try {
            const querySnapshot = await db.collection('orders').get();
            for (const doc of querySnapshot.docs) {
                const newOrder = doc.data().products;
                orders = [...orders, { orderId: doc.id, date: doc.data().orderDate, userId: doc.data().userId, order: newOrder }];
            }
        }
        catch (error) {
            console.error('Error getting documents:', error);
        }
    }
    const result = await demo();
    return resp.json({
        success: true,
        message: "All orders Fetched",
        orders
    })
})

app.post('/changeStatus', async (req, resp) => {
    const { id, docId, userId } = req.body;
    async function demo() {
        try {
            const querySnapshot = await db.collection('orders').get();
            for (const doc of querySnapshot.docs) {
                if (doc.id === docId) {
                    const newDoc = doc.data().products;
                    let doc1 = newDoc.map(x => x.id == id ? { ...x, status: 'Delivered' } : { ...x });
                    console.log("After -", doc1)
                    // doc1=doc1.map(x=>JSON.stringify(x));
                    await doc.ref.update({ products: doc1 });
                    break;
                }
            }


        }
        catch (error) {
            console.error('Error getting documents:', error);
        }
    }
    const result = await demo();
    db.collection('notifications').add({
        createdAt: Date.now(), creator: 'admin',
        reason: 'Order Delivered-'+docId+'-'+id, reciverId: [{id:userId,isRead:false}]
    }).then(docRef => console.log('Document written IN Notification with ID:', docRef.id))
        .catch(error => console.error('Error adding document:', error));


    return resp.json({
        success: true,
        message: "Status Changed",
    })
})

app.post('/giveRating', (req, resp) => {
    const { rating, review, productId, userId } = req.body;
    // console.log(req.body)
    db.collection('rating-and-review').add({ rating, review, productId, userId })
        .then(docRef => {
            console.log('Document written In Rating and Review-', docRef.id)
        })
        .catch(error => console.error('Error adding document:', error));
    return resp.json({
        success: true,
        message: "Product Successfully Rated"
    })
})

app.get('/getAllRatings', async (req, resp) => {
    let ratings = [];
    async function demo() {
        try {
            const querySnapshot = await db.collection('rating-and-review').get();
            for (const doc of querySnapshot.docs) {
                const newOrder = doc.data();
                ratings.push(newOrder);
            }
        }
        catch (error) {
            console.error('Error getting documents:', error);
        }

    }
    const result = await demo();
    return resp.json({
        success: true,
        message: "All Ratings Fetched",
        ratings
    })
})

app.post('/createCoupon', async (req, resp) => {
    const { coupon, amount } = req.body;
    let couponId;
    let reciverId = [];
    try {
        const querySnapshot = await db.collection('coupons').get();
        for (const doc of querySnapshot.docs) {
            // console.log("Doc ID-", doc.id)
            if (doc.data().coupon == coupon)
                return resp.json({
                    success: false,
                    message: "Coupon Already Exist"
                })
            // console.log(doc.id, '=>', doc.data());
        }
        await db.collection('coupons').add({ coupon, amount })
            .then(docRef => {
                couponId = docRef.id
                console.log('Coupon Document written with ID:', docRef.id)
            })
            .catch(error => console.error('Error adding Coupon document:', error));

        const querySnapshot1 = await db.collection('users').get();
        for (const doc of querySnapshot1.docs) {
            if (doc.data().role != 'Admin')
                reciverId.push({ isRead: false, id: doc.id });
        }

        db.collection('notifications').add({
            createdAt: Date.now(), creator: 'admin',
            reason: 'New Coupon-' + couponId, reciverId: reciverId
        })
            .then(docRef => console.log('Document written IN Notification with ID:', docRef.id))
            .catch(error => console.error('Error adding document:', error));

        return resp.json({
            success: true,
            message: "Coupon Created Successfully"
        })
    }
    catch (error) {
        console.error('Error getting documents:', error);
    }
})

// app.post('/')

app.get('/getUserNotifications', async (req, resp) => {
    let notifications = [];
    const querySnapshot = await db.collection('notifications').get();
    for (const doc of querySnapshot.docs) {
        if (doc.data().creator == 'admin')
            notifications.push(doc.data());
    }
    return resp.json({
        success: true,
        message: "All Notifications fetched",
        notifications
    })
})

app.get('/getSingleCoupon/:id', async (req, resp) => {
    let obj;
    const querySnapshot = await db.collection('coupons').get();
    for (const doc of querySnapshot.docs) {
        if (doc.id == req.params.id)
            obj = doc.data();
    }
    return resp.json({
        success: true,
        message: "Coupon",
        obj,
    })
})

app.get('/getCoupons', async (req, resp) => {
    // console.log("BACKEB API--")
    const coupons = [];
    const querySnapshot = await db.collection('coupons').get();
    for (const doc of querySnapshot.docs) {
        const newObj = { ...doc.data(), docId: doc.id }
        coupons.push(newObj)
    }
    return resp.json({
        success: true,
        message: "All Coupons",
        coupons,
    })
})

app.post('/updateReadStatus', async (req, resp) => {
    const { userId, createdAt } = req.body;
    console.log(req.body)
    let arr = [];
    const querySnapshot = await db.collection('notifications').get();
    for (const doc of querySnapshot.docs) {
        if (doc.data().createdAt == createdAt) {
            for (let obj of doc.data().reciverId) {
                if (obj.id == userId) arr.push({ ...obj, isRead: true });
                else arr.push(obj);
            }
        }
    }
    // console.log("ARR-", arr)
    for (const doc of querySnapshot.docs) {
        if (doc.data().createdAt == createdAt) {
            await doc.ref.update({ reciverId: arr });
            break;
        }
    }
    return resp.json({
        success: true,
        msg: 'Status Changed',
    })
})


app.delete('/deleteCoupon/:id', async (req, resp) => {
    // console.log("BACKEB API--")
    const id = req.params.id;
    console.log("Id-", id)
    db.collection('coupons').doc(id).delete()
        .then(() => {
            console.log('Coupon successfully deleted!');
        })
        .catch(error => console.error('Error deleting coupon:', error));

    return resp.json({
        success: true,
        message: "All Coupons",
    })
})

// Invoice HTML template
const generateInvoiceHTML = (orderData) => {
    // console.log("IN HTML -", orderData)
    const {
        orderId,
        customerName,
        customerEmail,
        customerAddress,
        orderDate,
        items = [],
        subtotal,
        discount,
        shipping,
        total
    } = orderData;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice ${orderId}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #007bff;
                padding-bottom: 20px;
            }
            .company-name {
                font-size: 28px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 5px;
            }
            .invoice-title {
                font-size: 24px;
                color: #666;
            }
            .invoice-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
            }
            .customer-info, .order-info {
                width: 48%;
            }
            .info-label {
                font-weight: bold;
                color: #007bff;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .info-content {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #007bff;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            .items-table th {
                background: #007bff;
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: bold;
            }
            .items-table td {
                padding: 10px 12px;
                border-bottom: 1px solid #ddd;
            }
            .items-table tr:nth-child(even) {
                background: #f8f9fa;
            }
            .totals {
                float: right;
                width: 300px;
                margin-top: 20px;
            }
            .total-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .total-row.final {
                font-weight: bold;
                font-size: 18px;
                color: #007bff;
                border-bottom: 2px solid #007bff;
                margin-top: 10px;
            }
            .footer {
                text-align: center;
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company-name">Amazon</div>
            <div class="invoice-title">INVOICE</div>
        </div>

        <div class="invoice-info">
            <div class="customer-info">
                <div class="info-label">Bill To:</div>
                <div class="info-content">
                    <strong>${customerName}</strong><br>
                    <strong>Email- </strong>${customerEmail}<br>
                    <strong>Address-</strong> ${customerAddress}
                </div>
            </div>
            <div class="order-info">
                <div class="info-label">Invoice Details:</div>
                <div class="info-content">
                    <strong>Invoice #:</strong> ${orderId}<br>
                    <strong>Date:</strong> ${orderDate}<br>
                    <strong>Status:</strong> Paid
                </div>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price.toFixed(2)}</td>
                        <td>₹${item.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Discount:</span>
                <span>-₹${discount.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Shipping:</span>
                <span>₹${shipping.toFixed(2)}</span>
            </div>
            <div class="total-row final">
                <span>Total:</span>
                <span>₹${total.toFixed(2)}</span>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>For questions about this invoice, contact support@yourcompany.com</p>
        </div>
    </body>
    </html>
  `;
};

// API endpoint to generate and return PDF
app.post('/generate-invoice', async (req, res) => {
    console.log("Staretd Backend API__ ")
    try {
        const orderData = req.body;
        // Validate required fields
        if (!orderData.orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        // Generate HTML content
        const htmlContent = generateInvoiceHTML(orderData);

        // Launch puppeteer and generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice_${orderData.orderId}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);

    }
    catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({
            error: 'Failed to generate invoice',
            details: error.message
        });
    }
});

app.get('/demo', (req, resp) => {
    return resp.json({
        msg: 'Hello'
    })
})


app.listen(PORT, () => console.log("APP started ", PORT))

// what is progaurd ? and how to USE/apply progaurd -
// How decompile works?
