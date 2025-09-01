import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const addOrderItems = asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Check stock availability for all items before processing
    for (const item of orderItems) {
      const product = await Product.findById(item._id);
      if (!product) {
        res.status(400);
        throw new Error(`Product ${item.name || item._id} not found`);
      }
      
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.countInStock}, Requested: ${item.qty}`);
      }
    }

    try {
      // Process the order and update stock
      for (const item of orderItems) {
        const product = await Product.findById(item._id);
        if (product) {
          product.countInStock = product.countInStock - item.qty;
          await product.save();
        }
      }

      const order = new Order({
        orderItems: orderItems.map((x) => ({
          ...x,
          product: x._id,
          _id: undefined,
        })),

        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      // If there's an error, we should rollback stock changes
      // This is a simplified rollback - in production you might want more sophisticated handling
      console.error('Error creating order, rolling back stock changes:', error);
      res.status(500);
      throw new Error('Failed to create order. Please try again.');
    }
  });

  const getAllOrders = asyncHandler(async (req, res) => {
    try {
      console.log('getAllOrders called');
      const orders = await Order.find({}).populate('user', 'name email');
      console.log('Orders found:', orders ? orders.length : 'null');
      if(orders){
        res.json(orders);
      }else{
        res.status(404);
        throw new Error('Orders not found');
      }
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      res.status(500).json({ 
        message: 'Internal server error while fetching orders',
        error: error.message 
      });
    }
  });


  const getOrderById = asyncHandler(async (req, res) => {
    try {
      console.log('getOrderById called with orderId:', req.params.orderId);
      const order = await Order.findById(req.params.orderId).populate(
        'user',
        'name email'
      );
      console.log('Order found:', order ? 'yes' : 'no');
      if(order){
        res.json(order);
      }else{
        res.status(404);
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error in getOrderById:', error);
      res.status(500).json({ 
        message: 'Internal server error while fetching order',
        error: error.message 
      });
    }
  });
  
  const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if(order){
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      const updateOrder = await order.save();

      const pointsAchieved = order.totalPrice/100;
      const pointUser = await User.findOne({_id: order.user._id});
      console.log(pointUser);
      pointUser.points += pointsAchieved;
      await pointUser.save();

      res.json(updateOrder);
    }else{
      res.status(404);
      throw new Error('Order not found');
    }
  });

  // Check stock availability for products
  const checkStockAvailability = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      res.status(400);
      throw new Error('Product ID and quantity are required');
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const isAvailable = product.countInStock >= quantity;
    const availableStock = product.countInStock;

    res.json({
      isAvailable,
      availableStock,
      requestedQuantity: quantity,
      productName: product.name
    });
  });

  // Check stock for multiple products (useful for cart validation)
  const checkCartStockAvailability = asyncHandler(async (req, res) => {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('Cart items are required');
    }

    const stockCheckResults = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId || item._id);
      if (!product) {
        stockCheckResults.push({
          productId: item.productId || item._id,
          isAvailable: false,
          error: 'Product not found'
        });
        continue;
      }

      const isAvailable = product.countInStock >= item.qty;
      stockCheckResults.push({
        productId: product._id,
        productName: product.name,
        isAvailable,
        availableStock: product.countInStock,
        requestedQuantity: item.qty,
        error: isAvailable ? null : `Insufficient stock. Available: ${product.countInStock}, Requested: ${item.qty}`
      });
    }

    const allAvailable = stockCheckResults.every(item => item.isAvailable);
    
    res.json({
      allAvailable,
      results: stockCheckResults
    });
  });

  const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if(order){
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updateOrder = await order.save();
      res.json(updateOrder);
    }else{
      res.status(404);
      throw new Error('Order not found');
    }
  });

const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.userId })
    .sort({ createdAt: -1 })
    .exec();

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Orders not found');
  }
});


const updateOrderToCancel = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.orderId);
  if (order) {
    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.qty;
          await product.save();
        }
      })
    );

    order.isCancelled = true;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const filterOrder = asyncHandler(async (req, res) => {
  const filter = req.params.filter;
  if(filter === 'paid'){
    const orders = await Order.find({ isPaid: true }).populate(
      'user',
      'name email'
    )
    .sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notPaid'){
    const orders = await Order.find({ isPaid: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'delivered'){
    const orders = await Order.find({ isDelivered: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notDelivered'){
    const orders = await Order.find({ isDelivered: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'cancelled'){
    const orders = await Order.find({ isCancelled: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notCancelled'){
    const orders = await Order.find({ isCancelled: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else{
    res.status(404);
    throw new Error('Invalid filter');
  }
});  

  const myFilterOrders = asyncHandler(async (req, res) => {
  const filter = req.params.filter;
  if(filter === 'paid'){
    const orders = await Order.find({ user: req.params.userId ,isPaid: true }).populate(
      'user',
      'name email'
    )
    .sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notPaid'){
    const orders = await Order.find({ user: req.params.userId ,isPaid: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'delivered'){
    const orders = await Order.find({ user: req.params.userId ,isDelivered: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notDelivered'){
    const orders = await Order.find({ user: req.params.userId ,isDelivered: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'cancelled'){
    const orders = await Order.find({ user: req.params.userId ,isCancelled: true }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else if(filter === 'notCancelled'){
    const orders = await Order.find({ user: req.params.userId ,isCancelled: false }).populate(
      'user',
      'name email'
    ).sort({ createdAt: -1 })
    .exec();
    res.status(200).json(orders);
  }else{
    res.status(404);
    throw new Error('Invalid filter');
  }
});

const getSales = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
  });
  const monthlySales = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  orders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleString('en-US', { month: 'long' });
    monthlySales[month] += order.totalPrice;
  });

  const salesData = Object.keys(monthlySales).map(month => ({
    month,
    value: parseFloat(monthlySales[month].toFixed(2))
  }));

  res.json(salesData);
});


const getTopProducts = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  });

  const productQuantities = {};

  orders.forEach(order => {
    order.orderItems.forEach(item => {
      const { product, qty } = item;
      if (!productQuantities[product]) {
        productQuantities[product] = 0;
      }
      productQuantities[product] += qty;
    });
  });

  const top5Products = Object.keys(productQuantities)
    .map(productId => ({
      productId,
      quantitySold: productQuantities[productId],
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);

  const productIds = top5Products.map(product => product.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const top5ProductsData = top5Products.map(product => {
    const { productId, quantitySold } = product;
    const productDetails = products.find(prod => prod._id.toString() === productId);

    if (productDetails) {
      return {
        productId: productDetails._id,
        productName: productDetails.name,
        quantitySold,
      };
    }

    return {
      productId: productId,
      productName: "Product not found",
      quantitySold,
    };
  });

  res.json(top5ProductsData);
});

const getProductCategoriesSortedByOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    const categoryCounts = {};

    for (const order of orders) {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (product && product.category) {
          if (!categoryCounts[product.category]) {
            categoryCounts[product.category] = 0;
          }
          categoryCounts[product.category] += item.qty;
        } else {
          const unknownCategory = 'Unknown Category';
          if (!categoryCounts[unknownCategory]) {
            categoryCounts[unknownCategory] = 0;
          }
          categoryCounts[unknownCategory] += item.qty;
        }
      }
    }

    const sortedCategories = Object.keys(categoryCounts)
      .map(category => ({
        category,
        orderCount: categoryCounts[category],
      }))
      .sort((a, b) => b.orderCount - a.orderCount);

    res.json(sortedCategories);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});


  export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders,
    myOrders,
    updateOrderToCancel,
    filterOrder,
    myFilterOrders,
    getSales,
    getTopProducts,
    getProductCategoriesSortedByOrders,
    checkStockAvailability,
    checkCartStockAvailability
  };