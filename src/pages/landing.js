import React, { useState, useEffect } from "react";
import AOS from 'aos';
import { Carousel, Container, CarouselItem, Row, Col, Button, Card } from "react-bootstrap";
import CarImg from "../components/carouselImg";
import './landing.css';
import 'aos/dist/aos.css';
import CardHeader from "react-bootstrap/esm/CardHeader";
import VenderLogo from "../components/vendor_logo";
const vendor_info = [
    ['1up.jpg', 'https://1upkeyboards.com/', '1UpKeyboards'],
    ['3dkeebs.png', 'https://3dkeebs.com/', '3DKeebs'],
    ['415keys.jpg', 'https://415keys.com/', '415keys'],
    ['aeboards.png', 'https://www.aeboards.com/', 'AEBoards'],
    ['alchemistkeyboards.png', 'https://www.alchemistkeyboards.com/', 'AlchemistKeyboards'],
    ['apexkeyboards.png', 'https://www.apexkeyboards.com/', 'ApexKeyboards'],
    ['ashkeebs.jpg', 'https://www.ashkeebs.com/', 'AskKeebs'],
    ['bearcable.png', 'https://bearcables.com/', 'Bear Cable Co.'],
    ['bolsasupply.png', 'https://bolsakeyboardsupply.com/', 'Bolsa Keyboard Supply'],
    ['cablemod.png', 'https://cablemod.com/', 'cablemod'],
    ['candykeys.png', 'https://candykeys.com/', 'CandyKeys'],
    ['cannonkeys.png', 'https://cannonkeys.com/', 'Cannon Keys'],
    ['cftkb.png', 'https://www.cftkb.com/', 'CFTKB'],
    ['ctrlshiftesc.png', 'https://www.ctrlshiftesc.co.za/', 'Ctrl.Shift.Esc'],
    ['dailyclack.png', 'https://dailyclack.com/', 'Daily Clack'],
    ['dangkeebs.jpg', 'https://dangkeebs.com/', 'Dangkeebs'],
    ['deskhero.png', 'https://www.deskhero.ca/', 'DeskHero'],
    ['divinikeys.png', 'https://divinikey.com/', 'Divinikey'],
    ['drop.png', 'https://drop.com/home', 'Drop'],
    ['elboard.png', 'https://elboard.store/', 'ELBOARD Keyboard Supply'],
    ['graystudio.png', 'https://graystudio.club/', 'Graystudio'],
    ['ilumkb.png', 'https://ilumkb.com/', 'iLumkb'],
    ['kbdfans.png', 'https://kbdfans.com/', 'KBDfans'],
    ['keebcats.png', 'https://keebcats.co.uk/', 'KeebCats'],
    ['keebforall.png', 'https://keebsforall.com/', 'KeebsForAll'],
    ['keebhut.png', 'https://keebhut.com/', 'Keebhut'],
    ['keebio.png', 'https://keeb.io/', 'Keebio'],
    ['keycult.jpg', 'https://keycult.com/', 'Keycult'],
    ['keygem.png', 'https://keygem.store/', 'KEYGEM'],
    ['keyhive.png', 'https://keyhive.xyz/', 'KeyHive'],
    ['keyspresso.jpg', 'https://keyspresso.ca/', 'Keyspresso'],
    ['kibou.png', 'https://kibou.store/', 'Kibou'],
    ['kineticlabs.png', 'https://kineticlabs.store/', 'Kinetic Labs'],
    ['kprepublic.png', 'https://kprepublic.com/', 'KPrepublic'],
    ['mechboards.png', 'https://mechboards.co.uk/', 'Mechboards'],
    ['mechmods.jpg', 'https://www.mechmods.co.uk/', 'MechMods'],
    ['mechsupply.png', 'http://www.mechsupply.co.uk/', 'MechSupply'],
    ['mekibo.png', 'https://mekibo.com/', 'mekibo'],
    ['melgeek.jpg', 'https://www.melgeek.com/', 'MelGeek'],
    ['minokeys.png', 'https://minokeys.com/', 'Mino Keys'],
    ['mkultra.png', 'https://mkultra.click/', 'MKUltra Corporation'],
    ['modedesigns.png', 'https://shop.modedesigns.com/', 'Mode Designs'],
    ['monstargears.jpg', 'https://www.monstargears.com/', 'Monstargear'],
    ['mykeyboard.png', 'https://mykeyboard.eu/', 'mykeyboard.eu'],
    ['novelkeys.png', 'https://novelkeys.com/', 'NovelKeys'],
    ['noxary.png', 'https://noxary.co/', 'Noxary'],
    ['omnitype.jpg', 'https://omnitype.com/', 'Omnitype'],
    ['prevailkeyco.png', 'https://prevailkeyco.com/', 'Prevail Key Co.'],
    ['prototypist.jpg', 'https://prototypist.net/', 'proto[Typist] Keyboards'],
    ['qlavier.png', 'https://www.qlavier.com/', 'Qlavier'],
    ['qwertykeys.png', 'https://www.qwertykeys.com/', 'QWERTYKeys'],
    ['rama.png', 'https://rama.works/', 'RAMA WORKS®'],
    ['ringerkeys.jpg', 'https://ringerkeys.com/', 'Ringer Keys'],
    ['salvun.png', 'https://salvun.com/', 'Salvun'],
    ['spaceholdings.png', 'https://spaceholdings.net/', 'SpaceHoldings'],
    ['splitkb.png', 'https://splitkb.com/', 'splitkb'],
    ['stupidfish.png', 'https://stupidfish.design/', 'StupidFish Designs'],
    ['swagkeys.png', 'https://swagkeys.com/', 'Swagkeys'],
    ['switchmod.png', 'https://switchmod.net/', 'Switchmod Keyboards'],
    ['thekeydot.png', 'https://thekey.company/', 'TheKey.Company'],
    ['thockeys.jpg', 'https://thockeys.com/', 'ThocKeys'],
    ['thockpop.png', 'https://thockpop.com/', 'thockpop'],
    ['upgradekeyboards.png', 'https://www.upgradekeyboards.com/', 'Upgrade Keyboards'],
    ['westm.png', 'https://westm.ca/', 'WestM'],
    ['zealpc.png', 'https://zealpc.net/', 'Zeal PC'],
    ['zfrontier.png', 'https://en.zfrontier.com/', 'zFrontier'],
    ['zfrontier_cn.png', 'https://www.zfrontier.com/', 'zFrontier - CN'],
];
const images_urls = [
    ['https://i.imgur.com/m5myZd2.png', 'Drookoo#7530'],
    ['https://i.imgur.com/vclGoVM.png', 'Drookoo#7530'],
    ['https://i.imgur.com/Occztag.png', 'Drookoo#7530'],
    ['https://i.imgur.com/4clfkma.png', 'Drookoo#7530'],
    ['https://i.imgur.com/e3CVrRB.png', 'Drookoo#7530'],
    ['https://i.imgur.com/Bh2Ifdn.jpeg', 'choobies#6274'],
    ['https://i.imgur.com/9cb0jtE.jpeg', 'choobies#6274']
];
const LandingPage = () => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        AOS.init({ duration: 1000 });
        AOS.refresh();
    }, [loading]);
    return (
        <>
            <div className='cta'>
                <Container>
                    <Row>
                        <Col md={6}>
                            <div className="card_padding">
                                <Card>
                                    <Card.Img variant="top" src="https://media.baamboozle.com/uploads/images/329012/1618828221_43191_gif-url.gif" />
                                    <CardHeader>No more unexpected packages!</CardHeader>
                                </Card>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="card_padding">
                                <Card>
                                    <Card.Img variant="top" src="https://c.tenor.com/d9eC2yAFVZUAAAAC/moneypusheen-gil.gif" />
                                    <CardHeader>Track your spendings</CardHeader>
                                    <Card.Text></Card.Text>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-grid gap-2" style={{ marginBottom: '5vh' }}>
                        <Button variant="outline-dark" size="lg" href="./signup">Sign up!</Button>
                    </div>
                </Container>
            </div >
            <Carousel className='carousel'>
                {images_urls.map(i => <CarouselItem interval={2000} key={i[0]}>
                    <CarImg url={i[0]} credits={i[1]} />
                </CarouselItem>)}
            </Carousel> 
            <div className="vendors" data-aos='fade-right' data-aos-easing="ease-in-sine">Vendors</div>
            <div style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: '30px', paddingRight: '30px', maxWidth: '2000px', margin: 'auto' }}>
                <Row xl={5} lg={4} md={3} sm={2} xs={1} >
                    {vendor_info.map(info =>
                        <Col key={info[0]}>
                            <VenderLogo src={`images/${info[0]}`} url={info[1]} text={info[2]}/>
                        </Col>
                    )}
                </Row>
            </div>
            <div className="disclaimer"><strong>Disclaimer</strong> this is not a full list of all vendors.</div>
        </>

    )
};
export default LandingPage;