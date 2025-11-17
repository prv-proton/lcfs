import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import SendIcon from '@mui/icons-material/Send'
import { useTranslation } from 'react-i18next'

import { useApiService } from '@/services/useApiService'

const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString()
}

export const Chatbot = () => {
  const { t } = useTranslation()
  const api = useApiService()
  const fileInputRef = useRef(null)
  const [documents, setDocuments] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loadingAnswer, setLoadingAnswer] = useState(false)
  const [error, setError] = useState('')

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/chatbot/documents')
      setDocuments(data)
    } catch (fetchError) {
      setError(t('ChatbotLoadError'))
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileChange = async (event) => {
    const files = event.target.files
    if (!files?.length) return
    setUploading(true)
    setError('')
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        await api.post('/chatbot/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      await fetchDocuments()
    } catch (uploadError) {
      setError(t('ChatbotUploadError'))
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const toggleDocument = (documentId) => {
    setSelectedDocuments((current) => {
      if (current.includes(documentId)) {
        return current.filter((item) => item !== documentId)
      }
      return [...current, documentId]
    })
  }

  const askQuestion = async () => {
    if (!question.trim()) {
      setError(t('ChatbotEnterQuestion'))
      return
    }
    setLoadingAnswer(true)
    setError('')
    try {
      const payload = { question: question.trim() }
      if (selectedDocuments.length) {
        payload.document_ids = selectedDocuments
      }
      const { data } = await api.post('/chatbot/query', payload)
      setAnswer(data.answer)
      setSources(data.sources || [])
    } catch (askError) {
      setError(t('ChatbotAnswerError'))
    } finally {
      setLoadingAnswer(false)
    }
  }

  return (
    <Stack spacing={3} px={{ xs: 2, md: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4">{t('Chatbot')}</Typography>
        <Typography variant="body1" color="text.secondary">
          {t('ChatbotIntro')}
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <input
              type="file"
              accept="application/pdf"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {t('UploadDocuments')}
            </Button>
            <Typography variant="body2" color="text.secondary">
              {t('ChatbotUploadHelp')}
            </Typography>
          </Stack>
          {uploading && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{t('YourDocuments')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('DocumentsSelected', {
                  count: selectedDocuments.length,
                  total: documents.length
                })}
              </Typography>
            </Stack>
            <Divider />
            {documents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t('NoDocumentsYet')}
              </Typography>
            ) : (
              <List>
                {documents.map((doc) => (
                  <ListItem
                    key={doc.document_id}
                    secondaryAction={
                      <Chip
                        label={selectedDocuments.includes(doc.document_id) ? t('Selected') : t('TapToUse')}
                        color={selectedDocuments.includes(doc.document_id) ? 'primary' : 'default'}
                        onClick={() => toggleDocument(doc.document_id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    }
                  >
                    <ListItemText
                      primary={doc.name}
                      secondary={`${t('IndexedOn')} ${formatDate(doc.created_at)}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">{t('AskQuestion')}</Typography>
            <TextField
              multiline
              minRows={3}
              label={t('AskPlaceholder')}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              fullWidth
            />
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={askQuestion}
                disabled={loadingAnswer}
              >
                {t('AskButton')}
              </Button>
            </Box>
            {loadingAnswer && <LinearProgress />}
          </Stack>
        </CardContent>
      </Card>

      {answer && (
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">{t('Answer')}</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {answer}
              </Typography>
              {sources.length > 0 && (
                <>
                  <Divider />
                  <Typography variant="subtitle2" color="text.secondary">
                    {t('Sources')}
                  </Typography>
                  <Stack spacing={1}>
                    {sources.map((source) => (
                      <Chip
                        key={`${source.document_id}-${source.score}`}
                        label={`${source.document_name} · ${t('RelevanceScore', {
                          score: source.score
                        })}`}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
