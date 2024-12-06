
const allProductState = (data) => {

        const currentDate = new Date().toLocaleString("en-US");


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
                </style>
            </head>
            <body>
                <h1>Products' State Report, ${currentDate}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Barcode</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Subcategory</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(product => `
                            <tr>
                                <td>${product.productName}</td>
                                <td>
                                    <div style="text-align: center;">
                                        <img src="${product.barcode}" style="max-width: 100px; height: auto;"/>
                                    </div>
                                </td>
                                <td>${product.price}</td>
                                <td>${product.productDescription}</td>
                                <td>${product.quantity}</td>
                                <td>${product.subcategoriesSubcategoryId}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `);
};

export default allProductState;
