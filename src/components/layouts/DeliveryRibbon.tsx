import React from "react";

const DeliveryRibbon = () => {
  return (
    <section className="mt-7 border-y border-gray-200 bg-[#FAF4F4] p-16 px-14 text-black">
      <main className="mx-auto flex max-w-[1200px] items-center justify-evenly text-2xl">
        {/* free delivery */}
        <div className="flex flex-col items-start gap-1 font-semibold">
          <h2>Free Delivery</h2>
          <p className="w-[82%] text-left text-sm font-normal text-gray-500">
            For all oders over $50, consectetur adipim scing elit.{" "}
          </p>
        </div>
        {/* 90 days return */}
        <div className="flex flex-col items-start gap-1 font-semibold">
          <h2>90 Days Return</h2>
          <p className="w-[82%] text-left text-sm font-normal text-gray-500">
            If goods have problems, consectetur adipim scing elit.
          </p>
        </div>
        {/* secure payments */}
        <div className="flex flex-col items-start gap-1 font-semibold">
          <h2>Secure Payment</h2>
          <p className="w-[82%] text-left text-sm font-normal text-gray-500">
            100% secure payment, consectetur adipim scing elit.
          </p>
        </div>
      </main>
    </section>
  );
};

export default DeliveryRibbon;
