from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user
from datetime import datetime

class CreateGoal(Resource):
    @jwt_required()
    def post(self):
        try:
            # Get data from the request body
            data = request.get_json()

            # Check if the required fields are provided
            if "goal_amount" not in data or "date" not in data:
                return make_response({"error": "goal_amount and date are required."}, 400)

            # Convert the 'date' string to a Python date object
            goal_date = datetime.strptime(data["date"], "%Y-%m-%d").date()

            # Optional: Set current_savings to 0.0 if it's not provided
            current_savings = data.get("current_savings", 0.0)

            # Create a new goal instance
            new_goal = Goal(
                goal_amount=data["goal_amount"],
                current_savings=current_savings,
                date=goal_date,
                user_id=current_user.id  # The goal is associated with the logged-in user
            )

            # Commit the new goal to the database
            db.session.add(new_goal)
            db.session.commit()

            # Return the created goal as a response with status code 201 (Created)
            return make_response(new_goal.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
