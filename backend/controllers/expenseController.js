const xlsx = require('xlsx');
const Expense = require('../models/Expense');



// add expense
exports.addExpense = async (req, res) => {
    // implementation here
    const uderId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;
        // validation check for missing fields
        if (!category || !amount) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newExpense = new Expense({
            userId: uderId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json({ newExpense });

    } catch (error) {                
        console.error('Error registering user:', error.stack);

        res.status(500).json({ message: "Server error" });
    }
}


exports.getAllExpenses = async (req, res) => {
  
const userId = req.user.id;
  try {
      const expenses = await Expense.find({ userId }).sort({ date: -1 });
      res.json({ expenses });
  } catch (error) {
    //   console.error('Error fetching expenses:', error.stack);
      res.status(500).json({ message: "Server error" });
  }

};

exports.deleteExpense = async (req, res) => {

    try {
        await Expense.findByIdAndDelete( req.params.id );
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {   
        //   console.error('Error deleting income:', error.stack);
        res.status(500).json({ message: "Server error" });
    }

};

exports.downloadExpenseExcel = async (req, res) => {

    // implementation here
    const userId = req.user.id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = expenses.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date.toISOString().split('T')[0], // format date as YYYY-MM-DD
        }));

        //create a workbook and add data
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Expense');
        xlsx.writeFile(workbook, 'expense_details.xlsx');

        //send file to client
        res.download('expense_details.xlsx')


    } catch (error) {                
        //   console.error('Error downloading expense excel:', error.stack);
        res.status(500).json({ message: "Server error" });
    }
};
