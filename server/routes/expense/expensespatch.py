from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.expense import Expense
from models.budget import Budget
from flask_jwt_extended import current_user

class ExpensesPatch(Resource):
    @jwt_required()
    def patch(self):
        try:
            data = request.get_json()

            # Ensure expense_id is provided in the request data
            if "expense_id" not in data:
                return make_response({"error": "Expense ID is required."}, 400)

            # Find the expense by its ID and ensure the current user owns it
            expense = Expense.query.filter_by(id=data["expense_id"], user_id=current_user.id).first()

            # Check if the expense exists or if the user is authorized to update it
            if not expense:
                return make_response({"error": "Expense not found or you are not authorized to update this expense."}, 404)

            # If no budget_id is provided, fetch the current user's active budget
            if "budget_id" not in data:
                budget = db.session.query(Budget).filter_by(user_id=current_user.id, is_active=True).first()
                if budget:
                    expense.budget_id = budget.id  # Automatically associate with the active budget
                else:
                    return make_response({"error": "No active budget found."}, 400)

            # Update fields based on the request data
            if "amount" in data:
                expense.amount = data["amount"]
            if "description" in data:
                expense.description = data["description"]
            if "date" in data:
                expense.date = data["date"]  # Update date if provided

            # Commit the changes to the database
            db.session.commit()

            # Return the updated expense data as a response
            return make_response(expense.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
