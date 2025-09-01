import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';




// get all product public
const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
});


// get a product public
const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findById( productId );
    if(product){
        res.status(200).json(product);

    }else{
        res.status(404);
        throw new Error('Product not found');
    }
});

// get all Unique Categories public
const getUniqueCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  });

// get a product from a category public
const getCategoryProducts = asyncHandler(async (req, res) => {
    const category = req.params.myCategory;
    const products = await Product.find({ category: category});
    if (products.length === 0) {
      res.status(404);
      throw new Error('No products found');
    } else {
      res.status(200).json(products);
    }
  });


const createProduct = asyncHandler(async (req, res) => {
    const { name, brand, description, category: initialCategory, subcategory, sku, upc, compatibleVehicles, fitmentNotes, material, color, weightKg, dimensionsCm, warrantyMonths, price, countInStock, image, images, tags, isFeatured } = req.body;
    const product = await Product.findOne({ name });
    if (product) {
        res.status(400);
        throw new Error('Product already exists');
    } else {
        const imageName = (req.file) ? req.file.filename : null;

        const category = initialCategory ? initialCategory.toUpperCase() : undefined;

        const parsedImages = Array.isArray(images) ? images : [];
        const parsedTags = Array.isArray(tags) ? tags : [];
        const parsedCompatible = Array.isArray(compatibleVehicles) ? compatibleVehicles : (compatibleVehicles ? [compatibleVehicles] : []);

        const newProduct = await Product.create({
            name,
            brand,
            sku,
            upc,
            description,
            category,
            subcategory,
            compatibleVehicles: parsedCompatible,
            fitmentNotes,
            material,
            color,
            weightKg,
            dimensionsCm,
            warrantyMonths,
            price,
            countInStock,
            image: imageName,
            images: parsedImages,
            tags: parsedTags,
            isFeatured
        });
        if (newProduct) {
            res.status(201);
        } else {
            res.status(400);
            throw new Error('Invalid product data');
        }
    }
});


//update a product private admin
const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    if(product){
        const imageName = (req.file) ? req.file.filename : null;
        product.name = req.body.name || product.name;
        product.brand = req.body.brand || product.brand;
        product.sku = req.body.sku || product.sku;
        product.upc = req.body.upc || product.upc;
        product.description = req.body.description || product.description;
        product.category = (req.body.category ? req.body.category.toUpperCase() : product.category);
        product.subcategory = req.body.subcategory || product.subcategory;
        product.compatibleVehicles = req.body.compatibleVehicles || product.compatibleVehicles;
        product.fitmentNotes = req.body.fitmentNotes || product.fitmentNotes;
        product.material = req.body.material || product.material;
        product.color = req.body.color || product.color;
        product.weightKg = req.body.weightKg ?? product.weightKg;
        product.dimensionsCm = req.body.dimensionsCm || product.dimensionsCm;
        product.warrantyMonths = req.body.warrantyMonths ?? product.warrantyMonths;
        product.price = req.body.price ?? product.price;
        product.countInStock = req.body.countInStock ?? product.countInStock;
        product.image = imageName || product.image;
        product.images = req.body.images || product.images;
        product.tags = req.body.tags || product.tags;
        product.isFeatured = req.body.isFeatured ?? product.isFeatured;

        const updatedProduct = await product.save();
        res.status(200).json({
            _id : updatedProduct._id,
            name : updatedProduct.name,
            brand : updatedProduct.brand,
            sku: updatedProduct.sku,
            upc: updatedProduct.upc,
            description : updatedProduct.description,
            category : updatedProduct.category,
            subcategory : updatedProduct.subcategory,
            compatibleVehicles: updatedProduct.compatibleVehicles,
            fitmentNotes: updatedProduct.fitmentNotes,
            material: updatedProduct.material,
            color: updatedProduct.color,
            weightKg: updatedProduct.weightKg,
            dimensionsCm: updatedProduct.dimensionsCm,
            warrantyMonths: updatedProduct.warrantyMonths,
            price : updatedProduct.price,
            countInStock : updatedProduct.countInStock,
            image : updatedProduct.image,
            images: updatedProduct.images,
            tags: updatedProduct.tags,
            isFeatured: updatedProduct.isFeatured
        });
    }else{
        res.status(404);
        throw new Error('Product not found');
    }
});

//delete a product private admin
const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.body.productId;
    console.log(productId);
    const deletedProduct = await Product.deleteOne({ _id: productId });
    if(deletedProduct){
        res.status(200).json({message: 'Product removed'});
    }else{
        res.status(404);
        throw new Error('Product not found');
    }
});

const getProductsByFilter = asyncHandler(async (req, res) => {
    const filter = req.params.filter;
    if (filter === 'pLow'){
        const products = await Product.find({}).sort({ price: 1 });
        res.status(200).json(products);
    }else if (filter === 'pHigh'){
        const products = await Product.find({}).sort({ price: -1 });
        res.status(200).json(products);}
    else if (filter === 'alphaA'){
        const products = await Product.find({}).sort({ name: 1 });
        res.status(200).json(products);}
    else if (filter === 'alphaZ'){
        const products = await Product.find({}).sort({ name: -1 });
        res.status(200).json(products);}
    else if (filter === 'ratingHigh'){
        const products = await Product.find({}).sort({ rating: -1 });
        res.status(200).json(products);}
    else if (filter === 'ratingLow'){
        const products = await Product.find({}).sort({ rating: 1 });
        res.status(200).json(products);}
    else if (filter === 'stock') {
        const products = await Product.find({ countInStock: { $gt: 0 } }).sort({ countInStock: -1 });
        res.status(200).json(products);
        }
    else if (filter === 'featured') {
        const products = await Product.find({ isFeatured: true }).sort({ createdAt: -1 });
        res.status(200).json(products);
        }
    else{
        res.status(404);
        throw new Error('Invalid filter');
    }
  });

const getProductsBySearch = asyncHandler(async (req, res) => {
    const search = req.params.search;
    const products = await Product.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { upc: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { subcategory: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
          { compatibleVehicles: { $regex: search, $options: 'i' } }
        ]
      });
    if (products.length === 0) {
        res.status(404);
        throw new Error('No products found');
    } else {
        res.status(200).json(products);
    }
    });

export {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getUniqueCategories,
    getCategoryProducts,
    getProductsByFilter,
    getProductsBySearch
};