"""Fix country/provinces for fuel code production facility

Revision ID: 72a3e3f6ac9a
Revises: 3365d6360912
Create Date: 2025-05-13 13:41:04.276915

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "72a3e3f6ac9a"
down_revision = "3365d6360912"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Get connection from Alembic
    connection = op.get_bind()

    # Start a transaction
    transaction = connection.begin_nested()
    # Insert the prefix with specific ID
    insert_prefix_sql = sa.text("""
        INSERT INTO fuel_code_prefix (fuel_code_prefix_id, prefix) 
        VALUES (:prefix_id, :prefix)
        ON CONFLICT (fuel_code_prefix_id) DO NOTHING
    """)
        
    connection.execute(insert_prefix_sql, {
        'prefix_id': 3,
        'prefix': 'C-BCLCF'
    })
    # Create a list of suffixes for each update operation
    canada_suffixes = ['110.0', '110.1', '110.2', '111.0', '111.1', '111.2', '112.0', '113.0', '114.0', '114.1', '115.0', '115.1', '116.0', '117.0',
    '118.0', '119.0', '136.0', '137.0', '138.0', '138.1', '138.2', '138.3', '138.4', '138.5', '139.0', '152.0', '162.0', '162.1', '162.2', '163.0',
    '163.1', '164.0', '164.1', '164.2', '165.0', '165.1', '166.0', '167.0', '168.0', '169.0', '170.0', '170.1', '170.2', '170.3', '170.4', '170.5',
    '171.0', '171.1', '171.2', '171.3', '171.4', '171.5', '172.0', '172.1', '172.2', '172.3', '172.4', '172.5', '173.0', '173.1', '173.2', '173.3',
    '173.4', '173.5', '174.0', '174.1', '174.2', '175.0', '175.1', '175.2', '176.0', '176.1', '176.2', '176.3', '176.4', '176.5', '177.0', '177.1', 
    '177.2', '177.3', '177.4', '177.5', '178.0', '178.1', '178.2', '178.3', '178.4', '178.5', '179.0', '179.1', '179.2', '179.3', '179.4', '180.0',
    '180.1', '180.2', '180.3', '180.4', '180.5', '183.0', '183.1', '183.2', '183.3', '183.4', '184.0', '184.1', '184.2', '184.3', '184.4', '217.0',
    '218.0', '219.0', '219.1', '220.0', '220.1', '220.2', '221.0', '221.1', '221.2', '223.0', '223.1', '223.2', '223.3', '223.4', '224.0', '224.1',
    '225.0', '225.1', '225.2', '225.3', '225.4', '226.0', '226.1', '226.2', '226.3', '226.4', '227.0', '227.1', '227.2', '227.3', '227.4', '228.0',
    '228.1', '228.2', '228.3', '228.4', '229.0', '229.1', '230.0', '230.1', '231.0', '231.1', '231.2', '231.3', '231.4', '232.0', '232.1', '232.2',
    '232.3', '232.4', '233.0', '233.1', '233.2', '233.3', '233.4', '234.0', '234.1', '234.2', '234.3', '235.0', '235.1', '235.2', '235.3', '235.4',
    '242.0', '242.1', '242.2', '243.0', '244.0', '244.1', '244.2', '245.0', '245.1', '245.2', '245.3', '245.4', '245.5', '247.0', '248.0', '249.0',
    '252.0', '263.0', '263.1', '263.2', '263.3', '263.4', '264.0', '264.1', '265.0', '265.1', '265.2', '265.3', '265.4', '266.0', '266.1', '266.2',
    '271.0', '277.0', '277.1', '277.2', '295.0', '297.0', '297.1', '297.2', '316.0', '316.1', '339.0', '339.1', '339.2', '345.0', '345.1', '346.0',
    '346.1', '347.0', '347.1', '348.0', '348.1', '349.0', '349.1', '352.0', '353.0', '353.1', '353.2', '354.0', '354.1', '354.2', '355.0', '355.1',
    '355.2', '356.0', '356.1', '356.2', '357.0', '357.1', '357.2', '358.0', '358.1', '359.0', '359.1', '360.0', '360.1', '362.0', '362.1', '377.0',
    '406.0', '406.1', '407.0', '407.1', '408.0', '408.1', '409.0', '409.1', '410.0', '410.1', '411.0', '411.1', '412.0', '412.1', '413.0', '413.1',
    '414.0', '414.1', '415.0', '415.1', '416.0', '416.1', '417.0', '417.1', '418.0', '418.1', '419.0', '419.1', '420.0', '420.1', '421.0', '421.1',
    '422.0', '422.1', '423.0', '423.1', '424.0', '424.1', '425.0', '425.1', '426.0', '426.1', '427.0', '427.1', '428.0', '428.1', '429.0', '429.1',
    '430.0', '430.1', '431.0', '431.1', '432.0', '432.1', '433.0', '433.1', '434.0', '434.1', '435.0', '435.1', '436.0', '436.1', '437.0', '437.1',
    '438.0', '438.1', '439.0', '439.1', '440.0', '440.1', '441.0', '441.1', '442.0', '442.1', '443.0', '443.1', '444.0', '444.1', '445.0', '445.1',
    '446.0', '447.0', '447.1', '448.0', '448.1', '449.0', '449.1', '450.0', '450.1', '451.0', '451.1', '452.0', '452.1', '453.0', '453.1', '454.0',
    '454.1', '455.0', '455.1', '456.0', '456.1', '457.0', '457.1', '458.0', '458.1', '459.0', '459.1', '460.0', '460.1', '461.0', '461.1', '462.0',
    '462.1', '463.0', '463.1', '464.0', '464.1', '465.0', '465.1', '466.0', '466.1', '467.0', '467.1', '468.0', '468.1', '475.0', '475.1', '476.0',
    '476.1', '478.0', '478.1', '502.0', '502.1', '559.0', '559.1', '560.0', '560.1', '578.0', '578.1', '579.0', '579.1', '580.0', '580.1', '581.0',
    '581.1', '582.0', '583.0', '584.0', '584.1', '585.0', '585.1', '586.0', '586.1', '587.0', '587.1', '588.0', '588.1', '589.0', '589.1', '590.0',
    '590.1', '591.0', '591.1', '592.0', '593.0', '594.0', '594.1', '595.0', '595.1', '607.0', '640.0', '641.0', '643.0', '643.1', '643.2', '644.0',
    '645.0', '646.0', '646.1', '647.0', '647.1', '648.0', '648.1', '649.0', '649.1', '650.0', '650.1', '651.0', '651.1', '652.0', '652.1', '653.0',
    '653.1', '654.0', '654.1', '655.0', '655.1', '656.0', '656.1', '657.0', '657.1', '658.0', '658.1', '659.0', '659.1', '660.0', '660.1', '661.0',
    '661.1', '662.0', '662.1', '663.0', '663.1', '664.0', '664.1', '665.0', '665.1', '666.0', '666.1', '667.0', '667.1', '668.0', '668.1', '669.0',
    '669.1', '670.0', '670.1', '671.0', '671.1', '672.0', '673.0', '674.0', '675.0', '676.0', '677.0', '678.0', '679.0', '698.0', '699.0', '700.0',
    '701.0', '702.0', '703.0', '704.0', '705.0', '706.0', '707.0', '713.0', '714.0', '715.0', '716.0', '717.0', '718.0', '721.0', '722.0', '723.0',
    '724.0', '725.0', '726.0', '765.0', '766.0', '767.0', '790.0', '791.0', '792.0', '793.0']
    BATCH_SIZE = 50

    # Process Canada suffixes
    for i in range(0, len(canada_suffixes), BATCH_SIZE):
        batch = canada_suffixes[i : i + BATCH_SIZE]
        # Create a string of quoted values for SQL IN clause
        values_str = ", ".join(f"'{suffix}'" for suffix in batch)

        update_canada_sql = sa.text(
            f"""
            UPDATE fuel_code
            SET fuel_production_facility_country = 'Canada'
            WHERE fuel_suffix IN ({values_str})
        """)

        connection.execute(update_canada_sql)
    usa_suffixes = ['120.0','121.0','121.1','121.2','121.3','121.4','122.0','122.1','122.2','122.3','122.4','123.0','123.1','123.2','123.3','123.4',
    '124.0','124.1','124.2','124.3','124.4','125.0','125.1','125.2','125.3','125.4','126.0','126.1','126.2','126.3','126.4','127.0','127.1','127.2','127.3',
    '127.4','128.0','128.1','128.2','129.0','129.1','129.2','130.0','131.0','131.1','131.2','131.3','132.0','132.1','132.2','132.3','132.4','132.5','133.0',
    '133.1','133.2','133.3','133.4','133.5','134.0','134.1','134.2','134.3','134.4','134.5','135.0','135.1','135.2','135.3','135.4','135.5','135.6','140.0',
    '140.1','140.2','140.3','141.0','141.1','142.0','143.0','143.1','143.2','143.3','143.4','147.0','147.1','147.2','147.3','147.4','149.0','149.1','150.0',
    '150.1','150.2','150.3','151.0','151.1','151.2','151.3','151.4','151.5','153.0','153.1','153.2','153.3','153.4','154.0','155.0','156.0','156.1','156.2',
    '157.0','157.1','158.0','159.0','160.0','160.1','161.0','161.1','182.0','182.1','182.2','182.3','182.4','185.0','185.1','185.2','185.3','185.4','186.0',
    '186.1','186.2','186.3','187.0','187.1','187.2','188.0','188.1','188.2','188.3','189.0','193.0','194.0','194.1','194.2','194.3','194.4','194.5','195.0',
    '195.1','195.2','195.3','195.4','195.5','196.0','196.1','196.2','196.3','196.4','196.5','197.0','197.1','197.2','197.3','198.0','198.1','198.2','199.0',
    '199.1','199.2','200.0','200.1','200.2','200.3','201.0','201.1','201.2','201.3','202.0','202.1','202.2','202.3','203.0','204.0','205.0','206.0','207.0',
    '208.0','209.0','209.1','222.0','222.1','222.2','222.3','236.0','236.1','236.2','236.3','237.0','238.0','239.0','239.1','239.2','239.3','240.0','240.1',
    '240.2','246.0','250.0','250.1','250.2','251.0','251.1','251.2','253.0','254.0','255.0','256.0','256.1','256.2','258.0','261.0','261.1','261.2','261.3',
    '262.0','262.1','262.2','268.0','268.1','268.2','268.3','269.0','269.1','269.2','269.3','269.4','270.0','270.1','272.0','273.0','274.0','274.1','274.2',
    '275.0','275.1','276.0','278.0','278.1','278.2','278.3','279.0','280.0','280.1','280.2','281.0','281.1','282.0','282.1','282.2','283.0','283.1','283.2',
    '284.0','284.1','284.2','285.0','285.1','285.2','286.0','286.1','286.2','286.3','286.4','287.0','287.1','287.2','288.0','288.1','288.2','289.0','289.1',
    '289.2','290.0','290.1','290.2','291.0','291.1','291.2','292.0','293.0','294.0','296.0','298.0','298.1','298.2','299.0','299.1','299.2','300.0','300.1',
    '300.2','301.0','307.0','307.1','307.2','307.3','308.0','308.1','308.2','308.3','309.0','309.1','311.0','311.1','312.0','312.1','313.0','313.1','314.0',
    '314.1','315.0','315.1','317.0','317.1','317.2','319.0','319.1','320.0','320.1','321.0','321.1','322.0','322.1','323.0','323.1','324.0','324.1','325.0',
    '325.1','326.0','326.1','327.0','327.1','328.0','328.1','333.0','333.1','334.0','335.0','336.0','337.0','337.1','338.0','338.1','340.0','340.1','340.2',
    '341.0','341.1','341.2','342.0','342.1','343.0','343.1','343.2','344.0','350.0','351.0','361.0','363.0','363.1','364.0','365.0','366.0','367.0','368.0',
    '369.0','369.1','370.0','370.1','371.0','372.0','372.1','373.0','373.1','374.0','374.1','375.0','375.1','376.0','376.1','378.0','378.1','379.0','379.1',
    '379.2','380.0','380.1','380.2','381.0','381.1','382.0','382.1','383.0','383.1','383.2','384.0','385.0','385.1','385.2','387.0','387.1','387.2','388.0',
    '388.1','388.2','389.0','389.1','389.2','390.0','390.1','390.2','391.0','391.1','391.2','392.0','392.1','392.2','393.0','393.1','393.2','394.0','394.1',
    '394.2','395.0','395.1','395.2','396.0','396.1','396.2','397.0','397.1','397.2','398.0','398.1','398.2','399.0','399.1','399.2','400.0','400.1','400.2',
    '401.0','401.1','401.2','402.0','402.1','402.2','403.0','403.1','403.2','404.0','404.1','404.2','405.0','405.1','405.2','469.0','469.1','470.0','470.1',
    '471.0','471.1','472.0','472.1','473.0','473.1','474.0','477.0','477.1','479.0','480.0','481.0','482.0','483.0','483.1','484.0','484.1','485.0','485.1',
    '486.0','487.0','487.1','488.0','488.1','489.0','489.1','490.0','490.1','491.0','491.1','492.0','492.1','493.0','493.1','494.0','494.1','495.0','495.1',
    '496.0','496.1','497.0','497.1','498.0','498.1','499.0','499.1','500.0','500.1','501.0','501.1','503.0','503.1','504.0','504.1','505.0','505.1','506.0',
    '506.1','507.0','508.0','509.0','509.1','510.0','510.1','511.0','511.1','512.0','513.0','513.1','514.0','515.0','515.1','516.0','517.0','517.1','518.0',
    '519.0','519.1','520.0','521.0','521.1','522.0','522.1','523.0','523.1','524.0','524.1','525.0','525.1','526.0','526.1','527.0','527.1','528.0','528.1',
    '529.0','529.1','530.0','530.1','531.0','531.1','532.0','532.1','532.2','533.0','533.1','533.2','534.0','534.1','534.2','535.0','535.1','535.2','536.0',
    '536.1','536.2','537.0','537.1','537.2','538.0','538.1','538.2','539.0','539.1','539.2','540.0','540.1','540.2','541.0','541.1','541.2','542.0','542.1',
    '542.2','543.0','543.1','545.0','545.1','546.0','546.1','547.0','547.1','548.0','548.1','549.0','550.0','551.0','552.0','553.0','554.0','555.0','556.0',
    '557.0','558.0','561.0','562.0','563.0','564.0','565.0','566.0','567.0','568.0','569.0','570.0','571.0','571.1','572.0','572.1','573.0','573.1','574.0',
    '574.1','575.0','575.1','576.0','577.0','599.0','600.0','601.0','602.0','623.0','624.0','625.0','626.0','627.0','628.0','629.0','630.0','631.0','632.0',
    '633.0','634.0','635.0','636.0','637.0','638.0','639.0','680.0','681.0','682.0','683.0','684.0','685.0','686.0','687.0','688.0','689.0','690.0','691.0',
    '692.0','693.0','694.0','695.0','696.0','697.0','708.0','709.0','710.0','711.0','712.0','719.0','720.0','727.0','728.0','729.0','730.0','731.0','732.0',
    '733.0','734.0','735.0','736.0','737.0','738.0','739.0','740.0','741.0','742.0','743.0','744.0','745.0','746.0','747.0','748.0','749.0','750.0','751.0',
    '752.0','753.0','754.0','755.0','756.0','757.0','758.0','759.0','760.0','761.0','762.0','763.0','764.0','768.0','769.0','770.0','771.0']
    
    for i in range(0, len(usa_suffixes), BATCH_SIZE):
        batch = usa_suffixes[i : i + BATCH_SIZE]
        values_str = ", ".join(f"'{suffix}'" for suffix in batch)

        update_usa_sql = sa.text(
            f"""
            UPDATE fuel_code
            SET fuel_production_facility_country = 'United States of America'
            WHERE fuel_suffix IN ({values_str})
        """)

        connection.execute(update_usa_sql)
    # Update British Columbia records
    bc_suffixes = ["339.2", "559.0", "559.1"]
    values_str = ", ".join(f"'{suffix}'" for suffix in bc_suffixes)

    update_bc_sql = sa.text(
        f"""
        UPDATE fuel_code
        SET fuel_production_facility_province_state = 'British Columbia'
        WHERE fuel_suffix IN ({values_str})
    """
    )
    connection.execute(update_bc_sql)
    update_canada_prefix_sql = sa.text(
        f"""
        UPDATE fuel_code
        SET prefix_id = 3
        WHERE fuel_production_facility_country = 'Canada'
    """
    )
    connection.execute(update_canada_prefix_sql)

    # Commit the transaction
    transaction.commit()


def downgrade() -> None:
    pass
