const allUsersTasksState = (data) => {
    const { startDate, endDate, filteredTasks } = data;
    const formattedStartDate = new Date(startDate).toLocaleString("en-US");
    const formattedEndDate = new Date(endDate).toLocaleString("en-US");

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
                    h1, h2 {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h1>Tasks Report</h1>
                <h2>From ${formattedStartDate} to ${formattedEndDate}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Completed Tasks Count</th>
                            <th>Task Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredTasks.map(user => `
                            <tr>
                                <td>${user.username}</td>
                                <td>${user.completedTasksCount}</td>
                                <td>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Task ID</th>
                                                <th>Start Date</th>
                                                <th>Finish Date</th>
                                                <th>Priority</th>
                                                <th>Taken</th>
                                                <th>Quantity Collected</th>
                                                <th>Quantity Allocated</th>
                                                <th>Done</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${user.tasks.map(task => `
                                                <tr>
                                                    <td>${task.taskId}</td>
                                                    <td>${new Date(task.startDate).toLocaleString("en-US")}</td>
                                                    <td>${new Date(task.finishDate).toLocaleString("en-US")}</td>
                                                    <td>${task.priority}</td>
                                                    <td>${task.taken ? "Yes" : "No"}</td>
                                                    <td>${task.quantityCollected}</td>
                                                    <td>${task.quantityAllocated}</td>
                                                    <td>${task.done ? "Yes" : "No"}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `);
};

export default allUsersTasksState;
