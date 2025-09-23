from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List
from app.schemas import FileUploadResponse
from app.services.s3_service import s3_service
from app.auth import get_current_active_user
from app.models import User

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/single", response_model=FileUploadResponse)
async def upload_single_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a single file to S3"""
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail="Only image files (JPEG, PNG, GIF, WebP) are allowed"
        )
    
    # Validate file size (5MB limit)
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 5MB"
        )
    
    # Reset file pointer
    await file.seek(0)
    
    try:
        # Upload to S3
        url = await s3_service.upload_file(file, folder="products")
        
        return FileUploadResponse(
            url=url,
            filename=file.filename,
            size=len(file_content)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.post("/multiple", response_model=List[FileUploadResponse])
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """Upload multiple files to S3"""
    
    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum 10 files allowed per upload"
        )
    
    uploaded_files = []
    
    for file in files:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if file.content_type not in allowed_types:
            continue  # Skip invalid files
        
        # Validate file size (5MB limit)
        file_content = await file.read()
        if len(file_content) > 5 * 1024 * 1024:  # 5MB
            continue  # Skip oversized files
        
        # Reset file pointer
        await file.seek(0)
        
        try:
            # Upload to S3
            url = await s3_service.upload_file(file, folder="products")
            
            uploaded_files.append(FileUploadResponse(
                url=url,
                filename=file.filename,
                size=len(file_content)
            ))
            
        except Exception as e:
            print(f"Failed to upload {file.filename}: {e}")
            continue  # Skip failed uploads
    
    return uploaded_files

@router.delete("/")
async def delete_file(
    file_url: str,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a file from S3"""
    
    try:
        success = await s3_service.delete_file(file_url)
        
        if success:
            return {"message": "File deleted successfully"}
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to delete file"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete file: {str(e)}"
        )

