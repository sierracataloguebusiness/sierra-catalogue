import React from "react";
import { Link } from "react-router-dom";
import Button from "../../component/Button.jsx";

const VendorGuidelinesMVP = () => {
  return (
    <div className="min-h-screen p-8 flex justify-center">
      <div className="bg-white/5 shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center text-primary-gold mb-6">
          Sierra Catalogue — Vendor Guidelines
        </h1>
        <p className="mb-4">
          Welcome to <span className="font-semibold">Sierra Catalogue</span>!
          These vendor guidelines explain the minimum requirements to become a
          vendor. We are starting simple so that vendors can onboard quickly,
          while more detailed rules will follow in future updates.
        </p>
        <section className="mb-6 ">
          <h2 className="text-xl font-semibold text-primary-gold mb-2">
            1. Purpose & Scope
          </h2>
          <p>
            These guidelines apply to all vendors who wish to sell products or
            services through Sierra Catalogue during the MVP phase.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-primary-gold mb-2">
            2. Vendor Eligibility & Onboarding
          </h2>
          <p className="mb-2">
            For the MVP phase, vendors only need to provide:
          </p>
          <ul className="list-disc list-inside">
            <li>Full Name</li>
            <li>Phone Number</li>
            <li>Email Address</li>
          </ul>
          <p className="mt-2">
            A simple application form will be used to collect this information.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-primary-gold">
            3. Product Listings
          </h2>
          <ul className="list-disc list-inside">
            <li>Each product must have a clear name and description.</li>
            <li>At least one image must be provided.</li>
            <li>Prices must be listed in Sierra Leone Leones (SLL).</li>
            <li>Stock/availability should be updated regularly.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-primary-gold">
            4. Payments
          </h2>
          <p>
            Payments will be handled through simple methods agreed upon with
            vendors. Commission rates and payout schedules will be added in
            later versions of the guidelines.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-primary-gold mb-2">
            5. Next Steps
          </h2>
          <p>
            This is just the beginning. Future updates to the Vendor Guidelines
            will cover business registration, tax compliance, product
            certifications, and service-level agreements (SLAs).
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-primary-gold mb-2">
            6. Contact & Support
          </h2>
          <p>For any questions during the MVP phase, reach out to:</p>
          <p className="mt-2">
            Email:{" "}
            <a
              href="mailto:sierracatalogue.business@gmail.com"
              className="text-primary-gold hover:underline"
            >
              sierracatalogue.business@gmail.com
            </a>{" "}
          </p>
          <p>
            Email:{" "}
            <a
              href="tel:+23276325542"
              className="text-primary-gold hover:underline"
            >
              +232 (76) 325 542
            </a>{" "}
          </p>
        </section>
        <div className="text-center mt-8">
          <Button to="/vendor-application" className="w-full">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorGuidelinesMVP;
