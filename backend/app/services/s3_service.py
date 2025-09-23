import boto3
from botocore.exceptions import ClientError
from typing import Optional, BinaryIO
import uuid
from app.config import settings
from fastapi import HTTPException, UploadFile
import os

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region
        )
        self.bucket_name = settings.aws_bucket_name
    
    async def upload_file(self, file: UploadFile, folder: str = "uploads") -> Optional[str]:
        """Upload file to S3 and return the URL"""
        try:
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1] if file.filename else ''
            unique_filename = f"{folder}/{uuid.uuid4()}{file_extension}"
            
            # Upload file
            file_content = await file.read()
            
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=unique_filename,
                Body=file_content,
                ContentType=file.content_type or 'application/octet-stream',
                ACL='public-read'
            )
            
            # Return public URL
            return f"https://{self.bucket_name}.s3.{settings.aws_region}.amazonaws.com/{unique_filename}"
            
        except ClientError as e:
            print(f"S3 upload error: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload file")
        except Exception as e:
            print(f"Upload error: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload file")
    
    async def upload_multiple_files(self, files: list[UploadFile], folder: str = "uploads") -> list[str]:
        """Upload multiple files to S3 and return URLs"""
        urls = []
        for file in files:
            url = await self.upload_file(file, folder)
            if url:
                urls.append(url)
        return urls
    
    async def delete_file(self, file_url: str) -> bool:
        """Delete file from S3"""
        try:
            # Extract key from URL
            key = file_url.split(f"{self.bucket_name}.s3.{settings.aws_region}.amazonaws.com/")[-1]
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
            return True
            
        except ClientError as e:
            print(f"S3 delete error: {e}")
            return False
        except Exception as e:
            print(f"Delete error: {e}")
            return False
    
    async def get_signed_url(self, key: str, expiration: int = 3600) -> Optional[str]:
        """Generate signed URL for private file access"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': key},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            print(f"S3 signed URL error: {e}")
            return None

# Global S3 service instance
s3_service = S3Service()

