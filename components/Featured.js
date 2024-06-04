import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import { RevealWrapper } from 'next-reveal';
import Image from 'next/image'; // Importing Image from next/image
import PropTypes from 'prop-types'; // For prop types validation

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img.main {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
    margin-left: auto;
    margin-right: auto;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    & > div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

const CenterImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ImgColumn = styled(Column)`
  & > div {
    width: 100%;
  }
`;

const ContentWrapper = styled.div``;

function Featured({ product }) {
  if (!product) {
    return null; // Render nothing or a fallback UI if product is not available
  }

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <RevealWrapper origin={'left'} delay={0}>
                <ContentWrapper>
                  <Title>{product.title}</Title>
                  <Desc>{product.description}</Desc>
                  <ButtonsWrapper>
                    <ButtonLink href={'/product/' + product._id} outline={1} white={1}>
                      Ürün Bilgileri
                    </ButtonLink>
                    <FlyingButton white={1} _id={product._id} src={product.images?.[0]}>
                      <CartIcon />
                      Sepete ekle
                    </FlyingButton>
                  </ButtonsWrapper>
                </ContentWrapper>
              </RevealWrapper>
            </div>
          </Column>
          <ImgColumn>
            <RevealWrapper delay={0}>
              <CenterImg>
                <Image
                  className={'main'}
                  src={product.images?.[0]}
                  alt={product.title || 'Product Image'}
                  layout="intrinsic" // Ensure the layout is intrinsic
                  width={500} // Provide a width
                  height={500} // Provide a height
                />
              </CenterImg>
            </RevealWrapper>
          </ImgColumn>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}

Featured.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Featured;
