from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.budget import Budget
from flask_jwt_extended import current_user

class BudgetsGet(Resource):
    @jwt_required()
    def get(self):
        try:
            # Get data from the request body
            data = request.get_json()

            # Ensure that budget_id is provided in the request
            if "budget_id" not in data:
                return make_response({"error": "budget_id is required."}, 400)

            # Fetch the budget by its ID, only if it belongs to the logged-in user
            budget = Budget.query(id=data["budget_id"], user_id=current_user.id)

            # If no budget is found or it doesn't belong to the logged-in user, return a 404 response
            if not budget:
                return make_response({"message": "Budget not found or you do not have permission to access it."}, 404)

            # Return the budget as a dictionary (assuming you have a to_dict method)
            return make_response(budget.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
