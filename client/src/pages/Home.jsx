import React, { useEffect, useState } from "react";
import Button from "../component/Button.jsx";
import { MdLocationPin, MdPersonAddAlt1 } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import {
  FaInstagram,
  FaShoppingBag,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import ContactStrip from "./contact/ContactStrip.jsx";
import ContactStripElement from "./contact/ContactStripElemet.jsx";
import { BiPhone } from "react-icons/bi";
import ListingCard from "../component/ListingCard.jsx";
import axios from "axios";
import Loader from "../component/Loader.jsx";
import { toast } from "react-toastify";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, listRes] = await Promise.all([
          axios.get("http://localhost:5000/api/category"), //Get all categories
          axios.get("http://localhost:5000/api/listings?limit=15"), //Get listings(15)
        ]);

        setCategories(catRes.data.categories || []);
        setListings(listRes.data.listings || []);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (listingId) => {
    try {
      setAddingId(listingId);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add to cart.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          listingId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Hero Banner*/}
      <div className="relative px-4 min-h-[85vh] bg-[url('/assets/bg-sec.jpg')] bg-cover bg-center flex flex-col gap-6 justify-center items-center text-white">
        <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>

        <div className="relative flex flex-col gap-4 md:w-3/4 mx-auto text-center">
          <h1 className="heading md:heading-large">
            Welcome to Sierra Catalogue
          </h1>
          <p className="text-lg">
            Discover & connect with businesses across Sierra Leone. Whether
            you’re shopping for yourself, a loved one, or just comparing prices,
            our platform provides you with all you need to make the best
            purchases.
          </p>
        </div>

        <div className="relative flex max-sm:flex-col gap-6 md:gap-10 max-sm:text-sm">
          <Button to="/vendor-application" className="px-6 py-4 max-md:text-lg">
            List your business
          </Button>
          <Button
            to="/shop"
            style="secondary"
            className="px-8 max-md:py-4 max-md:text-lg"
          >
            Shop now
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 py-20 container mx-auto min-h-[50vh] flex flex-col items-center gap-10">
        <h2 className="heading text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {[
            {
              step: "1",
              icon: <MdPersonAddAlt1 className="size-10" />,
              title: "Sign Up",
              desc: "Create an account in minutes and set up your profile.",
            },
            {
              step: "2",
              icon: <FiSearch className="size-10" />,
              title: "Browse",
              desc: "Explore categories and discover verified businesses.",
            },
            {
              step: "3",
              icon: <FaShoppingBag className="size-10" />,
              title: "Order",
              desc: "Add to cart, place your order, and track it in real time.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="border border-white rounded-2xl p-6 flex flex-col items-center justify-center gap-1 text-center bg-white/5 backdrop-blur-sm h-[30vh]"
            >
              {item.icon}
              <h3 className="text-xl max-md:text-2xl font-bold text-primary-gold mt-2">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-20 container mx-auto">
        <h2 className="heading text-center mb-10">Top Categories</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-lg text-center">
          {categories.length === 0 ? (
            <p className="text-gray-400 text-center col-span-3">
              No categories available yet.
            </p>
          ) : (
            categories.slice(0, 6).map((cat) => (
              <div key={cat._id} className="border border-white rounded-xl p-6">
                {cat.name}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 py-20 container mx-auto">
        <h2 className="heading text-center mb-10">Top Listings</h2>
        {listings.length === 0 ? (
          <p className="text-center text-gray-400">
            No products available yet.
          </p>
        ) : (
          <div className="justify-evenly items-center grid grid-cols-[repeat(auto-fit,minmax(288px,max-content))] gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                id={listing._id}
                {...listing}
                onAddToCart={handleAddToCart}
                adding={addingId === listing._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="flex flex-col items-center px-4 py-20 container mx-auto">
        <h2 className="heading mb-6">Contact Us</h2>
        <p className="mb-4 text-gray-300 text-center">
          Got questions or need support? We’re here to help!
        </p>
        <div className="flex max-md:flex-col justify-center gap-10 py-6">
          <div className="flex flex-col gap-4">
            <ContactStrip
              heading={"Chat with us"}
              content={"Speak to our friendly team via live chat."}
            />
            <div className="flex flex-col gap-4">
              <ContactStripElement
                icon={<FaWhatsapp />}
                to={"https://wa.me/23276325542"}
                content={"Start a voice call"}
              />
              <ContactStripElement
                icon={<FaInstagram />}
                to={
                  "https://www.instagram.com/sierracatalogue?igsh=NTZ0eWdlc2luOHJ4"
                }
                content={"Message on instagram"}
              />
              <ContactStripElement
                icon={<FaTiktok />}
                to={"https://tiktok.com/@sierracatalogue"}
                content={"View our tiktok page"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ContactStrip
              heading={"Call us"}
              content={"Call our team Mon-Fri from 8am to 5pm."}
            />
            <ContactStripElement
              icon={<BiPhone />}
              to={"tel:+23276325542"}
              content={"+232 76 325 542"}
            />
          </div>

          <div className="flex flex-col gap-4">
            <ContactStrip
              heading={"Visit us"}
              content={"Chat to us in person at our HQ."}
            />
            <ContactStripElement
              icon={<MdLocationPin />}
              content={"7 Cole Street, Hamilton"}
            />
          </div>
        </div>
        <Button to="/contact" className="max-md:w-full">
          Get in Touch
        </Button>
      </div>
    </>
  );
};

export default Home;
