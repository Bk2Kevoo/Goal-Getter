from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.budget import Budget
from flask_jwt_extended import current_user

class BudgetsPatch(Resource):
    @jwt_required()
    def patch(self, budget_id):
        try:
            # Get data from the request body
            data = request.get_json()

            budget = Budget.query.filter_by(id=budget_id, user_id=current_user.id).first()

            if not budget:
                return make_response({"message": "Budget not found or you do not have permission to update it."}, 404)

            # Update the fields of the budget if provided in the request body
            if "amount" in data:
                budget.amount = data["amount"]
            if "category_id" in data:
                budget.category_id = data["category_id"]
            if "description" in data:
                budget.description = data["description"]
            if "date" in data:
                budget.date = data["date"]

            # Commit the changes to the database
            db.session.commit()
            return make_response(budget.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)