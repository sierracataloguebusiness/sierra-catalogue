import VendorOrder from "../models/VendorOrder.js";

export const ALLOWED_STATUSES = ["accepted", "rejected", "out_of_stock", "pending"];

export const calculateMainOrderStatus = async (mainOrderId) => {
    const vendorOrders = await VendorOrder.find({ order: mainOrderId }).select("vendorStatus");
    const statuses = vendorOrders.map(v => v.vendorStatus);

    let mainStatus = "pending";
    if (statuses.every(s => s === "accepted")) mainStatus = "accepted";
    else if (statuses.every(s => s === "rejected")) mainStatus = "rejected";
    else if (statuses.includes("accepted") && statuses.includes("rejected"))
        mainStatus = "partially_accepted";

    await Order.findByIdAndUpdate(mainOrderId, { status: mainStatus });
};
