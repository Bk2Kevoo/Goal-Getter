from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.budget import Budget
from flask_jwt_extended import current_user

class BudgetsPatch(Resource):
    @jwt_required()
    def patch(self):
        try:
            # Get data from the request body
            data = request.get_json()

            # Ensure that the budget_id is provided in the request
            if "budget_id" not in data:
                return make_response({"error": "budget_id is required."}, 400)

            budget = Budget.query(id=data["budget_id"], user_id=current_user.id)

            if not budget:
                return make_response({"message": "Budget not found or you do not have permission to update it."}, 404)

            # Update the fields of the budget
            if "amount" in data:
                budget.amount = data["amount"]
            if "category_id" in data:
                budget.category_id = data["category_id"]
            if "description" in data:
                budget.description = data["description"]
            if "date" in data:
                budget.date = data["date"]

            db.session.commit()
            return make_response(budget.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
