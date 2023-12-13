import { useKeycloak } from '@react-keycloak/web'
import { logout } from '@/keycloak'
// @mui components
import BCButton from '@/components/BCButton'
import BCTypography from '@/components/BCTypography'
import BCBox from '@/components/BCBox'
import { useScrollTrigger } from '@mui/material'

import { PropTypes } from 'prop-types'
import useUserStore from '@/store/useUserStore'

const Logout = (props) => {
  const user = useUserStore((state) => state.user)
  const { keycloak } = useKeycloak()
  const isScrolled = useScrollTrigger()

  return (
    keycloak.authenticated && (
      <BCBox
        display="flex"
        alignItems="right"
        justifyContent="space-around"
        mr={2}
      >
        {user?.display_name && (
          <BCTypography
            variant="subtitle1"
            color={isScrolled ? 'primary' : 'light'}
            mx={1}
          >
            {user?.display_name}
          </BCTypography>
        )}
        <BCButton
          onClick={() => {
            logout()
          }}
          color={isScrolled ? 'primary' : 'light'}
          size="small"
          variant={isScrolled ? 'contained' : 'outlined'}
          data-test="logout-button"
        >
          Log out
        </BCButton>
      </BCBox>
    )
  )
}

Logout.propTypes = {
  isScrolled: PropTypes.bool
}

export default Logout
