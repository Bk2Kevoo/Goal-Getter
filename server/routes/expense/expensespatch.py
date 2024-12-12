from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.expense import Expense
from flask_jwt_extended import current_user


class ExpensesPatch(Resource):
    @jwt_required
    def patch(self):
        try:
            data = request.get_json()

            if "expense_id" not in data:
                return make_response({"error": "Expense ID is required."}, 400)

            expense = Expense.query.filter(id=data["expense_id"], user_id=current_user.id).first()

            # Check if the expense exists
            if not expense:
                return make_response({"error": "Expense not found or you are not authorized to update this expense."}, 404)

            # Update fields based on the request data
            if "amount" in data:
                expense.amount = data["amount"]
            if "description" in data:
                expense.description = data["description"]

            # Commit the changes to the database
            db.session.commit()

            # Return the updated expense data as a response
            return make_response(expense.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
