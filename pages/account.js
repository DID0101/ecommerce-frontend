import Header from "@/components/Header";
import Title from "@/components/Title";
import Center from "@/components/Center";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishlistLoaded, setWishlistLoaded] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }
  async function login() {
    await signIn('google');
  }
  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put('/api/address', data);
  }
  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishlistLoaded(false);
    setOrderLoaded(false);
    axios.get('/api/address')
      .then(response => {
        const addressData = response.data || {}; // Ensure response.data is not null
        setName(addressData.name || '');
        setEmail(addressData.email || '');
        setCity(addressData.city || '');
        setPostalCode(addressData.postalCode || '');
        setStreetAddress(addressData.streetAddress || '');
        setCountry(addressData.country || '');
        setAddressLoaded(true);
      })
      .catch(error => {
        console.error('Failed to fetch address:', error);
        setAddressLoaded(true);
      });

    axios.get('/api/wishlist')
      .then(response => {
        setWishedProducts(response.data.map(wp => wp.product));
        setWishlistLoaded(true);
      })
      .catch(error => {
        console.error('Failed to fetch wishlist:', error);
        setWishlistLoaded(true);
      });

    axios.get('/api/orders')
      .then(response => {
        setOrders(response.data);
        setOrderLoaded(true);
      })
      .catch(error => {
        console.error('Failed to fetch orders:', error);
        setOrderLoaded(true);
      });
  }, [session]);

  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts(products => {
      return [...products.filter(p => p._id.toString() !== idToRemove)];
    });
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs
                  tabs={['Siparişler', 'Favoriler']}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === 'Siparişler' && (
                  <>
                    {!orderLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && (
                          <p>Giriş yap</p>
                        )}
                        {orders.length > 0 && orders.map(o => (
                          <SingleOrder key={o._id} {...o} />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'Favoriler' && (
                  <>
                    {!wishlistLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {wishlistLoaded && (
                      <>
                        <WishedProductsGrid>
                          {wishedProducts.length > 0 && wishedProducts.map(wp => (
                            <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishlist={productRemovedFromWishlist} />
                          ))}
                        </WishedProductsGrid>
                        {wishedProducts.length === 0 && (
                          <>
                            {session && (
                              <p>Favorilerin Boş</p>
                            )}
                            {!session && (
                              <p>Giriş yap favori listenize eklemek için</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2>{session ? 'Hesap detayları' : 'Giriş yap'}</h2>
                {!addressLoaded && (
                  <Spinner fullWidth={true} />
                )}
                {addressLoaded && session && (
                  <>
                    <Input
                      type="text"
                      placeholder="Isim"
                      value={name}
                      name="name"
                      onChange={ev => setName(ev.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Email"
                      value={email}
                      name="email"
                      onChange={ev => setEmail(ev.target.value)}
                    />
                    <CityHolder>
                      <Input
                        type="text"
                        placeholder="Şehir"
                        value={city}
                        name="city"
                        onChange={ev => setCity(ev.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Posta Kodu"
                        value={postalCode}
                        name="postalCode"
                        onChange={ev => setPostalCode(ev.target.value)}
                      />
                    </CityHolder>
                    <Input
                      type="text"
                      placeholder="Adres"
                      value={streetAddress}
                      name="streetAddress"
                      onChange={ev => setStreetAddress(ev.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Ülke"
                      value={country}
                      name="country"
                      onChange={ev => setCountry(ev.target.value)}
                    />
                    <Button black block onClick={saveAddress}>
                      Kaydet
                    </Button>
                    <hr />
                  </>
                )}
                {session && (
                  <Button primary onClick={logout}>Çıkış Yap</Button>
                )}
                {!session && (
                  <Button primary onClick={login}>Google ile giriş yap</Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
