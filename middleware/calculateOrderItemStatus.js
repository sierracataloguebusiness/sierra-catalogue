import Order from "../models/Order.js";
import VendorOrder from "../models/VendorOrder.js";

export const allowedStatuses = ["accepted", "rejected", "out_of_stock", "pending"];

export const updateMainOrderStatus = async (orderId) => {
    const vendorOrders = await VendorOrder.find({ order: orderId });
    if (!vendorOrders || vendorOrders.length === 0) return;

    const statuses = vendorOrders.map(vo => vo.vendorStatus);

    const allAccepted = statuses.every(s => s === "accepted");
    const allRejected = statuses.every(s => s === "rejected");
    const allPending = statuses.every(s => s === "pending");

    const hasAccepted = statuses.includes("accepted");
    const hasRejected = statuses.includes("rejected");
    const hasPartiallyAccepted = statuses.includes("partially_accepted");
    const hasPending = statuses.includes("pending");
    const hasOutOfStock = statuses.includes("out_of_stock");

    let newStatus;

    if (allAccepted) {
        newStatus = "completed";
    } else if (allRejected) {
        newStatus = "cancelled";
    } else if (hasPartiallyAccepted) {
        newStatus = "partially_completed";
    } else if ((hasAccepted && hasRejected) || (hasAccepted && hasOutOfStock)) {
        newStatus = "partially_rejected";
    } else if (hasAccepted && hasPending) {
        newStatus = "partially_completed";
    } else if (allPending) {
        newStatus = "pending";
    } else {
        newStatus = "pending";
    }

    await Order.findByIdAndUpdate(orderId, { status: newStatus });
};

export const updateVendorOrder = async (orderId, vendorId, itemId, status) => {
    const order = await VendorOrder.findOne({ _id: orderId, vendor: vendorId });
    if (!order) throw new Error("Vendor order not found");

    const item = order.items.id(itemId);
    if (!item) throw new Error("Item not found");

    item.status = status;

    const statuses = order.items.map(i => i.status || "pending");

    if (statuses.every(s => s === "accepted")) order.vendorStatus = "accepted";
    else if (statuses.every(s => s === "rejected")) order.vendorStatus = "rejected";
    else if (statuses.includes("accepted") && statuses.includes("rejected")) order.vendorStatus = "partially_accepted";
    else if (statuses.includes("accepted") && (statuses.includes("pending") || statuses.includes("out_of_stock"))) order.vendorStatus = "partially_accepted";
    else order.vendorStatus = "pending";

    await order.save();
    
    return { vendorOrder: order, mainOrderId: order.order };
};
