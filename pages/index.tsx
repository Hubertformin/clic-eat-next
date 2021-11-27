import '../styles/home.module.less'
import React, {useEffect, useState} from "react";
import SeoTags from "../components/seo";
import Toolbar from "../components/toolbar";
import {formatCurrency} from "../utils/format-currency.util";
import {Avatar, Button, List, message, Modal, Skeleton} from "antd";
import {categoryCollection, itemsCollection, restaurantCollection} from "../firebase/db";
import Link from "next/link";
import {loadMenuPlaceholder} from "../utils/const";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {addItemToCartSession} from "../utils/cart.utils";
import Footer from "../components/footer";
import {DataContext} from "../context/data-context";
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const slideImages = [
    'https://ik.imagekit.io/srmdhcrwxnb/v0/b/clic-eat-app.appspot.com/o/banner.jpg?alt=media&token=9711615d-0e84-43dd-a705-efe7c3212385',
    'https://ik.imagekit.io/srmdhcrwxnb/v0/b/clic-eat-app.appspot.com/o/banner-chicken.jpeg?alt=media&token=c4288a5a-bf67-4787-971f-ec1a69d5d8b9',
    'https://ik.imagekit.io/srmdhcrwxnb/v0/b/clic-eat-app.appspot.com/o/slide-01.jpeg?alt=media&token=3257f938-1a14-4248-bf8e-0d601a2936ff',
    'https://ik.imagekit.io/srmdhcrwxnb/v0/b/clic-eat-app.appspot.com/o/slide-03.jpeg?alt=media&token=1a70f4cf-a60a-4c27-8eb6-f595ebebdbb6',
    'https://ik.imagekit.io/srmdhcrwxnb/v0/b/clic-eat-app.appspot.com/o/slide-02.jpeg?alt=media&token=dde8c1ab-3768-4808-8c79-2262901df80a'
];

const Slideshow = () => {
    return (
        <div className="slide-container" style={{height: '100%'}}>
            <Fade duration={3000} arrows={false}>
                <div className="each-slide" style={{height: '100%'}}>
                    <div className="img-container" style={{'backgroundImage': `url(${slideImages[0]})`, height: '100%'}}>
                    </div>
                </div>
                <div className="each-slide">
                    <div className="img-container" style={{'backgroundImage': `url(${slideImages[1]})`, height: '100%'}}>
                    </div>
                </div>
                <div className="each-slide">
                    <div className="img-container" style={{'backgroundImage': `url(${slideImages[2]})`, height: '100%'}}>
                    </div>
                </div>
                <div className="each-slide">
                    <div className="img-container" style={{'backgroundImage': `url(${slideImages[3]})`, height: '100%'}}>
                    </div>
                </div>
            </Fade>
        </div>
    )
};

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [mostOrderedItems, setMostOrderedItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartQty, setCartQty] = useState(1);

    useEffect(() => {
        if (categories.length === 0) {
            categoryCollection.limit(5).onSnapshot(snapshot => {
                const cats = snapshot.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                });
                setCategories(cats);
            });
        }
        if (restaurants.length === 0) {
            restaurantCollection.onSnapshot(res => {
                setRestaurants(res.docs.map(doc => {
                    return {id: doc.id, ...doc.data()}
                }))
            })
        }
        // get most ordered items
        if (mostOrderedItems.length === 0) {
            itemsCollection
                .orderBy('orderCount', 'desc')
                .limit(4)
                .onSnapshot(payload => {
                    const items = payload.docs.map(doc => {
                        return {id: doc.id, ...doc.data()}
                    });
                    setMostOrderedItems(items)
                })
        }
        // get most ordered items
        if (menuItems.length === 0) {
            itemsCollection
                .limit(16)
                .onSnapshot(payload => {
                    const items = payload.docs.map(doc => {
                        return {id: doc.id, ...doc.data()}
                    });
                    setMenuItems(items)
                })
        }
        //
    }, []);

    function viewItem(item) {
        setSelectedItem(item);
        console.log(item);
        setShowItemModal(true);
    }

    function changeCartQty(op) {
        if (op < 0 && cartQty === 1) {
            return;
        }
        if (op < 0) {
            setCartQty(cartQty - 1);
        } else {
            setCartQty(cartQty + 1);
        }
    }

    function addToCart() {
        addItemToCartSession({...selectedItem, quantity: cartQty, amount: cartQty * selectedItem.unitPrice});
        setShowItemModal(false);
        message.success(`${selectedItem.name} a été ajouté au panier`);
    }

    return (
      <>
          <SeoTags key="meta_tags" title="Bienvenue sur Clic-Eat" description="Bienvenue sur le site officiel de Clic-Eat" />
          <Toolbar transparent={true} />
          <div className="slide-show">
              <Slideshow/>
              <div id="home-banner" className="banner">
                  <h1 className="title font-bold">Bienvenue sur Clic-Eat</h1>
                  <p className="desc">les plats de vos restaurants préférés, livrés chez vous </p>
              </div>
          </div>
          <section id="page-body" className="pt-8 px-6 mx-auto md:pt-8 md:px-16 pb-16">
              <div className="row">
                  <div className="col-sm-9">
                      {
                          mostOrderedItems.length > 0 ?
                              <div className="most-ordered-section bg-white">
                                  <h1 className="font-bold mb-6">Articles les plus commandés</h1>
                                  <div className="row">
                                      {
                                          mostOrderedItems.map(item => {
                                              return(
                                                  <div key={item.id} className="col-sm-3 cursor-pointer" onClick={() => viewItem(item)}>
                                                      <div className="food-card mb-16">
                                                          <div className="icon">
                                                              <img src={item.coverImageURL} onError={loadMenuPlaceholder}/>
                                                          </div>
                                                          <div className="details">
                                                              <h4 className="name">{item.name}</h4>
                                                              <h5 className="currency">{formatCurrency(item.unitPrice)}</h5>
                                                          </div>
                                                      </div>
                                                  </div>
                                              )
                                          })
                                      }
                                  </div>
                              </div> :
                              <Skeleton active />
                      }
                      <div className="category-section py-6 md:py-10">
                          {
                              categories.map(category => {
                                  return (
                                      <Link key={`cat-link-${category.id}`} href={`/cat/${category.id}`}>
                                          <div key={`cat-item-${category.id}`} className="category-chip cursor-pointer">{category.name}</div>
                                      </Link>
                                  )
                              })
                          }
                      </div>
                      {
                          menuItems.length > 0 ?
                              <div className="all-items-section bg-white">
                                  <h1 className="font-bold mb-6">Les Articles</h1>
                                  <div className="menu-item-section">
                                      {
                                          menuItems.map(item => {
                                              return(
                                                  <div key={`m-list-${item.id}`} className="item cursor-pointer md:mb-4" onClick={() => viewItem(item)}>
                                                      <div key={`m-fcard-${item.id}`} className="food-card mb-16">
                                                          <div key={`m-icon-${item.id}`} className="icon">
                                                              <img key={`m-img-${item.id}`} src={item.coverImageURL} onError={loadMenuPlaceholder}/>
                                                          </div>
                                                          <div key={`m-details-${item.id}`} className="details">
                                                              <h4 key={`m-nom-${item.id}`} className="name">{item.name}</h4>
                                                              <h5 key={`m-currency-${item.id}`} className="currency">{formatCurrency(item.unitPrice)}</h5>
                                                          </div>
                                                      </div>
                                                  </div>
                                              )
                                          })
                                      }
                                  </div>
                              </div> :
                              <Skeleton active />
                      }
                  </div>
                  <div className="col-sm-3">
                      <div className="restautrants bg-white">
                          <List
                              size="large"
                              header={<div>Restaurants</div>}
                          >
                              {
                                  restaurants.map(item => {
                                      return (
                                          <List.Item key={"list-item-" + item.id}>
                                              <Link key={"rest-item-" + item.id} href={"/restaurant/" + item.id}>
                                                  <List.Item.Meta
                                                      key={"rest-meta-" + item.id}
                                                      avatar={<Avatar key={"rest-avat-" + item.id} src={item.photoURL} />}
                                                      title={<a key={"rest-a-" + item.id}>{item.name}</a>}
                                                  />
                                              </Link>
                                          </List.Item>
                                      )
                                  })
                              }
                              {/*<List.Item>Voir tout</List.Item>*/}
                          </List>
                      </div>
                  </div>
              </div>
          </section>
          <Footer />

          <DataContext.Consumer>{(context) => {
              return(
                  <Modal
                      visible={showItemModal}
                      title={selectedItem?.name}
                      width={750}
                      closable={true}
                      onCancel={() => setShowItemModal(false)}
                      footer={
                          <div className="">
                              <Button onClick={() => {
                                  context.addToCart({...selectedItem, quantity: cartQty, amount: cartQty * selectedItem.unitPrice});
                                  setShowItemModal(false);
                                  message.success(`${selectedItem.name} a été ajouté au panier`);
                              }} type="primary">Ajouter au panier</Button>
                              <Button onClick={() => setShowItemModal(false)}>Annuler</Button>
                          </div>
                      }
                  >

                      <div className="modal">
                          <div className="row">
                              <div className="col-sm-5">
                                  <img src={selectedItem?.coverImageURL} onError={loadMenuPlaceholder} style={{width: '100%', maxHeight: '150px', objectFit: "cover"}}/>
                              </div>
                              <div className="col-sm-7">
                                  <h4 className="title">{selectedItem?.name}</h4>
                                  <p className="text-gray-500 my-2 text-sm">{selectedItem?.restaurants[0]}</p>
                                  <h1 className="price text-theme-primary">{formatCurrency(selectedItem?.unitPrice * cartQty)}</h1>
                                  <div className="quantity-control">
                                      <button onClick={() => changeCartQty(-1)}><MinusOutlined /></button>
                                      <input type="number" placeholder={"qty"} value={cartQty} min={1} onChange={event =>  {
                                          if (Number(event.target.value) > 0) {
                                              setCartQty(Number(event.target.value))
                                          }
                                      }} />
                                      <button onClick={() => changeCartQty(1)}><PlusOutlined /></button>

                                  </div>
                                  <p className="mb-0 mt-5"><small><strong>Composition</strong></small></p>
                                  <div className="desc">
                                      <ul style={{listStyleType: 'disc'}} className="pl-8">
                                          {
                                              selectedItem?.composition.split(',').map((name, index) => {
                                                  return (<li key={'comp-' + index}>{name}</li>)
                                              })
                                          }
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </Modal>
              )
          }}</DataContext.Consumer>

      </>
  )
}
