from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.budget import Budget
from flask_jwt_extended import current_user

class BudgetsPost(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json()

            # Ensure that required fields are in the data
            if "amount" not in data or "category_id" not in data or "description" not in data or "date" not in data:
                return make_response({"error": "Amount, category_id, description, and date are required."}, 400)

            # Create a new budget instance for the logged-in user
            new_budget = Budget(
                amount=data["amount"],
                category_id=data["category_id"],
                description=data["description"],
                date=data["date"],
                user_id=current_user.id 
            )
            db.session.add(new_budget)
            db.session.commit()
            return make_response(new_budget.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
