from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.expense import Expense
from flask_jwt_extended import current_user

class ExpensesDelete(Resource):
    @jwt_required()
    def delete(self):
        try:
            data = request.get_json()

            if "expense_id" not in data:
                return make_response({"error": "Expense ID is required."}, 400)

            # Query the expense by ID and user_id (to ensure the logged-in user owns the expense)
            expense = Expense.query.filter(id=data["expense_id"], user_id=current_user.id).first()

            # Check if the expense exists
            if not expense:
                return make_response({"error": "Expense not found or you are not authorized to delete this expense."}, 404)

            # Delete the expense
            db.session.delete(expense)
            db.session.commit()

            return make_response({"message": "Expense deleted successfully."}, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
