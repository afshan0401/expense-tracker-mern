import moment from "moment";

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export const getInitials = (fullName) => {
    if (!fullName) return "";
    const words = fullName.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words,2) ; i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};


export const addThousandsSeparator = (number) => {
    if (number == null || isNaN(number)) return "";
    
    const [integerPart, fractionalPart] = number.toString().split(".");

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
}

// export const prepareExpenseBarChartData = (data= []) => {

//     const chartData = data.map((item) => ({
//       category : item?.category,
//       amount: item?.amount,
//     }));
    
//     return chartData;
// }

export const prepareExpenseBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"),
    amount: item?.amount,
    category: item?.category,
  }));
};



export const prepareIncomeBarChartData = (data= []) => {

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
      month: moment(item.date).format("Do MMM"),
      amount: item?.amount,
      source: item?.source
      
    }));
    
    return chartData;
}


export const prepareExpenseLineChartData = (data= []) => {

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
      month: moment(item.date).format("Do MMM"),
      amount: item?.amount,
      category: item?.category
      
    }));
    
    return chartData;
}