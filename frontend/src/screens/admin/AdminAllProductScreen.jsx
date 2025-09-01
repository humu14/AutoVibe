import { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import {
  useGetAllProductQuery, useUpdateProductMutation,
  useDeleteProductMutation
} from '../../slices/productsApiSlice.js';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Row, Col } from 'react-bootstrap';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import Grid from '@mui/material/Grid';
import { Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AddCircleIcon from '@mui/icons-material/AddCircle';




const AdminAllProductScreen = () => {
  const imageBaseUrl = 'http://localhost:5000/uploads/';
  const { data, isLoading, refetch, error } = useGetAllProductQuery();
  const [show, setShow] = useState(false);
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [sku, setSku] = useState('');
  const [upc, setUpc] = useState('');
  const [compatibleVehicles, setCompatibleVehicles] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [dimensionsLength, setDimensionsLength] = useState('');
  const [dimensionsWidth, setDimensionsWidth] = useState('');
  const [dimensionsHeight, setDimensionsHeight] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState('');

  const handleClose = () => {
    setShow(false);
    setProductId('');
    setName('');
    setBrand('');
    setDescription('');
    setCategory('');
    setSubcategory('');
    setSku('');
    setUpc('');
    setCompatibleVehicles('');
    setMaterial('');
    setColor('');
    setWeightKg('');
    setDimensionsLength('');
    setDimensionsWidth('');
    setDimensionsHeight('');
    setWarrantyMonths('');
    setTags('');
    setIsFeatured(false);
    setPrice('');
    setCountInStock('');
    setImage('');
  };

  const handleShow = (product) => {
    setShow(true);
    setProductId(product._id);
    setName(product.name);
    setBrand(product.brand);
    setDescription(product.description);
    setCategory(product.category);
    setSubcategory(product.subcategory || '');
    setSku(product.sku || '');
    setUpc(product.upc || '');
    setCompatibleVehicles(Array.isArray(product.compatibleVehicles) ? product.compatibleVehicles.join(', ') : '');
    setMaterial(product.material || '');
    setColor(product.color || '');
    setWeightKg(product.weightKg || '');
    setDimensionsLength(product.dimensionsCm?.length || '');
    setDimensionsWidth(product.dimensionsCm?.width || '');
    setDimensionsHeight(product.dimensionsCm?.height || '');
    setWarrantyMonths(product.warrantyMonths || '');
    setTags(Array.isArray(product.tags) ? product.tags.join(', ') : '');
    setIsFeatured(!!product.isFeatured);
    setPrice(product.price);
    setCountInStock(product.countInStock);
    setImage(product.image);
  };

  const [updateProduct, { isLoading: isLoadingUpdate, error: errorUpdate }] = useUpdateProductMutation();
  const submitHandler = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('sku', sku);
      formData.append('upc', upc);
      if (compatibleVehicles) compatibleVehicles.split(',').map(v => formData.append('compatibleVehicles', v.trim()))
      formData.append('material', material);
      formData.append('color', color);
      if (weightKg) formData.append('weightKg', weightKg);
      if (dimensionsLength || dimensionsWidth || dimensionsHeight) {
        formData.append('dimensionsCm[length]', dimensionsLength || 0);
        formData.append('dimensionsCm[width]', dimensionsWidth || 0);
        formData.append('dimensionsCm[height]', dimensionsHeight || 0);
      }
      if (warrantyMonths) formData.append('warrantyMonths', warrantyMonths);
      formData.append('price', price);
      formData.append('countInStock', countInStock);
      formData.append('image', image);
      if (tags) tags.split(',').map(t => formData.append('tags', t.trim()));
      formData.append('isFeatured', isFeatured);
      const res = updateProduct(formData);
      toast.success('Product updated successfully');
      handleClose();
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const [deleteProduct, { isLoading: isLoadingDelete, error: errorDelete }] = useDeleteProductMutation();
  const handleRemoveProduct = (product) => {
    try {
      deleteProduct({ productId: product._id });
      toast.success('Product deleted successfully');
      handleClose();
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <AdminPanelScreen />
      <div className="admin-content">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
              <Typography variant="h4" className="text-gray-800 font-bold">
                Product Management
              </Typography>
              <LinkContainer to="/admin/addproduct">
                <Button variant="success" className="btn-lg px-4 py-2 flex items-center gap-2">
                  <AddCircleIcon /> Add New Product
              </Button>
            </LinkContainer>
            </div>
            
        {isLoading ? (
              <div className="flex justify-center items-center py-20">
          <Loader />
              </div>
        ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <Message variant="danger">{error.message}</Message>
              </div>
        ) : data && data.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <Message variant="info">No products found. Start by adding your first product!</Message>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHead className="bg-gray-50">
                <TableRow>
                        <TableCell className="font-semibold text-gray-700">Product Name</TableCell>
                        <TableCell className="font-semibold text-gray-700">Status</TableCell>
                        <TableCell className="font-semibold text-gray-700">Image</TableCell>
                        <TableCell className="font-semibold text-gray-700">Category</TableCell>
                        <TableCell className="font-semibold text-gray-700">Price</TableCell>
                        <TableCell className="font-semibold text-gray-700">Stock</TableCell>
                        <TableCell className="font-semibold text-gray-700">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                      {data && data.map((product) => (
                        <TableRow key={product._id} className="hover:bg-gray-50 transition-colors">
                          <LinkContainer to={`/product/${product._id}`} style={{ cursor: 'pointer' }}>
                            <TableCell className="text-blue-600 hover:text-blue-800 font-medium">
                              {product.name}
                            </TableCell>
                    </LinkContainer>
                          <TableCell>
                            {product.isFeatured ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Featured
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Standard
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <img 
                              src={`${imageBaseUrl}${product.image}`} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md border"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ${product.price}
                          </TableCell>
                          <TableCell>
                            {product.countInStock > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {product.countInStock} in stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                    </TableCell>
                    <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline-primary"
                                onClick={() => handleShow(product)}
                                className="btn-sm"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline-danger"
                                onClick={() => handleRemoveProduct(product)}
                                className="btn-sm"
                              >
                                Delete
                      </Button>
                            </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                </div>
              </div>
        )}
      </Grid>
        </Grid>
      </div>
      
      <Modal 
        show={show} 
        onHide={handleClose} 
        size="lg" 
        className="modal-centered"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton className="bg-gray-50">
          <Modal.Title className="text-xl font-semibold">Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='name'>
                  <Form.Label className="font-semibold">Product Name</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='Enter product name' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='brand'>
                  <Form.Label className="font-semibold">Brand</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='Enter brand' 
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className='mb-3' controlId='description'>
              <Form.Label className="font-semibold">Description</Form.Label>
              <Form.Control 
                as="textarea"
                rows={3}
                placeholder='Enter product description' 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='category'>
                  <Form.Label className="font-semibold">Category</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='e.g., EXTERIOR, INTERIOR' 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='subcategory'>
                  <Form.Label className="font-semibold">Subcategory</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='e.g., Floor Mats, Dash Cams' 
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='sku'>
                  <Form.Label className="font-semibold">SKU</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='Enter SKU' 
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='upc'>
                  <Form.Label className="font-semibold">UPC</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='Enter UPC (optional)' 
                    value={upc}
                    onChange={(e) => setUpc(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className='mb-3' controlId='compatibleVehicles'>
              <Form.Label className="font-semibold">Compatible Vehicles</Form.Label>
              <Form.Control 
                type='text' 
                placeholder='Comma-separated, e.g., Toyota Camry 2018-2022, Universal' 
                value={compatibleVehicles}
                onChange={(e) => setCompatibleVehicles(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='material'>
                  <Form.Label className="font-semibold">Material</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='e.g., PU Leather, Rubber' 
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='color'>
                  <Form.Label className="font-semibold">Color</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='e.g., Black, Beige' 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className='mb-3' controlId='weightKg'>
                  <Form.Label className="font-semibold">Weight (kg)</Form.Label>
                  <Form.Control 
                    type='number' 
                    step='0.01' 
                    placeholder='0.00' 
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3' controlId='dimensionsLength'>
                  <Form.Label className="font-semibold">Length (cm)</Form.Label>
                  <Form.Control 
                    type='number' 
                    step='0.1' 
                    placeholder='0.0' 
                    value={dimensionsLength}
                    onChange={(e) => setDimensionsLength(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className='mb-3' controlId='dimensionsWidth'>
                  <Form.Label className="font-semibold">Width (cm)</Form.Label>
                  <Form.Control 
                    type='number' 
                    step='0.1' 
                    placeholder='0.0' 
                    value={dimensionsWidth}
                    onChange={(e) => setDimensionsWidth(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='warrantyMonths'>
                  <Form.Label className="font-semibold">Warranty (months)</Form.Label>
                  <Form.Control 
                    type='number' 
                    placeholder='e.g., 12' 
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='price'>
                  <Form.Label className="font-semibold">Price ($)</Form.Label>
                  <Form.Control 
                    type='number' 
                    step='0.01' 
                    placeholder='0.00' 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='countInStock'>
                  <Form.Label className="font-semibold">Stock Quantity</Form.Label>
                  <Form.Control 
                    type='number' 
                    placeholder='Enter stock quantity' 
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='tags'>
                  <Form.Label className="font-semibold">Tags</Form.Label>
                  <Form.Control 
                    type='text' 
                    placeholder='Comma-separated tags' 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
            </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className='mb-3' controlId='isFeatured'>
              <Form.Check 
                type='checkbox' 
                label='Featured Product' 
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="text-gray-700"
              />
            </Form.Group>
            
            <Form.Group className='mb-3' controlId='image'>
              <Form.Label className="font-semibold">Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            
            {isLoadingUpdate && <Loader />}
            <div className="flex gap-3 mt-4">
              <Button type='submit' variant='primary' className='px-6 py-2'>
                Update Product
              </Button>
              <Button variant='secondary' onClick={handleClose} className='px-6 py-2'>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );

};
export default AdminAllProductScreen;