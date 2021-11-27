import React, {useEffect, useState} from 'react';
import AdminNav from "../../components/admin-nav";
import {Avatar, Button, Form, Input, List, message, Modal, Popconfirm, Rate, Skeleton} from "antd";
import SeoTags from "../../components/seo";
import ImageUploadWall from "../../components/image-upload-wall";
import firebase from '../../firebase/clientApp';
import {DeleteOutlined, EditOutlined} from "@ant-design/icons/lib";
import Link from "next/link";

function RestaurantAdmin() {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const restaurant = {name: '', photoURL: null, dateAdded: new Date(), rating: 1};
    let [clearImages, setClearImages] = useState(false);
    let [isAddLoading, setIsAddLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (restaurants.length === 0) {
            firebase.firestore()
                .collection('restaurants')
                .orderBy('dateAdded', 'desc')
                .onSnapshot(query => {
                    const rows = query.docs.map(doc => {
                        return {id: doc.id, ...doc.data()};
                    });
                    setRestaurants(rows);
                    setPageLoading(false);
                })
        }
    }, []);

    function save() {
        if (!form.getFieldsValue().name) {
            message.error('Un nom est requis');
            return;
        }
        restaurant.name = form.getFieldsValue().name;
        setIsAddLoading(true);
        firebase.firestore().collection('restaurants')
            .add(restaurant)
            .then(() => {
                form.resetFields();
                setClearImages(true);
                setIsCreateModalVisible(false);
            }).catch(err => message.error('Un erruer se produit, svp ressayez plus tard'))
            .finally(() => {
                setIsAddLoading(false);
            })
    }

    function onUploadCover(url) {
        restaurant.photoURL = url;
    }

    function deleteRestaurant(id: string) {
        firebase.firestore().collection('restaurants')
            .doc(id).delete()
            .catch(err => {
                console.error(err);
                message.error('Erreur lors de la suppression de cet élément');
            })
    }

    return (
        <>
            <SeoTags title="Restaurants" />
            <AdminNav menuLabel="restaurants">
                <h1 className="font-bold text-2xl mb-6">Retaurants</h1>
                <section className="bg-white px-6 py-10">
                    <div className="header flex justify-between">
                        <h4>Tout</h4>
                        <div className="actions">
                            <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>+ Ajouter</Button>
                        </div>
                    </div>
                    {
                        !pageLoading ?
                            <div className="body pt-8">
                                <List
                                    dataSource={restaurants}
                                    renderItem={item => (
                                        <List.Item key={item.id}>
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar src={item.photoURL} />
                                                }
                                                title={<span>{item.name}</span>}
                                            />
                                            <div className="text-xl cursor-pointer">
                                                <Popconfirm
                                                    title="Êtes-vous sûr de supprimer cet élément?"
                                                    onConfirm={() => deleteRestaurant(item.id)}
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

            <Modal
                title="Ajouter un restaurant"
                visible={isCreateModalVisible}
                onOk={save}
                onCancel={() => setIsCreateModalVisible(false)}
                confirmLoading={isAddLoading}
            >
                <ImageUploadWall clearAll={clearImages} max={1} onUpload={onUploadCover} />
                <Form
                    name="basic"
                    layout="vertical"
                    form={form}
                >
                    <Form.Item
                        label="Nom"
                        name="name"
                        rules={[{ required: true, message: 'Un nom est requis' }]}
                    >
                        <Input />
                    </Form.Item>
                    <p>Classement</p>
                    <Rate allowClear={false} defaultValue={1} onChange={(value) => restaurant.rating = value} />
                </Form>
            </Modal>
        </>
    )
}

export default RestaurantAdmin;
