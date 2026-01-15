const Income = require('../models/Income');
const xlsx = require('xlsx');



// add income source
exports.addIncome = async (req, res) => {
    // implementation here
    const uderId = req.user.id;
    try {
        const { icon, source, amount, date } = req.body;
        // validation check for missing fields
        if (!source || !amount) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newIncome = new Income({
            userId: uderId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json({ newIncome });

    } catch (error) {                
        console.error('Error registering user:', error.stack);

        res.status(500).json({ message: "Server error" });
    }
}


exports.getAllIncomes = async (req, res) => {
  
const userId = req.user.id;
  try {
      const incomes = await Income.find({ userId }).sort({ date: -1 });
      res.json({ incomes });
  } catch (error) {
    //   console.error('Error fetching incomes:', error.stack);
      res.status(500).json({ message: "Server error" });
  }

};

exports.deleteIncome = async (req, res) => {

    try {
        await Income.findByIdAndDelete( req.params.id );
        res.json({ message: "Income deleted successfully" });
    } catch (error) {   
        //   console.error('Error deleting income:', error.stack);
        res.status(500).json({ message: "Server error" });
    }

};

exports.downloadIncomeExcel = async (req, res) => {

    // implementation here
    const userId = req.user.id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = incomes.map(income => ({
            Source: income.source,
            Amount: income.amount,
            Date: income.date.toISOString().split('T')[0], // format date as YYYY-MM-DD
        }));

        //create a workbook and add data
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Income');
        xlsx.writeFile(workbook, 'income_details.xlsx');

        //send file to client
        res.download('income_details.xlsx')


    } catch (error) {                
        //   console.error('Error downloading income excel:', error.stack);
        res.status(500).json({ message: "Server error" });
    }
};
