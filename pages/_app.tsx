import '../styles/globals.less'
import '../styles/antd.less';
import '../styles/nprogress.less';
import { ConfigProvider } from 'antd';
import frFR from 'antd/lib/locale/fr_FR';
import {AppProps} from "next/app";
import NProgress from 'nprogress';
import {Router} from "next/router";
import DataContextProvider from "../context/data-context";

Router.events.on('routeChangeStart', (url) => {
    console.log(`Loading: ${url}`);
    NProgress.start()
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


function CustomApp({
                       Component,
                       pageProps,
                       router, // Added this prop
                   }: AppProps): JSX.Element {
    return (
        // Wrapping our page `Component` with the `Flipper`
        <>
            <DataContextProvider>
                <ConfigProvider locale={frFR}>
                    <Component {...pageProps} />
                </ConfigProvider>
            </DataContextProvider>
        </>
    )
}

export default CustomApp
