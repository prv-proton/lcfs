import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BCAlert from '@/components/BCAlert'
import BCButton from '@/components/BCButton'
import BCBox from '@/components/BCBox'
import Loading from '@/components/Loading'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BCDataGridEditor from '@/components/BCDataGrid/BCDataGridEditor'
import { defaultColDef, notionalTransferColDefs } from './_schema'
import { AddRowsButton } from './components/AddRowsButton'
import { useNotionalTransferOptions, useGetNotionalTransfers, useSaveNotionalTransfer } from '@/hooks/useNotionalTransfer'
import { v4 as uuid } from 'uuid'

export const AddEditNotionalTransfers = () => {
  const [rowData, setRowData] = useState([])
  const [gridApi, setGridApi] = useState(null)
  const [columnApi, setColumnApi] = useState(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('info')

  const gridRef = useRef(null)
  const alertRef = useRef()
  const location = useLocation()
  const { t } = useTranslation(['common', 'notionalTransfer'])
  const { complianceReportId } = useParams()
  const { data: optionsData, isLoading: optionsLoading, isFetched } = useNotionalTransferOptions()
  const { data: notionalTransfers, isLoading: transfersLoading } = useGetNotionalTransfers(complianceReportId)
  const { mutate: saveRow } = useSaveNotionalTransfer()

  const gridKey = 'add-notional-transfer'
  const gridOptions = useMemo(
    () => ({
      overlayNoRowsTemplate: t('notionalTransfer:noNotionalTransfersFound'),
      autoSizeStrategy: {
        type: 'fitCellContents',
        defaultMinWidth: 50,
        defaultMaxWidth: 600,
      },
    }),
    [t]
  )

  useEffect(() => {
    if (location.state?.message) {
      setAlertMessage(location.state.message)
      setAlertSeverity(location.state.severity || 'info')
    }
  }, [location.state])

  const onGridReady = (params) => {
    setGridApi(params.api)
    setColumnApi(params.columnApi)

    const ensureRowIds = (rows) => {
      return rows.map(row => {
        if (!row.id) {
          return { 
            ...row, 
            id: uuid(),
            isValid: true
          }
        }
        return row
      })
    }

    if(notionalTransfers && notionalTransfers.length > 0) {
      try {
        setRowData(ensureRowIds(notionalTransfers))
      } catch (error) {
        setAlertMessage(t('errMsg:LoadFailMsg'))
        setAlertSeverity('error')
      }
    } else {
      const id = uuid()
      const emptyRow = { id, complianceReportId }
      setRowData([emptyRow])
    }

    params.api.sizeColumnsToFit()
  }

  const onValidated = (status, message) => {
    let errMsg = ''
    try {
      const field = t(`notionalTransfer:notionalTransferColLabels.${message.response?.data?.detail[0]?.loc[1]}`)
      errMsg = `Error updating row: ${field}  ${message.response?.data?.detail[0]?.msg}`
    } catch (error) {
      errMsg = message
    }
    setAlertMessage(errMsg)
    setAlertSeverity(status)
    alertRef.current?.triggerAlert()
  }

  const statusBarComponent = useMemo(
    () => (
      <Box component="div" m={2}>
        <AddRowsButton gridApi={gridApi} complianceReportId={complianceReportId} />
      </Box>
    ),
    [gridApi, complianceReportId]
  )

  if (optionsLoading || transfersLoading) {
    return <Loading />
  }

  return (
    isFetched && (
      <Grid2 className="add-edit-notional-transfer-container" mx={-1}>
        <div>
          {alertMessage && (
            <BCAlert ref={alertRef} data-test="alert-box" severity={alertSeverity} delay={5000}>
              {alertMessage}
            </BCAlert>
          )}
        </div>
        <div className="header">
          <Typography variant="h5" color="primary">
            {t('notionalTransfer:newNotionalTransferTitle')}
          </Typography>
        </div>
        <BCBox my={2} component="div" style={{ height: '100%', width: '100%' }}>
          <BCDataGridEditor
            gridKey={gridKey}
            className="ag-theme-quartz"
            getRowId={(params) => params.data.id}
            gridRef={gridRef}
            columnDefs={notionalTransferColDefs(t, optionsData, gridApi, onValidated)}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            rowData={rowData}
            setRowData={setRowData}
            gridApi={gridApi}
            columnApi={columnApi}
            gridOptions={gridOptions}
            getRowNodeId={(data) => data.id}
            defaultStatusBar={false}
            statusBarComponent={statusBarComponent}
            saveRow={saveRow}
            onValidated={onValidated}
          />
        </BCBox>
        <Stack
          direction={{ md: 'column', lg: 'row' }}
          spacing={{ xs: 2, sm: 2, md: 3 }}
          useFlexGap
          flexWrap="wrap"
          m={2}
        >
          <BCButton
            variant="contained"
            size="medium"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faFloppyDisk} className="small-icon" />}
            onClick={() => gridApi.stopEditing(false)}
          >
            <Typography variant="subtitle2">{t('notionalTransfer:saveNotionalTransferBtn')}</Typography>
          </BCButton>
        </Stack>
      </Grid2>
    )
  )
}
