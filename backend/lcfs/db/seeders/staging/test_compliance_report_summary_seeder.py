import structlog
from sqlalchemy import select
from lcfs.db.models.compliance.ComplianceReportSummary import ComplianceReportSummary

logger = structlog.get_logger(__name__)


async def seed_test_compliance_report_summaries(session):
    """
    Seeds the compliance report summaries into the database with comprehensive test data,
    if they do not already exist.

    Args:
        session: The database session for committing the new records.
    """

    # Define the compliance report summaries to seed based on actual test database
    compliance_report_summaries_to_seed = [
        {
            "summary_id": 1,
            "compliance_report_id": 1,
            "is_locked": False,
            "line_1_fossil_derived_base_fuel_gasoline": 1000000000.0,
            "line_1_fossil_derived_base_fuel_diesel": 801000000.0,
            "line_1_fossil_derived_base_fuel_jet_fuel": 75000000.0,
            "line_2_eligible_renewable_fuel_supplied_gasoline": 100000000.0,
            "line_2_eligible_renewable_fuel_supplied_diesel": 340000000.0,
            "line_2_eligible_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_3_total_tracked_fuel_supplied_gasoline": 1100000000.0,
            "line_3_total_tracked_fuel_supplied_diesel": 1141000000.0,
            "line_3_total_tracked_fuel_supplied_jet_fuel": 75000000.0,
            "line_4_eligible_renewable_fuel_required_gasoline": 55000000.0,
            "line_4_eligible_renewable_fuel_required_diesel": 45640000.0,
            "line_4_eligible_renewable_fuel_required_jet_fuel": 0.0,
            "line_5_net_notionally_transferred_gasoline": -5000000.0,
            "line_5_net_notionally_transferred_diesel": 0.0,
            "line_5_net_notionally_transferred_jet_fuel": 0.0,
            "line_6_renewable_fuel_retained_gasoline": 0.0,
            "line_6_renewable_fuel_retained_diesel": 0.0,
            "line_6_renewable_fuel_retained_jet_fuel": 0.0,
            "line_7_previously_retained_gasoline": 0.0,
            "line_7_previously_retained_diesel": 0.0,
            "line_7_previously_retained_jet_fuel": 0.0,
            "line_8_obligation_deferred_gasoline": 0.0,
            "line_8_obligation_deferred_diesel": 0.0,
            "line_8_obligation_deferred_jet_fuel": 0.0,
            "line_9_obligation_added_gasoline": 0.0,
            "line_9_obligation_added_diesel": 0.0,
            "line_9_obligation_added_jet_fuel": 0.0,
            "line_10_net_renewable_fuel_supplied_gasoline": 95000000.0,
            "line_10_net_renewable_fuel_supplied_diesel": 340000000.0,
            "line_10_net_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_12_low_carbon_fuel_required": 0.0,
            "line_13_low_carbon_fuel_supplied": 10000.0,
            "line_14_low_carbon_fuel_surplus": 0.0,
            "line_15_banked_units_used": 0.0,
            "line_16_banked_units_remaining": 0.0,
            "line_17_non_banked_units_used": 48000.0,
            "line_18_units_to_be_banked": -46034.0,
            "line_19_units_to_be_exported": 0.0,
            "line_20_surplus_deficit_units": -46034.0,
            "line_21_surplus_deficit_ratio": 0.0,
            "line_22_compliance_units_issued": 1966.0,
            "line_11_fossil_derived_base_fuel_gasoline": 0.0,
            "line_11_fossil_derived_base_fuel_diesel": 0.0,
            "line_11_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_11_fossil_derived_base_fuel_total": 0.0,
            "line_21_non_compliance_penalty_payable": 0.0,
            "total_non_compliance_penalty_payable": 0.0,
        },
        {
            "summary_id": 2,
            "compliance_report_id": 2,
            "is_locked": False,
            "line_1_fossil_derived_base_fuel_gasoline": 0.0,
            "line_1_fossil_derived_base_fuel_diesel": 1000000.0,
            "line_1_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_2_eligible_renewable_fuel_supplied_gasoline": 0.0,
            "line_2_eligible_renewable_fuel_supplied_diesel": 0.0,
            "line_2_eligible_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_3_total_tracked_fuel_supplied_gasoline": 0.0,
            "line_3_total_tracked_fuel_supplied_diesel": 1000000.0,
            "line_3_total_tracked_fuel_supplied_jet_fuel": 0.0,
            "line_4_eligible_renewable_fuel_required_gasoline": 0.0,
            "line_4_eligible_renewable_fuel_required_diesel": 40000.0,
            "line_4_eligible_renewable_fuel_required_jet_fuel": 0.0,
            "line_5_net_notionally_transferred_gasoline": 0.0,
            "line_5_net_notionally_transferred_diesel": 0.0,
            "line_5_net_notionally_transferred_jet_fuel": 0.0,
            "line_6_renewable_fuel_retained_gasoline": 0.0,
            "line_6_renewable_fuel_retained_diesel": 0.0,
            "line_6_renewable_fuel_retained_jet_fuel": 0.0,
            "line_7_previously_retained_gasoline": 0.0,
            "line_7_previously_retained_diesel": 0.0,
            "line_7_previously_retained_jet_fuel": 0.0,
            "line_8_obligation_deferred_gasoline": 0.0,
            "line_8_obligation_deferred_diesel": 0.0,
            "line_8_obligation_deferred_jet_fuel": 0.0,
            "line_9_obligation_added_gasoline": 0.0,
            "line_9_obligation_added_diesel": 0.0,
            "line_9_obligation_added_jet_fuel": 0.0,
            "line_10_net_renewable_fuel_supplied_gasoline": 0.0,
            "line_10_net_renewable_fuel_supplied_diesel": 0.0,
            "line_10_net_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_12_low_carbon_fuel_required": 0.0,
            "line_13_low_carbon_fuel_supplied": 0.0,
            "line_14_low_carbon_fuel_surplus": 0.0,
            "line_15_banked_units_used": 0.0,
            "line_16_banked_units_remaining": 0.0,
            "line_17_non_banked_units_used": 50000.0,
            "line_18_units_to_be_banked": 0.0,
            "line_19_units_to_be_exported": 0.0,
            "line_20_surplus_deficit_units": 0.0,
            "line_21_surplus_deficit_ratio": 0.0,
            "line_22_compliance_units_issued": 50000.0,
            "line_11_fossil_derived_base_fuel_gasoline": 0.0,
            "line_11_fossil_derived_base_fuel_diesel": 0.0,
            "line_11_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_11_fossil_derived_base_fuel_total": 18000.0,
            "line_21_non_compliance_penalty_payable": 0.0,
            "total_non_compliance_penalty_payable": 18000.0,
        },
        {
            "summary_id": 3,
            "compliance_report_id": 3,
            "is_locked": True,
            "line_1_fossil_derived_base_fuel_gasoline": 100000000.0,
            "line_1_fossil_derived_base_fuel_diesel": 101000000.0,
            "line_1_fossil_derived_base_fuel_jet_fuel": 100000000.0,
            "line_2_eligible_renewable_fuel_supplied_gasoline": 20100000.0,
            "line_2_eligible_renewable_fuel_supplied_diesel": 20120000.0,
            "line_2_eligible_renewable_fuel_supplied_jet_fuel": 100000.0,
            "line_3_total_tracked_fuel_supplied_gasoline": 120100000.0,
            "line_3_total_tracked_fuel_supplied_diesel": 121120000.0,
            "line_3_total_tracked_fuel_supplied_jet_fuel": 100100000.0,
            "line_4_eligible_renewable_fuel_required_gasoline": 6005000.0,
            "line_4_eligible_renewable_fuel_required_diesel": 4844800.0,
            "line_4_eligible_renewable_fuel_required_jet_fuel": 0.0,
            "line_5_net_notionally_transferred_gasoline": 5000000.0,
            "line_5_net_notionally_transferred_diesel": 0.0,
            "line_5_net_notionally_transferred_jet_fuel": 0.0,
            "line_6_renewable_fuel_retained_gasoline": 0.0,
            "line_6_renewable_fuel_retained_diesel": 0.0,
            "line_6_renewable_fuel_retained_jet_fuel": 0.0,
            "line_7_previously_retained_gasoline": 0.0,
            "line_7_previously_retained_diesel": 0.0,
            "line_7_previously_retained_jet_fuel": 0.0,
            "line_8_obligation_deferred_gasoline": 0.0,
            "line_8_obligation_deferred_diesel": 0.0,
            "line_8_obligation_deferred_jet_fuel": 0.0,
            "line_9_obligation_added_gasoline": 0.0,
            "line_9_obligation_added_diesel": 0.0,
            "line_9_obligation_added_jet_fuel": 0.0,
            "line_10_net_renewable_fuel_supplied_gasoline": 25100000.0,
            "line_10_net_renewable_fuel_supplied_diesel": 20120000.0,
            "line_10_net_renewable_fuel_supplied_jet_fuel": 100000.0,
            "line_12_low_carbon_fuel_required": 0.0,
            "line_13_low_carbon_fuel_supplied": 0.0,
            "line_14_low_carbon_fuel_surplus": 0.0,
            "line_15_banked_units_used": 0.0,
            "line_16_banked_units_remaining": 0.0,
            "line_17_non_banked_units_used": 50000.0,
            "line_18_units_to_be_banked": -17639.0,
            "line_19_units_to_be_exported": 0.0,
            "line_20_surplus_deficit_units": -17639.0,
            "line_21_surplus_deficit_ratio": 0.0,
            "line_22_compliance_units_issued": 32361.0,
            "line_11_fossil_derived_base_fuel_gasoline": 0.0,
            "line_11_fossil_derived_base_fuel_diesel": 0.0,
            "line_11_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_11_fossil_derived_base_fuel_total": 0.0,
            "line_21_non_compliance_penalty_payable": 0.0,
            "total_non_compliance_penalty_payable": 0.0,
        },
        {
            "summary_id": 4,
            "compliance_report_id": 4,
            "is_locked": True,
            "line_1_fossil_derived_base_fuel_gasoline": 0.0,
            "line_1_fossil_derived_base_fuel_diesel": 0.0,
            "line_1_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_2_eligible_renewable_fuel_supplied_gasoline": 0.0,
            "line_2_eligible_renewable_fuel_supplied_diesel": 0.0,
            "line_2_eligible_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_3_total_tracked_fuel_supplied_gasoline": 0.0,
            "line_3_total_tracked_fuel_supplied_diesel": 0.0,
            "line_3_total_tracked_fuel_supplied_jet_fuel": 0.0,
            "line_4_eligible_renewable_fuel_required_gasoline": 0.0,
            "line_4_eligible_renewable_fuel_required_diesel": 0.0,
            "line_4_eligible_renewable_fuel_required_jet_fuel": 0.0,
            "line_5_net_notionally_transferred_gasoline": 0.0,
            "line_5_net_notionally_transferred_diesel": 0.0,
            "line_5_net_notionally_transferred_jet_fuel": 0.0,
            "line_6_renewable_fuel_retained_gasoline": 0.0,
            "line_6_renewable_fuel_retained_diesel": 0.0,
            "line_6_renewable_fuel_retained_jet_fuel": 0.0,
            "line_7_previously_retained_gasoline": 0.0,
            "line_7_previously_retained_diesel": 0.0,
            "line_7_previously_retained_jet_fuel": 0.0,
            "line_8_obligation_deferred_gasoline": 0.0,
            "line_8_obligation_deferred_diesel": 0.0,
            "line_8_obligation_deferred_jet_fuel": 0.0,
            "line_9_obligation_added_gasoline": 0.0,
            "line_9_obligation_added_diesel": 0.0,
            "line_9_obligation_added_jet_fuel": 0.0,
            "line_10_net_renewable_fuel_supplied_gasoline": 0.0,
            "line_10_net_renewable_fuel_supplied_diesel": 0.0,
            "line_10_net_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_12_low_carbon_fuel_required": 0.0,
            "line_13_low_carbon_fuel_supplied": 0.0,
            "line_14_low_carbon_fuel_surplus": 0.0,
            "line_15_banked_units_used": 0.0,
            "line_16_banked_units_remaining": 0.0,
            "line_17_non_banked_units_used": 50000.0,
            "line_18_units_to_be_banked": 569.0,
            "line_19_units_to_be_exported": 0.0,
            "line_20_surplus_deficit_units": 569.0,
            "line_21_surplus_deficit_ratio": 0.0,
            "line_22_compliance_units_issued": 50569.0,
            "line_11_fossil_derived_base_fuel_gasoline": 0.0,
            "line_11_fossil_derived_base_fuel_diesel": 0.0,
            "line_11_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_11_fossil_derived_base_fuel_total": 0.0,
            "line_21_non_compliance_penalty_payable": 0.0,
            "total_non_compliance_penalty_payable": 0.0,
        },
        {
            "summary_id": 5,
            "compliance_report_id": 5,
            "is_locked": False,
            "line_1_fossil_derived_base_fuel_gasoline": 0.0,
            "line_1_fossil_derived_base_fuel_diesel": 0.0,
            "line_1_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_2_eligible_renewable_fuel_supplied_gasoline": 0.0,
            "line_2_eligible_renewable_fuel_supplied_diesel": 0.0,
            "line_2_eligible_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_3_total_tracked_fuel_supplied_gasoline": 0.0,
            "line_3_total_tracked_fuel_supplied_diesel": 0.0,
            "line_3_total_tracked_fuel_supplied_jet_fuel": 0.0,
            "line_4_eligible_renewable_fuel_required_gasoline": 0.0,
            "line_4_eligible_renewable_fuel_required_diesel": 0.0,
            "line_4_eligible_renewable_fuel_required_jet_fuel": 0.0,
            "line_5_net_notionally_transferred_gasoline": 0.0,
            "line_5_net_notionally_transferred_diesel": 0.0,
            "line_5_net_notionally_transferred_jet_fuel": 0.0,
            "line_6_renewable_fuel_retained_gasoline": 0.0,
            "line_6_renewable_fuel_retained_diesel": 0.0,
            "line_6_renewable_fuel_retained_jet_fuel": 0.0,
            "line_7_previously_retained_gasoline": 0.0,
            "line_7_previously_retained_diesel": 0.0,
            "line_7_previously_retained_jet_fuel": 0.0,
            "line_8_obligation_deferred_gasoline": 0.0,
            "line_8_obligation_deferred_diesel": 0.0,
            "line_8_obligation_deferred_jet_fuel": 0.0,
            "line_9_obligation_added_gasoline": 0.0,
            "line_9_obligation_added_diesel": 0.0,
            "line_9_obligation_added_jet_fuel": 0.0,
            "line_10_net_renewable_fuel_supplied_gasoline": 0.0,
            "line_10_net_renewable_fuel_supplied_diesel": 0.0,
            "line_10_net_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_12_low_carbon_fuel_required": 0.0,
            "line_13_low_carbon_fuel_supplied": 0.0,
            "line_14_low_carbon_fuel_surplus": 0.0,
            "line_15_banked_units_used": 0.0,
            "line_16_banked_units_remaining": 0.0,
            "line_17_non_banked_units_used": 50000.0,
            "line_18_units_to_be_banked": 0.0,
            "line_19_units_to_be_exported": 0.0,
            "line_20_surplus_deficit_units": 0.0,
            "line_21_surplus_deficit_ratio": 0.0,
            "line_22_compliance_units_issued": 50000.0,
            "line_11_fossil_derived_base_fuel_gasoline": 0.0,
            "line_11_fossil_derived_base_fuel_diesel": 0.0,
            "line_11_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_11_fossil_derived_base_fuel_total": 0.0,
            "line_21_non_compliance_penalty_payable": 0.0,
            "total_non_compliance_penalty_payable": 0.0,
        },
        {
            "summary_id": 6,
            "compliance_report_id": 6,
            "is_locked": False,
            "line_1_fossil_derived_base_fuel_gasoline": 0.0,
            "line_1_fossil_derived_base_fuel_diesel": 0.0,
            "line_1_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_2_eligible_renewable_fuel_supplied_gasoline": 0.0,
            "line_2_eligible_renewable_fuel_supplied_diesel": 100000.0,
            "line_2_eligible_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_3_total_tracked_fuel_supplied_gasoline": 0.0,
            "line_3_total_tracked_fuel_supplied_diesel": 100000.0,
            "line_3_total_tracked_fuel_supplied_jet_fuel": 0.0,
            "line_4_eligible_renewable_fuel_required_gasoline": 0.0,
            "line_4_eligible_renewable_fuel_required_diesel": 4000.0,
            "line_4_eligible_renewable_fuel_required_jet_fuel": 0.0,
            "line_5_net_notionally_transferred_gasoline": 10000.0,
            "line_5_net_notionally_transferred_diesel": 0.0,
            "line_5_net_notionally_transferred_jet_fuel": 0.0,
            "line_6_renewable_fuel_retained_gasoline": 0.0,
            "line_6_renewable_fuel_retained_diesel": 0.0,
            "line_6_renewable_fuel_retained_jet_fuel": 0.0,
            "line_7_previously_retained_gasoline": 0.0,
            "line_7_previously_retained_diesel": 0.0,
            "line_7_previously_retained_jet_fuel": 0.0,
            "line_8_obligation_deferred_gasoline": 0.0,
            "line_8_obligation_deferred_diesel": 0.0,
            "line_8_obligation_deferred_jet_fuel": 0.0,
            "line_9_obligation_added_gasoline": 0.0,
            "line_9_obligation_added_diesel": 0.0,
            "line_9_obligation_added_jet_fuel": 0.0,
            "line_10_net_renewable_fuel_supplied_gasoline": 10000.0,
            "line_10_net_renewable_fuel_supplied_diesel": 100000.0,
            "line_10_net_renewable_fuel_supplied_jet_fuel": 0.0,
            "line_12_low_carbon_fuel_required": 10000.0,
            "line_13_low_carbon_fuel_supplied": 0.0,
            "line_14_low_carbon_fuel_surplus": 0.0,
            "line_15_banked_units_used": 0.0,
            "line_16_banked_units_remaining": 0.0,
            "line_17_non_banked_units_used": 30000.0,
            "line_18_units_to_be_banked": 3516.0,
            "line_19_units_to_be_exported": 0.0,
            "line_20_surplus_deficit_units": 3516.0,
            "line_21_surplus_deficit_ratio": 0.0,
            "line_22_compliance_units_issued": 33516.0,
            "line_11_fossil_derived_base_fuel_gasoline": 0.0,
            "line_11_fossil_derived_base_fuel_diesel": 0.0,
            "line_11_fossil_derived_base_fuel_jet_fuel": 0.0,
            "line_11_fossil_derived_base_fuel_total": 0.0,
            "line_21_non_compliance_penalty_payable": 0.0,
            "total_non_compliance_penalty_payable": 0.0,
        },
    ]

    for summary_data in compliance_report_summaries_to_seed:
        # Check if the compliance report summary already exists
        existing_summary = await session.execute(
            select(ComplianceReportSummary).where(
                ComplianceReportSummary.summary_id == summary_data["summary_id"]
            )
        )
        if existing_summary.scalar():
            logger.info(
                f"Compliance report summary with ID {summary_data['summary_id']} already exists, skipping."
            )
            continue

        # Create and add the new compliance report summary
        compliance_report_summary = ComplianceReportSummary(**summary_data)
        session.add(compliance_report_summary)

    await session.flush()
    logger.info(
        f"Seeded {len(compliance_report_summaries_to_seed)} compliance report summaries."
    )
