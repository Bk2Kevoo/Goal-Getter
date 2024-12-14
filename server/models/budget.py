from models.__init__ import SerializerMixin, validates, db
from datetime import date
# from models.user import User

class Budget(db.Model, SerializerMixin):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    total_amount = db.Column(db.Float, default=0.0, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime,  server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    def __repr__(self):
        return f"""
            <Budget #{self.id}:
                Name: {self.name}
                Description: {self.description}
                Total Amount: {self.total_amount}
                Start Date: {self.start_date}
                End Date: {self.end_date}
                Is Active: {self.is_active}
                User Id: {self.user_id}
                Category Id: {self.category_id}>
        """


    # Relationships
    user = db.relationship("User", back_populates="budgeting")

    category = db.relationship("Category", back_populates="budgets")

    expenses = db.relationship("Expense", back_populates="budget")

    #Serialize
    serialize_rules = ("-user", "-category", "-expenses",)

    @validates("name")
    def validate_name(self, key, name):
        if not isinstance(name, str):
            raise TypeError("Name must be a string.")
        if not (2 <= len(name) <= 50):
            raise ValueError("Name must be between 2 and 50 characters long.")
        return name


    @validates("description")
    def validate_description(self, key, description):
        if not isinstance(description, str):
            raise TypeError("Description must be a string.")
        description = description.strip()  # Remove leading and trailing whitespace
        if not (2 <= len(description) <= 255):
            raise ValueError("Description must be between 2 and 255 characters long.")
        return description

    @validates("total_amount")
    def validate_total_amount(self, _, total_amount):
        if not isinstance(total_amount, float):
            raise TypeError("Total Amount must be a float.")
        elif not (0 < total_amount <= 200_000):
            raise ValueError(f"{total_amount} must be a positive float and no more than 200,000.")
        return total_amount


    @validates("start_date")
    def validate_start_date(self, _, start_date):
        # Start date must be a valid date and should be today or in the future
        if not isinstance(start_date, date):
            raise TypeError("Start Date must be a valid date.")
        if start_date < date.today():
            raise ValueError("Start Date must be today or in the future.")
        return start_date

    @validates("end_date")
    def validate_end_date(self, _, end_date):
        # End date must be a valid date and should be later than the start date
        if not isinstance(end_date, date):
            raise TypeError("End Date must be a valid date.")
        if end_date <= self.start_date:
            raise ValueError("End Date must be after Start Date.")
        return end_date


    @validates("is_active")
    def validate_is_active(self, _, is_active):
        if not isinstance(is_active, bool):
            raise TypeError("Is Active must be a boolean value.")
        return is_active
    
    # @validates("user_id")
    # def validate_user_id(self, _, user_id):
    #     if not isinstance(user_id, int):
    #         raise TypeError("User ids must be integers")
    #     elif user_id < 1:
    #         raise ValueError(f"{user_id} has to be a positive integer")
    #     elif not db.session.query(User).get(user_id):
    #         raise ValueError(f"{user_id} must belong to an existing User")
    #     return user_id