import { CommonArrayRenderer } from '@/utils/cellRenderers'
import { Typography } from '@mui/material'
import * as yup from 'yup'
import { FuelCodeActions } from './components/FuelCodeActions'
import { suppressKeyboardEvent } from '@/utils/eventHandlers'
import { apiRoutes } from '@/constants/routes'

export const fuelCodeSchema = (t, optionsData) =>
  yup.object().shape({
    prefix: yup
      .string()
      .oneOf(
        optionsData.fuelCodePrefixes.map((obj) => obj.prefix),
        t('fuelCode:validateMsg.prefix')
      )
      .required(
        t('fuelCode:validateMsg.isRequired', {
          field: t('fuelCode:fuelCodeColLabels.prefix')
        })
      ),
    fuelCode: yup.number().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.fuelCode')
      })
    ),
    company: yup.string().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.company')
      })
    ),
    carbonIntensity: yup.number().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.carbonIntensity')
      })
    ),
    edrms: yup.string().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.edrms')
      })
    ),
    applicationDate: yup.date().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.applicationDate')
      })
    ),
    fuel: yup
      .string()
      .oneOf(
        optionsData.fuelTypes
          .filter((fuel) => !fuel.fossilDerived)
          .map((obj) => obj.fuelType),
        t('fuelCode:validateMsg.fuel')
      )
      .required(
        t('fuelCode:validateMsg.isRequired', {
          field: t('fuelCode:fuelCodeColLabels.fuel')
        })
      ),
    feedstock: yup.string().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.feedstock')
      })
    ),
    feedstockLocation: yup.string().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.feedstockLocation')
      })
    ),
    fuelProductionFacilityCity: yup.string().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.fuelProductionFacilityCity')
      })
    ),
    fuelProductionFacilityProvinceState: yup.string().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t(
          'fuelCode:fuelCodeColLabels.fuelProductionFacilityProvinceState'
        )
      })
    ),
    fuelProductionFacilityCountry: yup.string().required(
      t('fuelCode:validateMsg.isRequired', {
        field: t('fuelCode:fuelCodeColLabels.fuelProductionFacilityCountry')
      })
    )
  })

export const fuelCodeColDefs = (t, optionsData, api, onValidated, client) => [
  {
    colId: 'validation',
    cellRenderer: 'validationRenderer',
    cellRendererParams: { enableSave: false },
    pinned: 'left',
    maxWidth: 60,
    editable: false,
    suppressKeyboardEvent,
    filter: false
  },
  {
    colId: 'action',
    cellRenderer: FuelCodeActions,
    cellRendererParams: { api, onValidated },
    pinned: 'left',
    maxWidth: 110,
    editable: false,
    suppressKeyboardEvent,
    filter: false
  },
  {
    field: 'id',
    cellEditor: 'agTextCellEditor',
    cellDataType: 'text',
    hide: true
  },
  {
    field: 'prefix',
    headerComponent: 'headerComponent',
    headerName: t('fuelCode:fuelCodeColLabels.prefix'),
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: optionsData?.fuelCodePrefixes?.map((obj) => obj.prefix)
    },
    minWidth: 135,
    valueGetter: (params) => params.data.prefix || 'BCLCF'
  },
  {
    field: 'fuelCode',
    headerComponent: 'headerComponent',
    headerName: t('fuelCode:fuelCodeColLabels.fuelCode'),
    cellDataType: 'text',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditor: 'asyncSuggestionEditor',
    cellEditorParams: (params) => ({
      queryKey: 'fuel-code-search',
      queryFn: async ({ queryKey }) => {
        let path = apiRoutes.fuelCodeSearch
        path +=
          'prefix=' +
          (params.data.prefix || 'BCLCF') +
          '&distinctSearch=true&fuelCode=' +
          queryKey[1]
        const response = await client.get(path)
        return response.data
      },
      optionLabel: 'fuelCodes',
      title: 'fuelCode'
    }),
    suppressKeyboardEvent,
    valueGetter: (params) => {
      if (!params.data.fuelCode) {
        const prefix = params.data.prefix || 'BCLCF'
        return optionsData?.fuelCodePrefixes?.find(
          (obj) => obj.prefix === prefix
        )?.nextFuelCode
      }
      return params.data.fuelCode
    },
    tooltipValueGetter: (p) => 'select the next fuel code version'
  },
  {
    field: 'carbonIntensity',
    headerComponent: 'headerComponent',
    headerName: t('fuelCode:fuelCodeColLabels.carbonIntensity'),
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: {
      precision: 2,
      showStepperButtons: false
    },
    cellStyle: (params) => {
      if (params.data.modified && params.data.carbonIntensity ==='') return { borderColor: 'red' }
    },
    type: 'numericColumn'
  },
  {
    field: 'edrms',
    headerComponent: 'headerComponent',
    headerName: t('fuelCode:fuelCodeColLabels.edrms'),
    cellEditor: 'agTextCellEditor',
    cellDataType: 'text'
  },
  {
    field: 'company',
    headerComponent: 'headerComponent',
    headerName: t('fuelCode:fuelCodeColLabels.company'),
    cellDataType: 'text',
    cellEditor: 'asyncSuggestionEditor',
    cellEditorParams: (params) => ({
      queryKey: 'company-name-search',
      queryFn: async ({ queryKey }) => {
        let path = apiRoutes.fuelCodeSearch
        path += 'company=' + queryKey[1]
        const response = await client.get(path)
        return response.data
      },
      title: 'company'
    }),
    valueSetter: (params) => {
      params.data.company = params.newValue
      if (params.newValue === '') {
        params.data.contactName = ''
        params.data.contactEmail = ''
      }
      return true
    },
    suppressKeyboardEvent,
    minWidth: 300
  },
  {
    field: 'contactName',
    headerName: t('fuelCode:fuelCodeColLabels.contactName'),
    cellEditor: 'asyncSuggestionEditor',
    cellDataType: 'text',
    cellEditorParams: (params) => ({
      queryKey: 'contact-name-search',
      queryFn: async ({ queryKey }) => {
        let path = apiRoutes.fuelCodeSearch
        path += 'company=' + params.data.company + '&contactName=' + queryKey[1]
        const response = await client.get(path)
        return response.data
      },
      title: 'contactName',
      enabled: params.data.company !== ''
    }),
    suppressKeyboardEvent,
    minWidth: 300
  },
  {
    field: 'contactEmail',
    headerName: t('fuelCode:fuelCodeColLabels.contactEmail'),
    cellEditor: 'asyncSuggestionEditor',
    cellDataType: 'text',
    cellEditorParams: (params) => ({
      queryKey: 'contact-email-search',
      queryFn: async ({ queryKey }) => {
        let path = apiRoutes.fuelCodeSearch
        path += 'company=' + params.data.company + '&contactName=' + params.data.contactName + '&contactEmail=' + queryKey[1]
        const response = await client.get(path)
        return response.data
      },
      title: 'contactEmail',
      enabled: params.data.company !== '' && params.data.contactName !== ''
    }),
    suppressKeyboardEvent,
    minWidth: 300
  },

  {
    field: 'applicationDate',
    headerName: t('fuelCode:fuelCodeColLabels.applicationDate'),
    maxWidth: 220,
    minWidth: 220,
    cellRenderer: (params) => (
      <Typography variant="body4">
        {params.value ? params.value : 'YYYY-MM-DD'}
      </Typography>
    ),
    suppressKeyboardEvent,
    cellEditor: 'dateEditor'
  },
  {
    field: 'approvalDate',
    headerName: t('fuelCode:fuelCodeColLabels.approvalDate'),
    maxWidth: 220,
    minWidth: 220,
    cellRenderer: (params) => (
      <Typography variant="body4">
        {params.value ? params.value : 'YYYY-MM-DD'}
      </Typography>
    ),
    suppressKeyboardEvent,
    cellEditor: 'dateEditor'
  },
  {
    field: 'effectiveDate',
    headerName: t('fuelCode:fuelCodeColLabels.effectiveDate'),
    maxWidth: 220,
    minWidth: 220,
    cellRenderer: (params) => (
      <Typography variant="body4">
        {params.value ? params.value : 'YYYY-MM-DD'}
      </Typography>
    ),
    suppressKeyboardEvent,
    cellEditor: 'dateEditor'
  },
  {
    field: 'expirationDate',
    headerName: t('fuelCode:fuelCodeColLabels.expiryDate'),
    maxWidth: 220,
    minWidth: 220,
    cellRenderer: (params) => (
      <Typography variant="body4">
        {params.value ? params.value : 'YYYY-MM-DD'}
      </Typography>
    ),
    suppressKeyboardEvent,
    cellEditor: 'dateEditor'
  },
  {
    field: 'fuel',
    headerName: t('fuelCode:fuelCodeColLabels.fuel'),
    cellEditor: 'autocompleteEditor',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      options: optionsData.fuelTypes
        .filter((fuel) => !fuel.fossilDerived)
        .map((obj) => obj.fuelType),
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: false, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    suppressKeyboardEvent,
    minWidth: 300
  },
  {
    field: 'feedstock',
    headerName: t('fuelCode:fuelCodeColLabels.feedstock'),
    cellEditor: 'autocompleteEditor',
    suppressKeyboardEvent,
    cellDataType: 'text',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      noLabel: true,
      options: optionsData.fieldOptions.feedstock,
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: true, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    minWidth: 300
  },
  {
    field: 'feedstockLocation',
    headerName: t('fuelCode:fuelCodeColLabels.feedstockLocation'),
    cellEditor: 'autocompleteEditor',
    suppressKeyboardEvent,
    cellDataType: 'text',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      noLabel: true,
      options: optionsData.fieldOptions.feedstockLocation,
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: true, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    minWidth: 300
  },
  {
    field: 'feedstockMisc',
    headerName: t('fuelCode:fuelCodeColLabels.misc'),
    cellEditor: 'autocompleteEditor',
    suppressKeyboardEvent,
    cellDataType: 'text',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      noLabel: true,
      options: optionsData.fieldOptions.feedstockMisc,
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: true, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    minWidth: 495
  },
  {
    field: 'fuelProductionFacilityCity',
    headerName: t('fuelCode:fuelCodeColLabels.fuelProductionFacilityCity'),
    cellEditor: 'autocompleteEditor',
    suppressKeyboardEvent,
    cellDataType: 'text',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      onDynamicUpdate: (val, params) => params.api.stopEditing(),
      noLabel: true,
      options: [
        ...new Map(
          optionsData.fpLocations.map((location) => [
            location.fuelProductionFacilityCity,
            location.fuelProductionFacilityCity
          ])
        ).values()
      ],
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: true, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    minWidth: 325 // TODO: handle in #486
  },
  {
    field: 'fuelProductionFacilityProvinceState',
    headerName: t(
      'fuelCode:fuelCodeColLabels.fuelProductionFacilityProvinceState'
    ),
    cellEditor: 'autocompleteEditor',
    suppressKeyboardEvent,
    cellDataType: 'text',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      onDynamicUpdate: (val, params) => params.api.stopEditing(),
      noLabel: true,
      options: [
        ...new Map(
          optionsData.fpLocations.map((location) => [
            location.fuelProductionFacilityProvinceState,
            location.fuelProductionFacilityProvinceState
          ])
        ).values()
      ],
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: true, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    minWidth: 325 // TODO: handle in #486
  },
  {
    field: 'fuelProductionFacilityCountry',
    headerName: t('fuelCode:fuelCodeColLabels.fuelProductionFacilityCountry'),
    cellEditor: 'autocompleteEditor',
    suppressKeyboardEvent,
    cellDataType: 'text',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      noLabel: true,
      options: [
        ...new Map(
          optionsData.fpLocations.map((location) => [
            location.fuelProductionFacilityCountry,
            location.fuelProductionFacilityCountry
          ])
        ).values()
      ],
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: true, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    minWidth: 325 // TODO: handle in #486
  },
  {
    field: 'facilityNameplateCapacity',
    headerName: t('fuelCode:fuelCodeColLabels.facilityNameplateCapacity'),
    cellEditor: 'agNumberCellEditor',
    type: 'numericColumn',
    cellEditorParams: {
      precision: 0,
      min: 0,
      showStepperButtons: false
    },
    minWidth: 290
  },
  {
    field: 'facilityNameplateCapacityUnit',
    headerName: t('fuelCode:fuelCodeColLabels.facilityNameplateCapacityUnit'),
    cellEditor: 'autocompleteEditor',
    cellRenderer: (params) =>
      params.value ||
      (!params.value && <Typography variant="body4">Select</Typography>),
    cellEditorParams: {
      options: optionsData.facilityNameplateCapacityUnits,
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: false, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    suppressKeyboardEvent,
    cellStyle: (params) => {
      if (
        params.data.modified &&
        params.data.facilityNameplateCapacity &&
        (!params.value || params.value === '')
      )
        return { borderColor: 'red' }
    },
    minWidth: 300
  },
  {
    field: 'feedstockTransportMode',
    headerName: t('fuelCode:fuelCodeColLabels.feedstockTransportMode'),
    cellEditor: 'autocompleteEditor',
    cellRenderer: (params) =>
      params.value ? (
        <CommonArrayRenderer {...params} />
      ) : (
        <Typography variant="body4">Select</Typography>
      ),
    cellRendererParams: {
      disableLink: true
    },
    cellEditorParams: {
      options: optionsData.transportModes.map((obj) => obj.transportMode),
      multiple: true,
      openOnFocus: true,
      disableCloseOnSelect: true
    },
    suppressKeyboardEvent,
    minWidth: 325
  },
  {
    field: 'finishedFuelTransportMode',
    headerName: t('fuelCode:fuelCodeColLabels.finishedFuelTransportMode'),
    cellEditor: 'autocompleteEditor',
    cellRenderer: (params) =>
      params.value ? (
        <CommonArrayRenderer {...params} />
      ) : (
        <Typography variant="body4">Select</Typography>
      ),
    cellRendererParams: {
      disableLink: true
    },
    cellEditorParams: {
      options: optionsData.transportModes.map((obj) => obj.transportMode),
      multiple: true,
      openOnFocus: true,
      disableCloseOnSelect: true
    },
    suppressKeyboardEvent,
    minWidth: 325
  },
  {
    field: 'formerCompany',
    headerName: t('fuelCode:fuelCodeColLabels.formerCompany'),
    cellEditor: 'autocompleteEditor',
    suppressKeyboardEvent,
    cellDataType: 'text',
    cellEditorParams: {
      noLabel: true,
      options: optionsData.fieldOptions.formerCompany,
      multiple: false, // ability to select multiple values from dropdown
      disableCloseOnSelect: false, // if multiple is true, this will prevent closing dropdown on selecting an option
      freeSolo: true, // this will allow user to type in the input box or choose from the dropdown
      openOnFocus: true // this will open the dropdown on input focus
    },
    minWidth: 300
  },
  {
    field: 'notes',
    headerName: t('fuelCode:fuelCodeColLabels.notes'),
    cellEditor: 'agTextCellEditor',
    cellDataType: 'text',
    minWidth: 600
  }
]

export const defaultColDef = {
  editable: true,
  resizable: true,
  filter: true,
  floatingFilter: false,
  sortable: false,
  singleClickEdit: true
}