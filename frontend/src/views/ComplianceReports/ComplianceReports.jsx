// mui components
import { Typography, Stack } from '@mui/material'
import BCBox from '@/components/BCBox'
import BCAlert from '@/components/BCAlert'
import BCDataGridServer from '@/components/BCDataGrid/BCDataGridServer'
// react components
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
// Services
import { Role } from '@/components/Role'
// constants
import { roles } from '@/constants/roles'
import { ROUTES, apiRoutes } from '@/constants/routes'
import { COMPLIANCE_REPORT_STATUSES } from '@/constants/statuses'
// hooks
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useCreateComplianceReport } from '@/hooks/useComplianceReports'
// internal components
import { reportsColDefs } from './components/_schema'
import { NewComplianceReportButton } from './components/NewComplianceReportButton'
import Loading from '@/components/Loading'

export const ComplianceReports = () => {
  const { t } = useTranslation(['common', 'report'])
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('info')
  const [gridKey, setGridKey] = useState(`compliance-reports-grid`)

  const gridRef = useRef()
  const alertRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const { hasRoles, data: currentUser } = useCurrentUser()

  const gridOptions = useMemo(() => ({
    overlayNoRowsTemplate: t('report:noReportsFound')
  }))
  const getRowId = useCallback((params) => params.data.complianceReportId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRowClicked = useCallback(({data}) => {
    console.log("I'm here")
    navigate(
      ROUTES.REPORTS_VIEW.replace(
        ':compliancePeriod',
        data.compliancePeriod.description
      ).replace(':complianceReportId', data.complianceReportId)
    )
  })

  const handleGridKey = useCallback(() => {
    setGridKey(`reports-grid`)
  }, [])

  useEffect(() => {
    if (location.state?.message) {
      setAlertMessage(location.state.message)
      setAlertSeverity(location.state.severity || 'info')
    }
  }, [location.state])

  const {
    mutate: createComplianceReport,
    isLoading: isCreating,
    isError
  } = useCreateComplianceReport(currentUser?.organization?.organizationId, {
    onSuccess: (response, variables) => {
      setAlertMessage(
        t('report:actionMsgs.successText', {
          status: 'created'
        })
      )
      setAlertSeverity('success')
      navigate(
        ROUTES.REPORTS_VIEW.replace(
          ':compliancePeriod',
          response.data.compliancePeriod.description
        ).replace(':complianceReportId', response.data.complianceReportId),
        { state: { data: response.data } }
      )
      alertRef.current.triggerAlert()
    },
    onError: (_error, _variables) => {
      const errorMsg = _error.response.data?.detail
      setAlertMessage(errorMsg)
      setAlertSeverity('error')
      alertRef.current.triggerAlert()
    }
  })

  if (isCreating) {
    return <Loading />
  }
  return (
    <>
      <div>
        {alertMessage && (
          <BCAlert
            ref={alertRef}
            data-test="alert-box"
            severity={alertSeverity}
            delay={6500}
          >
            {alertMessage}
          </BCAlert>
        )}
      </div>
      <Typography variant="h5" color="primary">
        {t('report:title')}
      </Typography>
      <Stack
        direction={{ md: 'coloumn', lg: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 3 }}
        useFlexGap
        flexWrap="wrap"
        my={{ xs: 1, sm: 1, md: 2 }}
        mx={0}
      >
        <Role roles={[roles.supplier]}>
          <NewComplianceReportButton
            handleNewReport={(option) => {
              createComplianceReport({
                compliancePeriod: option.description,
                organizationId: currentUser?.organization?.organizationId,
                status: COMPLIANCE_REPORT_STATUSES.DRAFT
              })
            }}
          />
        </Role>
        <BCBox component="div" sx={{ height: '100%', width: '100%' }}>
          <BCDataGridServer
            gridRef={gridRef}
            apiEndpoint={
              hasRoles(roles.supplier)
                ? apiRoutes.getOrgComplianceReports
                : apiRoutes.getComplianceReports
            }
            apiData={'reports'}
            columnDefs={reportsColDefs(t, hasRoles(roles.supplier))}
            gridKey={gridKey}
            getRowId={getRowId}
            // defaultSortModel={defaultSortModel}
            gridOptions={gridOptions}
            handleGridKey={handleGridKey}
            handleRowClicked={handleRowClicked}
            enableCopyButton={false}
          />
        </BCBox>
      </Stack>
    </>
  )
}
