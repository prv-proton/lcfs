import { actions, validation } from '@/components/BCDataGrid/columns'
import {
  AsyncSuggestionEditor,
  AutocompleteCellEditor,
  NumberEditor,
  RequiredHeader
} from '@/components/BCDataGrid/components'
import BCTypography from '@/components/BCTypography'
import { apiRoutes } from '@/constants/routes'
import { ACTION_STATUS_MAP } from '@/constants/schemaConstants'
import i18n from '@/i18n'
import colors from '@/themes/base/colors'
import { formatNumberWithCommas as valueFormatter } from '@/utils/formatters'
import { SelectRenderer } from '@/utils/grid/cellRenderers.jsx'
import { changelogCellStyle } from '@/utils/grid/changelogCellStyle'
import { StandardCellWarningAndErrors } from '@/utils/grid/errorRenderers'
import { suppressKeyboardEvent } from '@/utils/grid/eventHandlers'
import { isQuarterEditable } from '@/utils/grid/cellEditables.jsx'

export const notionalTransferColDefs = (
  optionsData,
  currentUser,
  errors,
  warnings,
  isSupplemental,
  compliancePeriod,
  isEarlyIssuance = false
) => {
  const baseColumns = [
    validation,
    actions((params) => {
      return {
        enableDuplicate: false,
        enableDelete: !params.data.isNewSupplementalEntry,
        enableUndo: isSupplemental && params.data.isNewSupplementalEntry,
        enableStatus:
          isSupplemental &&
          params.data.isNewSupplementalEntry &&
          ACTION_STATUS_MAP[params.data.actionType]
      }
    }),
    {
      field: 'id',
      cellEditor: 'agTextCellEditor',
      cellDataType: 'text',
      hide: true
    },
    {
      field: 'complianceReportId',
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.complianceReportId'
      ),
      cellEditor: 'agTextCellEditor',
      cellDataType: 'text',
      hide: true
    },
    {
      field: 'notionalTransferId',
      hide: true
    },
    {
      field: 'legalName',
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.legalName'
      ),
      headerComponent: RequiredHeader,
      cellDataType: 'object',
      cellEditor: AsyncSuggestionEditor,
      cellEditorParams: (params) => ({
        queryKey: 'company-details-search',
        queryFn: async ({ queryKey, client }) => {
          let path = apiRoutes.organizationSearch
          path += 'org_name=' + queryKey[1]
          const response = await client.get(path)
          const filteredData = response.data.filter(
            (org) => org.name !== currentUser.organization.name
          )
          params.node.data.apiDataCache = filteredData
          return filteredData
        },
        title: 'legalName',
        api: params.api
      }),
      cellRenderer: (params) =>
        params.value ||
        (!params.value && (
          <BCTypography variant="body4">Enter or search a name</BCTypography>
        )),
      suppressKeyboardEvent,
      minWidth: 300,
      valueSetter: (params) => {
        const { newValue: selectedName, node, data } = params
        if (typeof selectedName === 'object') {
          // If selectedName is an object, set the legalName directly
          data.legalName = selectedName.name
          data.addressForService = selectedName.address
        } else {
          // If no match, only update the legalName field, leave others unchanged
          data.legalName = selectedName
        }
        return true
      },
      cellStyle: (params) =>
        StandardCellWarningAndErrors(params, errors, warnings, isSupplemental)
    },
    {
      field: 'addressForService',
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.addressForService'
      ),
      headerComponent: RequiredHeader,
      cellEditor: 'agTextCellEditor',
      cellDataType: 'text',
      cellStyle: (params) =>
        StandardCellWarningAndErrors(params, errors, warnings, isSupplemental)
    },
    {
      field: 'fuelCategory',
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.fuelCategory'
      ),
      headerComponent: RequiredHeader,
      cellEditor: AutocompleteCellEditor,
      suppressKeyboardEvent,
      cellDataType: 'text',
      cellEditorParams: {
        options: optionsData?.fuelCategories?.map((obj) => obj.category),
        multiple: false,
        disableCloseOnSelect: false,
        freeSolo: false,
        openOnFocus: true
      },
      cellStyle: (params) =>
        StandardCellWarningAndErrors(params, errors, warnings, isSupplemental),
      cellRenderer: SelectRenderer
    },
    {
      field: 'receivedOrTransferred',
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.receivedOrTransferred'
      ),
      headerComponent: RequiredHeader,
      cellEditor: AutocompleteCellEditor,
      suppressKeyboardEvent,
      cellDataType: 'text',
      cellEditorParams: {
        options: optionsData?.receivedOrTransferred || [],
        multiple: false,
        disableCloseOnSelect: false,
        freeSolo: false,
        openOnFocus: true
      },
      cellStyle: (params) =>
        StandardCellWarningAndErrors(params, errors, warnings, isSupplemental),
      cellRenderer: SelectRenderer
    },
    {
      field: 'quantity',
      headerName: i18n.t('notionalTransfer:notionalTransferColLabels.quantity'),
      headerComponent: RequiredHeader,
      cellEditor: NumberEditor,
      cellEditorParams: {
        precision: 0,
        min: 0,
        showStepperButtons: false
      },
      valueFormatter: (params) => valueFormatter({ value: params.value }),
      cellStyle: (params) =>
        StandardCellWarningAndErrors(params, errors, warnings, isSupplemental)
    }
  ]

  // Swap in Quarterly Columns if it's an early issuance report
  if (isEarlyIssuance) {
    return baseColumns.flatMap((item) => {
      if (item.field === 'quantity') {
        return [
          {
            field: 'q1Quantity',
            headerComponent: RequiredHeader,
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q1Quantity'
            ),
            valueFormatter: valueFormatter,
            cellEditor: NumberEditor,
            cellEditorParams: {
              precision: 0,
              min: 0,
              showStepperButtons: false
            },
            cellStyle: (params) =>
              StandardCellWarningAndErrors(
                params,
                errors,
                warnings,
                isSupplemental
              ),
            editable: () => {
              return isQuarterEditable(1, compliancePeriod)
            }
          },
          {
            field: 'q2Quantity',
            headerComponent: RequiredHeader,
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q2Quantity'
            ),
            valueFormatter: valueFormatter,
            cellEditor: NumberEditor,
            cellEditorParams: {
              precision: 0,
              min: 0,
              showStepperButtons: false
            },
            cellStyle: (params) =>
              StandardCellWarningAndErrors(
                params,
                errors,
                warnings,
                isSupplemental
              ),
            editable: () => {
              return isQuarterEditable(2, compliancePeriod)
            }
          },
          {
            field: 'q3Quantity',
            headerComponent: RequiredHeader,
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q3Quantity'
            ),
            valueFormatter: valueFormatter,
            cellEditor: NumberEditor,
            cellEditorParams: {
              precision: 0,
              min: 0,
              showStepperButtons: false
            },
            cellStyle: (params) =>
              StandardCellWarningAndErrors(
                params,
                errors,
                warnings,
                isSupplemental
              ),
            editable: () => {
              return isQuarterEditable(3, compliancePeriod)
            }
          },
          {
            field: 'q4Quantity',
            headerComponent: RequiredHeader,
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q4Quantity'
            ),
            valueFormatter: valueFormatter,
            cellEditor: NumberEditor,
            cellEditorParams: {
              precision: 0,
              min: 0,
              showStepperButtons: false
            },
            cellStyle: (params) =>
              StandardCellWarningAndErrors(
                params,
                errors,
                warnings,
                isSupplemental
              ),
            editable: () => {
              return isQuarterEditable(4, compliancePeriod)
            }
          },
          {
            field: 'totalQuantity',
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.totalQuantity'
            ),
            valueFormatter: valueFormatter,
            cellStyle: (params) =>
              StandardCellWarningAndErrors(
                params,
                errors,
                warnings,
                isSupplemental
              ),
            valueGetter: (params) => {
              const data = params.data
              return (
                (data.q1Quantity || 0) +
                (data.q2Quantity || 0) +
                (data.q3Quantity || 0) +
                (data.q4Quantity || 0)
              )
            },
            editable: false
          }
        ]
      }

      return [item]
    })
  }

  return baseColumns
}

export const notionalTransferSummaryColDefs = (isEarlyIssuance = false) => {
  const baseColumns = [
    {
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.legalName'
      ),
      field: 'legalName',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.addressForService'
      ),
      field: 'addressForService',
      flex: 1,
      minWidth: 200
    },
    {
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.fuelCategory'
      ),
      field: 'fuelCategory'
    },
    {
      headerName: i18n.t(
        'notionalTransfer:notionalTransferColLabels.receivedOrTransferred'
      ),
      field: 'receivedOrTransferred'
    },
    {
      headerName: i18n.t('notionalTransfer:notionalTransferColLabels.quantity'),
      field: 'quantity',
      valueFormatter
    }
  ]

  if (isEarlyIssuance) {
    return baseColumns.flatMap((item) => {
      if (item.field === 'quantity') {
        return [
          {
            field: 'q1Quantity',
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q1Quantity'
            ),
            valueFormatter
          },
          {
            field: 'q2Quantity',
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q2Quantity'
            ),
            valueFormatter
          },
          {
            field: 'q3Quantity',
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q3Quantity'
            ),
            valueFormatter
          },
          {
            field: 'q4Quantity',
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.q4Quantity'
            ),
            valueFormatter
          },
          {
            field: 'totalQuantity',
            headerName: i18n.t(
              'notionalTransfer:notionalTransferColLabels.totalQuantity'
            ),
            valueFormatter,
            valueGetter: (params) => {
              const data = params.data
              return (
                (data.q1Quantity || 0) +
                (data.q2Quantity || 0) +
                (data.q3Quantity || 0) +
                (data.q4Quantity || 0)
              )
            }
          }
        ]
      }

      return [item]
    })
  }
  return baseColumns
}

export const defaultColDef = {
  editable: true,
  resizable: true,
  filter: false,
  floatingFilter: false,
  sortable: false,
  singleClickEdit: true,
  flex: 1
}

export const changelogCommonColDefs = (highlight = true) => [
  {
    headerName: i18n.t('notionalTransfer:notionalTransferColLabels.legalName'),
    field: 'legalName',
    flex: 1,
    minWidth: 200,
    cellStyle: (params) => highlight && changelogCellStyle(params, 'fuelType')
  },
  {
    headerName: i18n.t(
      'notionalTransfer:notionalTransferColLabels.addressForService'
    ),
    field: 'addressForService',
    flex: 1,
    minWidth: 200,
    cellStyle: (params) =>
      highlight && changelogCellStyle(params, 'addressForService')
  },
  {
    headerName: i18n.t(
      'notionalTransfer:notionalTransferColLabels.fuelCategory'
    ),
    field: 'fuelCategory.category',
    cellStyle: (params) =>
      highlight && changelogCellStyle(params, 'fuelCategory')
  },
  {
    headerName: i18n.t(
      'notionalTransfer:notionalTransferColLabels.receivedOrTransferred'
    ),
    field: 'receivedOrTransferred',
    cellStyle: (params) =>
      highlight && changelogCellStyle(params, 'receivedOrTransferred')
  },
  {
    headerName: i18n.t('notionalTransfer:notionalTransferColLabels.quantity'),
    field: 'quantity',
    valueFormatter,
    cellStyle: (params) =>
      highlight && changelogCellStyle(params, 'quantitySupplied')
  }
]

export const changelogColDefs = (highlight = true) => [
  {
    field: 'groupUuid',
    hide: true,
    sort: 'desc',
    sortIndex: 3
  },
  { field: 'createDate', hide: true, sort: 'asc', sortIndex: 1 },
  { field: 'version', hide: true, sort: 'desc', sortIndex: 2 },
  {
    field: 'actionType',
    valueGetter: (params) => {
      if (params.data.actionType === 'UPDATE') {
        if (params.data.updated) {
          return 'Edited old'
        } else {
          return 'Edited new'
        }
      }
      if (params.data.actionType === 'DELETE') {
        return 'Deleted'
      }
      if (params.data.actionType === 'CREATE') {
        return 'Added'
      }
    },
    cellStyle: (params) => {
      if (highlight && params.data.actionType === 'UPDATE') {
        return { backgroundColor: colors.alerts.warning.background }
      }
    }
  },
  ...changelogCommonColDefs(highlight)
]

export const changelogDefaultColDefs = {
  floatingFilter: false,
  filter: false
}

export const changelogCommonGridOptions = {
  overlayNoRowsTemplate: i18n.t('notionalTransfer:noNotionalTransfersFound'),
  autoSizeStrategy: {
    type: 'fitCellContents',
    defaultMinWidth: 50,
    defaultMaxWidth: 600
  },
  enableCellTextSelection: true, // enables text selection on the grid
  ensureDomOrder: true
}

export const changelogGridOptions = {
  ...changelogCommonGridOptions,
  getRowStyle: (params) => {
    if (params.data.actionType === 'DELETE') {
      return {
        backgroundColor: colors.alerts.error.background
      }
    }
    if (params.data.actionType === 'CREATE') {
      return {
        backgroundColor: colors.alerts.success.background
      }
    }
  }
}
