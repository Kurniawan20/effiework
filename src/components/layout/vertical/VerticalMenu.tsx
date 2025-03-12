// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu
          label={dictionary['navigation'].dashboards}
          icon={<i className='ri-home-smile-line' />}
          suffix={<Chip label='5' size='small' color='error' />}
        >
          <MenuItem href={`/${locale}/dashboards/crm`}>{dictionary['navigation'].crm}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/analytics`}>{dictionary['navigation'].analytics}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/ecommerce`}>{dictionary['navigation'].eCommerce}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/academy`}>{dictionary['navigation'].academy}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/logistics`}>{dictionary['navigation'].logistics}</MenuItem>
        </SubMenu>
        <MenuSection label='Asset Management'>
          {/* Asset Registration & Tracking */}
          <SubMenu label='Asset Registration' icon={<i className='ri-file-list-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/registration/new`}>
              <span>New Asset</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/registration/list`}>
              <span>Asset List</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/category`}>
              <span>Category Management</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/location`}>
              <span>Location Management</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/department`}>
              <span>Department Management</span>
            </MenuItem>
          </SubMenu>

          {/* Asset Maintenance
          <SubMenu label='Maintenance' icon={<i className='ri-tools-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/maintenance/schedule`}>
              <span>Maintenance Schedule</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/maintenance/history`}>
              <span>Service History</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/maintenance/tickets`}>
              <span>Repair Tickets</span>
              <Chip size='small' color='error' label='3' />
            </MenuItem>
          </SubMenu> */}

          {/* Asset Transfer & Assignment */}
          <SubMenu label='Asset Transfer' icon={<i className='ri-exchange-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/transfer/create`}>
              <span>Create Transfer</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/transfer/list`}>
              <span>Transfer List</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/transfer/my-requests`}>
              <span>My Transfer Requests</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/transfer/requests`}>
              <span>Transfer Request</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/transfer/history`}>
              <span>Transfer History</span>
            </MenuItem>
            {/* <MenuItem href={`/${params?.lang}/asset-management/transfer/assignments`}>
              <span>Asset Assignments</span>
            </MenuItem> */}
          </SubMenu>

          {/* Asset Inventory */}
          <SubMenu label='Inventory' icon={<i className='ri-stack-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/inventory/stock-take`}>
              <span>Stock Taking</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/inventory/audit`}>
              <span>Audit</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/inventory/reconciliation`}>
              <span>Reconciliation</span>
            </MenuItem>
          </SubMenu>

          {/* Financial Management */}
          <SubMenu label='Financial' icon={<i className='ri-money-dollar-circle-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/financial/depreciation`}>
              <span>Depreciation</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/financial/valuation`}>
              <span>Valuation</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/financial/budget`}>
              <span>Budget</span>
            </MenuItem>
          </SubMenu>

          {/* Knowledge Base */}
          <SubMenu label='Knowledge Base' icon={<i className='ri-book-open-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/knowledge-base`}>
              <span>Document Library</span>
            </MenuItem>
          </SubMenu>

          {/* AI Analysis */}
          <SubMenu label='AI Analysis' icon={<i className='ri-brain-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/ai-analysis`}>
              <span>AI Analysis</span>
            </MenuItem>
          </SubMenu>

          {/* Reports */}
          <SubMenu label='Reports' icon={<i className='ri-file-chart-line' />}>
            <MenuItem href={`/${params?.lang}/asset-management/reports/asset`}>
              <span>Asset Reports</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/reports/maintenance`}>
              <span>Maintenance Reports</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/asset-management/reports/financial`}>
              <span>Financial Reports</span>
            </MenuItem>
          </SubMenu>
        </MenuSection>
        <MenuSection label='Food Management'>
          <SubMenu label='Food Management' icon={<i className='ri-restaurant-line' />}>
            <MenuItem href={`/${params?.lang}/food-management/ingredients`}>
              <span>Ingredients Management</span>
            </MenuItem>
            <MenuItem href={`/${params?.lang}/food-management/menu-items`}>
              <span>Menu Items Management</span>
            </MenuItem>
            {/* <MenuItem href={`/${params?.lang}/food-management/recipes`}>
              <span>Recipe Builder</span>
            </MenuItem> */}
          </SubMenu>
        </MenuSection>
        <MenuSection label='Branch Management'>
          <SubMenu label='Branch Management' icon={<i className='ri-building-line' />}>
            <MenuItem href={`/${params?.lang}/branch-management`}>
              <span>Branch List</span>
            </MenuItem>
          </SubMenu>
        </MenuSection>
        <MenuSection label='Settings'>
          <MenuItem href={`/${params?.lang}/asset-management/settings/users`}>
            <i className='ri-user-settings-line' />
            <span>User Management</span>
          </MenuItem>
          <MenuItem href={`/${params?.lang}/asset-management/settings/roles`}>
            <i className='ri-shield-user-line' />
            <span>Role Management</span>
          </MenuItem>
          <MenuItem href={`/${params?.lang}/asset-management/settings/system`}>
            <i className='ri-settings-line' />
            <span>System Settings</span>
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
