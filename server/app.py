# from flask import request, g, render_template, session
from werkzeug.exceptions import NotFound
from config import app, api

# From my Auth folder
from routes.auth.login import Login
from routes.auth.signup import Signup
from routes.auth.logout import Logout
from routes.auth.currentuser import CurrentUser
from routes.auth.currentuser import CurrentUserPatch
from routes.auth.refresh import Refresh
from routes.auth.currentuser import UserDelete
from routes.auth.googleauth import GoogleAuth

# Only From My Routes Goal folder
from routes.goal.goals import GoalsGet
from routes.goal.goalsbyid import GoalsById
from routes.goal.goalsdelete import GoalsDelete
from routes.goal.goalspatch import GoalsPatch
from routes.goal.creategoal import CreateGoal

# Budget Folder Routes
from routes.budget.budgetsdelete import BudgetsDelete
from routes.budget.budgetsget import BudgetsGet
from routes.budget.budgetspatch import BudgetsPatch
from routes.budget.budgetspost import BudgetsPost
from routes.budget.budgetsbyid import BudgetsById

# Category Folder
from routes.catergory.categoriesdelete import CategoriesDelete
from routes.catergory.categoriesget import CategoriesGet
from routes.catergory.categoriespatch import CategoriesPatch
from routes.catergory.categoriespost import CategoriesPost
from routes.catergory.categoriesget import CategoriesById

# Expense Folder
from routes.expense.expensesdelete import ExpensesDelete
from routes.expense.expensesget import ExpensesGet
from routes.expense.expensesget import ExpensesById
from routes.expense.expensespatch import ExpensesPatch
from routes.expense.expensespost import ExpensesPost


# Views go here!

@app.errorhandler(NotFound)
def not_found(error):
    return {"error": error.description}, 404

# Auth Routes (done)
api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(CurrentUser, "/current-user")
api.add_resource(CurrentUserPatch, "/current-user/update")
api.add_resource(Logout, "/logout")
api.add_resource(Refresh, "/refresh")
api.add_resource(UserDelete, "/delete-account")
# api.add_resource(, "/user/edit")

api.add_resource(GoogleAuth, "/google-auth")

# Goals Routes (done)
api.add_resource(CreateGoal, "/user/goal/create")
api.add_resource(GoalsGet, "/user/goals")  
api.add_resource(GoalsById, "/user/goals/<int:goal_id>")
api.add_resource(GoalsPatch, "/user/goals/<int:goal_id>/update") 
api.add_resource(GoalsDelete, "/user/goals/<int:goal_id>/delete") 

# Categories Routes
api.add_resource(CategoriesPost, "/user/categories/create")
api.add_resource(CategoriesGet, "/user/categories")  
api.add_resource(CategoriesById, "/user/categories/<int:category_id>")
api.add_resource(CategoriesPatch, "/user/categories/<int:category_id>/update") 
api.add_resource(CategoriesDelete, "/user/categories/<int:category_id>/delete") 

# Expenses Routes
api.add_resource(ExpensesPost, "/user/expenses/create")
api.add_resource(ExpensesGet, "/user/expenses")  
api.add_resource(ExpensesById, "/user/expenses/<int:expense_id>")  
api.add_resource(ExpensesPatch, "/user/expenses/<int:expense_id>/update") 
api.add_resource(ExpensesDelete, "/user/expenses/<int:expense_id>/delete") 

# Budgets Routes (done)
api.add_resource(BudgetsPost, "/user/budgets/create")
api.add_resource(BudgetsGet, "/user/budgets")  
api.add_resource(BudgetsById, "/user/budgets/<int:budget_id>")
api.add_resource(BudgetsPatch, "/user/budgets/<int:budget_id>/update") 
api.add_resource(BudgetsDelete, "/user/budgets/<int:budget_id>/delete") 



if __name__ == '__main__':
    app.run(port=5555, debug=True)