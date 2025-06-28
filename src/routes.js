import { element } from 'prop-types'
import React from 'react'

// ========= admin ============
const Dashboard = React.lazy(() => import('./views/admin/dashboard/Dashboard'))
const Astrologers = React.lazy(() => import('./views/admin/astrologers/Astrologers'))

const ECommers = React.lazy(() => import('./views/admin/eCommerce/ECommers'))
// const ECommers = React.lazy(() => import('./views/admin/eCommerce/product/Products'))
const Product = React.lazy(() => import('./views/admin/eCommerce/product/Products'))
const ProductDesign = React.lazy(() => import('./views/admin/eCommerce/product-design/ProductDesign'))

const Users = React.lazy(() => import('./views/admin/users/Users'))
const Orders = React.lazy(() => import('./views/admin/orders/Orders'))
const Payout = React.lazy(() => import('./views/admin/payout/Payout'))
const Cms = React.lazy(() => import('./views/admin/cms/Cms'))
const Settings = React.lazy(() => import('./views/admin/settings/Settings'))
const Banners = React.lazy(()=> import('./views/admin/banners/Banners'))
const Blogs = React.lazy(()=> import('./views/admin/blogs/Blogs'))
const Offers = React.lazy(()=> import('./views/admin/offers/Offers'))
const Support = React.lazy(()=> import('./views/admin/support/Support'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },

  // ============ admin ==============
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/astrologers', name: 'Astrologers', element: Astrologers },

  { path: '/eCommerce', name: 'E-Commers', element: ECommers,},
  // { path: '/eCommerce', name: 'E-Commers', element: ECommers,  exact: true },
  { path: '/eCommerce/product', name: 'Products', element: Product },
  { path: '/eCommerce/product-design', name: 'Products Design', element: ProductDesign },

  { path: '/users', name: 'Users', element: Users },
  { path: '/orders', name: 'Orders', element: Orders },
  { path: '/cms', name: 'CMS', element: Cms },
  { path: '/payout', name: 'Payout', element: Payout },
  { path: '/banners', name: 'Banners', element: Banners },
  { path: '/blogs', name: 'Blogs', element: Blogs },
  { path: '/offers', name: 'Offers', element: Offers },
  { path: '/support', name: "Support", element: Support },
]

export default routes
