from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.validators import validate_file
from app.services.extract_pdf import extract_text_from_pdf
from app.services.extract_docx import extract_text_from_docx
from app.services.llm import analyze_document_text

router = APIRouter()


@router.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    ext = validate_file(file)

    try:
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        if ext == ".pdf":
            extracted_text = extract_text_from_pdf(file_bytes)
        elif ext == ".docx":
            extracted_text = extract_text_from_docx(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the file"
            )

        llm_result = analyze_document_text(extracted_text)

        return {
            "filename": file.filename,
            "extracted_text_preview": extracted_text[:1000],
            "analysis": llm_result
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))