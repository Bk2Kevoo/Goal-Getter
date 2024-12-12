from routes.__init__ import make_response, Resource
from routes.__init__ import jwt_required, request, db
from models.goal import Goal
from flask_jwt_extended import current_user


# If it is the user that is logged in then allow them to see their goals no-one elses
class GoalsById(Resource):    
    @jwt_required()
    def post(self):
        try:
            # Get data from the request body
            data = request.get_json()

            # Check that all required fields are provided
            if "goal_amount" not in data or "date" not in data:
                return make_response({"error": "goal_amount and date are required."}, 400)

            # Optional: You can check if current_savings is provided, otherwise set it to 0.0
            current_savings = data.get("current_savings", 0.0)

            # Create the new goal instance
            new_goal = Goal(
                goal_amount=data["goal_amount"],
                current_savings=current_savings,
                date=data["date"],
                user_id=current_user.id  # The goal is associated with the logged-in user
            )

            # Commit the new goal to the database
            db.session.add(new_goal)
            db.session.commit()

            # Return the created goal as a response
            return make_response(new_goal.to_dict(), 201)

        except ValueError as e:
            return make_response({"error": str(e)}, 422)
        except Exception as e:
            return make_response({"error": str(e)}, 500)