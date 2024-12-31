from models.__init__ import SerializerMixin, validates, db
from models.user import User
from sqlalchemy import Date
from datetime import date


class Goal(db.Model, SerializerMixin):
    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=True)
    goal_amount = db.Column(db.Float, nullable=False)
    current_savings = db.Column(db.Float, default=0.0, nullable=False)
    is_completed = db.Column(db.Boolean, default=0.0) 
    start_date = db.Column(Date, nullable=False)
    end_date = db.Column(Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def __repr__(self):
        return f"""
            <Goal #{self.id}:
                Name: {self.name}
                Goal_Amount: {self.goal_amount}
                Current Savings: {self.current_savings}
                Is Completed: {self.is_completed}
                Start Date: {self.start_date}
                End Date: {self.end_date}
                User Id: {self.user_id}>
        """

    # Relationships
    user = db.relationship("User", back_populates="goals") 

    # Serialize
    serialize_rules = ("-user",)

    
    @validates("name")
    def validate_name(self, _, value):
        if len(value) < 3:
            raise ValueError("name must be 3 characters long")
        return value

    @validates("goal_amount")
    def validate_goal_amount(self, key, value):
        if value <= 0:
            raise ValueError("Goal amount must be greater than zero.")
        return value

    @validates("current_savings")
    def validate_current_savings(self, key, value):
        if value < 0:
            raise ValueError("Current savings cannot be negative.")
        elif hasattr(self, "goal_amount") and value > self.goal_amount:
            raise ValueError("Current savings cannot exceed the goal amount.")
        return value
    
    @validates("start_date")
    def validate_start_date(self, _, value):
        if not isinstance(value, date):
            raise ValueError("Start date must be a valid date.")
        today = date.today()
        if value > today.replace(year=today.year + 5):
            raise ValueError("Start date cannot be more than 5 years in the future.")
        return value

    @validates("end_date")
    def validate_end_date(self, _, value):
        if not isinstance(value, date):
            raise ValueError("End date must be a valid date.")
        if hasattr(self, "start_date") and self.start_date and value < self.start_date:
            raise ValueError("End date cannot be earlier than start date.")
        return value

    @validates("user_id")
    def validate_user_id(self, _, user_id):
        if not isinstance(user_id, int):
            raise TypeError("User ids must be integers")
        elif user_id < 1:
            raise ValueError(
                f"{user_id} has to be a positive integer"
            )
        elif not db.session.get(User, user_id):
            raise ValueError(f"{user_id} must belong to an existing User")
        return user_id