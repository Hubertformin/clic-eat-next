import React, {useEffect, useState} from 'react';
import '../styles/toolbar.module.less';
import Link from "next/link";
import SlideToggleContent from "./slide-toggle-content";
import Image from "next/image";
import ActiveLink from "./active-link";
import {MenuOutlined} from "@ant-design/icons/lib";
import {DataContext} from "../context/data-context";
import {useRouter} from "next/router";
import {Drawer} from "antd";


function Toolbar({transparent = false, noSearchBar=false}) {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (transparent) {
            if (typeof window !== "undefined") {
                window.onscroll = (evt) => {
                    if(window.scrollY > 320) {
                        document.getElementById('toolbar')?.classList.remove('transparent');
                    } else {
                        document.getElementById('toolbar')?.classList.add('transparent');
                    }
                }
            }
        }
    }, []);

    function onInputSearch(e) {
        if (e.keyCode === 13) {
            router.push(`/search?q=${e.target.value}`)
        }
    }

    return(
        <DataContext.Consumer>{(context) => {
            const {cart} = context;
            return(
                <nav id="toolbar" className={`shadow ${transparent ? 'transparent' : null}`}>
                    {/*<div className="detail-meta py-1 flex justify-between">
                    <div className="social flex">
                        <span className="mr-2"><Icon.Facebook size={15} /></span>
                        <span className="mr-2"><Icon.Twitter size={15} /></span>
                        <span className="mr-2"><Icon.Instagram size={15} /></span>
                    </div>

                    <div className="contact flex">
                        <span className="mr-3">
                            <Icon.Phone size={15} />&nbsp;<span className="text">+237 695-717-510</span>
                        </span>
                        <span className="mr-3">
                            <Icon.Mail size={15} />&nbsp;<span className="text">cliceat@gmail.com</span>
                        </span>
                    </div>

                </div>*/}
                    <div className="logo">
                        <Link href="/">
                            <Image src="/images/logo.png" alt="logo" height={35} width={35} />
                        </Link>
                    </div>
                    <div className="links-sm">
                        <div className="controls">
                            <span className="menu" onClick={() => setIsVisible(!isVisible)}><MenuOutlined style={{fontSize: 22}} /></span>
                            <div className="px-2">
                                <input type="search"
                                       style={{backgroundImage: 'url(/images/search.svg)', visibility: !noSearchBar ? 'visible' : 'hidden'}}
                                       onKeyUp={onInputSearch}
                                       placeholder="Rechercher des articles"
                                />
                            </div>
                            <span className="cart">
                                <span className="badge">{cart.length}</span>
                                <Link href="/panier">
                                    <img src="/images/cart-icon.svg" alt=""/>
                                </Link>
                            </span>
                        </div>
                    </div>

                    <div className="links-md">
                        <div className="leading">
                            <ul className="nav-links">
                                <li>
                                    <img src="/images/logo.png" alt=""/>
                                </li>
                                <li>
                                    <ActiveLink href="/" activeClassName="active">
                                        <a>Accueil</a>
                                    </ActiveLink>
                                </li>
                                {/*<li>
                                <Link href="/a-propos">
                                    <a>À propos de nous</a>
                                </Link>
                            </li>*/}
                                <li>
                                    <ActiveLink href="/termes" activeClassName="active">
                                        <a>Termes</a>
                                    </ActiveLink>
                                </li>
                                <li>
                                    <Link href="/conctact">
                                        <a href="mailto:cliceat01@gmail.com">Contact</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="trailing">
                            {
                                !noSearchBar ?
                                    <input style={{backgroundImage: 'url(/images/search.svg)'}} onKeyUp={onInputSearch}
                                           type="search" placeholder="Rechercher des articles"/> : null
                            }
                            <div className="cart">
                                <span className="badge">{cart.length}</span>
                                <Link href="/panier">
                                    <a className="px-4">
                                        <img src="/images/cart-icon.svg" alt="cart-icon"/>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Drawer
                        visible={isVisible}
                        placement="left"
                        drawerStyle={{backgroundColor: '#e53e3e'}}
                        onClose={() => setIsVisible(false)}
                    >
                        <section className="h-full w-full nav-drawer">
                            <div className="title pt-5 flex justify-center">
                                <Image src="/images/logo.png" style={{borderRadius: '50%'}} alt="logo" height={65} width={65} />
                            </div>
                            <div className="pt-6">
                                <ul className="nav-links">
                                    <li>
                                        <Link href="/">
                                            <a>Accueil</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/a-propos">
                                            <a>À propos de nous</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/termes">
                                            <a>Termes</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/conctact">
                                            <a>Contact</a>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </Drawer>
                </nav>
            )
        }}</DataContext.Consumer>
    )
}

export default Toolbar;
