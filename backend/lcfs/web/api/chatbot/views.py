from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from lcfs.services.chatbot import ChatbotService
from lcfs.web.api.chatbot.schema import ChatDocument, ChatQuery, ChatResponse

router = APIRouter()


def get_chatbot_service() -> ChatbotService:
    return ChatbotService()


@router.get("/documents", response_model=list[ChatDocument])
async def list_chatbot_documents(
    service: ChatbotService = Depends(get_chatbot_service),
) -> list[ChatDocument]:
    documents = service.list_documents()
    return [ChatDocument.model_validate(item) for item in documents]


@router.post(
    "/documents",
    response_model=ChatDocument,
    status_code=status.HTTP_201_CREATED,
)
async def upload_chatbot_document(
    file: UploadFile = File(...),
    service: ChatbotService = Depends(get_chatbot_service),
) -> ChatDocument:
    if file.content_type not in {"application/pdf", "application/octet-stream"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF documents can be ingested.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    try:
        document = service.ingest_pdf(file_bytes, file.filename)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc

    return ChatDocument.model_validate(document)


@router.post("/query", response_model=ChatResponse)
async def query_chatbot(
    payload: ChatQuery, service: ChatbotService = Depends(get_chatbot_service)
) -> ChatResponse:
    response = service.answer_question(
        question=payload.question, document_ids=payload.document_ids
    )
    return ChatResponse.model_validate(response)
