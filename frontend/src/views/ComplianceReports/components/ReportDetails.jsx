import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Link,
  CircularProgress
} from '@mui/material'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { NotionalTransferSummary } from '@/views/NotionalTransfers/NotionalTransferSummary'
import { ROUTES } from '@/constants/routes'
import { roles } from '@/constants/roles'
import { Role } from '@/components/Role'
import { OtherUsesSummary } from '@/views/OtherUses/OtherUsesSummary'
import { useGetFinalSupplyEquipments } from '@/hooks/useFinalSupplyEquipment'
import { FinalSupplyEquipmentSummary } from '@/views/FinalSupplyEquipments/FinalSupplyEquipmentSummary'
import { useGetAllNotionalTransfers } from '@/hooks/useNotionalTransfer'
import { useGetAllOtherUses } from '@/hooks/useOtherUses'

const ReportDetails = () => {
  const { t } = useTranslation()
  const { compliancePeriod, complianceReportId } = useParams()
  const navigate = useNavigate()

  const activityList = useMemo(
    () => [
      {
        name: t('report:activityLists.supplyOfFuel'),
        action: () =>
          navigate(
            ROUTES.REPORTS_ADD_SUPPLY_OF_FUEL.replace(
              ':compliancePeriod',
              compliancePeriod
            ).replace(':complianceReportId', complianceReportId)
          ),
        useFetch: async () => ({
          data: [],
          isLoading: false,
          isError: false,
          isFetched: true
        }),
        component: (data) => <>Coming soon...</>
      },
      {
        name: t('finalSupplyEquipment:fseTitle'),
        action: () =>
          navigate(
            ROUTES.REPORTS_ADD_FINAL_SUPPLY_EQUIPMENTS.replace(
              ':compliancePeriod',
              compliancePeriod
            ).replace(':complianceReportId', complianceReportId)
          ),
        useFetch: useGetFinalSupplyEquipments,
        component: (data) =>
          data.finalSupplyEquipments.length > 0 && (
            <FinalSupplyEquipmentSummary data={data} />
          )
      },
      {
        name: t('report:activityLists.allocationAgreements'),
        action: () =>
          navigate(
            ROUTES.REPORTS_ADD_ALLOCATION_AGREEMENTS.replace(
              ':compliancePeriod',
              compliancePeriod
            ).replace(':complianceReportId', complianceReportId)
          ),
        useFetch: async () => ({
          data: [],
          isLoading: false,
          isError: false,
          isFetched: true
        }),
        component: (data) => <>Coming soon...</>
      },
      {
        name: t('report:activityLists.notionalTransfers'),
        action: () =>
          navigate(
            ROUTES.REPORTS_ADD_NOTIONAL_TRANSFERS.replace(
              ':compliancePeriod',
              compliancePeriod
            ).replace(':complianceReportId', complianceReportId)
          ),
        useFetch: useGetAllNotionalTransfers,
        component: (data) => data.length > 0 && <NotionalTransferSummary data={data} />
      },
      {
        name: t('otherUses:summaryTitle'),
        action: () =>
          navigate(
            ROUTES.REPORTS_ADD_OTHER_USE_FUELS.replace(
              ':compliancePeriod',
              compliancePeriod
            ).replace(':complianceReportId', complianceReportId)
          ),
        useFetch: useGetAllOtherUses,
        component: (data) => data.length > 0 && <OtherUsesSummary data={data} />
      },
      {
        name: t('report:activityLists.exportFuels'),
        action: () =>
          navigate(
            ROUTES.REPORTS_ADD_EXPORT_FUELS.replace(
              ':compliancePeriod',
              compliancePeriod
            ).replace(':complianceReportId', complianceReportId)
          ),
        useFetch: async () => ({
          data: [],
          isLoading: false,
          isError: false,
          isFetched: true
        }),
        component: (data) => <>Coming soon...</>
      }
    ],
    [t, navigate, compliancePeriod, complianceReportId]
  )

  const [expanded, setExpanded] = useState(() => activityList.map((_, index) => `panel${index}`))
  const [allExpanded, setAllExpanded] = useState(true)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prev) =>
      isExpanded ? [...prev, panel] : prev.filter((p) => p !== panel)
    )
  }

  const handleExpandAll = () => {
    setExpanded(activityList.map((_, index) => `panel${index}`))
    setAllExpanded(true)
  }

  const handleCollapseAll = () => {
    setExpanded([])
    setAllExpanded(false)
  }

  return (
    <>
      <Typography color="primary" variant="h5" mb={2} component="div">
        {t('report:reportDetails')}
        <Link component="button" variant="body2" onClick={handleExpandAll} sx={{ ml: 2, mr: 1, textDecoration: 'underline' }}>
          {t('report:expandAll')}
        </Link>
        |
        <Link component="button" variant="body2" onClick={handleCollapseAll} sx={{ ml: 1, textDecoration: 'underline' }}>
          {t('report:collapseAll')}
        </Link>
      </Typography>
      {activityList.map((activity, index) => {
        const { data, error, isLoading } = activity.useFetch(complianceReportId)
        return (
          <Accordion
            key={index}
            expanded={expanded.includes(`panel${index}`)}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ width: '2rem', height: '2rem' }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              data-test={`panel${index}-summary`}
            >
              <Typography variant="h6" color="primary" component="div">
                {activity.name}&nbsp;&nbsp;
                <Role
                  roles={[
                    roles.supplier,
                    roles.compliance_reporting,
                    roles.compliance_reporting
                  ]}
                >
                  <FontAwesomeIcon
                    component="div"
                    icon={faEdit}
                    size={'lg'}
                    onClick={activity.action}
                  />
                </Role>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isLoading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">Error loading data</Typography>
              ) : activity.component ? (
                activity.component(data)
              ) : (
                <Typography>{JSON.stringify(data)}</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </>
  )
}

export default ReportDetails