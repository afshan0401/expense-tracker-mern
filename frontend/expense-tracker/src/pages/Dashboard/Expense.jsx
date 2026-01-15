import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // get all expense transactions
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      console.log("Expense API:", response.data);

      if (Array.isArray(response.data.expenses)) {
        setExpenseData(response.data.expenses || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data. Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  //handle add expense
  const handleAllExpense = async (expense) => {
    if (!expense) return;

    const { category, amount, date, icon } = expense;

    //validation checks
    if (!category || !category.trim()) {
      toast.error("Please enter expense category.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter valid amount.");
      return;
    }

    if (!date) {
      toast.error("Please select date.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense: ",
        error.response?.data?.message || error.message
      );
    }
  };

  // delete expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense: ",
        error.response?.data?.message || error.message
      );
    }
  };

  //handle download income details
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(
      API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",
      }
    );

    //create url for blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expense_details.xlsx");
    link.download = "expense.xlsx";
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error downloading expense details: ",
        error.response?.data?.message || error.message);
        toast.error("Error downloading expense details.");

      ;
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    return () => {};
  }, []);

  // useEffect(() => {
  //   console.log("Updated expenseData:", expenseData);
  // }, [expenseData]);

  return (
    <DashboardLayout activeMenu="Expenses">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

    <ExpenseList
        transactions={expenseData}
        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
        onDownload={handleDownloadExpenseDetails}
        />

        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAllExpense} />
        </Modal>


        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
          content = "Are you sure you want to delete this expense?"
          onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
          </Modal>


      </div>
    </DashboardLayout>
  );
};

export default Expense;
