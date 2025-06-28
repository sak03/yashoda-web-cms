import React from 'react'
import { CNavGroup, CNavItem } from '@coreui/react'
import {
  FaTachometerAlt,
  FaMoneyBillWave,
  FaRegAddressCard,
  FaReceipt,
  FaLuggageCart,
  FaBoxOpen,
  FaCog,
  FaUserAlt,
  FaBloggerB,
  FaFlagCheckered,
  FaShoppingCart,
  FaImages,
  FaRing,
  FaHeadset,
  FaPercent
} from "react-icons/fa";

const _nav = {
  admin_nav: [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <FaTachometerAlt className="nav-icon" title="Dashboard" />,
    },
    // {
    //   component: CNavItem,
    //   name: 'Astrologers',
    //   to: '/astrologers',
    //   icon: <FaRegAddressCard className="nav-icon" title="Astrologers" />,
    // },
    {
      component: CNavItem,
      name: 'Users',
      to: '/users',
      icon: <FaUserAlt className="nav-icon" title="Users" />,
    },
    // {
    //   component: CNavItem,
    //   name: 'E-Commerce',
    //   to: '/eCommerce',
    //   icon: <FaBoxOpen className="nav-icon" title="E-Commerce" />,
    // },
    // {
    //   component: CNavGroup,
    //   name: "E-Commerce",
    //   to: "/eCommerce",
    //   icon: <FaShoppingCart className="nav-iconc" title="E-Commerce" />,
    //   items: [
    //     {
    //       component: CNavItem,
    //       name: "Products",
    //       to: "/eCommerce/product",
    //       icon: <FaRing className="nav-icon" title="Products" />,
    //     },
    //     {
    //       component: CNavItem,
    //       name: "Products Design",
    //       to: "/eCommerce/product-design",
    //       icon: <FaImages className="nav-icon" title="Products Design" />,
    //     }
    //   ],
    // },
    // {
    //   component: CNavItem,
    //   name: 'Orders',
    //   to: '/orders',
    //   icon: <FaLuggageCart className="nav-icon" title="Orders" />,
    // },
    // {
    //   component: CNavItem,
    //   name: 'Payout',
    //   to: '/payout',
    //   icon: <FaMoneyBillWave className="nav-icon" title="Payout" />,
    // },
    // {
    //   component: CNavItem,
    //   name: 'CMS',
    //   to: '/cms',
    //   icon: <FaReceipt className="nav-icon" title="CMS" />,
    // },
    // {
    {
      component: CNavItem,
      name: 'Banners',
      to: '/banners',
      icon: <FaFlagCheckered className="nav-icon" title="Banners" />,
    },
    // {
    //   component: CNavItem,
    //   name: 'Blogs',
    //   to: '/blogs',
    //   icon: <FaBloggerB className="nav-icon" title="Blogs" />,
    // },
    // {
    //   component: CNavItem,
    //   name: 'Offers',
    //   to: '/offers',
    //   icon: <FaPercent className="nav-icon" title="Offers" />,
    // },
    // {
    //   component: CNavItem,
    //   name: 'Support',
    //   to: '/support',
    //   icon: <FaHeadset className="nav-icon" title="Support" />,
    // },
  ],
}

export default _nav
