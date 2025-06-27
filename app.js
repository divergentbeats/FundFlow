let income = 0;
let expenses = 0;
let goal = 0;

function updateUI() {
  document.getElementById('incomeDisplay').textContent = `₹${income}`;
  document.getElementById('expensesDisplay').textContent = `₹${expenses}`;
  document.getElementById('balanceDisplay').textContent = `₹${income - expenses}`;
  let progress = goal ? Math.min(100, Math.round(((income - expenses) / goal) * 100)) : 0;
  document.getElementById('goalProgressDisplay').textContent = `${progress}%`;

  // Budget plan
  document.getElementById('spendingAmount').textContent = `₹${Math.round(income * 0.5)}`;
  document.getElementById('savingsAmount').textContent = `₹${Math.round(income * 0.3)}`;
  document.getElementById('investmentsAmount').textContent = `₹${Math.round(income * 0.2)}`;
  document.getElementById('spendingBar').style.width = '50%';
  document.getElementById('savingsBar').style.width = '30%';
  document.getElementById('investmentsBar').style.width = '20%';

  // Coach
  let coach = "Add some expenses and set a savings goal to get personalized advice! 🚀";
  if (income > 0 && expenses > income * 0.5) {
    coach = "You're spending more than 50% of your income! Try to cut back on non-essentials. 💡";
  } else if (goal && (income - expenses) >= goal) {
    coach = "Congrats! You've reached your savings goal this month! 🏆";
  } else if (income > 0 && expenses === 0) {
    coach = "Great start! Add your expenses to see your progress. 🌱";
  }
  document.getElementById('coachText').textContent = coach;
}

function setIncome() {
  const val = parseInt(document.getElementById('incomeInput').value, 10);
  if (!isNaN(val) && val >= 0) {
    income = val;
    updateUI();
  }
}

function addExpense() {
  const val = parseInt(document.getElementById('expenseAmount').value, 10);
  if (!isNaN(val) && val > 0) {
    expenses += val;
    updateUI();
    document.getElementById('expenseAmount').value = '';
  }
}

function setGoal() {
  const val = parseInt(document.getElementById('goalInput').value, 10);
  if (!isNaN(val) && val > 0) {
    goal = val;
    updateUI();
    document.getElementById('goalInput').value = '';
  }
}

window.onload = updateUI; 