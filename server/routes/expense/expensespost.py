from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.expense import Expense
from flask_jwt_extended import current_user

class ExpensesPost(Resource):
    @jwt_required
    def post(self):
        try:
            expenses = Expense.query(Expense.user_id == current_user.id)

            if not expenses:
                return make_response({"error": str(e)}, 404)
            return make_response(expenses.to_dict(), 200)
            
        except Exception as e:
            return make_response