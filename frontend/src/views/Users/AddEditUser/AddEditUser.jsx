import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// hooks
import { saveUpdateUser, useUser } from '@/hooks/useUser'
import {
  userInfoSchema,
  idirTextFields,
  bceidTextFields,
  defaultValues,
  statusOptions
} from './_schema'
import { useApiService } from '@/services/useApiService'
import { ROUTES } from '@/constants/routes'
// components
import { BCFormRadio, BCFormText } from '@/components/BCForm'
import colors from '@/themes/base/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import BCButton from '@/components/BCButton'
import { Box, Stack, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import BCAlert from '@/components/BCAlert'
import Loading from '@/components/Loading'
import { IDIRSpecificRoleFields } from './components/IDIRSpecificRoleFields'
import { BCeIDSpecificRoleFields } from './components/BCeIDSpecificRoleFields'
import { roles } from '@/constants/roles'

// switch between 'idir' and 'bceid'
export const AddEditUser = ({ userType = 'bceid', edit = false }) => {
  const navigate = useNavigate()
  const apiService = useApiService()
  const { t } = useTranslation(['common', 'admin'])
  const { userID, orgID } = useParams()
  const [orgId, setOrgId] = useState(orgID)

  const {
    data,
    isLoading: isUserLoading,
    isFetched: isUserFetched
  } = useUser(userID, { enabled: !!userID, retry: false })
  // User form hook and form validation
  const form = useForm({
    resolver: yupResolver(userInfoSchema),
    mode: 'onChange',
    defaultValues
  })
  const { handleSubmit, control, setValue, watch, reset, trigger } = form
  const [disabled, setDisabled] = useState(false)
  const textFields = useMemo(
    () => (orgID || orgId ? bceidTextFields(t) : idirTextFields(t)),
    [t]
  )
  const status = watch('status')
  const readOnly = watch('readOnly')

  useEffect(() => {
    if (status !== 'active' || readOnly === 'read only') {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [status, readOnly])

  useEffect(() => {
    if (isUserFetched && data) {
      const dataRoles = data?.roles.map((role) => role.name.toLowerCase())
      const userData = {
        keycloakEmail: data?.keycloak_email,
        altEmail: data?.email,
        jobTitle: data?.title,
        firstName: data?.first_name,
        lastName: data?.last_name,
        userName: data?.keycloak_username,
        phone: data?.phone,
        mobile: data?.mobile_phone,
        status: data?.is_active ? 'active' : 'inactive',
        readOnly: dataRoles
          .filter((r) => r === roles.read_only.toLocaleLowerCase())
          .join(''),
        adminRole: dataRoles.filter((r) => r === roles.administrator.toLocaleLowerCase()),
        idirRole: dataRoles
          .filter((r) => r !== roles.administrator.toLocaleLowerCase())
          .join(''),
        bceidRoles: dataRoles.includes(roles.read_only.toLocaleLowerCase())
          ? []
          : dataRoles
      }

      reset(userData)
      setOrgId(data.organization?.organization_id)
    }
  }, [isUserFetched, data, reset, orgId])
  // Prepare payload and call mutate function
  const onSubmit = (data) => {
    const payload = {
      user_profile_id: userID,
      title: data.jobTitle,
      first_name: data.firstName,
      last_name: data.lastName,
      keycloak_username: data.userName,
      keycloak_email: data.keycloakEmail,
      email: data.altEmail === '' ? null : data.altEmail,
      phone: data.phone,
      mobile_phone: data.mobile,
      is_active: data.status === 'active',
      organization_id: orgID,
      roles:
        data.status === 'active'
          ? [
              ...data.adminRole,
              ...(data.readOnly === '' ? data.bceidRoles : []),
              data.idirRole,
              data.readOnly
            ]
          : []
    }
    mutate(payload)
  }

  const onErrors = (error) => {
    console.log(error)
  }
  // useMutation hook from React Query for handling API request
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (payload) =>
      userID
        ? await apiService.put(`/users/${userID}`, payload)
        : await apiService.post('/users', payload),
    onSuccess: () => {
      // on success navigate somewhere
      if (orgID) {
        navigate(ROUTES.ORGANIZATIONS_VIEW.replace(':orgID', orgID), {
          state: {
            message: 'User has been successfully saved.',
            severity: 'success'
          }
        })
      } else {
        navigate(ROUTES.ADMIN_USERS, {
          state: {
            message: 'User has been successfully saved.',
            severity: 'success'
          }
        })
      }
    },
    onError: (error) => {
      // handle axios errors here
      console.error('Error saving user:', error)
    }
  })

  if (isUserLoading) {
    return <Loading message="Loading..." />
  }

  if (isPending) {
    return <Loading message="Adding user..." />
  }

  return (
    <div>
      {isError && <BCAlert severity="error">{t('admin:errMsg')}</BCAlert>}
      <Typography variant="h5" color={colors.primary.main} mb={2}>
        {userID ? 'Edit' : 'Add'} user&nbsp;
        {userType === 'bceid' && `to Test Org`}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit, onErrors)}>
        <FormProvider {...{ control, setValue }}>
          <Grid2 container columnSpacing={2.5} rowSpacing={3.5}>
            {/* Form fields */}
            <Grid2 xs={12} md={5} lg={4}>
              <Stack bgcolor={colors.background.grey} p={3} spacing={1} mb={3}>
                {textFields.map((field) => (
                  <BCFormText
                    key={field.name}
                    control={control}
                    label={field.label}
                    name={field.name}
                    optional={field.optional}
                  />
                ))}
              </Stack>
              <Box
                bgcolor={colors.background.grey}
                px={3}
                display="flex"
                justifyContent="space-between"
              >
                <BCButton
                  variant="outlined"
                  size="medium"
                  color="primary"
                  sx={{
                    backgroundColor: 'white.main'
                  }}
                  startIcon={
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="small-icon"
                    />
                  }
                  onClick={() =>
                    navigate(
                      userType === 'idir'
                        ? ROUTES.ADMIN_USERS
                        : ROUTES.ORGANIZATIONS
                    )
                  }
                >
                  <Typography variant="subtitle2" textTransform="none">
                    {t('backBtn')}
                  </Typography>
                </BCButton>
                <BCButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  color="primary"
                  data-test="saveUser"
                  sx={{ ml: 2 }}
                  data-testid="saveUser"
                  startIcon={
                    <FontAwesomeIcon
                      icon={faFloppyDisk}
                      className="small-icon"
                    />
                  }
                >
                  <Typography variant="button">{t('saveBtn')}</Typography>
                </BCButton>
              </Box>
            </Grid2>
            <Grid2 xs={12} md={7} lg={6}>
              <Stack bgcolor={colors.background.grey} p={3} spacing={2} mb={3}>
                <BCFormRadio
                  control={control}
                  name="status"
                  label="Status"
                  options={statusOptions(t)}
                />
                {userType === 'bceid' || orgId ? (
                  <BCeIDSpecificRoleFields
                    form={form}
                    disabled={disabled}
                    status={status}
                    t={t}
                  />
                ) : (
                  <IDIRSpecificRoleFields
                    form={form}
                    disabled={disabled}
                    t={t}
                  />
                )}
              </Stack>
            </Grid2>
          </Grid2>
        </FormProvider>
      </form>
    </div>
  )
}
