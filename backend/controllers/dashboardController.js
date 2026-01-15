const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

//Dashboard data
exports.getDashboardData = async (req, res) => {
    try{
        const userId = req.user.id;
        const userIdObject = new Types.ObjectId(userId);

        //fetch total income & expense
        const totalIncome = await Income.aggregate([
            { $match: { userId: userIdObject } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("Total Income : ", {totalIncome, userId: isValidObjectId(userId)});

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userIdObject } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("Total Expense : ", {totalExpense, userId: isValidObjectId(userId)});

        // get income transactions in the last 60 days

        const last60daysIncomeTransactions = await Income.find({
            userId: userId,
            date: { $gte: new Date(Date.now() - 60*24*60*60*1000) }
        }).sort({date: -1});

        //get total income for last 60 days
        const incomeLast60days = last60daysIncomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);


        //get expense transactions in the last 30 days
        const last30daysExpenseTransactions = await Expense.find({
            userId: userId,
            date: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
        }).sort({date: -1});

        //get total expense for last 30 days
        const expenseLast30days = last30daysExpenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

        //getch last 5 transactions (income + expense)
        const lastTransactions = [...(await Income.find({userId}).sort({date: -1}).limit(5)).map(txn => ({...txn.toObject(), type: 'income'})),
        ...(await Expense.find({userId}).sort({date: -1}).limit(5)).map(txn => ({...txn.toObject(), type: 'expense'}))
        ]
        .sort((a, b) => b.date - a.date); //sort latest first

        //final response

        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: expenseLast30days,
                transactions: last30daysExpenseTransactions
            },
            last60DaysIncome : {
                total: incomeLast60days,
                transactions: last60daysIncomeTransactions
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        // console.error("Error fetching dashboard data:", error);
        res.status(500).json({message: "Server error"});
    }


};