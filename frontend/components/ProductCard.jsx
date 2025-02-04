"use client";

import {
  Box,
  Text,
  Heading,
  Flex,
  Button,
  Spinner,
  Image,
  useToast,
} from "@chakra-ui/react";
import { ThemeColors } from "@constants/constants";
import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartCreateMutation } from "@slices/usersApiSlice";

const ProductCard = ({ product, UGX, userInfo, width, height }) => {
  const [addCartApi] = useCartCreateMutation();
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const chakraToast = useToast();

  // function to handle adding product to cart
  const handleAddCart = async (ID) => {
    // check if user has not logged in
    if (!userInfo) {
      chakraToast({
        title: "Sign In is required",
        description: `You need to sign in to add to cart`,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
      router.push("/signin");
      return;
    }

    try {
      // set loading to be true
      setLoading((prevState) => (prevState ? false : true));

      const res = await addCartApi({ productId: ID, userId: userInfo?._id });

      if (res.data?.message) {
        // set loading to be false
        setLoading((prevState) => (prevState ? false : true));

        chakraToast({
          title: "Success",
          description: res.data?.message,
          status: "success",
          duration: 5000,
          isClosable: false,
        });
      }

      if (res.error) {
        // set loading to be false
        setLoading((prevState) => (prevState ? false : true));

        chakraToast({
          title: "Error has occured",
          description: err.data?.message
            ? err.data?.message
            : err.data || err.error,
          status: "error",
          duration: 5000,
          isClosable: false,
        });
      }
    } catch (err) {
      // set loading to be false
      setLoading((prevState) => (prevState ? false : true));

      chakraToast({
        title: "Error",
        description: err.message.error || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <>
      <Box>
        <Box
          padding={{ base: "0.5rem 1rem", md: "1rem", xl: "1rem" }}
          background={"#fff"}
          borderRadius={"md"}
          _hover={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
          width={"200px"}
          maxHeight={"auto"}
          margin={!width ? "none" : "0 1rem 0 0"}
          height={"auto"}
        >
          <Box
            height={{ base: "120px", md: "120px", xl: "120px" }}
            padding="0.3rem"
          >
            <Link href={`/product?id=${product._id}`}>
              <Flex
                alignContent={"center"}
                justifyContent={"center"}
                height={"100%"}
              >
                <Image
                  src={`${product.images}`}
                  width={"auto"}
                  style={{
                    width: "auto",
                    height: "100%",
                    margin: "auto",
                  }}
                />
              </Flex>
            </Link>
          </Box>
          <Box padding={"0.3rem 0"}>
            <Text
              textAlign={"center"}
              className="secondary-light-font"
              fontSize={{ base: "lg", md: "lg", xl: "lg" }}
            >
              {product.name}
            </Text>
            <Heading
              as={"h3"}
              margin={"0.5rem 0"}
              textAlign={"center"}
              className="secondary-extra-bold"
              fontSize={{ base: "md", md: "md", xl: "md" }}
              color={ThemeColors.darkColor}
            >
              {UGX(product.price).format()}
            </Heading>
            <Box padding={"0.3rem 0"}>
            {product.priceTiers && product.priceTiers.length > 0 && (
              <Box textAlign="center">
                {product.priceTiers.map((tier, index) => (
                  <Text
                    key={index}
                    className="secondary-extra-bold"
                    fontSize={{ base: "sm", md: "md", xl: "md" }}
                    color={ThemeColors.darkColor}
                  >
                     {`UGX ${UGX(tier.price)} - ${tier.quantity}`}
                  </Text>
                ))}
              </Box>
            )}
              <Flex justifyContent={"center"}>
                <Button
                  color={ThemeColors.lightColor}
                  background={ThemeColors.darkColor}
                  border={"1.7px solid " + ThemeColors.darkColor}
                  borderRadius={"0.3rem"}
                  padding={"1rem"}
                  className="secondary-light-font"
                  fontSize={"sm"}
                  _hover={{
                    border: "1.7px solid " + ThemeColors.lightColor,
                  }}
                  onClick={() => handleAddCart(product._id)}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <FaCartPlus
                      size={20}
                      style={{ margin: "0 0.5rem 0 0" }}
                      color={ThemeColors.lightColor}
                    />
                  )}
                  Add To cart
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProductCard;
