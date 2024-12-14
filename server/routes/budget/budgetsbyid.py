from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.budget import Budget
from flask_jwt_extended import current_user

class BudgetsById(Resource):
    @jwt_required()
    def get(self, budget_id):
        try:
            # Query the specific budget by ID, ensuring it belongs to the logged-in user
            budget = Budget.query.filter_by(id=budget_id, user_id=current_user.id).first()

            # If the budget is not found, return a 404 response
            if not budget:
                return make_response({"message": "Budget not found or you do not have permission to access it."}, 404)

            # Return the budget as a dictionary
            return make_response(budget.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
