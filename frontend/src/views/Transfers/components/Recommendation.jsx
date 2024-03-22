import BCBox from '@/components/BCBox'
import { TRANSFER_STATUSES } from '@/constants/statuses'
import { useTransfer } from '@/hooks/useTransfer'
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export const Recommendation = ({ value, onChange, currentStatus }) => {
  const { t } = useTranslation(['common', 'transfer'])
  const { transferId } = useParams()
  const { data: transferData } = useTransfer(transferId, {
    enabled: !!transferId,
    retry: false
  })

  return (
    <BCBox mt={2}>
      <Typography variant="h6" color="primary" mb={2}>
        {t('transfer:analystRecommend')}
      </Typography>
      {currentStatus === TRANSFER_STATUSES.SUBMITTED ? (
        <RadioGroup
          row
          style={{
            gap: 24,
            alignItems: 'center'
          }}
          name="recommend"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <FormControlLabel
            value="Record"
            control={<Radio />}
            label={t('transfer:recommendRecord')}
          />
          <FormControlLabel
            value="Refuse"
            control={<Radio />}
            label={t('transfer:recommendRefuse')}
          />
        </RadioGroup>
      ) : (
        <Typography>
          The analyst has recommended that you to{' '}
          <strong>{transferData.recommendation}</strong> this transfer.
        </Typography>
      )}
    </BCBox>
  )
}
