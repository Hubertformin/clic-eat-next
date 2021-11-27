import {Layout, Menu, Drawer} from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import '../styles/admin-nav.less';
import React, {useState} from "react";
import Link from "next/link";
import {AccountBookOutlined, BankOutlined, BarChartOutlined, UnorderedListOutlined} from "@ant-design/icons/lib";
import {useRouter} from "next/router";

const { Header, Content, Sider } = Layout;


function AdminNav({menuLabel = "dashboard", children}) {
    let [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const router = useRouter();

    function logOut() {
        router.push('/admin');
    }

    return (
        <>
        <Layout style={{height: '100vh'}}>
            <Header className="header flex justify-between">
                <div className="logo text-white">
                    <span className="mr-3 show-sm cursor-pointer" onClick={() => setIsDrawerVisible(true)}><MenuOutlined style={{fontSize: 22}} /></span>
                    <img src="/images/logo.png" style={{height: '40px', width: '40px', display: 'inline-block', borderRadius: '50%'}} alt=""/>
                </div>
                <div className="text-white">
                    <button onClick={logOut}>Se déconnecter</button>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="side-nav-md">
                    <SideNavMenu activeLabel={menuLabel} />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: '24px 0px',
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>

            <Drawer
                title="Clic Eat Admin"
                placement="left"
                closable={true}
                onClose={() => setIsDrawerVisible(false)}
                visible={isDrawerVisible}
                key="phone-drawer"
            >
                <SideNavMenu activeLabel={menuLabel} />
            </Drawer>
    </>
    )
}

function SideNavMenu({activeLabel = "dashboard"}) {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={[activeLabel]}
            style={{ height: '100%', borderRight: 0 }}
        >
            <Menu.Item key="dashboard" icon={<BarChartOutlined />}>
                <Link href="/admin/panneau">
                    <a>Panneau</a>
                </Link>
            </Menu.Item>
            <Menu.Item key="sales" icon={<AccountBookOutlined />}>
                <Link href="/admin/ventes">
                    <a>Ventes</a>
                </Link>
            </Menu.Item>
            <Menu.Item key="restaurants" icon={<BankOutlined />}>
                <Link href="/admin/restaurants">
                    <a>Restaurants</a>
                </Link>
            </Menu.Item>
            <Menu.Item key="menu" icon={<UnorderedListOutlined />}>
                <Link href="/admin/menu">
                    <a>Menu</a>
                </Link>
            </Menu.Item>
        </Menu>
    )
}

export default AdminNav;
