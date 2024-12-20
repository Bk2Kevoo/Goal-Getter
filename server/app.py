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
from routes.auth.googleauth import ChangePassword

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
api.add_resource(ChangePassword, "/change-password")

# Goals Routes (done)
api.add_resource(CreateGoal, "/goal/create")
api.add_resource(GoalsGet, "/goals")  
api.add_resource(GoalsById, "/goals/<int:goal_id>")
api.add_resource(GoalsPatch, "/goals/<int:goal_id>/update") 
api.add_resource(GoalsDelete, "/goals/<int:goal_id>/delete") 

# Categories Routes
api.add_resource(CategoriesPost, "/categories/create")
api.add_resource(CategoriesGet, "/categories")  
api.add_resource(CategoriesById, "/categories/<int:category_id>")
api.add_resource(CategoriesPatch, "/categories/<int:category_id>/update") 
api.add_resource(CategoriesDelete, "/categories/<int:category_id>/delete") 

# Expenses Routes
api.add_resource(ExpensesPost, "/expenses/create")
api.add_resource(ExpensesGet, "/expenses")  
api.add_resource(ExpensesById, "/expenses/<int:expense_id>")  
api.add_resource(ExpensesPatch, "/expenses/<int:expense_id>/update") 
api.add_resource(ExpensesDelete, "/expenses/<int:expense_id>/delete") 

# Budgets Routes (done)
api.add_resource(BudgetsPost, "/budgets/create")
api.add_resource(BudgetsGet, "/budgets")  
api.add_resource(BudgetsById, "/budgets/<int:budget_id>")
api.add_resource(BudgetsPatch, "/budgets/<int:budget_id>/update") 
api.add_resource(BudgetsDelete, "/budgets/<int:budget_id>/delete") 



if __name__ == '__main__':
    app.run(port=5555, debug=True)