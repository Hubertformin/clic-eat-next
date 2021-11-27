import React, {useEffect, useState} from 'react';
import AdminNav from "../../../components/admin-nav";
import {Avatar, Button, List, message, Popconfirm, Skeleton} from "antd";
import SeoTags from "../../../components/seo";
import Link from "next/link";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons/lib";
import {itemsCollection} from "../../../firebase/db";
import {showNoInternetMsg} from "../../../utils/internet";

const ITEMS_FETCH_LIMIT = 20;

function MenuAdmin() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (items.length === 0) {
            // show no internet message
            showNoInternetMsg(items.length === 0);
            itemsCollection
                .orderBy('name', 'asc')
                .limit(ITEMS_FETCH_LIMIT)
                .get()
                .then((payload) => {
                    const items = payload.docs.map(doc => {
                        return {id: doc.id, ...doc.data()}
                    });
                    setItems(items);
                    setPageLoading(false);
                }).catch(err => {
                    console.log(err.message);
                    message.warn("Une erreur s'est produite lors de la récupération des éléments de menu");
            });
        }
    }, []);

    function loadMore(lastItem) {
        setIsLoading(true);
        itemsCollection
            .orderBy('name', 'asc')
            .startAfter(lastItem.name)
            .limit(10)
            .get()
            .then((payload) => {
                const _newItems = payload.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                });
                console.log(_newItems);
                setItems([...items, ..._newItems]);
            }).finally(() => {
                setIsLoading(false);
        })
    }


    function deleteItem(id: any) {
        itemsCollection.doc(id)
            .delete()
            .then(() => {
                // remove from array
                const _items = items.filter(it => it.id !== id);
                setItems(_items);
                fetch('/api/search/delete', {
                    method: 'POST',
                    body: JSON.stringify({id})
                }).catch(err => {
                    console.error(err);
                });
            })
            .catch(err => console.error(err));
    }

    return (
        <>
            <SeoTags title="Menu" />
            <AdminNav menuLabel="menu">
                <h1 className="font-bold text-2xl mb-6">Éléments du menu</h1>
                <section className="bg-white px-6 py-10">
                    <div className="header flex justify-between">
                        <h4>Tout</h4>
                        <div className="actions">
                            <Link href="/admin/menu-plus">
                                <Button type="primary">+ Ajouter</Button>
                            </Link>
                        </div>
                    </div>
                    {
                        !pageLoading ?
                            <div className="body pt-8 px-69">
                                <List
                                    dataSource={items}
                                    renderItem={item => (
                                        <List.Item key={item.id}>
                                            <List.Item.Meta
                                                key={`list-meta-${item.id}`}
                                                avatar={
                                                    <Avatar key={`avatar-${item.id}`} src={item.coverImageURL} />
                                                }
                                                title={<span key={`title-${item.id}`}>{item.name}</span>}
                                            />
                                            <div key={`lgDiv-${item.id}`} className="text-xl cursor-pointer">
                                                <Link key={`link-${item.id}`} href={'/admin/menu/' + item.id}>
                                                    <span key={`span-${item.id}`} className="px-2"><EditOutlined /></span>
                                                </Link>
                                                <Popconfirm
                                                    title="Êtes-vous sûr de supprimer cet élément?"
                                                    onConfirm={() => deleteItem(item.id)}
                                                    okText="Oui"
                                                    cancelText="Non"
                                                >
                                                    <DeleteOutlined />
                                                </Popconfirm>
                                            </div>
                                        </List.Item>
                                    )}
                                >
                                </List>
                                {
                                    items.length >= ITEMS_FETCH_LIMIT ?
                                        <div className="actions py-3 text-center">
                                            <Button onClick={() => loadMore(items[items.length - 1])} loading={isLoading}>Charger plus</Button>
                                        </div>: null
                                }
                            </div> :
                            <div className="body pt-8 px-69">
                                <div>
                                    <Skeleton active />
                                    <Skeleton active />
                                    <Skeleton active />
                                    <Skeleton active />
                                    <Skeleton active />
                                </div>
                            </div>
                    }
                </section>
            </AdminNav>
        </>
    )
}

export default MenuAdmin;
