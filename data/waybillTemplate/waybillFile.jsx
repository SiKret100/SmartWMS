const waybillFile = (waybill) => {
    const currentDate = new Date().toLocaleDateString(); // Get current date for the report

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
                .waybill-details {
                    margin-top: 20px;
                }
                .barcode {
                    text-align: center;
                }
                .summary {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #ddd;
                }
            </style>
        </head>
        <body>
            <h1>Waybill, ${currentDate}</h1>

            <div class="waybill-details">
                <h3>Waybill Details</h3>
                <table>
                    <tr>
                        <th>Barcode digits</th>
                        <td>${waybill.barcode}</td>
                    </tr>
                    <tr>
                        <th>Country</th>
                        <td>${waybill.countryName}</td>
                    </tr>
                    <tr>
                        <th>Postal Code</th>
                        <td>${waybill.postalCode}</td>
                    </tr>
                    <tr>
                        <th>Supplier Name</th>
                        <td>${waybill.supplierName}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>${waybill.address}</td>
                    </tr>
                </table>
            </div>
                     
            <div style="text-align: center;" class="barcode">
                <h3>Barcode</h3>
                <img src="${waybill.barcodeImage}" alt="Barcode" style="max-width: 600px; height: auto;"/>
            </div>

            <div class="summary">
                <h3>Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Waybill ID</td>
                            <td>${waybill.waybillId}</td>
                        </tr>
                        <tr>
                            <td>Supplier Name</td>
                            <td>${waybill.supplierName}</td>
                        </tr>
                        <tr>
                            <td>Postal Code</td>
                            <td>${waybill.postalCode}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </body>
    </html>
    `);
};

export default waybillFile;
