from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.expense import Expense
from flask_jwt_extended import current_user

class ExpensesPost(Resource):
    @jwt_required()
    def post(self):
        try:
            # Get data from the request body
            data = request.get_json()

            # Ensure that required fields are in the data
            if "amount" not in data or "description" not in data:
                return make_response({"error": "Amount and description are required."}, 400)

            # Create a new expense instance
            new_expense = Expense(
                amount=data["amount"],
                description=data["description"],
                user_id=current_user.id  # Associate with the logged-in user
            )

            # Add the new expense to the database and commit the transaction
            db.session.add(new_expense)
            db.session.commit()

            # Return the created expense as a response
            return make_response(new_expense.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
