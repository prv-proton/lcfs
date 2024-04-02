import { Box, Collapse, IconButton, TextField } from '@mui/material'
import { useState } from 'react'

// MUI Icons
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useFormContext } from 'react-hook-form'
import { LabelBox } from './LabelBox'
import { useTranslation } from 'react-i18next'

export const Comments = ({ editorMode, isGovernmentUser, commentField }) => {
  const { t } = useTranslation(['transfer'])
  const [isExpanded, setIsExpanded] = useState(true)

  const { register } = useFormContext()

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    commentField && (
      <>
        <LabelBox
          label={
            (editorMode && t('transfer:commentsLabel')) ||
            (isGovernmentUser && t('transfer:govCommentLabel')) ||
            t('transfer:toOrgCommentLabel')
          }
          description={t('transfer:commentsDescText')}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={handleToggle}
            sx={{ cursor: 'pointer' }}
          >
            <IconButton aria-label="expand comments">
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={isExpanded}>
            <TextField
              {...register(commentField)}
              multiline
              fullWidth
              rows={4}
              variant="outlined"
            />
          </Collapse>
        </LabelBox>
      </>
    )
  )
}