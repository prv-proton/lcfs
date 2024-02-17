/* eslint-disable react-hooks/exhaustive-deps */
// @mui component
import BCTypography from '@/components/BCTypography'
import BCButton from '@/components/BCButton'
import BCBox from '@/components/BCBox'
import BCAlert from '@/components/BCAlert'
import BCDataGridServer from '@/components/BCDataGrid/BCDataGridServer'
import { Snackbar } from '@mui/material'
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
// hooks
import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { ROUTES, apiRoutes } from '@/constants/routes'
import { usersColumnDefs } from './_schema'
// import DemoButtons from './DemoButtons'

export const Users = () => {
  const { t } = useTranslation(['common', 'admin'])
  const location = useLocation()
  const [gridKey, setGridKey] = useState('users-grid')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('info')
  const [showAlert, setShowAlert] = useState(false)

  const handleGridKey = useCallback(() => {
    setGridKey(`users-grid-${Math.random()}`)
    if (gridRef.current) {
      gridRef.current.api.deselectAll()
    }
  }, [])
  const gridOptions = {
    overlayNoRowsTemplate: t('admin:usersNotFound')
  }
  const defaultSortModel = [
    { field: 'is_active', direction: 'desc' },
    { field: 'first_name', direction: 'asc' }
  ]
  const navigate = useNavigate()

  const handleNewUserClick = () => {
    navigate(ROUTES.ADMIN_USERS_ADD)
  }
  const getRowId = useCallback((params) => {
    return params.data.user_profile_id
  }, [])

  const handleRowClicked = useCallback((params) => {
    navigate(`${ROUTES.ADMIN_USERS}/${params.data.user_profile_id}`)
  })

  const gridRef = useRef()
  const closeAlert = () => {
    setShowAlert(false)
  }
  useEffect(() => {
    if (location.state?.message) {
      setShowAlert(true)
      setAlertMessage(location.state.message)
      setAlertSeverity(location.state.severity || 'info')
    }
  }, [location.state])

  return (
    <>
      <BCBox component="div">
        <Snackbar
          sx={{ marginTop: '150px' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={showAlert}
          onClose={closeAlert}
          TransitionComponent={'Slide'}
          autoHideDuration={5000} // Automatically close after 6 seconds
        >
          <BCAlert data-test="alert-box" severity={alertSeverity}>
            {alertMessage}
          </BCAlert>
        </Snackbar>
        <BCTypography variant="h5" my={1} color="primary">
          {t('admin:Users')}
        </BCTypography>
        <BCButton
          variant="contained"
          size="small"
          color="primary"
          startIcon={
            <FontAwesomeIcon icon={faCirclePlus} className="small-icon" />
          }
          onClick={handleNewUserClick}
        >
          <BCTypography variant="subtitle2">
            {t('admin:newUserBtn')}
          </BCTypography>
        </BCButton>
        <BCBox
          my={2}
          component="div"
          className="ag-theme-alpine"
          style={{ height: '100%', width: '100%' }}
        >
          {/* <DemoButtons gridRef={gridRef} handleGridKey={handleGridKey} /> */}
          <BCDataGridServer
            gridRef={gridRef}
            apiEndpoint={apiRoutes.listUsers}
            apiData={'users'}
            columnDefs={usersColumnDefs(t)}
            gridKey={gridKey}
            getRowId={getRowId}
            gridOptions={gridOptions}
            defaultSortModel={defaultSortModel}
            handleGridKey={handleGridKey}
            handleRowClicked={handleRowClicked}
            enableCopyButton={false}
          />
        </BCBox>
      </BCBox>
    </>
  )
}

Users.propTypes = {}
