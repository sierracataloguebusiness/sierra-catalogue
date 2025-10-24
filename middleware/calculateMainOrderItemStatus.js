import Order from "../models/Order.js";
import VendorOrder from "../models/VendorOrder.js";

export const allowedStatuses = ["accepted", "rejected", "out_of_stock", "pending"];

export const updateMainOrderStatus = async (orderId) => {
    const vendorOrders = await VendorOrder.find({ order: orderId });

    if (vendorOrders.every(vo => vo.vendorStatus === "accepted")) {
        await Order.findByIdAndUpdate(orderId, { status: "completed" });
    } else if (vendorOrders.every(vo => vo.vendorStatus === "rejected")) {
        await Order.findByIdAndUpdate(orderId, { status: "cancelled" });
    } else if (vendorOrders.some(vo => vo.vendorStatus === "accepted") &&
        vendorOrders.some(vo => vo.vendorStatus === "rejected")) {
        await Order.findByIdAndUpdate(orderId, { status: "partially_completed" });
    } else {
        await Order.findByIdAndUpdate(orderId, { status: "pending" });
    }
};
