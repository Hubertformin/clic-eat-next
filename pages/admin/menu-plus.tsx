import React, {useEffect, useRef, useState} from 'react';
import AdminNav from "../../components/admin-nav";
import {Button, Divider, Form, Input, InputNumber, message, Modal, notification, Select} from "antd";
import SeoTags from "../../components/seo";
import ImageUploadWall from "../../components/image-upload-wall";
import '../../styles/AddMenuAdmin.module.less';
import {categoryCollection, itemsCollection, restaurantCollection} from "../../firebase/db";
import {slowConnectionChecker} from "../../utils";
import {PlusOutlined} from "@ant-design/icons/lib";

function AddMenuAdmin() {
    const [form] = Form.useForm();
    const [catForm] = Form.useForm();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [imageURLS, setImageURLS] = useState([]);
    const [isAddCatLoading, setIsAddCatLoading] = useState(false);
    let [categories, setCategories] = useState([]);
    let [isAddItem, setIsAddItem] = useState(false);
    let [resetImageWall, setResetImageWall] = useState(false);
    let [restaurants, setRestaurants] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const filteredOptions = restaurants.filter(o => !selectedItems.includes(o));
    // image input ref
    const inputRef = useRef();

    useEffect(() => {
        if (categories.length === 0) {
            categoryCollection.onSnapshot(snapshot => {
                const cats = snapshot.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                });
                setCategories(cats);
            });
        }

        if (restaurants.length === 0) {
            restaurantCollection.onSnapshot(snapshot => {
               const res = snapshot.docs.map(doc => {
                   return {id: doc.id, ...doc.data()}
               });
               setRestaurants(res);
            });
        }
    }, []);

    function onFileUpload(url: string) {
        // console.log(url);
        setImageURLS([...imageURLS, url]);
    }

    const onFileDelete = (url) => {
        const _img = imageURLS.filter(file => file != url);
        setImageURLS(_img);
    };

    function handleSelectChange (selectedItems) {
        setSelectedItems(selectedItems);
    }

    async function saveForm() {
        console.log(imageURLS);
        const formVal = form.getFieldsValue();
        if (!formVal.name && !formVal.unitPrice) {
          await form.validateFields();
          return;
        }

        if (imageURLS.length < 1) {
            message.warn('Veuillez ajouter au moins une image');
            return;
        }

        const payload = {imageURLS, ...form.getFieldsValue(), coverImageURL: imageURLS[0] ? imageURLS[0] : '', orderCount: 0};

        setIsAddItem(true);

        try {
            // set timeout to check if it's still loading
            slowConnectionChecker(isAddItem);
            const snapshot = await itemsCollection.add(payload);
            // message
            message.success('Cet élément a été ajouté avec succès');
            // reset form...
            form.resetFields();
            setResetImageWall(true);
            setIsAddItem(false);
            // adding to search index
            await fetch('/api/search/add', {
                method: 'POST',
                body: JSON.stringify({id: snapshot.id, objectID: snapshot.id , ...payload})
            }).catch(err => {
                console.error(err);
            });
        } catch (err) {
            console.error(err);
            setIsAddItem(false);
            message.error("Une erreur s'est produite lors de l'ajout de cet élément");
        }
    }

    function saveCategory() {
        const name = catForm.getFieldsValue().name;

        if (!name) {
            message.warn('Le nom de la catégorie est obligatoire');
            return;
        }

        setIsAddCatLoading(true);

        categoryCollection.add({name, dateAdded: new Date()})
            .then(() => {
                catForm.resetFields();
                setShowCategoryModal(false);
                form.setFields([{name: 'category', value: name}])

            })
            .catch(err => {
                console.error(err);
                message.error("Une erreur s'est produite lors de l'ajout de cet élément");
            })
            .finally(() => {
                setIsAddCatLoading(false);
            })
    }

    function uploadImg() {
        // @ts-ignore
        inputRef?.current?.click();
    }

    return (
        <>
            <SeoTags title="Adjouter au menu"/>
            <AdminNav menuLabel="menu">
                <h1 className="font-bold text-2xl mb-6">Éléments du menu</h1>
                <section className="bg-white md:px-6 md:py-10">
                    <div className="header flex justify-between">
                        <h4>Adjouter au menu</h4>
                    </div>
                    <div className="body pt-8">
                        <div className="row">
                            <div className="col-sm-8">
                                <Form
                                    layout="vertical"
                                    form={form}
                                >
                                    <Form.Item label="Nome" name="name" required={true}>
                                        <Input placeholder="Nom de l'élément de menu"/>
                                    </Form.Item>
                                    <Form.Item label="Prix unitaire (FCFA)" name="unitPrice" required={true}>
                                        <InputNumber placeholder="Prix unitaire"/>
                                    </Form.Item>
                                    <Form.Item label="Compositions" name="composition">
                                        <Input.TextArea placeholder="Compositions"/>
                                    </Form.Item>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <Form.Item label="Categorie" name="category">
                                                <Select
                                                    style={{ width: 240 }}
                                                    placeholder="Categorie"
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{ margin: '4px 0' }} />
                                                            <Button onClick={() => setShowCategoryModal(true)} type="link"> + Ajouter une catégorie</Button>
                                                        </div>
                                                    )}
                                                >
                                                    {categories.map(item => (
                                                        <Select.Option value={item.name} key={'cat-opts-' + item.id}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-sm-6">
                                            <Form.Item label="Restaurant" name="restaurants">
                                                <Select
                                                    mode="multiple"
                                                    placeholder="Sélectionnez le restaurant dans lequel cet article est disponible"
                                                    value={selectedItems}
                                                    onChange={handleSelectChange}
                                                    style={{ width: '100%' }}
                                                >
                                                    {filteredOptions.map(item => (
                                                        <Select.Option key={'res' + item.id} value={item.name}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <Form.Item>
                                        <Button loading={isAddItem} onClick={saveForm} type="primary">Ajouter</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div className="col-sm-3">
                                <ImageUploadWall max={1} clearAll={resetImageWall} onUpload={onFileUpload} onDelete={onFileDelete}/>
                                {/*<div className="image-upload-container">
                                    <input type="file" accept="image/*" onChange={onImageImport} ref={inputRef} style={{display: 'none'}} />
                                    <button onClick={() => uploadImg()} className="upload-btn">
                                        <PlusOutlined size={64} />
                                        <span>Ajouter une image</span>
                                    </button>
                                </div>*/}
                            </div>
                        </div>
                    </div>
                </section>
            </AdminNav>
            {/*show category modal*/}
            <Modal
                title="Ajouter une catégorie"
                visible={showCategoryModal}
                onOk={saveCategory}
                onCancel={() => setShowCategoryModal(false)}
                confirmLoading={isAddCatLoading}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    form={catForm}
                >
                    <Form.Item
                        label="Nom"
                        name="name"
                        rules={[{ required: true, message: 'Un nom est requis' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AddMenuAdmin;
