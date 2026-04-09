from fastapi import APIRouter, HTTPException, status
from typing import List
from models.contact import Contact, ContactCreate
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
import logging
from services.email_service import email_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'origenes_db')]
contacts_collection = db.contacts


@router.post("/", response_model=Contact, status_code=status.HTTP_201_CREATED)
async def create_contact(contact_data: ContactCreate):
    """
    Create a new contact inquiry from the website form.
    """
    try:
        contact = Contact(**contact_data.model_dump())
        
        doc = contact.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await contacts_collection.insert_one(doc)
        
        logger.info(f"New contact created: {contact.email} - {contact.name}")
        
        try:
            email_service.send_contact_notification(doc)
        except Exception as e:
            logger.error(f"Email notification failed: {str(e)}")
        
        return contact
    
    except Exception as e:
        logger.error(f"Error creating contact: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar la solicitud: {str(e)}"
        )


@router.get("/", response_model=List[Contact])
async def get_contacts(
    limit: int = 100,
    skip: int = 0,
    status_filter: str = None
):
    """
    Get all contact inquiries. Optional filtering by status.
    """
    try:
        query = {}
        if status_filter:
            query["status"] = status_filter
        
        contacts = await contacts_collection.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        
        return [Contact(**contact) for contact in contacts]
    
    except Exception as e:
        logger.error(f"Error fetching contacts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener las consultas: {str(e)}"
        )


@router.get("/{contact_id}", response_model=Contact)
async def get_contact(contact_id: str):
    """
    Get a specific contact by ID.
    """
    try:
        contact = await contacts_collection.find_one({"id": contact_id}, {"_id": 0})
        
        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Consulta no encontrada"
            )
        
        return Contact(**contact)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching contact: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener la consulta: {str(e)}"
        )


@router.patch("/{contact_id}/status")
async def update_contact_status(contact_id: str, new_status: str):
    """
    Update the status of a contact inquiry.
    Valid statuses: pending, contacted, closed
    """
    try:
        valid_statuses = ["pending", "contacted", "closed"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}"
            )
        
        result = await contacts_collection.update_one(
            {"id": contact_id},
            {"$set": {"status": new_status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Consulta no encontrada"
            )
        
        return {"message": "Estado actualizado exitosamente", "status": new_status}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el estado: {str(e)}"
        )
