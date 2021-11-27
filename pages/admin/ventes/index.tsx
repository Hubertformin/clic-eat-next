import React, {useEffect, useRef, useState} from 'react';
import AdminNav from "../../../components/admin-nav";
import SeoTags from "../../../components/seo";
import {itemsCollection, ordersCollection, reportsCollection} from "../../../firebase/db";
import {Avatar, Button, List, message, Modal, Popconfirm, Skeleton, Table, Tag} from "antd";
import {formatCurrency} from "../../../utils/format-currency.util";
import {formatDate, timeAgo} from "../../../utils/date.utils";
import '../../../styles/VentesAdmin.module.less';
import {ArrowLeftOutlined} from "@ant-design/icons/lib";
import {slowConnectionChecker} from "../../../utils";

function VentesAdmin() {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [moreLoading, setMoreLoading] = useState(false);
    const audioRef = useRef();

    useEffect(() => {
        ordersCollection
            .orderBy('date', 'desc')
            .limit(25)
            .onSnapshot(snap => {
                const orders = snap.docs.map(order => {
                    const id = order.id;
                    const data = order.data();
                    return {id, ...data};
                });
                // hide page loading
                setPageLoading(false);
                // play sound
                playSound();
                setOrders(orders);
                // console.log(orders);
            });

    }, []);


    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Prix',
            dataIndex: 'unitPrice',
            key: 'age',
            render: (price) => formatCurrency(price)
        },
        {
            title: 'Qte',
            dataIndex: 'quantity',
            key: 'address',
        },{
            title: 'Montant',
            dataIndex: 'amount',
            key: 'address',
            render: (price) => formatCurrency(price)
        },
    ];

    async function confirmOrder() {
        // add to reports
        const date = new Date();
        const dayId = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

        try {
            // upaate order status
            setConfirmLoading(true);
            slowConnectionChecker(confirmLoading);
           const reportRef = await reportsCollection.doc(dayId).get();
            if (reportRef.exists) {
                const data = reportRef.data();
                await reportsCollection.doc(dayId).set({
                    totalAmount: currentOrder.amount + data.totalAmount,
                    orders: data.orders + 1
                });
            } else {
                await reportsCollection.doc(dayId).set({totalAmount: currentOrder.amount, orders: 1, date: Date.now()});
            }

            await ordersCollection.doc(currentOrder.id)
                .update({status: 'CONFIRMED'})
                .then(() => {
                    message.success(`Cette ${currentOrder.inv} commande a été confirmée!`);
                    setCurrentOrder({...currentOrder, status: 'CONFIRMED'});
                })
                .finally(() => {
                    setConfirmLoading(false);
                });
        } catch (e) {
            console.error(e);
            message.error("Une erreur s'est produite lors de l'exécution de cette demande. Veuillez contacter l'administrateur");
        }

    }

    function playSound() {
        if (typeof window !== "undefined") {
           /* (document.getElementById('audioPlayer') as HTMLAudioElement).play()
                .catch(err => {
                    console.error(err);
                    message.warn('Problème de lecture du son, veuillez actualiser la page');
                })*/
           // @ts-ignore
            audioRef.current.play();
        }
    }

    function showCurrentOrder(item: any) {
        setShowModal(true);
        setCurrentOrder(item);
    }

    function loadMore() {
        setMoreLoading(true);
        ordersCollection
            .orderBy('date', 'desc')
            .startAfter(orders[orders.length - 1].date)
            .limit(10)
            .get()
            .then((payload) => {
                const _newOrders = payload.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                });
                setOrders([...orders, ..._newOrders]);
            }).finally(() => {
            setMoreLoading(false);
        })
    }

    return (
        <>
            <SeoTags title="Ventes" />
            <AdminNav menuLabel="Ventes">
                <div className="card bg-white md:pl-6 md:pb-6 rounded relative h-full">
                    <h1 className="font-bold text-2xl">Ventes</h1>
                    <audio id="audioPlayer" ref={audioRef} src="/audio/bell-ringing.mp3" style={{display: 'none'}} controls/>
                    {
                        !pageLoading ?
                            <div className="row relative" style={{height: '432px'}}>
                                <div className="col-sm-12 h-full border-r overflow-y-auto">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={orders}
                                        renderItem={item => (
                                            <List.Item className={`cursor-pointer ${item.id === currentOrder?.id ? 'bg-red-100': ''}`}
                                                       onClick={() => showCurrentOrder(item)}
                                            >
                                                <div className="cursor-pointer md:flex justify-between w-full">
                                                    <h5 className="">{item.inv}</h5>
                                                    <h1 className="text-theme-primary">{formatCurrency(item.amount)}</h1>
                                                    {
                                                        item.status === 'CONFIRMED' ? <Tag color="green" style={{height: 23}}>Confirme</Tag> : <Tag style={{height: 23}} color="red">Non-confirme</Tag>
                                                    }
                                                    <p>{timeAgo(item.date)}</p>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                    <div className="py-4 text-center">
                                        <Button loading={moreLoading} onClick={() => loadMore()}>Charger plus</Button>
                                    </div>
                                </div>
                                {/*<div className="col-sm-8 preview-pane h-full overflow-y-auto">
                            {
                                currentOrder ?
                                    <section className="">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <h4><small className="text-xs">Nom:</small>&nbsp;{currentOrder.customer.name}</h4>
                                                <p><small className="text-xs">Tel:</small>&nbsp;{currentOrder.customer.phone}</p>
                                                <p><small className="text-xs">Date:</small>&nbsp;{formatDate(currentOrder.date)}</p>
                                            </div>
                                            <div className="col-sm-6">
                                                <h4><small className="text-xs">#:</small>&nbsp;{currentOrder.inv}</h4>
                                                <p className="text-theme-primary"><small className="text-xs">Montant:</small>&nbsp;{currentOrder.amount}</p>
                                                <p><small className="text-xs">Adresse:</small>&nbsp;{currentOrder.address}</p>
                                                <p><small className="text-xs">Spécification:</small>&nbsp;{currentOrder.specification}</p>
                                            </div>
                                        </div>
                                        <div className="table mt-6 w-full">
                                            <div className="action pt-1 pb-4">
                                                {
                                                    currentOrder.status === 'NOT_CONFIRMED' ? <Popconfirm
                                                        title="Confirmer cette commande?"
                                                        onConfirm={confirmOrder}
                                                        okText="Oui"
                                                        cancelText="Non"
                                                    >
                                                        <Button type="primary" loading={confirmLoading}>Confirme</Button>
                                                    </Popconfirm> : null
                                                }

                                            </div>
                                            <Table dataSource={currentOrder.items} columns={columns} />
                                        </div>

                                    </section> :
                                    <div className="no-selection h-full flex justify-center align-item-center flex-col">
                                        <h1>Rien ici</h1>
                                        <p>Veuillez cliquer sur les éléments à gauche pour prévisualiser</p>
                                    </div>
                            }
                        </div>*/}
                                <Modal
                                    visible={showModal}
                                    width={650}
                                    onCancel={() => setShowModal(false)}
                                >
                                    <section className="overflow-auto">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <h4><small className="text-xs">Nom:</small>&nbsp;{currentOrder?.customer.name}</h4>
                                                <p><small className="text-xs">Tel:</small>&nbsp;{currentOrder?.customer.phone}</p>
                                                <p><small className="text-xs">Date:</small>&nbsp;{formatDate(currentOrder?.date)}</p>
                                            </div>
                                            <div className="col-sm-6">
                                                <h4><small className="text-xs">#:</small>&nbsp;{currentOrder?.inv}</h4>
                                                <p className="text-theme-primary"><small className="text-xs">Montant:</small>&nbsp;{currentOrder?.amount}</p>
                                                <p><small className="text-xs">Adresse:</small>&nbsp;{currentOrder?.address}</p>
                                                <p><small className="text-xs">Spécification:</small>&nbsp;{currentOrder?.specification}</p>
                                            </div>
                                        </div>
                                        <div className="table mt-6 w-full">
                                            <div className="action pt-1 pb-4">
                                                {
                                                    currentOrder?.status === 'NOT_CONFIRMED' ? <Popconfirm
                                                        title="Confirmer cette commande?"
                                                        onConfirm={confirmOrder}
                                                        okText="Oui"
                                                        cancelText="Non"
                                                    >
                                                        <Button type="primary" loading={confirmLoading}>Confirme</Button>
                                                    </Popconfirm> : null
                                                }

                                            </div>
                                            <Table dataSource={currentOrder?.items} columns={columns} />
                                        </div>

                                    </section>
                                </Modal>
                            </div> :
                            <div>
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                            </div>
                    }
                </div>
            </AdminNav>
        </>
    )
}

export default VentesAdmin;
