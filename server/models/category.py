from models.__init__ import SerializerMixin, validates, db


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    allocated_amount = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __repr__(self):
        return f"""
            <Category #{self.id}:
                Name: {self.name}
                Description: {self.description}
                Allocated Amount: {self.allocated_amount}>
        """
    # Relationship
    budgets = db.relationship("Budget", back_populates="category", cascade="all, delete-orphan")

    # Serialize
    serialize_rules = ("-budgets",)

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
    
    @validates("allocated_amount")
    def validate_amount(self, key, amount):
        if not isinstance(amount, int):
            raise TypeError("Allocated Amount must be of type integer.")
        if amount < 0:
            raise ValueError("Allocated Amount cannot be negative.")
        return amount
