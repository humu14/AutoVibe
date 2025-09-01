import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    upc: {
        type: String,
        unique: true,
        sparse: true
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        // e.g. "Exterior", "Interior", "Electronics", "Performance", "Tools"
    },
    subcategory: {
        type: String,
        // e.g. "Floor Mats", "Seat Covers", "Dash Cams"
    },
    compatibleVehicles: [{
        type: String,
        // e.g. "Toyota Camry 2018-2022"
    }],
    fitmentNotes: {
        type: String,
    },
    material: {
        type: String,
    },
    color: {
        type: String,
    },
    weightKg: {
        type: Number,
        default: 0
    },
    dimensionsCm: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    warrantyMonths: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0,
        required: true,
    },
    countInStock: {
        type: Number,
        default: 0,
        required: true,
    },
    image: {
        type: String,
        // primary image filename stored in /uploads
    },
    images: [{
        type: String,
        // additional image filenames
    }],
    tags: [{ type: String }],
    numReviews: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
