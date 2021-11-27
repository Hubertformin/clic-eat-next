import React, {useEffect, useState} from 'react';
import AdminNav from "../../components/admin-nav";
import {Card, Statistic, Table} from "antd";
import SeoTags from "../../components/seo";
import {reportsCollection} from "../../firebase/db";
import {formatCurrency} from "../../utils/format-currency.util";

function Dashboard() {
    const [reports, setReports] = useState([]);
    const [todayReport, setTodayReport] = useState({id: '', totalAmount: 0, orders: 0});

    const columns = [
        {
            title: 'Date',
            dataIndex: 'id',
            key: 'date',
        },
        {
            title: 'Montant vendu',
            dataIndex: 'totalAmount',
            key: 'ttmt',
            render: (price) => formatCurrency(price)
        },
        {
            title: 'N commandes',
            dataIndex: 'orders',
            key: 'odrs',
        },
    ];

    useEffect(() => {
        reportsCollection.orderBy('date', 'desc').limit(10).get()
            .then(snap => {
                const date = new Date();
                const todayId = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
                const _reports = snap.docs.map(doc => {
                    if (doc.id === todayId) {
                        const data = doc.data();
                        setTodayReport({id: doc.id, totalAmount: data.totalAmount, orders: data.orders});
                    }
                    return {id: doc.id, ...doc.data()}
                });
                setReports(_reports);
            });
    }, []);

    return (
        <>
            <SeoTags title="Panneau" />
            <AdminNav>
                <section>Dashboard</section>
                <Card title="Statistiques d'aujourd'hui" bordered={false}>
                    <div className="row">
                        <div className="col-sm-6">
                            <Statistic title="Montant vendu" value={formatCurrency(todayReport?.totalAmount)} />
                        </div>
                        <div className="col-sm-6">
                            <Statistic title="Nombre de commandes" value={todayReport?.orders} />
                        </div>
                    </div>
                </Card>
                <div className="py-4"/>
                <Card>
                    <Table dataSource={reports} columns={columns} />
                </Card>
            </AdminNav>
        </>
    )
}

export default Dashboard;
