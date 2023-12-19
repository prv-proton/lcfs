import autumn1 from '@/assets/images/autumn-fall-leaves.png'
import autumn2 from '@/assets/images/autumn-fall-leaves2.png'
import bgAutumnImage from '@/assets/images/bg_autumn.jpg'
import bgSummerImage from '@/assets/images/bg_summer.jpg'
import bgWinterImage from '@/assets/images/bg_winter2.jpg'
import logoDark from '@/assets/images/gov3_bc_logo.png'
import snowflake1 from '@/assets/images/snowflake.png'
import snowflake2 from '@/assets/images/snowflake2.png'
import waterdrop from '@/assets/images/water-drop.png'
import BCBox from '@/components/BCBox'
import BCButton from '@/components/BCButton'
import BCTypography from '@/components/BCTypography'
import { IDENTITY_PROVIDERS } from '@/constants/auth'
import { Card } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useKeycloak } from '@react-keycloak/web'
import { Link } from 'react-router-dom'
import Snowfall from 'react-snowfall'

const currentDate = new Date()

const month = currentDate.getMonth() + 1 // Months are zero-indexed
const day = currentDate.getDate()

const season =
  (month === 3 && day >= 20) ||
  (month > 3 && month < 6) ||
  (month === 6 && day <= 20)
    ? 'spring'
    : (month === 6 && day >= 21) ||
        (month > 6 && month < 9) ||
        (month === 9 && day <= 21)
      ? 'summer'
      : (month === 9 && day >= 22) ||
          (month > 9 && month < 12) ||
          (month === 12 && day <= 20)
        ? 'autumn'
        : 'winter'

const seasonImages = {
  winter: {
    count: 150,
    radius: [2, 6],
    wind: [-0.5, 2.0],
    image: bgWinterImage
  },
  spring: {
    count: 250,
    radius: [1, 4],
    wind: [0, 0],
    image: bgSummerImage
  },
  summer: {
    count: 0,
    radius: [0, 0],
    wind: [0, 0],
    image: bgSummerImage
  },
  autumn: {
    count: 5,
    radius: [12, 24],
    wind: [-0.5, 2.0],
    image: bgAutumnImage
  }
}

const droplets = () => {
  const elm1 = document.createElement('img')
  const elm2 = document.createElement('img')

  switch (season) {
    case 'autumn':
      elm1.src = autumn1
      elm2.src = autumn2
      break
    case 'winter':
      elm1.src = snowflake1
      elm2.src = snowflake2
      break
    case 'spring':
      elm1.src = waterdrop
      elm2.src = waterdrop
      break
    case 'summer':
      return []
    default:
      break
  }
  return [elm1, elm2]
}

const image = seasonImages[season].image

export const Login = () => {
  const { keycloak } = useKeycloak()
  const redirectUri = window.location.origin

  return (
    <BCBox
      position="absolute"
      width="100%"
      minHeight="100vh"
      sx={{
        backgroundImage: ({
          functions: { linearGradient, rgba },
          palette: { gradients }
        }) =>
          image &&
          `${linearGradient(
            rgba(gradients.dark.main, 0.1),
            rgba(gradients.dark.state, 0.1)
          )}, url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Snowfall
        wind={seasonImages[season].wind}
        snowflakeCount={seasonImages[season].count}
        radius={seasonImages[season].radius}
        images={droplets()}
      />
      <BCBox px={1} width="100%" height="100vh" mx="auto">
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card
              className="login"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                bordeRadius: '15px',
                border: '1px solid rgba(43, 43, 43, 0.568)'
              }}
            >
              <BCBox
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <img
                  src={logoDark}
                  alt="BC Government Logo"
                  style={{
                    width: '160px',
                    marginRight: '10px',
                    height: 'auto'
                  }}
                />
                <BCTypography
                  variant="h5"
                  fontWeight="medium"
                  color="white"
                  mt={1}
                >
                  Low Carbon Fuel Standard
                </BCTypography>
              </BCBox>
              <BCBox pt={1} pb={3} px={3}>
                <BCBox component="form" role="form" data-test="login-container">
                  <BCBox mt={4} mb={1}>
                    <BCButton
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        keycloak.login({
                          idpHint: IDENTITY_PROVIDERS.BCEID_BUSINESS,
                          redirectUri
                        })
                      }}
                      id="link-bceid"
                      className="button"
                      data-test="link-bceid"
                      size="large"
                      fullWidth
                    >
                      <BCTypography
                        variant="h6"
                        component="span"
                        color="text"
                        sx={{ fontWeight: '400' }}
                      >
                        Login with&nbsp;
                      </BCTypography>
                      <BCTypography
                        variant="h6"
                        component="span"
                        className="bceid-name"
                      >
                        BCeID
                      </BCTypography>
                    </BCButton>
                  </BCBox>
                  <BCBox mt={4} mb={1}>
                    <BCButton
                      variant="contained"
                      color="light"
                      onClick={() => {
                        keycloak.login({
                          idpHint: IDENTITY_PROVIDERS.IDIR,
                          redirectUri
                        })
                      }}
                      id="link-idir"
                      className="button"
                      data-test="link-idir"
                      size="large"
                      fullWidth
                    >
                      <BCTypography
                        variant="h6"
                        color="text"
                        sx={{ fontWeight: '400' }}
                      >
                        Login with&nbsp;
                      </BCTypography>
                      <BCTypography variant="h6" mr={3} className="idir-name">
                        IDIR
                      </BCTypography>
                    </BCButton>
                  </BCBox>
                  <BCBox mt={3} mb={1} textAlign="center">
                    <BCButton variant="contained" color="dark" size="small">
                      {' '}
                      <Link
                        component="button"
                        variant="button"
                        to="/contact-us"
                        fontWeight="medium"
                      >
                        <BCTypography variant="body2" color="light">
                          Trouble logging in?
                        </BCTypography>
                      </Link>
                    </BCButton>
                  </BCBox>
                </BCBox>
              </BCBox>
            </Card>
          </Grid>
        </Grid>
      </BCBox>
    </BCBox>
  )
}