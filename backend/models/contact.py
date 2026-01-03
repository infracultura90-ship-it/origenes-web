from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class ContactBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    department: str = Field(..., min_length=2, max_length=50)
    culture: str = Field(..., min_length=2, max_length=50)
    hectares: Optional[int] = Field(None, ge=0)
    message: str = Field(..., min_length=10, max_length=1000)


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")  # pending, contacted, closed

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Juan Pérez",
                "email": "juan@ejemplo.com",
                "phone": "300 123 4567",
                "department": "Antioquia",
                "culture": "Café",
                "hectares": 50,
                "message": "Me interesa mejorar el rendimiento de mi cultivo de café",
                "created_at": "2025-01-03T12:00:00",
                "status": "pending"
            }
        }
