from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required
from models.expense import Expense
from models.budget import Budget
from flask_jwt_extended import current_user


class ExpensesGet(Resource):
    @jwt_required()
    def get(self):
        try:
            budgets = Budget.query.filter_by(user_id=current_user.id).all()
            if not budgets:
                return make_response({"message": "No budgets found for the user."}, 404)
            expenses = Expense.query.filter(Expense.budget_id.in_([budget.id for budget in budgets])).all()
            if not expenses:
                return make_response({"message": "No expenses found."}, 404)
            return make_response([expense.to_dict() for expense in expenses], 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

        
class ExpensesById(Resource):
    @jwt_required()
    def get(self, expense_id):
        try:
            # Query the expense based on the provided expense_id
            expense = Expense.query.filter_by(id=expense_id).first()
            
            if not expense:
                return make_response({"message": "Expense not found or you do not have access to this."}, 404)
            
            # Return the expense as a dictionary using the to_dict method
            return make_response(expense.to_dict(), 200)
        
        except Exception as e:
            return make_response({"error": str(e)}, 500)
