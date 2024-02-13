// External Modules
import { faArrowLeft, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { schemaValidation } from './_schema'

// Internal Modules
import BCAlert from '@/components/BCAlert'
import BCButton from '@/components/BCButton'
import Loading from '@/components/Loading'
import { ROUTES } from '@/constants/routes'
import { useOrganization } from '@/hooks/useOrganization'
import { useApiService } from '@/services/useApiService'

// Component for adding a new organization
export const AddEditOrg = ({ mode }) => {
  const { t } = useTranslation(['common', 'org'])
  const navigate = useNavigate()
  const apiService = useApiService()
  const { orgID } = useParams()

  const { data, isFetched } = useOrganization(orgID, {
    enabled: mode === 'edit',
    retry: false
  })

  // State for controlling checkbox behavior
  const [sameAsLegalName, setSameAsLegalName] = useState(false)
  const [sameAsServiceAddress, setSameAsServiceAddress] = useState(false)

  // useForm hook setup with React Hook Form and Yup for form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset
  } = useForm({
    resolver: yupResolver(schemaValidation),
    defaultValues: {
      orgRegForTransfers: 2
    }
  })

  useEffect(() => {
    if (isFetched && data) {
      reset({
        orgLegalName: data.name,
        orgOperatingName: data?.operating_name,
        orgEmailAddress: data.email,
        orgPhoneNumber: data.phone,
        orgEDRMSRecord: data.edrms_record,
        orgRegForTransfers:
          data.org_status.organization_status_id === 2 ? '2' : '1',
        orgStreetAddress: data.org_address.street_address,
        orgAddressOther: data.org_address.address_other,
        orgCity: data.org_address.city,
        orgPostalCodeZipCode: data.org_address.postalCode_zipCode,
        orgAttorneyStreetAddress: data.org_attorney_address.street_address,
        orgAttroneyAddressOther: data.org_attorney_address.address_other,
        orgAttroneyCity: data.org_attorney_address.city,
        orgAttroneyPostalCodeZipCode:
          data.org_attorney_address.postalCode_zipCode
      })

      if (
        data.name === data?.operating_name ||
        (data.name && !data?.operating_name)
      ) {
        setSameAsLegalName(true)
      }

      if (
        data.org_address.postalCode_zipCode ===
          data.org_attorney_address.postalCode_zipCode &&
        data.org_address.street_address ===
          data.org_attorney_address.street_address
      ) {
        setSameAsServiceAddress(true)
      }
    }
  }, [isFetched])

  // Watching form fields
  const orgLegalName = watch('orgLegalName')
  const orgStreetAddress = watch('orgStreetAddress')
  const orgAddressOther = watch('orgAddressOther')
  const orgCity = watch('orgCity')
  const orgPostalCodeZipCode = watch('orgPostalCodeZipCode')

  // Set value and trigger validation function
  const setValueAndTriggerValidation = useCallback(
    (fieldName, value) => {
      if (watch(fieldName) !== value) {
        setValue(fieldName, value)
        if (value.trim().length > 0) {
          trigger(fieldName)
        }
      }
    },
    [setValue, trigger, watch]
  )

  // Clear fields function
  const clearFields = useCallback(
    (fields) => {
      fields.forEach((fieldName) => {
        if (watch(fieldName)) {
          setValue(fieldName, '')
        }
      })
    },
    [setValue, watch]
  )

  // Function to render form error messages
  const renderError = (fieldName, sameAsField = null) => {
    // If the sameAsField is provided and is true, hide errors for this field
    if (sameAsField && watch(sameAsField)) {
      return null
    }
    return (
      errors[fieldName] && (
        <Typography color="error" variant="caption">
          {errors[fieldName].message}
        </Typography>
      )
    )
  }

  // Prepare payload and call mutate function
  const onSubmit = async (data) => {
    const payload = {
      organization_id: orgID,
      name: data.orgLegalName,
      operating_name: data.orgOperatingName,
      email: data.orgEmailAddress,
      phone: data.orgPhoneNumber,
      edrms_record: data.orgEDRMSRecord,
      organization_status_id: parseInt(data.orgRegForTransfers),
      organization_type_id: parseInt(data.orgSupplierType),
      address: {
        name: data.orgOperatingName,
        street_address: data.orgStreetAddress,
        address_other: data.orgAddressOther || '',
        city: data.orgCity,
        province_state: data.orgProvince || 'BC',
        country: data.orgCountry || 'Canada',
        postalCode_zipCode: data.orgPostalCodeZipCode
      },
      attorney_address: {
        name: data.orgOperatingName,
        street_address: data.orgAttroneyStreetAddress,
        address_other: data.orgAttroneyAddressOther || '',
        city: data.orgAttroneyCity,
        province_state: data.orgAttroneyProvince || 'BC',
        country: data.orgAttroneyCountry || 'Canada',
        postalCode_zipCode: data.orgAttroneyPostalCodeZipCode
      }
    }

    if (mode === 'add') {
      createOrg(payload)
    }
    if (mode === 'edit') {
      updateOrg(payload)
    }
  }

  // useMutation hook from React Query for handling API request
  const {
    mutate: createOrg,
    isPending: isCreateOrgPending,
    isError: isCreateOrgError
  } = useMutation({
    mutationFn: async (userData) =>
      await apiService.post('/organizations/create', userData),
    onSuccess: () => {
      // Redirect to Organization route on success
      navigate(ROUTES.ORGANIZATIONS, {
        state: {
          message: 'Organization has been successfully added.',
          severity: 'success'
        }
      })
    },
    onError: (error) => {
      // Error handling logic
      console.error('Error posting data:', error)
    }
  })

  const {
    mutate: updateOrg,
    isPending: isUpdateOrgPending,
    isError: isUpdateOrgError
  } = useMutation({
    mutationFn: async (payload) =>
      await apiService.put(`/organizations/${orgID}`, payload),
    onSuccees: () => {
      navigate(ROUTES.ORGANIZATIONS, {
        state: {
          message: 'Organization has been successfully updated.',
          severity: 'success'
        }
      })
    },
    onError: (error) => {
      console.error('Error posting data:', error)
    }
  })

  // Syncing logic for 'sameAsLegalName'
  useEffect(() => {
    if (sameAsLegalName) {
      setValueAndTriggerValidation('orgOperatingName', orgLegalName)
    } else {
      clearFields(['orgOperatingName'])
    }
  }, [sameAsLegalName, orgLegalName, setValueAndTriggerValidation, clearFields])

  // Syncing logic for 'sameAsServiceAddress'
  useEffect(() => {
    const attorneyFields = [
      'orgAttroneyStreetAddress',
      'orgAttroneyAddressOther',
      'orgAttroneyCity',
      'orgAttroneyPostalCodeZipCode'
    ]
    if (sameAsServiceAddress) {
      const fieldsToSync = [
        { target: 'orgAttroneyStreetAddress', value: orgStreetAddress },
        { target: 'orgAttroneyAddressOther', value: orgAddressOther },
        { target: 'orgAttroneyCity', value: orgCity },
        { target: 'orgAttroneyPostalCodeZipCode', value: orgPostalCodeZipCode }
      ]
      fieldsToSync.forEach(({ target, value }) =>
        setValueAndTriggerValidation(target, value)
      )
    } else {
      clearFields(attorneyFields)
    }
  }, [
    sameAsServiceAddress,
    orgStreetAddress,
    orgAddressOther,
    orgCity,
    orgPostalCodeZipCode,
    setValueAndTriggerValidation,
    clearFields
  ])

  // Conditional rendering for loading
  if (isCreateOrgPending || isUpdateOrgPending) {
    return <Loading message="Adding Organization..." />
  }

  // Form layout and structure
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        border: 'none'
      }}
      data-test="addEditOrgContainer"
    >
      {/* Error Alert */}
      {(isCreateOrgError || isUpdateOrgError) && (
        <BCAlert severity="error">{t('org:errMsg')}</BCAlert>
      )}

      <Typography variant="h5" px={3}>
        {t('org:addOrgTitle')}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        {/* Form Fields */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ bgcolor: 'background.grey', p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mr: { sm: 0, md: 4 } }}>
                    <Box mb={2}>
                      <InputLabel htmlFor="orgLegalName" sx={{ pb: 1 }}>
                        {t('org:legalNameLabel')}
                      </InputLabel>
                      <TextField
                        required
                        id="orgLegalName"
                        name="orgLegalName"
                        data-test="orgLegalName"
                        variant="outlined"
                        fullWidth
                        error={!!errors.orgLegalName}
                        helperText={errors.orgLegalName?.message}
                        {...register('orgLegalName')}
                      />
                    </Box>
                    <Box mb={2}>
                      <Grid container>
                        <Grid item xs={6}>
                          <InputLabel htmlFor="orgOperatingName" sx={{ pb: 1 }}>
                            {t('org:operatingNameLabel')}:
                          </InputLabel>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={sameAsLegalName}
                                onChange={(e) =>
                                  setSameAsLegalName(e.target.checked)
                                }
                                data-test="sameAsLegalName"
                              />
                            }
                            label={
                              <Typography variant="body3">
                                {t('org:sameAsLegalNameLabel')}
                              </Typography>
                            }
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        required
                        disabled={sameAsLegalName}
                        id="orgOperatingName"
                        name="orgOperatingName"
                        data-test="orgOperatingName"
                        variant="outlined"
                        fullWidth
                        error={!!errors.orgOperatingName}
                        helperText={errors.orgOperatingName?.message}
                        {...register('orgOperatingName')}
                      />
                    </Box>
                    <Box mb={2}>
                      <InputLabel htmlFor="orgEmailAddress" sx={{ pb: 1 }}>
                        {t('org:emailAddrLabel')}:
                      </InputLabel>
                      <TextField
                        required
                        id="orgEmailAddress"
                        name="orgEmailAddress"
                        data-test="orgEmailAddress"
                        variant="outlined"
                        fullWidth
                        error={!!errors.orgEmailAddress}
                        helperText={errors.orgEmailAddress?.message}
                        {...register('orgEmailAddress')}
                      />
                    </Box>
                    <Box mb={2}>
                      <InputLabel htmlFor="orgPhoneNumber" sx={{ pb: 1 }}>
                        {t('org:phoneNbrLabel')}:
                      </InputLabel>
                      <TextField
                        required
                        id="orgPhoneNumber"
                        name="orgPhoneNumber"
                        data-test="orgPhoneNumber"
                        variant="outlined"
                        fullWidth
                        error={!!errors.orgPhoneNumber}
                        helperText={errors.orgPhoneNumber?.message}
                        {...register('orgPhoneNumber')}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Box mb={2}>
                      <FormControl fullWidth>
                        <Grid container>
                          <Grid item xs={4}>
                            <FormLabel id="orgSupplierType" sx={{ pb: 1 }}>
                              <Typography variant="body3">
                                {t('org:supplierTypLabel')}:
                              </Typography>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={8}>
                            <RadioGroup
                              row
                              id="orgSupplierType"
                              name="orgSupplierType"
                              defaultValue="1"
                              sx={{ pt: 1 }}
                            >
                              <FormControlLabel
                                value="1"
                                control={
                                  <Radio
                                    {...register('orgSupplierType')}
                                    data-test="orgSupplierType1"
                                  />
                                }
                                label={
                                  <Typography variant="body3">
                                    {t('supplier')}
                                  </Typography>
                                }
                              />
                            </RadioGroup>
                            {renderError('orgSupplierType')}
                          </Grid>
                        </Grid>
                      </FormControl>
                    </Box>
                    <Box mb={2}>
                      <FormControl fullWidth>
                        <Grid container>
                          <Grid item xs={4}>
                            <FormLabel id="orgRegForTransfers" sx={{ pb: 1 }}>
                              <Typography variant="body3">
                                {t('org:regTrnLabel')}:
                              </Typography>
                            </FormLabel>
                          </Grid>
                          <Grid item xs={8}>
                            <RadioGroup
                              id="orgRegForTransfers"
                              name="orgRegForTransfers"
                              sx={{ pt: 1 }}
                            >
                              <FormControlLabel
                                value="2"
                                control={
                                  <Radio
                                    {...register('orgRegForTransfers')}
                                    data-test="orgRegForTransfers2"
                                  />
                                }
                                label={
                                  <Typography variant="body3">
                                    {t('yes')}
                                  </Typography>
                                }
                              />
                              <FormControlLabel
                                value="1"
                                control={
                                  <Radio
                                    {...register('orgRegForTransfers')}
                                    data-test="orgRegForTransfers1"
                                  />
                                }
                                label={
                                  <Typography variant="body3">
                                    {t('no')}
                                  </Typography>
                                }
                              />
                            </RadioGroup>
                            {renderError('orgRegForTransfers')}
                          </Grid>
                        </Grid>
                      </FormControl>
                    </Box>
                    <Box mb={2}>
                      <InputLabel htmlFor="orgEDRMSRecord" sx={{ pb: 1 }}>
                        {t('org:edrmsLabel')}:
                      </InputLabel>
                      <TextField
                        required
                        id="orgEDRMSRecord"
                        name="orgEDRMSRecord"
                        data-test="orgEDRMSRecord"
                        variant="outlined"
                        fullWidth
                        error={!!errors.orgEDRMSRecord}
                        helperText={errors.orgEDRMSRecord?.message}
                        {...register('orgEDRMSRecord')}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} data-testid="service-address-section">
            <Box sx={{ bgcolor: 'background.grey', p: 3 }}>
              <Typography variant="h6" sx={{ pb: 7 }}>
                {t('org:serviceAddrLabel')}
              </Typography>
              <Box mb={2}>
                <InputLabel htmlFor="orgStreetAddress" sx={{ pb: 1 }}>
                  {t('org:streetAddrLabel')}:
                </InputLabel>
                <TextField
                  required
                  id="orgStreetAddress"
                  name="orgStreetAddress"
                  data-test="orgStreetAddress"
                  variant="outlined"
                  fullWidth
                  error={!!errors.orgStreetAddress}
                  helperText={errors.orgStreetAddress?.message}
                  {...register('orgStreetAddress')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgAddressOther" sx={{ pb: 1 }}>
                  {t('org:addrOthLabel')}:
                </InputLabel>
                <TextField
                  id="orgAddressOther"
                  name="orgAddressOther"
                  data-test="orgAddressOther"
                  variant="outlined"
                  fullWidth
                  {...register('orgAddressOther')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgCity" sx={{ pb: 1 }}>
                  {t('org:cityLabel')}:
                </InputLabel>
                <TextField
                  required
                  id="orgCity"
                  name="orgCity"
                  data-test="orgCity"
                  variant="outlined"
                  fullWidth
                  error={!!errors.orgCity}
                  helperText={errors.orgCity?.message}
                  {...register('orgCity')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgProvince" sx={{ pb: 1 }}>
                  {t('org:provinceLabel')}:
                </InputLabel>
                <TextField
                  disabled
                  id="orgProvince"
                  name="orgProvince"
                  data-test="orgProvince"
                  variant="outlined"
                  defaultValue="BC"
                  {...register('orgProvince')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgCountry" sx={{ pb: 1 }}>
                  {t('org:cntryLabel')}:
                </InputLabel>
                <TextField
                  disabled
                  id="orgCountry"
                  name="orgCountry"
                  data-test="orgCountry"
                  variant="outlined"
                  defaultValue="Canada"
                  {...register('orgCountry')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgPostalCodeZipCode" sx={{ pb: 1 }}>
                  {t('org:poLabel')}:
                </InputLabel>
                <TextField
                  required
                  id="orgPostalCodeZipCode"
                  name="orgPostalCodeZipCode"
                  data-test="orgPostalCodeZipCode"
                  variant="outlined"
                  fullWidth
                  error={!!errors.orgPostalCodeZipCode}
                  helperText={errors.orgPostalCodeZipCode?.message}
                  {...register('orgPostalCodeZipCode')}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} data-testid="attorney-address-section">
            <Box sx={{ bgcolor: 'background.grey', p: 3 }}>
              <Typography variant="h6" sx={{ pb: 2 }}>
                {t('org:bcAddrLabel')}
              </Typography>
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsServiceAddress}
                      onChange={(e) =>
                        setSameAsServiceAddress(e.target.checked)
                      }
                    />
                  }
                  label={
                    <Typography variant="body3">
                      {t('org:sameAddrLabel')}
                    </Typography>
                  }
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgAttroneyStreetAddress" sx={{ pb: 1 }}>
                  {t('org:streetAddrLabel')}:
                </InputLabel>
                <TextField
                  required
                  disabled={sameAsServiceAddress}
                  id="orgAttroneyStreetAddress"
                  name="orgAttroneyStreetAddress"
                  data-test="orgAttroneyStreetAddress"
                  variant="outlined"
                  fullWidth
                  error={!!errors.orgAttroneyStreetAddress}
                  helperText={errors.orgAttroneyStreetAddress?.message}
                  {...register('orgAttroneyStreetAddress')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgAttroneyAddressOther" sx={{ pb: 1 }}>
                  {t('org:addrOthLabel')}:
                </InputLabel>
                <TextField
                  disabled={sameAsServiceAddress}
                  id="orgAttroneyAddressOther"
                  name="orgAttroneyAddressOther"
                  data-test="orgAttroneyAddressOther"
                  variant="outlined"
                  fullWidth
                  {...register('orgAttroneyAddressOther')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgAttroneyCity" sx={{ pb: 1 }}>
                  {t('org:cityLabel')}:
                </InputLabel>
                <TextField
                  required
                  disabled={sameAsServiceAddress}
                  id="orgAttroneyCity"
                  name="orgAttroneyCity"
                  data-test="orgAttroneyCity"
                  variant="outlined"
                  fullWidth
                  error={!!errors.orgAttroneyCity}
                  helperText={errors.orgAttroneyCity?.message}
                  {...register('orgAttroneyCity')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgAttroneyProvince" sx={{ pb: 1 }}>
                  {t('org:provinceLabel')}:
                </InputLabel>
                <TextField
                  disabled
                  id="orgAttroneyProvince"
                  name="orgAttroneyProvince"
                  data-test="orgAttroneyProvince"
                  variant="outlined"
                  defaultValue="BC"
                  {...register('orgAttroneyProvince')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel htmlFor="orgAttroneyCountry" sx={{ pb: 1 }}>
                  {t('org:cntryLabel')}:
                </InputLabel>
                <TextField
                  disabled
                  id="orgAttroneyCountry"
                  name="orgAttroneyCountry"
                  data-test="orgAttroneyCountry"
                  variant="outlined"
                  defaultValue="Canada"
                  {...register('orgAttroneyCountry')}
                />
              </Box>
              <Box mb={2}>
                <InputLabel
                  htmlFor="orgAttroneyPostalCodeZipCode"
                  sx={{ pb: 1 }}
                >
                  {t('org:poLabel')}:
                </InputLabel>
                <TextField
                  required
                  disabled={sameAsServiceAddress}
                  id="orgAttroneyPostalCodeZipCode"
                  name="orgAttroneyPostalCodeZipCode"
                  data-test="orgAttroneyPostalCodeZipCode"
                  variant="outlined"
                  fullWidth
                  error={!!errors.orgAttroneyPostalCodeZipCode}
                  helperText={errors.orgAttroneyPostalCodeZipCode?.message}
                  {...register('orgAttroneyPostalCodeZipCode')}
                />
              </Box>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                bgcolor: 'background.grey',
                p: 3,
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <BCButton
                variant="outlined"
                size="medium"
                color="primary"
                sx={{
                  backgroundColor: 'white.main'
                }}
                startIcon={
                  <FontAwesomeIcon icon={faArrowLeft} className="small-icon" />
                }
                onClick={() => navigate(ROUTES.ORGANIZATIONS)}
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
                data-test="saveOrganization"
                sx={{ ml: 2 }}
                data-testid="saveOrganization"
                startIcon={
                  <FontAwesomeIcon icon={faFloppyDisk} className="small-icon" />
                }
              >
                <Typography variant="button">{t('saveBtn')}</Typography>
              </BCButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
