import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Formcontainer from "../../components/Formcontainer";
import { toast } from 'react-toastify'
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Grid from '@mui/material/Grid';
import AdminPanelScreen from './AdminPanelScreen.jsx';
import { useCreateProductMutation } from '../../slices/productsApiSlice';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AdminAddProductScreen = () => {
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

    const navigate = useNavigate();

    const [createProduct, { isLoading: isLoadingCreate, error: errorCreate }] = useCreateProductMutation();

    // const fileToString = (file) => {
    // console.log(file);
    // const { name, lastModified, lastModifiedDate, size, type, webkitRelativePath} = file;
    // const fileObject = {
    //     name,
    //     lastModified,
    //     lastModifiedDate: lastModifiedDate.toString(),
    //     size,
    //     type,
    //     webkitRelativePath,
    // };
    // return JSON.stringify(fileObject);
    // };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('brand', brand);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('subcategory', subcategory);
            formData.append('sku', sku);
            formData.append('upc', upc);
            if (compatibleVehicles) {
                // split by comma into array server can parse as repeated fields
                compatibleVehicles.split(',').map(v => formData.append('compatibleVehicles', v.trim()));
            }
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
            console.log(category);
            const res = await createProduct(formData).unwrap();
            if (res) {
                toast.success('Product added successfully');
                navigate("/admin/productslist");
            }
        } catch (err) {
            toast.error(err?.data?.message || err?.error);
            console.log(err);
            navigate("/admin/productslist");
        }
        navigate("/admin/productslist");
    };

    return (
        <>
            <AdminPanelScreen />
            {/* <Grid container spacing={6}> */}
            {/* <Grid item xs={12} md={12}> */}
            <Formcontainer>
                <h1>Add Product</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-2' controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' placeholder='Enter Name' value={name}
                            onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='size'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type='text' placeholder='Enter Brand' value={brand}
                            onChange={(e) => setBrand(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='text' placeholder='Enter Description' value={description}
                            onChange={(e) => setDescription(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control type='text' placeholder='Enter Category' value={category}
                            onChange={(e) => setCategory(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='subcategory'>
                        <Form.Label>Subcategory</Form.Label>
                        <Form.Control type='text' placeholder='e.g. Dash Cams, Seat Covers' value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='sku'>
                        <Form.Label>SKU</Form.Label>
                        <Form.Control type='text' placeholder='Enter SKU' value={sku}
                            onChange={(e) => setSku(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='upc'>
                        <Form.Label>UPC</Form.Label>
                        <Form.Control type='text' placeholder='Enter UPC (optional)' value={upc}
                            onChange={(e) => setUpc(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='compatibleVehicles'>
                        <Form.Label>Compatible Vehicles</Form.Label>
                        <Form.Control type='text' placeholder='Comma-separated, e.g. Toyota Camry 2018-2022, Universal' value={compatibleVehicles}
                            onChange={(e) => setCompatibleVehicles(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='material'>
                        <Form.Label>Material</Form.Label>
                        <Form.Control type='text' placeholder='e.g. PU Leather, Rubber' value={material}
                            onChange={(e) => setMaterial(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='color'>
                        <Form.Label>Color</Form.Label>
                        <Form.Control type='text' placeholder='e.g. Black, Beige' value={color}
                            onChange={(e) => setColor(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='weightKg'>
                        <Form.Label>Weight (kg)</Form.Label>
                        <Form.Control type='number' step='0.01' placeholder='Enter weight in kg' value={weightKg}
                            onChange={(e) => setWeightKg(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className='my-2' controlId='dimensionsLength'>
                                <Form.Label>Length (cm)</Form.Label>
                                <Form.Control type='number' step='0.1' placeholder='Length' value={dimensionsLength}
                                    onChange={(e) => setDimensionsLength(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='my-2' controlId='dimensionsWidth'>
                                <Form.Label>Width (cm)</Form.Label>
                                <Form.Control type='number' step='0.1' placeholder='Width' value={dimensionsWidth}
                                    onChange={(e) => setDimensionsWidth(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className='my-2' controlId='dimensionsHeight'>
                                <Form.Label>Height (cm)</Form.Label>
                                <Form.Control type='number' step='0.1' placeholder='Height' value={dimensionsHeight}
                                    onChange={(e) => setDimensionsHeight(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className='my-2' controlId='warrantyMonths'>
                        <Form.Label>Warranty (months)</Form.Label>
                        <Form.Control type='number' placeholder='e.g. 12' value={warrantyMonths}
                            onChange={(e) => setWarrantyMonths(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='price'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type='text' placeholder='Enter Price' value={price}
                            onChange={(e) => setPrice(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='countInStock'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control type='text' placeholder='Enter Count In Stock' value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="my-2" controlId="image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            placeholder="Image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Form.Group>
                    <Form.Group className='my-2' controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <Form.Control type='text' placeholder='Comma-separated tags' value={tags}
                            onChange={(e) => setTags(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='my-2' controlId='isFeatured'>
                        <Form.Check type='checkbox' label='Featured' checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)} />
                    </Form.Group>

                    <Button type='submit' variant='success' className='mt-3'>Confirm</Button>
                </Form>
            </Formcontainer>
            {/* </Grid> */}
            {/* </Grid> */}
        </>
    )
}

export default AdminAddProductScreen;
