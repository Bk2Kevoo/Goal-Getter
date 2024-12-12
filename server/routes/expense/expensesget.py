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
