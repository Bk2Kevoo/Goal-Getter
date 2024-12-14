from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required
from models.expense import Expense
from flask_jwt_extended import current_user


class ExpensesGet(Resource):
    @jwt_required()
    def get(self):
        try:
            # Fetch expenses for the logged-in user
            expenses = Expense.query.filter(Expense.user_id == current_user.id).all()

            # If no expenses are found, return a message
            if not expenses:
                return make_response({"message": "No expenses found."}, 404)

            return make_response([expense.to_dict() for expense in expenses], 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
class ExpensesById(Resource):
    @jwt_required
    def get(self, expense_id):
        try:
            expense = Expense.query.filter_by(id=expense_id, user_id=current_user.id).first()
            if not expense:
                return make_response({"message": "Expense not found or you do not have access to this."})
            return make_response(expense.dict(), 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
