from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.budget import Budget
from flask_jwt_extended import current_user

class BudgetsGet(Resource):
    @jwt_required()
    def get(self):
        try:
            # Query all budgets belonging to the logged-in user
            budgets = Budget.query.filter_by(user_id=current_user.id).all()

            # If no budgets are found, return a 404 response
            if not budgets:
                return make_response({"message": "No budgets found for the current user."}, 404)

            # Convert each budget to a dictionary (assuming a `to_dict` method exists)
            budgets_data = [budget.to_dict() for budget in budgets]

            # Return the list of budgets
            return make_response({"budgets": budgets_data}, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)