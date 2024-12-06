const allOrderState = (data) => {
    const currentDate = new Date().toLocaleString("en-US");

    // Utworzenie obiektu, który zbiera wszystkie produkty i ich ilości
    const productSummary = data.reduce((acc, order) => {
        order.orderDetails.forEach(product => {
            if (acc[product.productName]) {
                acc[product.productName].quantity += product.quantity;
                acc[product.productName].totalPrice += product.price * product.quantity;
            } else {
                acc[product.productName] = {
                    quantity: product.quantity,
                    totalPrice: product.price * product.quantity,
                };
            }
        });
        return acc;
    }, {});

    // Obliczanie średniej ceny
    const totalPrice = data.reduce((sum, order) => {
        return sum + order.orderDetails.reduce((orderSum, product) => orderSum + product.price * product.quantity, 0);
    }, 0);

    const totalProductsCount = data.reduce((count, order) => count + order.orderDetails.reduce((orderCount, product) => orderCount + product.quantity, 0), 0);

    const averagePrice = totalProductsCount ? (totalPrice / totalProductsCount).toFixed(2) : '0.00';

    return (`
    <html>
        <head>
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                h1 {
                    text-align: center;
                }
                .order-header {
                    margin-bottom: 20px;
                }
                .order-details {
                    margin-top: 20px;
                }
                .summary {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #ddd;
                }
            </style>
        </head>
        <body>
            <h1>Orders Report, ${currentDate}</h1>

            ${data.map(order => `
                <div class="order-header">
                    <h2>Order ID: ${order.ordersHeaderId}</h2>
                    <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                    <p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleString()}</p>
                    <p><strong>Destination Address:</strong> ${order.destinationAddress}</p>
                    <p><strong>Status:</strong> Status ${order.statusName}</p>
                </div>

                <div class="order-details">
                    <h3>Order Details</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.orderDetails.map(product => `
                                <tr>
                                    <td>${product.productName}</td>
                                    <td>${product.quantity}</td>
                                    <td>${product.price}</td>
                                    <td>${product.price * product.quantity}</td>
                                    <td>${product.done ? 'Completed' : 'Pending'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}

            <div class="summary">
                <h3>Product Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Total Quantity</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(productSummary).map(([productName, { quantity, totalPrice }]) => `
                            <tr>
                                <td>${productName}</td>
                                <td>${quantity}</td>
                                <td>${totalPrice.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p><strong>Average Price per Product:</strong> ${averagePrice}</p>
            </div>

        </body>
    </html>
    `);
};

export default allOrderState;
