from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.budget import Budget
from flask_jwt_extended import current_user

class BudgetsDelete(Resource):
    @jwt_required()
    def delete(self):
        try:
            # Get data from the request body
            data = request.get_json()

            # Ensure that the budget_id is provided in the request
            if "budget_id" not in data:
                return make_response({"error": "budget_id is required."}, 400)
            
            budget = Budget.query.get(data["budget_id"])

            if not budget:
                return make_response({"error": "Budget not found."}, 404)
            if budget.user_id != current_user.id:
                return make_response({"error": "You can only delete your own budgets."}, 403)
            
            db.session.delete(budget)
            db.session.commit()
            return make_response({"message": "Budget deleted successfully."}, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
